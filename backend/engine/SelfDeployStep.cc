#include "SelfDeployStep.h"
#include "DeployStateRepo.h"
#include "RunCommand.h"
#include "SelfDeployInternal.h"
#include "StepConfig.h"
#include <chrono>
#include <drogon/drogon.h>
#include <thread>

namespace deploybutton {
namespace {
constexpr int kDefaultHealthTimeoutSeconds = 120;
}  // namespace

std::string otherSlot(const std::string &slot) {
    return slot == "blue" ? "green" : "blue";
}

bool buildAndStartSlot(const std::string &cwd, const std::string &slot,
                       const OutputFn &onOutput) {
    std::string command = "SLOT=" + slot + " docker compose -p deploybutton-" +
                          slot + " -f docker-compose.app.yml up -d --build";
    return runCommand(cwd, command, onOutput).exitCode == 0;
}

bool waitForHealthy(const std::string &slot, int timeoutSeconds,
                    const OutputFn &onOutput) {
    std::string checkCommand = "docker exec backend-" + slot +
                               " curl -fsS http://localhost:8080/api/health";
    auto quiet = [](const std::string &) {};
    for (int waited = 0; waited < timeoutSeconds; waited += 2) {
        if (runCommand("", checkCommand, quiet).exitCode == 0) {
            onOutput(slot + " is healthy.\n");
            return true;
        }
        std::this_thread::sleep_for(std::chrono::seconds(2));
    }
    onOutput("Timed out waiting for " + slot + " to become healthy.\n");
    return false;
}

StepResult blueGreenDeployStep(const Json::Value &config,
                               const OutputFn &onOutput) {
    std::string cwd = configStr(config, "cwd");
    if (cwd.empty()) {
        onOutput("blue_green_deploy step missing 'cwd'\n");
        return {1};
    }
    int timeout =
        configInt(config, "healthTimeoutSeconds", kDefaultHealthTimeoutSeconds);

    auto db = drogon::app().getDbClient();
    std::string current = getActiveSlot(db);
    std::string target = otherSlot(current);
    onOutput("Active slot: " + current + ". Building " + target + "...\n");

    if (!buildAndStartSlot(cwd, target, onOutput)) {
        onOutput(target + " failed to build/start; " + current +
                 " is untouched.\n");
        return {1};
    }

    if (!waitForHealthy(target, timeout, onOutput)) {
        tearDownSlot(cwd, target, false, onOutput);
        return {1};
    }

    if (!cutOverNginx(target, onOutput)) {
        tearDownSlot(cwd, target, false, onOutput);
        return {1};
    }

    setActiveSlot(db, target);
    onOutput("Cutover complete; " + target + " is now active.\n");
    tearDownSlot(cwd, current, true, onOutput);
    return {0};
}
}  // namespace deploybutton
