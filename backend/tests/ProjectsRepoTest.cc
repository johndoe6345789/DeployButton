#include "../repositories/ProjectsRepo.h"
#include "../repositories/WorkflowsRepo.h"
#include "support/TempSqliteDb.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::freshTestDb;

namespace {
long long makeWorkflow(const drogon::orm::DbClientPtr& db) {
    return createWorkflow(db, "W", "desc");
}
}  // namespace

TEST(ProjectsRepo, CreateAndGet) {
    auto db = freshTestDb();
    auto workflowId = makeWorkflow(db);

    auto id = createProject(db, "My App", "my-app", "repo-url", workflowId);
    auto project = getProject(db, id);

    ASSERT_FALSE(project.isNull());
    EXPECT_EQ(project["name"].asString(), "My App");
    EXPECT_EQ(project["slug"].asString(), "my-app");
    EXPECT_EQ(project["workflow_id"].asInt64(), workflowId);
    EXPECT_EQ(project["workflow_name"].asString(), "W");
    EXPECT_TRUE(project["last_run_status"].isNull());
}

TEST(ProjectsRepo, GetMissingReturnsNull) {
    auto db = freshTestDb();
    EXPECT_TRUE(getProject(db, 999).isNull());
}

TEST(ProjectsRepo, GetBySlug) {
    auto db = freshTestDb();
    auto workflowId = makeWorkflow(db);
    createProject(db, "App", "app-slug", "", workflowId);

    auto project = getProjectBySlug(db, "app-slug");
    ASSERT_FALSE(project.isNull());
    EXPECT_EQ(project["slug"].asString(), "app-slug");
    EXPECT_TRUE(getProjectBySlug(db, "nope").isNull());
}

TEST(ProjectsRepo, ListOrdersNewestFirst) {
    auto db = freshTestDb();
    auto workflowId = makeWorkflow(db);
    createProject(db, "First", "first", "", workflowId);
    createProject(db, "Second", "second", "", workflowId);

    auto all = listProjects(db);
    ASSERT_EQ(all.size(), 2u);
    EXPECT_EQ(all[0]["slug"].asString(), "second");
    EXPECT_EQ(all[1]["slug"].asString(), "first");
}

TEST(ProjectsRepo, UpdateChangesFields) {
    auto db = freshTestDb();
    auto workflowId = makeWorkflow(db);
    auto id = createProject(db, "Old", "old", "", workflowId);

    updateProject(db, id, "New", "new-slug", "url", workflowId);

    auto project = getProject(db, id);
    EXPECT_EQ(project["name"].asString(), "New");
    EXPECT_EQ(project["slug"].asString(), "new-slug");
    EXPECT_EQ(project["repo_url"].asString(), "url");
}

TEST(ProjectsRepo, DeleteRemovesProject) {
    auto db = freshTestDb();
    auto workflowId = makeWorkflow(db);
    auto id = createProject(db, "Gone", "gone", "", workflowId);

    deleteProject(db, id);

    EXPECT_TRUE(getProject(db, id).isNull());
}
