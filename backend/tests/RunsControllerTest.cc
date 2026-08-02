#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

TEST(RunsController, GetMissingRunReturns404) {
    EXPECT_EQ(apiGet("/api/runs/999999").httpCode, 404);
}

TEST(RunsController, ListForProjectReturnsArray) {
    auto workflowId = makeWorkflowViaApi("Runs list workflow");
    auto projectId =
        makeProjectViaApi("Runs list app", "runs-list-app", workflowId);

    auto resp = apiGet("/api/projects/" + std::to_string(projectId) + "/runs");
    EXPECT_EQ(resp.httpCode, 200);
    EXPECT_TRUE(resp.body.isArray());
    EXPECT_EQ(resp.body.size(), 0u);
}
