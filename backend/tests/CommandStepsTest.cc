#include "../engine/CommandSteps.h"
#include "support/StubPath.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::StubPath;

TEST_F(StubPath, NpmInstallRunsNpmInstall) {
    addStub("npm");
    Json::Value config;
    config["manager"] = "npm";
    std::string output;
    auto result =
        npmInstallStep(config, [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(output.find("STUB:npm install"), std::string::npos);
}

TEST_F(StubPath, NpmInstallDefaultsToNpm) {
    addStub("npm");
    std::string output;
    auto result = npmInstallStep(Json::Value(),
                                 [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(output.find("STUB:npm install"), std::string::npos);
}

TEST_F(StubPath, NpmBuildUsesNpmRunScript) {
    addStub("npm");
    Json::Value config;
    config["manager"] = "npm";
    config["script"] = "build";
    std::string output;
    auto result =
        npmBuildStep(config, [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(output.find("STUB:npm run build"), std::string::npos);
}

TEST_F(StubPath, NpmBuildUsesYarnDirectScript) {
    addStub("yarn");
    Json::Value config;
    config["manager"] = "yarn";
    config["script"] = "build";
    std::string output;
    auto result =
        npmBuildStep(config, [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(output.find("STUB:yarn build"), std::string::npos);
}

TEST_F(StubPath, ShellCommandDelegatesToRunCommand) {
    Json::Value config;
    config["command"] = "echo shell-step-ran";
    std::string output;
    auto result = shellStep(config, [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_EQ(output, "shell-step-ran\n");
}
