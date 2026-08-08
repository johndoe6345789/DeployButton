#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

TEST(HealthController, ReturnsOk) {
    auto response = apiGet("/api/health");
    EXPECT_EQ(response.httpCode, 200);
    EXPECT_EQ(response.body["status"].asString(), "ok");
}
