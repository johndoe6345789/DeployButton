#pragma once

#include <drogon/HttpController.h>

namespace deploybutton {
class ProjectsController : public drogon::HttpController<ProjectsController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ProjectsController::list, "/api/projects", drogon::Get);
    ADD_METHOD_TO(ProjectsController::create, "/api/projects", drogon::Post);
    ADD_METHOD_TO(ProjectsController::get, "/api/projects/{1}", drogon::Get);
    ADD_METHOD_TO(ProjectsController::update, "/api/projects/{1}", drogon::Put);
    ADD_METHOD_TO(ProjectsController::remove, "/api/projects/{1}",
                  drogon::Delete);
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
};
}  // namespace deploybutton
