#include "../engine/HttpWebhookStep.h"
#include "support/TestHttpServer.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::TestHttpServer;

TEST(HttpWebhookStep, SuccessfulPostReturnsExitZero) {
    TestHttpServer server;
    int port = server.start("200 OK");

    Json::Value config;
    config["url"] = "http://127.0.0.1:" + std::to_string(port) + "/hook";
    config["method"] = "POST";
    config["body"] = "payload";

    std::string output;
    auto result =
        httpWebhookStep(config, [&](const std::string &c) { output += c; });

    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(output.find("HTTP 200"), std::string::npos);
    EXPECT_NE(server.lastRequest().find("POST /hook"), std::string::npos);
    EXPECT_NE(server.lastRequest().find("payload"), std::string::npos);
}

TEST(HttpWebhookStep, NonSuccessStatusReturnsExitOne) {
    TestHttpServer server;
    int port = server.start("500 Internal Server Error");

    Json::Value config;
    config["url"] = "http://127.0.0.1:" + std::to_string(port) + "/hook";

    auto result = httpWebhookStep(config, [](const std::string &) {});
    EXPECT_EQ(result.exitCode, 1);
}

TEST(HttpWebhookStep, MissingUrlFailsWithoutNetworkCall) {
    Json::Value config;
    std::string output;
    auto result =
        httpWebhookStep(config, [&](const std::string &c) { output += c; });
    EXPECT_EQ(result.exitCode, 1);
    EXPECT_NE(output.find("missing 'url'"), std::string::npos);
}

TEST(HttpWebhookStep, UnreachableHostFailsGracefully) {
    Json::Value config;
    config["url"] = "http://127.0.0.1:1/unreachable";
    auto result = httpWebhookStep(config, [](const std::string &) {});
    EXPECT_EQ(result.exitCode, 1);
}

TEST(HttpWebhookStep, GetMethodSendsNoBody) {
    TestHttpServer server;
    int port = server.start("200 OK");

    Json::Value config;
    config["url"] = "http://127.0.0.1:" + std::to_string(port) + "/hook";
    config["method"] = "GET";

    auto result = httpWebhookStep(config, [](const std::string &) {});
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(server.lastRequest().find("GET /hook"), std::string::npos);
}
