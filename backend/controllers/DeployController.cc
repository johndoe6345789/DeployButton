#include "DeployController.h"
#include "HttpUtil.h"
#include "../engine/WorkflowExecutor.h"
#include "../repositories/ProjectsRepo.h"

using namespace drogon;

namespace deploybutton
{
void DeployController::deploy(const HttpRequestPtr &req,
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

    long long workflowId = project["workflow_id"].asInt64();
    auto runId = startWorkflowRun(id, workflowId, "manual");
    if (runId < 0)
    {
        callback(errorResponse(k409Conflict, "A deploy for this project is already running"));
        return;
    }

    Json::Value body;
    body["runId"] = static_cast<Json::Int64>(runId);
    callback(jsonResponse(body, k202Accepted));
}
}  // namespace deploybutton
