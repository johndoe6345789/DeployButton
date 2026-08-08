#include "../engine/Steps.h"
#include <gtest/gtest.h>

using namespace deploybutton;

namespace {
std::string run(const std::string& type, const Json::Value& config,
                int* exit = nullptr) {
    std::string output;
    auto result = executeStep(
        type, config, [&](const std::string& chunk) { output += chunk; });
    if (exit) *exit = result.exitCode;
    return output;
}
}  // namespace

TEST(StepsDispatch, ShellDelegatesToRunCommand) {
    Json::Value config;
    config["command"] = "echo dispatched";
    int exitCode = -1;
    auto output = run("shell", config, &exitCode);
    EXPECT_EQ(exitCode, 0);
    EXPECT_EQ(output, "dispatched\n");
}

TEST(StepsDispatch, DelayWaitsAndSucceeds) {
    Json::Value config;
    config["seconds"] = 0;
    int exitCode = -1;
    auto output = run("delay", config, &exitCode);
    EXPECT_EQ(exitCode, 0);
    EXPECT_NE(output.find("Waiting 0 seconds"), std::string::npos);
}

TEST(StepsDispatch, NotifyOutputsMessageAndSucceeds) {
    Json::Value config;
    config["message"] = "deployed!";
    int exitCode = -1;
    auto output = run("notify", config, &exitCode);
    EXPECT_EQ(exitCode, 0);
    EXPECT_EQ(output, "deployed!\n");
}

TEST(StepsDispatch, UnknownTypeFailsWithMessage) {
    int exitCode = -1;
    auto output = run("not_a_real_type", Json::Value(), &exitCode);
    EXPECT_EQ(exitCode, 1);
    EXPECT_NE(output.find("Unknown step type"), std::string::npos);
}
