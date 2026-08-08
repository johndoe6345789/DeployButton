#include "Steps.h"
#include "CommandSteps.h"
#include "HttpWebhookStep.h"
#include "SelfDeployStep.h"
#include "StepConfig.h"
#include <chrono>
#include <thread>

namespace {
deploybutton::StepResult delayStep(const Json::Value &config,
                                   const deploybutton::OutputFn &onOutput) {
    int seconds = deploybutton::configInt(config, "seconds", 0);
    onOutput("Waiting " + std::to_string(seconds) + " seconds...\n");
    std::this_thread::sleep_for(std::chrono::seconds(seconds));
    return {0};
}

deploybutton::StepResult notifyStep(const Json::Value &config,
                                    const deploybutton::OutputFn &onOutput) {
    std::string message = deploybutton::configStr(config, "message");
    onOutput(message + "\n");

    std::string webhookUrl = deploybutton::configStr(config, "webhookUrl");
    if (!webhookUrl.empty()) {
        Json::Value notifyConfig;
        notifyConfig["url"] = webhookUrl;
        notifyConfig["method"] = "POST";
        notifyConfig["body"] = message;
        deploybutton::httpWebhookStep(notifyConfig, onOutput);
    }
    return {0};
}
}  // namespace

namespace deploybutton {
StepResult executeStep(
    const std::string &type, const Json::Value &config,
    const std::function<void(const std::string &)> &onOutput) {
    if (type == "git_pull") return gitPullStep(config, onOutput);
    if (type == "shell") return shellStep(config, onOutput);
    if (type == "npm_install") return npmInstallStep(config, onOutput);
    if (type == "npm_build") return npmBuildStep(config, onOutput);
    if (type == "docker_build") return dockerBuildStep(config, onOutput);
    if (type == "http_webhook") return httpWebhookStep(config, onOutput);
    if (type == "blue_green_deploy")
        return blueGreenDeployStep(config, onOutput);
    if (type == "delay") return delayStep(config, onOutput);
    if (type == "notify") return notifyStep(config, onOutput);

    onOutput("Unknown step type: " + type + "\n");
    return {1};
}
}  // namespace deploybutton
