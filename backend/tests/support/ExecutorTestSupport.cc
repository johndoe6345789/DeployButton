#include "ExecutorTestSupport.h"
#include "../../repositories/RunsRepo.h"
#include <chrono>
#include <drogon/drogon.h>
#include <thread>

namespace deploybutton::test {
Json::Value waitForTerminal(long long runId, int timeoutMs) {
    auto db = drogon::app().getDbClient();
    auto start = std::chrono::steady_clock::now();
    while (true) {
        auto detail = deploybutton::getRunDetail(db, runId);
        if (detail["status"].asString() != "running") return detail;
        auto elapsed = std::chrono::steady_clock::now() - start;
        if (elapsed > std::chrono::milliseconds(timeoutMs)) return detail;
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
    }
}

Json::Value shellStepConfig(const std::string &command) {
    Json::Value step;
    step["name"] = "step";
    step["type"] = "shell";
    step["config"]["command"] = command;
    return step;
}
}  // namespace deploybutton::test
