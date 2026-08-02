#pragma once

#include "Steps.h"
#include <functional>
#include <json/json.h>
#include <string>

// The step types that just run a subprocess via RunCommand.
namespace deploybutton {
using OutputFn = std::function<void(const std::string &)>;

StepResult gitPullStep(const Json::Value &config, const OutputFn &onOutput);
StepResult shellStep(const Json::Value &config, const OutputFn &onOutput);
StepResult npmInstallStep(const Json::Value &config, const OutputFn &onOutput);
StepResult npmBuildStep(const Json::Value &config, const OutputFn &onOutput);
StepResult dockerBuildStep(const Json::Value &config, const OutputFn &onOutput);
}  // namespace deploybutton
