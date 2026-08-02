#include "RunsController.h"
#include "HttpUtil.h"
#include "../repositories/RunsRepo.h"

using namespace drogon;

namespace deploybutton
{
void RunsController::listForProject(const HttpRequestPtr &req,
                                     std::function<void(const HttpResponsePtr &)> &&callback,
                                     long long projectId)
{
    auto db = app().getDbClient();
    callback(jsonResponse(listRunsForProject(db, projectId)));
}

void RunsController::get(const HttpRequestPtr &req,
                          std::function<void(const HttpResponsePtr &)> &&callback,
                          long long runId)
{
    auto db = app().getDbClient();
    auto run = getRunDetail(db, runId);
    if (run.isNull())
    {
        callback(notFound("run"));
        return;
    }
    callback(jsonResponse(run));
}
}  // namespace deploybutton
