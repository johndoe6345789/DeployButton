#include "ProjectsController.h"
#include "HttpUtil.h"
#include "../repositories/ProjectsRepo.h"

using namespace drogon;

namespace deploybutton
{
void ProjectsController::list(const HttpRequestPtr &req,
                               std::function<void(const HttpResponsePtr &)> &&callback)
{
    auto db = app().getDbClient();
    callback(jsonResponse(listProjects(db)));
}

void ProjectsController::create(const HttpRequestPtr &req,
                                 std::function<void(const HttpResponsePtr &)> &&callback)
{
    auto json = req->getJsonObject();
    if (!json)
    {
        callback(errorResponse(k400BadRequest, "Invalid JSON body"));
        return;
    }
    std::string name = (*json).get("name", "").asString();
    std::string slug = (*json).get("slug", "").asString();
    std::string repoUrl = (*json).get("repo_url", "").asString();
    long long workflowId = (*json).get("workflow_id", 0).asInt64();

    if (name.empty() || slug.empty() || workflowId <= 0)
    {
        callback(errorResponse(k400BadRequest, "name, slug and workflow_id are required"));
        return;
    }

    auto db = app().getDbClient();
    try
    {
        auto id = createProject(db, name, slug, repoUrl, workflowId);
        callback(jsonResponse(getProject(db, id), k201Created));
    }
    catch (const drogon::orm::DrogonDbException &e)
    {
        callback(errorResponse(k400BadRequest, e.base().what()));
    }
}

void ProjectsController::get(const HttpRequestPtr &req,
                              std::function<void(const HttpResponsePtr &)> &&callback,
                              long long id)
{
    auto db = app().getDbClient();
    auto project = getProject(db, id);
    if (project.isNull())
    {
        callback(notFound("project"));
        return;
    }
    callback(jsonResponse(project));
}

void ProjectsController::update(const HttpRequestPtr &req,
                                 std::function<void(const HttpResponsePtr &)> &&callback,
                                 long long id)
{
    auto db = app().getDbClient();
    auto existing = getProject(db, id);
    if (existing.isNull())
    {
        callback(notFound("project"));
        return;
    }

    auto json = req->getJsonObject();
    if (!json)
    {
        callback(errorResponse(k400BadRequest, "Invalid JSON body"));
        return;
    }
    std::string name = (*json).get("name", existing["name"].asString()).asString();
    std::string slug = (*json).get("slug", existing["slug"].asString()).asString();
    std::string repoUrl = (*json).get("repo_url", existing["repo_url"].asString()).asString();
    long long workflowId = (*json).get("workflow_id", existing["workflow_id"].asInt64()).asInt64();

    try
    {
        updateProject(db, id, name, slug, repoUrl, workflowId);
        callback(jsonResponse(getProject(db, id)));
    }
    catch (const drogon::orm::DrogonDbException &e)
    {
        callback(errorResponse(k400BadRequest, e.base().what()));
    }
}

void ProjectsController::remove(const HttpRequestPtr &req,
                                 std::function<void(const HttpResponsePtr &)> &&callback,
                                 long long id)
{
    auto db = app().getDbClient();
    deleteProject(db, id);
    callback(jsonResponse(Json::Value(Json::objectValue)));
}
}  // namespace deploybutton
