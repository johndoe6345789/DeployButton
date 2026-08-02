#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <chrono>
#include <gtest/gtest.h>
#include <thread>

using namespace deploybutton::test;

namespace {
Json::Value waitForRun(long long runId, int timeoutMs = 5000) {
    auto start = std::chrono::steady_clock::now();
    while (true) {
        auto resp = apiGet("/api/runs/" + std::to_string(runId));
        if (resp.body["status"].asString() != "running") return resp.body;
        if (std::chrono::steady_clock::now() - start >
            std::chrono::milliseconds(timeoutMs)) {
            return resp.body;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
    }
}
}  // namespace

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
