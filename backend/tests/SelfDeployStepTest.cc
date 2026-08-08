#include "../engine/SelfDeployInternal.h"
#include "../engine/SelfDeployStep.h"
#include "../repositories/DeployStateRepo.h"
#include "support/StubPath.h"
#include <drogon/drogon.h>
#include <fstream>
#include <gtest/gtest.h>
#include <sys/stat.h>

using namespace deploybutton;
using deploybutton::test::StubPath;

TEST(SelfDeployStep, OtherSlotToggles) {
    EXPECT_EQ(otherSlot("blue"), "green");
    EXPECT_EQ(otherSlot("green"), "blue");
}

TEST(SelfDeployStep, MissingCwdFails) {
    std::string output;
    auto result = blueGreenDeployStep(
        Json::Value(), [&](const std::string& c) { output += c; });
    EXPECT_EQ(result.exitCode, 1);
    EXPECT_NE(output.find("missing 'cwd'"), std::string::npos);
}

TEST_F(StubPath, HappyPathFlipsActiveSlotAndSucceeds) {
    addStub("docker");
    auto db = drogon::app().getDbClient();
    setActiveSlot(db, "blue");

    Json::Value config;
    config["cwd"] = "/tmp";
    config["healthTimeoutSeconds"] = 5;
    std::string output;
    auto result =
        blueGreenDeployStep(config, [&](const std::string& c) { output += c; });

    EXPECT_EQ(result.exitCode, 0);
    EXPECT_EQ(getActiveSlot(db), "green");
    EXPECT_NE(output.find("Cutover complete"), std::string::npos);
}

TEST_F(StubPath, FailedBuildLeavesActiveSlotUntouched) {
    std::string path = dir_ + "/docker";
    std::ofstream out(path);
    out << "#!/bin/sh\nexit 1\n";
    out.close();
    chmod(path.c_str(), 0755);

    auto db = drogon::app().getDbClient();
    setActiveSlot(db, "blue");

    Json::Value config;
    config["cwd"] = "/tmp";
    std::string output;
    auto result =
        blueGreenDeployStep(config, [&](const std::string& c) { output += c; });

    EXPECT_EQ(result.exitCode, 1);
    EXPECT_EQ(getActiveSlot(db), "blue");
    EXPECT_NE(output.find("untouched"), std::string::npos);
}
