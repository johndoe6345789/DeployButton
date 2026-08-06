#include "RunsController.h"
#include "HttpUtil.h"
#include "../repositories/RunsRepo.h"
#include <optional>

using namespace drogon;

namespace {
constexpr long long kDefaultOutputLimit = 65536;

std::optional<long long> parseOptionalInt64(const HttpRequestPtr &req,
                                            const std::string &name) {
    auto raw = req->getParameter(name);
    if (raw.empty()) {
        return std::nullopt;
    }
    try {
        return std::stoll(raw);
    } catch (const std::exception &) {
        return std::nullopt;
    }
}
}  // namespace

namespace deploybutton {
void RunsController::listForProject(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback,
    long long projectId) {
    auto db = app().getDbClient();
    callback(jsonResponse(listRunsForProject(db, projectId)));
}

void RunsController::get(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback, long long runId) {
    auto db = app().getDbClient();
    auto run = getRunDetail(db, runId);
    if (run.isNull()) {
        callback(notFound("run"));
        return;
    }
    callback(jsonResponse(run));
}

void RunsController::getStepOutput(
    const HttpRequestPtr &req,
    std::function<void(const HttpResponsePtr &)> &&callback,
    long long stepRunId) {
    auto db = app().getDbClient();
    auto before = parseOptionalInt64(req, "before");
    auto after = parseOptionalInt64(req, "after");
    auto limit = parseOptionalInt64(req, "limit").value_or(kDefaultOutputLimit);

    auto chunk = getStepOutputChunk(db, stepRunId, before, after, limit);
    if (chunk.isNull()) {
        callback(notFound("step run"));
        return;
    }
    callback(jsonResponse(chunk));
}
}  // namespace deploybutton
