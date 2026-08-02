#include "../engine/WorkflowExecutor.h"
#include "../repositories/ProjectsRepo.h"
#include "../repositories/WorkflowsRepo.h"
#include "support/ExecutorTestSupport.h"
#include <drogon/drogon.h>
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::shellStepConfig;
using deploybutton::test::waitForTerminal;

TEST(WorkflowExecutor, RejectsConcurrentRunForSameProject) {
    auto db = drogon::app().getDbClient();
    auto workflowId = createWorkflow(db, "slow-workflow", "");
    Json::Value steps(Json::arrayValue);
    steps.append(shellStepConfig("sleep 0.3"));
    replaceSteps(db, workflowId, steps);
    auto projectId = createProject(db, "P3", "p3", "", workflowId);

    auto firstRunId = startWorkflowRun(projectId, workflowId, "manual");
    ASSERT_GE(firstRunId, 0);
    auto secondRunId = startWorkflowRun(projectId, workflowId, "manual");
    EXPECT_EQ(secondRunId, -1);

    waitForTerminal(firstRunId);
}
