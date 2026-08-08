#pragma once

#include "Steps.h"
#include <functional>
#include <json/json.h>
#include <string>

namespace deploybutton {
// Fires an HTTP request per `config` ("url", "method", "body"). Used both
// for the http_webhook step type and for notify's optional webhookUrl.
StepResult httpWebhookStep(
    const Json::Value& config,
    const std::function<void(const std::string&)>& onOutput);
}  // namespace deploybutton
