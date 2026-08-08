#pragma once

#include <drogon/HttpController.h>

namespace deploybutton {
class WebhooksController : public drogon::HttpController<WebhooksController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(WebhooksController::github, "/api/webhooks/github/{1}",
                  drogon::Post);
    METHOD_LIST_END

    void github(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                std::string slug);
};
}  // namespace deploybutton
