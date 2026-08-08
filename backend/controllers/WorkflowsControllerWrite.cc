#include "HttpUtil.h"
#include "WorkflowsController.h"
#include "../repositories/WorkflowsRepo.h"

using namespace drogon;

namespace deploybutton {
void WorkflowsController::create(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback) {
    auto json = req->getJsonObject();
    if (!json) {
        callback(errorResponse(k400BadRequest, "Invalid JSON body"));
        return;
    }
    std::string name = (*json).get("name", "").asString();
    std::string description = (*json).get("description", "").asString();
    if (name.empty()) {
        callback(errorResponse(k400BadRequest, "name is required"));
        return;
    }

    auto db = app().getDbClient();
    auto id = createWorkflow(db, name, description);
    callback(jsonResponse(getWorkflowWithSteps(db, id), k201Created));
}

void WorkflowsController::update(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback, long long id) {
    auto db = app().getDbClient();
    auto existing = getWorkflowWithSteps(db, id);
    if (existing.isNull()) {
        callback(notFound("workflow"));
        return;
    }

    auto json = req->getJsonObject();
    if (!json) {
        callback(errorResponse(k400BadRequest, "Invalid JSON body"));
        return;
    }
    std::string name =
        (*json).get("name", existing["name"].asString()).asString();
    std::string description =
        (*json)
            .get("description", existing["description"].asString())
            .asString();

    updateWorkflow(db, id, name, description);
    callback(jsonResponse(getWorkflowWithSteps(db, id)));
}

void WorkflowsController::remove(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback, long long id) {
    auto db = app().getDbClient();
    deleteWorkflow(db, id);
    callback(jsonResponse(Json::Value(Json::objectValue)));
}
}  // namespace deploybutton
