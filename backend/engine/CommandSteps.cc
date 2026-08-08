#include "CommandSteps.h"
#include "RunCommand.h"
#include "StepConfig.h"

namespace deploybutton {
StepResult gitPullStep(const Json::Value& config, const OutputFn& onOutput) {
    auto result = runCommand(configStr(config, "cwd"), "git pull", onOutput);
    return {result.exitCode};
}

StepResult shellStep(const Json::Value& config, const OutputFn& onOutput) {
    auto result = runCommand(configStr(config, "cwd"),
                             configStr(config, "command"), onOutput);
    return {result.exitCode};
}

StepResult npmInstallStep(const Json::Value& config, const OutputFn& onOutput) {
    std::string manager = configStr(config, "manager", "npm");
    auto result =
        runCommand(configStr(config, "cwd"), manager + " install", onOutput);
    return {result.exitCode};
}

StepResult npmBuildStep(const Json::Value& config, const OutputFn& onOutput) {
    std::string manager = configStr(config, "manager", "npm");
    std::string script = configStr(config, "script", "build");
    std::string command = (manager == "npm") ? (manager + " run " + script)
                                             : (manager + " " + script);
    auto result = runCommand(configStr(config, "cwd"), command, onOutput);
    return {result.exitCode};
}

StepResult dockerBuildStep(const Json::Value& config,
                           const OutputFn& onOutput) {
    std::string tag = configStr(config, "tag", "app:latest");
    std::string dockerfile = configStr(config, "dockerfile", "Dockerfile");
    std::string command = "docker build -t " + tag + " -f " + dockerfile + " .";
    auto result = runCommand(configStr(config, "cwd"), command, onOutput);
    return {result.exitCode};
}
}  // namespace deploybutton
