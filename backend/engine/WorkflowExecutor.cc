#include "WorkflowExecutor.h"
#include "../repositories/JsonUtil.h"
#include "../repositories/RunsRepo.h"
#include "../repositories/WorkflowsRepo.h"
#include "RunGuard.h"
#include "Steps.h"
#include <drogon/drogon.h>
#include <thread>

using namespace drogon;

namespace {
void runWorkflowThread(long long projectId, long long workflowId,
                       long long runId) {
    auto db = app().getDbClient();
    auto steps = deploybutton::getStepsForWorkflow(db, workflowId);

    bool failed = false;
    for (const auto &step : steps) {
        auto stepRunId = deploybutton::createStepRun(
            db, runId, step.id, step.position, step.name, step.type);

        auto onOutput = [db, stepRunId](const std::string &chunk) {
            deploybutton::appendStepOutput(db, stepRunId, chunk);
        };

        auto config = deploybutton::parseJsonText(step.config);
        auto result = deploybutton::executeStep(step.type, config, onOutput);

        deploybutton::finishStepRun(db, stepRunId,
                                    result.exitCode == 0 ? "success" : "failed",
                                    result.exitCode);

        if (result.exitCode != 0) {
            failed = true;
            break;
        }
    }

    deploybutton::finishRun(db, runId, failed ? "failed" : "success");
    deploybutton::releaseRunGuard(projectId);
}
}  // namespace

namespace deploybutton {
long long startWorkflowRun(long long projectId, long long workflowId,
                           const std::string &triggerType) {
    if (!tryAcquireRunGuard(projectId)) {
        return -1;
    }

    auto db = app().getDbClient();
    auto runId = createRun(db, projectId, workflowId, triggerType);
    std::thread(runWorkflowThread, projectId, workflowId, runId).detach();
    return runId;
}
}  // namespace deploybutton
