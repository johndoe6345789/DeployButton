#include "../repositories/WorkflowsRepo.h"
#include "support/TempSqliteDb.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::freshTestDb;

TEST(WorkflowsRepo, CreateAndGetHasEmptySteps) {
    auto db = freshTestDb();
    auto id = createWorkflow(db, "My Workflow", "does things");

    auto workflow = getWorkflowWithSteps(db, id);
    ASSERT_FALSE(workflow.isNull());
    EXPECT_EQ(workflow["name"].asString(), "My Workflow");
    EXPECT_FALSE(workflow["is_template"].asBool());
    EXPECT_TRUE(workflow["steps"].isArray());
    EXPECT_EQ(workflow["steps"].size(), 0u);
}

TEST(WorkflowsRepo, GetMissingReturnsNull) {
    auto db = freshTestDb();
    EXPECT_TRUE(getWorkflowWithSteps(db, 12345).isNull());
}

TEST(WorkflowsRepo, ListReturnsAllWorkflows) {
    auto db = freshTestDb();
    createWorkflow(db, "A", "");
    createWorkflow(db, "B", "");
    EXPECT_EQ(listWorkflows(db).size(), 2u);
}

TEST(WorkflowsRepo, UpdateChangesNameAndDescription) {
    auto db = freshTestDb();
    auto id = createWorkflow(db, "Old", "old desc");
    updateWorkflow(db, id, "New", "new desc");

    auto workflow = getWorkflowWithSteps(db, id);
    EXPECT_EQ(workflow["name"].asString(), "New");
    EXPECT_EQ(workflow["description"].asString(), "new desc");
}

TEST(WorkflowsRepo, DeleteRemovesWorkflow) {
    auto db = freshTestDb();
    auto id = createWorkflow(db, "Gone", "");
    deleteWorkflow(db, id);
    EXPECT_TRUE(getWorkflowWithSteps(db, id).isNull());
}
