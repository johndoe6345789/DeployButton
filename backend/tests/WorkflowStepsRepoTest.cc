#include "../repositories/WorkflowsRepo.h"
#include "support/TempSqliteDb.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::freshTestDb;

TEST(WorkflowStepsRepo, ReplaceStepsSetsOrderedSteps) {
    auto db = freshTestDb();
    auto id = createWorkflow(db, "W", "");

    Json::Value steps(Json::arrayValue);
    Json::Value step1;
    step1["name"] = "First";
    step1["type"] = "shell";
    step1["config"]["command"] = "echo 1";
    steps.append(step1);
    Json::Value step2;
    step2["name"] = "Second";
    step2["type"] = "delay";
    steps.append(step2);

    replaceSteps(db, id, steps);

    auto fetched = getStepsForWorkflow(db, id);
    ASSERT_EQ(fetched.size(), 2u);
    EXPECT_EQ(fetched[0].name, "First");
    EXPECT_EQ(fetched[0].position, 0);
    EXPECT_EQ(fetched[0].type, "shell");
    EXPECT_EQ(fetched[1].name, "Second");
    EXPECT_EQ(fetched[1].position, 1);
}

TEST(WorkflowStepsRepo, ReplaceStepsDiscardsPreviousSteps) {
    auto db = freshTestDb();
    auto id = createWorkflow(db, "W", "");

    Json::Value first(Json::arrayValue);
    Json::Value s;
    s["name"] = "Only";
    s["type"] = "shell";
    first.append(s);
    replaceSteps(db, id, first);

    Json::Value empty(Json::arrayValue);
    replaceSteps(db, id, empty);

    EXPECT_EQ(getStepsForWorkflow(db, id).size(), 0u);
}

TEST(WorkflowStepsRepo, ReplaceStepsDefaultsMissingConfigToEmptyObject) {
    auto db = freshTestDb();
    auto id = createWorkflow(db, "W", "");

    Json::Value steps(Json::arrayValue);
    Json::Value s;
    s["name"] = "No config";
    s["type"] = "notify";
    steps.append(s);
    replaceSteps(db, id, steps);

    auto workflow = getWorkflowWithSteps(db, id);
    EXPECT_TRUE(workflow["steps"][0]["config"].isObject());
    EXPECT_EQ(workflow["steps"][0]["config"].size(), 0u);
}
