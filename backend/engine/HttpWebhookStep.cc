#include "HttpWebhookStep.h"
#include "HttpClient.h"
#include "StepConfig.h"
#include <sstream>

namespace deploybutton {
StepResult httpWebhookStep(
    const Json::Value &config,
    const std::function<void(const std::string &)> &onOutput) {
    std::string url = configStr(config, "url");
    std::string method = configStr(config, "method", "POST");
    std::string body = configStr(config, "body");

    if (url.empty()) {
        onOutput("http_webhook step missing 'url'\n");
        return {1};
    }

    auto result = performHttpRequest(url, method, body);
    if (!result.ok) {
        onOutput("HTTP request failed: " + result.error + "\n");
        return {1};
    }

    std::ostringstream oss;
    oss << method << " " << url << " -> HTTP " << result.httpCode << "\n";
    if (!result.body.empty()) {
        oss << result.body << "\n";
    }
    onOutput(oss.str());

    return {(result.httpCode >= 200 && result.httpCode < 300) ? 0 : 1};
}
}  // namespace deploybutton
