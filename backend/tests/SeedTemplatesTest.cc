#include "../db/SeedTemplates.h"
#include <gtest/gtest.h>

using namespace deploybutton;

TEST(SeedTemplates, ReturnsTwoTemplates) {
    auto templates = defaultSeedWorkflows();
    ASSERT_EQ(templates.size(), 2u);
    EXPECT_EQ(templates[0].name, "React App via CapRover");
    EXPECT_EQ(templates[1].name, "Node/Docker Backend via CapRover");
}

TEST(SeedTemplates, ReactTemplateHasFiveSteps) {
    auto templates = defaultSeedWorkflows();
    EXPECT_EQ(templates[0].steps.size(), 5u);
    EXPECT_EQ(templates[0].steps[0].type, "git_pull");
    EXPECT_EQ(templates[0].steps.back().type, "notify");
}

TEST(SeedTemplates, BackendTemplateStepsReferenceCaproverWebhook) {
    auto templates = defaultSeedWorkflows();
    auto& steps = templates[1].steps;
    ASSERT_EQ(steps.size(), 4u);
    EXPECT_EQ(steps[1].type, "http_webhook");
    EXPECT_NE(steps[1].config.find("captain.example.com"), std::string::npos);
}
