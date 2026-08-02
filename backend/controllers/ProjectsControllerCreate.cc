#include "HttpUtil.h"
#include "ProjectsController.h"
#include "../repositories/ProjectsRepo.h"

using namespace drogon;

namespace deploybutton {
void ProjectsController::create(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback) {
    auto json = req->getJsonObject();
    if (!json) {
        callback(errorResponse(k400BadRequest, "Invalid JSON body"));
        return;
    }
    std::string name = (*json).get("name", "").asString();
    std::string slug = (*json).get("slug", "").asString();
    std::string repoUrl = (*json).get("repo_url", "").asString();
    long long workflowId = (*json).get("workflow_id", 0).asInt64();

    if (name.empty() || slug.empty() || workflowId <= 0) {
        callback(errorResponse(k400BadRequest,
                               "name, slug and workflow_id are required"));
        return;
    }

    auto db = app().getDbClient();
    try {
        auto id = createProject(db, name, slug, repoUrl, workflowId);
        callback(jsonResponse(getProject(db, id), k201Created));
    } catch (const drogon::orm::DrogonDbException &e) {
        callback(errorResponse(k400BadRequest, e.base().what()));
    }
}
}  // namespace deploybutton
