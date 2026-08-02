#include "../engine/StepConfig.h"
#include <gtest/gtest.h>

using namespace deploybutton;

TEST(StepConfig, ConfigStrReturnsValueWhenPresent) {
    Json::Value config;
    config["url"] = "https://example.com";
    EXPECT_EQ(configStr(config, "url"), "https://example.com");
}

TEST(StepConfig, ConfigStrReturnsDefaultWhenMissing) {
    Json::Value config;
    EXPECT_EQ(configStr(config, "url", "fallback"), "fallback");
}

TEST(StepConfig, ConfigStrReturnsDefaultWhenWrongType) {
    Json::Value config;
    config["seconds"] = 5;
    EXPECT_EQ(configStr(config, "seconds", "fallback"), "fallback");
}

TEST(StepConfig, ConfigIntReturnsValueWhenPresent) {
    Json::Value config;
    config["seconds"] = 42;
    EXPECT_EQ(configInt(config, "seconds"), 42);
}

TEST(StepConfig, ConfigIntReturnsDefaultWhenMissing) {
    Json::Value config;
    EXPECT_EQ(configInt(config, "seconds", 7), 7);
}

TEST(StepConfig, ConfigIntReturnsDefaultWhenWrongType) {
    Json::Value config;
    config["seconds"] = "not a number";
    EXPECT_EQ(configInt(config, "seconds", 3), 3);
}
