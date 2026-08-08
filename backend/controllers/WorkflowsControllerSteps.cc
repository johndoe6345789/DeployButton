#include "HttpUtil.h"
#include "WorkflowsController.h"
#include "../repositories/WorkflowsRepo.h"

using namespace drogon;

namespace deploybutton {
void WorkflowsController::updateSteps(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback, long long id) {
    auto db = app().getDbClient();
    auto existing = getWorkflowWithSteps(db, id);
    if (existing.isNull()) {
        callback(notFound("workflow"));
        return;
    }

    auto json = req->getJsonObject();
    if (!json || !(*json).isArray()) {
        callback(errorResponse(k400BadRequest,
                               "Body must be a JSON array of steps"));
        return;
    }

    replaceSteps(db, id, *json);
    callback(jsonResponse(getWorkflowWithSteps(db, id)));
}
}  // namespace deploybutton
