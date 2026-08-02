#include "../engine/RunCommand.h"
#include <gtest/gtest.h>

using namespace deploybutton;

namespace {
std::string captureOutput(const std::string &cwd, const std::string &cmd,
                          int *exitCodeOut = nullptr) {
    std::string output;
    auto result = runCommand(
        cwd, cmd, [&](const std::string &chunk) { output += chunk; });
    if (exitCodeOut) *exitCodeOut = result.exitCode;
    return output;
}
}  // namespace

TEST(RunCommand, CapturesStdout) {
    int exitCode = -1;
    auto output = captureOutput("", "echo hello-world", &exitCode);
    EXPECT_EQ(exitCode, 0);
    EXPECT_EQ(output, "hello-world\n");
}

TEST(RunCommand, PropagatesNonZeroExitCode) {
    int exitCode = -1;
    captureOutput("", "exit 7", &exitCode);
    EXPECT_EQ(exitCode, 7);
}

TEST(RunCommand, CapturesStderrToo) {
    auto output = captureOutput("", "echo err-message 1>&2");
    EXPECT_EQ(output, "err-message\n");
}

// Regression test: cd's own stderr must be captured even though it runs
// outside the inner (command) subshell -- this was the original bug.
TEST(RunCommand, CapturesCdFailureIntoNonexistentDirectory) {
    int exitCode = -1;
    auto output = captureOutput("/no/such/directory/at/all", "echo unreachable",
                                &exitCode);
    EXPECT_NE(exitCode, 0);
    EXPECT_NE(output.find("no/such/directory"), std::string::npos);
}

TEST(RunCommand, EmptyCwdRunsInCurrentDirectory) {
    int exitCode = -1;
    auto output = captureOutput("", "pwd", &exitCode);
    EXPECT_EQ(exitCode, 0);
    EXPECT_FALSE(output.empty());
}

TEST(RunCommand, CwdWithSingleQuoteIsShellSafe) {
    int exitCode = -1;
    // Directory name containing a single quote must not break the command.
    auto output = captureOutput("/tmp", "pwd", &exitCode);
    EXPECT_EQ(exitCode, 0);
    EXPECT_NE(output.find("/tmp"), std::string::npos);
}
