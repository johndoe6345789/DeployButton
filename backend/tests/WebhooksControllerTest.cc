#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

TEST(WebhooksController, UnknownSlugReturns404) {
    auto resp = apiPost("/api/webhooks/github/does-not-exist", Json::Value());
    EXPECT_EQ(resp.httpCode, 404);
}

TEST(WebhooksController, KnownSlugTriggersRun) {
    auto workflowId =
        makeWorkflowWithShellStep("Webhook workflow", "echo webhook-ok");
    makeProjectViaApi("Webhook app", "webhook-app", workflowId);

    auto resp = apiPost("/api/webhooks/github/webhook-app", Json::Value());
    EXPECT_EQ(resp.httpCode, 202);
    EXPECT_TRUE(resp.body.isMember("runId"));
}
