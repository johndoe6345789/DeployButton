#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

TEST(WorkflowsControllerSteps, UpdateStepsPersistsOrderedSteps) {
    auto id = makeWorkflowViaApi("WC steps");

    Json::Value steps(Json::arrayValue);
    Json::Value step;
    step["name"] = "Echo";
    step["type"] = "shell";
    step["config"]["command"] = "echo hi";
    steps.append(step);

    auto put = apiPut("/api/workflows/" + std::to_string(id) + "/steps", steps);
    EXPECT_EQ(put.httpCode, 200);
    ASSERT_EQ(put.body["steps"].size(), 1u);
    EXPECT_EQ(put.body["steps"][0]["name"].asString(), "Echo");
}

TEST(WorkflowsControllerSteps, UpdateStepsRejectsNonArrayBody) {
    auto id = makeWorkflowViaApi("WC bad steps");
    Json::Value notArray;
    notArray["oops"] = true;
    auto put =
        apiPut("/api/workflows/" + std::to_string(id) + "/steps", notArray);
    EXPECT_EQ(put.httpCode, 400);
}

TEST(WorkflowsControllerSteps, UpdateStepsForMissingWorkflowReturns404) {
    Json::Value steps(Json::arrayValue);
    EXPECT_EQ(apiPut("/api/workflows/999999/steps", steps).httpCode, 404);
}
