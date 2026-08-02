#pragma once

#include <drogon/HttpController.h>

namespace deploybutton {
class RunsController : public drogon::HttpController<RunsController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(RunsController::listForProject, "/api/projects/{1}/runs",
                  drogon::Get);
    ADD_METHOD_TO(RunsController::get, "/api/runs/{1}", drogon::Get);
    METHOD_LIST_END

    void listForProject(
        const drogon::HttpRequestPtr &req,
        std::function<void(const drogon::HttpResponsePtr &)> &&callback,
        long long projectId);
    void get(const drogon::HttpRequestPtr &req,
             std::function<void(const drogon::HttpResponsePtr &)> &&callback,
             long long runId);
};
}  // namespace deploybutton
