#include "HttpUtil.h"
#include "ProjectsController.h"
#include "../repositories/ProjectsRepo.h"

using namespace drogon;

namespace deploybutton {
void ProjectsController::update(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback, long long id) {
    auto db = app().getDbClient();
    auto existing = getProject(db, id);
    if (existing.isNull()) {
        callback(notFound("project"));
        return;
    }

    auto json = req->getJsonObject();
    if (!json) {
        callback(errorResponse(k400BadRequest, "Invalid JSON body"));
        return;
    }
    std::string name =
        (*json).get("name", existing["name"].asString()).asString();
    std::string slug =
        (*json).get("slug", existing["slug"].asString()).asString();
    std::string repoUrl =
        (*json).get("repo_url", existing["repo_url"].asString()).asString();
    long long workflowId =
        (*json).get("workflow_id", existing["workflow_id"].asInt64()).asInt64();

    try {
        updateProject(db, id, name, slug, repoUrl, workflowId);
        callback(jsonResponse(getProject(db, id)));
    } catch (const drogon::orm::DrogonDbException& e) {
        callback(errorResponse(k400BadRequest, e.base().what()));
    }
}

void ProjectsController::remove(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback, long long id) {
    auto db = app().getDbClient();
    deleteProject(db, id);
    callback(jsonResponse(Json::Value(Json::objectValue)));
}
}  // namespace deploybutton
