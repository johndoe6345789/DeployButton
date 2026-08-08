#pragma once

#include <drogon/HttpController.h>

namespace deploybutton {
// Liveness probe used by the blue/green self-deploy step to confirm the
// newly-built slot is actually serving requests before nginx cuts over.
class HealthController : public drogon::HttpController<HealthController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(HealthController::get, "/api/health", drogon::Get);
    METHOD_LIST_END

    void get(const drogon::HttpRequestPtr& req,
             std::function<void(const drogon::HttpResponsePtr&)>&& callback);
};
}  // namespace deploybutton
