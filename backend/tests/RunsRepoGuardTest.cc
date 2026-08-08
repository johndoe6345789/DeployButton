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

TEST(RunsRepoGuard, RejectsWhileOneIsRunning) {
    Fixture f;
    auto first =
        createRunIfNotRunning(f.db, f.projectId, f.workflowId, "manual");
    ASSERT_GE(first, 0);

    auto second =
        createRunIfNotRunning(f.db, f.projectId, f.workflowId, "manual");
    EXPECT_EQ(second, -1);
}

TEST(RunsRepoGuard, AllowsAgainAfterFinish) {
    Fixture f;
    auto first =
        createRunIfNotRunning(f.db, f.projectId, f.workflowId, "manual");
    finishRun(f.db, first, "success");

    auto second =
        createRunIfNotRunning(f.db, f.projectId, f.workflowId, "manual");
    EXPECT_GE(second, 0);
}
