#pragma once

#include "Steps.h"
#include <functional>
#include <json/json.h>
#include <string>

namespace deploybutton {
// Builds and starts whichever slot (blue/green) isn't currently active
// alongside it, health-checks the new slot, cuts nginx over to it, then
// tears down the now-idle old slot. Never stops the currently-active slot
// until a replacement is confirmed healthy and serving, so a bad build or
// a runtime crash in the new code leaves the running app untouched.
// Config: "cwd", the deploybutton repo checkout path (required).
StepResult blueGreenDeployStep(
    const Json::Value &config,
    const std::function<void(const std::string &chunk)> &onOutput);
}  // namespace deploybutton
