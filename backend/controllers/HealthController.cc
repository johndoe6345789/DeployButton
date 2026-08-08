#include "HealthController.h"
#include "HttpUtil.h"

using namespace drogon;

namespace deploybutton {
void HealthController::get(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback) {
    Json::Value body;
    body["status"] = "ok";
    callback(jsonResponse(body));
}
}  // namespace deploybutton
