#pragma once

#include <functional>
#include <json/json.h>
#include <string>

namespace deploybutton
{
struct StepResult
{
    int exitCode;  // 0 = success
};

// Dispatches on `type` (git_pull | shell | npm_install | npm_build | docker_build |
// http_webhook | delay | notify) and executes it, streaming output via onOutput.
StepResult executeStep(const std::string &type,
                        const Json::Value &config,
                        const std::function<void(const std::string &chunk)> &onOutput);
}  // namespace deploybutton
