#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

TEST(WorkflowsController, CreateReturnsEmptyStepsWorkflow) {
    Json::Value b;
    b["name"] = "WC 1";
    b["description"] = "";
    auto resp = apiPost("/api/workflows", b);
    EXPECT_EQ(resp.httpCode, 201);
    EXPECT_TRUE(resp.body["steps"].isArray());
    EXPECT_EQ(resp.body["steps"].size(), 0u);
}

TEST(WorkflowsController, CreateMissingNameReturns400) {
    Json::Value body;
    body["description"] = "no name";
    EXPECT_EQ(apiPost("/api/workflows", body).httpCode, 400);
}

TEST(WorkflowsController, GetMissingReturns404) {
    EXPECT_EQ(apiGet("/api/workflows/999999").httpCode, 404);
}

TEST(WorkflowsController, UpdateAndDelete) {
    auto id = makeWorkflowViaApi("WC update");

    Json::Value update;
    update["name"] = "WC updated";
    auto put = apiPut("/api/workflows/" + std::to_string(id), update);
    EXPECT_EQ(put.httpCode, 200);
    EXPECT_EQ(put.body["name"].asString(), "WC updated");

    auto del = apiDelete("/api/workflows/" + std::to_string(id));
    EXPECT_EQ(del.httpCode, 200);
    EXPECT_EQ(apiGet("/api/workflows/" + std::to_string(id)).httpCode, 404);
}

TEST(WorkflowsController, ListIncludesTemplateFlag) {
    auto list = apiGet("/api/workflows");
    EXPECT_EQ(list.httpCode, 200);
    ASSERT_TRUE(list.body.isArray());
    ASSERT_GT(list.body.size(), 0u);
    EXPECT_TRUE(list.body[0].isMember("is_template"));
}
