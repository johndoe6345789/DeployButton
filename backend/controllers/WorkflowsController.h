#pragma once

#include <drogon/HttpController.h>

namespace deploybutton {
class WorkflowsController : public drogon::HttpController<WorkflowsController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(WorkflowsController::list, "/api/workflows", drogon::Get);
    ADD_METHOD_TO(WorkflowsController::create, "/api/workflows", drogon::Post);
    ADD_METHOD_TO(WorkflowsController::get, "/api/workflows/{1}", drogon::Get);
    ADD_METHOD_TO(WorkflowsController::update, "/api/workflows/{1}",
                  drogon::Put);
    ADD_METHOD_TO(WorkflowsController::remove, "/api/workflows/{1}",
                  drogon::Delete);
    ADD_METHOD_TO(WorkflowsController::updateSteps, "/api/workflows/{1}/steps",
                  drogon::Put);
    METHOD_LIST_END

    void list(const drogon::HttpRequestPtr& req,
              std::function<void(const drogon::HttpResponsePtr&)>&& callback);
    void create(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&& callback);
    void get(const drogon::HttpRequestPtr& req,
             std::function<void(const drogon::HttpResponsePtr&)>&& callback,
             long long id);
    void update(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                long long id);
    void remove(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                long long id);
    void updateSteps(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& callback,
        long long id);
};
}  // namespace deploybutton
