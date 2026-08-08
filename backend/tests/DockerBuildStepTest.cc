#include "../engine/CommandSteps.h"
#include "support/StubPath.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::StubPath;

TEST_F(StubPath, DockerBuildConstructsCommand) {
    addStub("docker");
    Json::Value config;
    config["tag"] = "my-app:latest";
    config["dockerfile"] = "Dockerfile";
    std::string output;
    auto result =
        dockerBuildStep(config, [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(output.find("STUB:docker build -t my-app:latest"),
              std::string::npos);
}

TEST_F(StubPath, DockerBuildDefaultsTagAndDockerfile) {
    addStub("docker");
    std::string output;
    auto result = dockerBuildStep(Json::Value(),
                                  [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 0);
    EXPECT_NE(output.find("app:latest"), std::string::npos);
    EXPECT_NE(output.find("Dockerfile"), std::string::npos);
}
