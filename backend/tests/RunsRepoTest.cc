#include "../repositories/ProjectsRepo.h"
#include "../repositories/RunsRepo.h"
#include "../repositories/WorkflowsRepo.h"
#include "support/TempSqliteDb.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::freshTestDb;

namespace {
struct Fixture {
    drogon::orm::DbClientPtr db = freshTestDb();
    long long workflowId = createWorkflow(db, "W", "");
    long long projectId = createProject(db, "P", "p", "", workflowId);
};
}  // namespace

TEST(RunsRepo, CreateRunStartsRunning) {
    Fixture f;
    auto runId = createRun(f.db, f.projectId, f.workflowId, "manual");

    auto detail = getRunDetail(f.db, runId);
    ASSERT_FALSE(detail.isNull());
    EXPECT_EQ(detail["status"].asString(), "running");
    EXPECT_EQ(detail["trigger_type"].asString(), "manual");
    EXPECT_TRUE(detail["finished_at"].isNull());
    EXPECT_EQ(detail["step_runs"].size(), 0u);
}

TEST(RunsRepo, GetMissingReturnsNull) {
    Fixture f;
    EXPECT_TRUE(getRunDetail(f.db, 999).isNull());
}

TEST(RunsRepo, GetStepOutputChunkMissingStepRunReturnsNull) {
    Fixture f;
    EXPECT_TRUE(getStepOutputChunk(f.db, 999, std::nullopt, std::nullopt, 65536)
                    .isNull());
}

TEST(RunsRepo, FinishRunSetsStatusAndFinishedAt) {
    Fixture f;
    auto runId = createRun(f.db, f.projectId, f.workflowId, "manual");
    finishRun(f.db, runId, "success");

    auto detail = getRunDetail(f.db, runId);
    EXPECT_EQ(detail["status"].asString(), "success");
    EXPECT_FALSE(detail["finished_at"].isNull());
}

TEST(RunsRepo, ListOrdersNewestFirst) {
    Fixture f;
    auto r1 = createRun(f.db, f.projectId, f.workflowId, "manual");
    auto r2 = createRun(f.db, f.projectId, f.workflowId, "github_webhook");

    auto runs = listRunsForProject(f.db, f.projectId);
    ASSERT_EQ(runs.size(), 2u);
    EXPECT_EQ(runs[0]["id"].asInt64(), r2);
    EXPECT_EQ(runs[1]["id"].asInt64(), r1);
}

TEST(RunsRepo, StepRunLifecycle) {
    Fixture f;
    auto runId = createRun(f.db, f.projectId, f.workflowId, "manual");
    auto stepRunId = createStepRun(f.db, runId, 1, 0, "Step", "shell");

    appendStepOutput(f.db, stepRunId, "hello\n");
    appendStepOutput(f.db, stepRunId, "world\n");
    finishStepRun(f.db, stepRunId, "success", 0);

    auto detail = getRunDetail(f.db, runId);
    ASSERT_EQ(detail["step_runs"].size(), 1u);
    auto step = detail["step_runs"][0];
    EXPECT_EQ(step["status"].asString(), "success");
    EXPECT_EQ(step["exit_code"].asInt(), 0);
    EXPECT_EQ(step["output_length"].asInt64(), 12);
}
