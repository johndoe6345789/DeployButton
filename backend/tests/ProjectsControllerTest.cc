#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

TEST(ProjectsController, CreateThenGet) {
    auto workflowId = makeWorkflowViaApi("PC workflow 1");
    auto id = makeProjectViaApi("Ctrl App", "ctrl-app", workflowId);

    auto fetched = apiGet("/api/projects/" + std::to_string(id));
    EXPECT_EQ(fetched.httpCode, 200);
    EXPECT_EQ(fetched.body["slug"].asString(), "ctrl-app");
}

TEST(ProjectsController, CreateMissingFieldsReturns400) {
    Json::Value body;
    body["name"] = "Incomplete";
    auto resp = apiPost("/api/projects", body);
    EXPECT_EQ(resp.httpCode, 400);
}

TEST(ProjectsController, GetMissingReturns404) {
    auto resp = apiGet("/api/projects/999999");
    EXPECT_EQ(resp.httpCode, 404);
}

TEST(ProjectsController, ListIncludesCreatedProject) {
    auto workflowId = makeWorkflowViaApi("PC workflow 2");
    makeProjectViaApi("Listed", "listed-app", workflowId);

    auto list = apiGet("/api/projects");
    EXPECT_EQ(list.httpCode, 200);
    EXPECT_TRUE(list.body.isArray());
    EXPECT_GT(list.body.size(), 0u);
}

TEST(ProjectsController, UpdateChangesName) {
    auto workflowId = makeWorkflowViaApi("PC workflow 3");
    auto id = makeProjectViaApi("Before", "update-app", workflowId);

    Json::Value update;
    update["name"] = "After";
    auto resp = apiPut("/api/projects/" + std::to_string(id), update);
    EXPECT_EQ(resp.httpCode, 200);
    EXPECT_EQ(resp.body["name"].asString(), "After");
}

TEST(ProjectsController, DeleteRemovesProject) {
    auto workflowId = makeWorkflowViaApi("PC workflow 4");
    auto id = makeProjectViaApi("Doomed", "doomed-app", workflowId);

    auto del = apiDelete("/api/projects/" + std::to_string(id));
    EXPECT_EQ(del.httpCode, 200);
    EXPECT_EQ(apiGet("/api/projects/" + std::to_string(id)).httpCode, 404);
}
