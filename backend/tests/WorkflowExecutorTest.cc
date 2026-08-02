#include "../engine/WorkflowExecutor.h"
#include "../repositories/ProjectsRepo.h"
#include "../repositories/WorkflowsRepo.h"
#include "support/ExecutorTestSupport.h"
#include <drogon/drogon.h>
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::shellStepConfig;
using deploybutton::test::waitForTerminal;

TEST(WorkflowExecutor, SuccessfulRunMarksSuccessAndCapturesOutput) {
    auto db = drogon::app().getDbClient();
    auto workflowId = createWorkflow(db, "ok-workflow", "");
    Json::Value steps(Json::arrayValue);
    steps.append(shellStepConfig("echo executor-ok"));
    replaceSteps(db, workflowId, steps);
    auto projectId = createProject(db, "P1", "p1", "", workflowId);

    auto runId = startWorkflowRun(projectId, workflowId, "manual");
    ASSERT_GE(runId, 0);

    auto detail = waitForTerminal(runId);
    EXPECT_EQ(detail["status"].asString(), "success");
    ASSERT_EQ(detail["step_runs"].size(), 1u);
    EXPECT_EQ(detail["step_runs"][0]["output"].asString(), "executor-ok\n");
}

TEST(WorkflowExecutor, FailingStepStopsSubsequentSteps) {
    auto db = drogon::app().getDbClient();
    auto workflowId = createWorkflow(db, "fail-workflow", "");
    Json::Value steps(Json::arrayValue);
    steps.append(shellStepConfig("exit 1"));
    steps.append(shellStepConfig("echo should-not-run"));
    replaceSteps(db, workflowId, steps);
    auto projectId = createProject(db, "P2", "p2", "", workflowId);

    auto runId = startWorkflowRun(projectId, workflowId, "manual");
    auto detail = waitForTerminal(runId);

    EXPECT_EQ(detail["status"].asString(), "failed");
    EXPECT_EQ(detail["step_runs"].size(), 1u);
}
