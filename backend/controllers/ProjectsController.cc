#include "ProjectsController.h"
#include "../repositories/ProjectsRepo.h"
#include "HttpUtil.h"

using namespace drogon;

namespace deploybutton {
void ProjectsController::list(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback) {
    auto db = app().getDbClient();
    callback(jsonResponse(listProjects(db)));
}

void ProjectsController::get(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback, long long id) {
    auto db = app().getDbClient();
    auto project = getProject(db, id);
    if (project.isNull()) {
        callback(notFound("project"));
        return;
    }
    callback(jsonResponse(project));
}
}  // namespace deploybutton
