#include "WorkflowExecutor.h"
#include "Steps.h"
#include "../repositories/RunsRepo.h"
#include "../repositories/WorkflowsRepo.h"
#include <drogon/drogon.h>
#include <mutex>
#include <sstream>
#include <thread>
#include <unordered_set>

using namespace drogon;

namespace
{
std::mutex g_runningMutex;
std::unordered_set<long long> g_runningProjects;

Json::Value parseConfig(const std::string &text)
{
    Json::CharReaderBuilder builder;
    Json::Value root;
    std::string errs;
    std::istringstream stream(text);
    if (!Json::parseFromStream(builder, stream, &root, &errs))
    {
        return Json::Value(Json::objectValue);
    }
    return root;
}

void runWorkflowThread(long long projectId, long long workflowId, long long runId)
{
    auto db = app().getDbClient();
    auto steps = deploybutton::getStepsForWorkflow(db, workflowId);

    bool failed = false;
    for (const auto &step : steps)
    {
        auto stepRunId =
            deploybutton::createStepRun(db, runId, step.id, step.position, step.name, step.type);

        auto onOutput = [db, stepRunId](const std::string &chunk) {
            deploybutton::appendStepOutput(db, stepRunId, chunk);
        };

        auto config = parseConfig(step.config);
        auto result = deploybutton::executeStep(step.type, config, onOutput);

        deploybutton::finishStepRun(
            db, stepRunId, result.exitCode == 0 ? "success" : "failed", result.exitCode);

        if (result.exitCode != 0)
        {
            failed = true;
            break;
        }
    }

    deploybutton::finishRun(db, runId, failed ? "failed" : "success");

    std::lock_guard<std::mutex> lock(g_runningMutex);
    g_runningProjects.erase(projectId);
}
}  // namespace

namespace deploybutton
{
long long startWorkflowRun(long long projectId, long long workflowId, const std::string &triggerType)
{
    {
        std::lock_guard<std::mutex> lock(g_runningMutex);
        if (g_runningProjects.count(projectId) > 0)
        {
            return -1;
        }
        g_runningProjects.insert(projectId);
    }

    auto db = app().getDbClient();
    auto runId = createRun(db, projectId, workflowId, triggerType);

    std::thread(runWorkflowThread, projectId, workflowId, runId).detach();

    return runId;
}
}  // namespace deploybutton
