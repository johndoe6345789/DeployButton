#include "WebhooksController.h"
#include "HttpUtil.h"
#include "../engine/WorkflowExecutor.h"
#include "../repositories/ProjectsRepo.h"

using namespace drogon;

namespace deploybutton {
// No signature verification in v1 (see plan's explicit non-goals) -- this
// endpoint is reachable only via Tailscale/Cloudflare Tunnel, matching the
// project's no-application-auth decision.
void WebhooksController::github(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback, std::string slug) {
    auto db = app().getDbClient();
    auto project = getProjectBySlug(db, slug);
    if (project.isNull()) {
        callback(notFound("project"));
        return;
    }

    long long projectId = project["id"].asInt64();
    long long workflowId = project["workflow_id"].asInt64();
    auto runId = startWorkflowRun(projectId, workflowId, "github_webhook");
    if (runId < 0) {
        callback(errorResponse(k409Conflict,
                               "A deploy for this project is already running"));
        return;
    }

    Json::Value body;
    body["runId"] = static_cast<Json::Int64>(runId);
    callback(jsonResponse(body, k202Accepted));
}
}  // namespace deploybutton
