#pragma once

#include <drogon/HttpController.h>

namespace deploybutton
{
class DeployController : public drogon::HttpController<DeployController>
{
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(DeployController::deploy, "/api/projects/{1}/deploy", drogon::Post);
    METHOD_LIST_END

    void deploy(const drogon::HttpRequestPtr &req,
                std::function<void(const drogon::HttpResponsePtr &)> &&callback,
                long long id);
};
}  // namespace deploybutton
