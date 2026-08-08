#include "support/ApiFixtures.h"
#include "support/HttpTestClient.h"
#include <gtest/gtest.h>

using namespace deploybutton::test;

namespace {
// Six lines of "Lx\n" (3 chars each, 18 total) -- long enough to exercise
// tail/before/after paging with small limits and deterministic offsets.
constexpr const char* kSixLineCommand =
    "printf 'L1\\nL2\\nL3\\nL4\\nL5\\nL6\\n'";
}  // namespace

TEST(StepOutputController, DefaultsToFullTail) {
    auto stepRunId = runShellStepAndGetId("output-tail", kSixLineCommand);

    auto resp =
        apiGet("/api/step-runs/" + std::to_string(stepRunId) + "/output");
    EXPECT_EQ(resp.httpCode, 200);
    EXPECT_EQ(resp.body["text"].asString(), "L1\nL2\nL3\nL4\nL5\nL6\n");
    EXPECT_EQ(resp.body["start_offset"].asInt64(), 0);
    EXPECT_EQ(resp.body["end_offset"].asInt64(), 18);
    EXPECT_EQ(resp.body["total_length"].asInt64(), 18);
}

TEST(StepOutputController, TailWithLimitSnapsToLineStart) {
    auto stepRunId = runShellStepAndGetId("output-tail-limit", kSixLineCommand);

    // Raw window for the last 5 chars is "5\nL6\n" -- snapped forward past
    // its first newline so the returned text starts on a full line.
    auto resp = apiGet("/api/step-runs/" + std::to_string(stepRunId) +
                       "/output?limit=5");
    EXPECT_EQ(resp.httpCode, 200);
    EXPECT_EQ(resp.body["text"].asString(), "L6\n");
    EXPECT_EQ(resp.body["start_offset"].asInt64(), 15);
    EXPECT_EQ(resp.body["end_offset"].asInt64(), 18);
}

TEST(StepOutputController, BeforePagesBackwardWithSnapping) {
    auto stepRunId = runShellStepAndGetId("output-before", kSixLineCommand);

    // Continue paging "earlier" from offset 15 (the tail chunk's start).
    // Raw window for before=15,limit=5 is "4\nL5\n" -- snapped the same way.
    auto resp = apiGet("/api/step-runs/" + std::to_string(stepRunId) +
                       "/output?before=15&limit=5");
    EXPECT_EQ(resp.httpCode, 200);
    EXPECT_EQ(resp.body["text"].asString(), "L5\n");
    EXPECT_EQ(resp.body["start_offset"].asInt64(), 12);
    EXPECT_EQ(resp.body["end_offset"].asInt64(), 15);
}

TEST(StepOutputController, AfterReturnsOnlyNewContent) {
    auto stepRunId = runShellStepAndGetId("output-after", kSixLineCommand);

    auto resp = apiGet("/api/step-runs/" + std::to_string(stepRunId) +
                       "/output?after=15");
    EXPECT_EQ(resp.httpCode, 200);
    EXPECT_EQ(resp.body["text"].asString(), "L6\n");
    EXPECT_EQ(resp.body["start_offset"].asInt64(), 15);
    EXPECT_EQ(resp.body["end_offset"].asInt64(), 18);
}
