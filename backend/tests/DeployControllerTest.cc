#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

TEST(DeployController, DeployMissingProjectReturns404) {
    EXPECT_EQ(apiPost("/api/projects/999999/deploy", Json::Value()).httpCode,
              404);
}

TEST(DeployController, DeployRunsWorkflowToSuccess) {
    auto workflowId = makeWorkflowWithShellStep("Deploy ok", "echo deploy-ok");
    auto projectId =
        makeProjectViaApi("Deploy ok", "deploy-ok-app", workflowId);

    auto deploy =
        apiPost("/api/projects/" + std::to_string(projectId) + "/deploy",
                Json::Value());
    EXPECT_EQ(deploy.httpCode, 202);

    auto run = waitForRun(deploy.body["runId"].asInt64());
    EXPECT_EQ(run["status"].asString(), "success");
}

TEST(DeployController, ConcurrentDeployIsRejectedWithConflict) {
    auto workflowId = makeWorkflowWithShellStep("Deploy slow", "sleep 0.3");
    auto projectId =
        makeProjectViaApi("Deploy slow", "deploy-slow-app", workflowId);
    std::string path = "/api/projects/" + std::to_string(projectId) + "/deploy";

    auto first = apiPost(path, Json::Value());
    EXPECT_EQ(first.httpCode, 202);
    auto second = apiPost(path, Json::Value());
    EXPECT_EQ(second.httpCode, 409);

    waitForRun(first.body["runId"].asInt64());
}
