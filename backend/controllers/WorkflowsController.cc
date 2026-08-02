#include "HttpUtil.h"
#include "WorkflowsController.h"
#include "../repositories/WorkflowsRepo.h"

using namespace drogon;

namespace deploybutton {
void WorkflowsController::list(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback) {
    auto db = app().getDbClient();
    callback(jsonResponse(listWorkflows(db)));
}

void WorkflowsController::get(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback, long long id) {
    auto db = app().getDbClient();
    auto workflow = getWorkflowWithSteps(db, id);
    if (workflow.isNull()) {
        callback(notFound("workflow"));
        return;
    }
    callback(jsonResponse(workflow));
}
}  // namespace deploybutton
