#include "../engine/CommandSteps.h"
#include <cstdlib>
#include <cstring>
#include <gtest/gtest.h>

using namespace deploybutton;

namespace {
std::string makeEmptyGitRepo() {
    char buf[] = "/tmp/deploybutton_git_test_XXXXXX";
    std::string dir = mkdtemp(buf);
    std::string cmd = "git init -q " + dir + " >/dev/null 2>&1";
    std::system(cmd.c_str());
    return dir;
}
}  // namespace

// No fake remote is configured, so `git pull` fails deterministically --
// this still exercises the real command construction and cwd handling.
TEST(GitPullStep, FailsWithCapturedOutputWhenNoRemoteConfigured) {
    Json::Value config;
    config["cwd"] = makeEmptyGitRepo();

    std::string output;
    auto result =
        gitPullStep(config, [&](const std::string& c) { output += c; });

    EXPECT_NE(result.exitCode, 0);
    EXPECT_FALSE(output.empty());
}

TEST(GitPullStep, FailsWhenCwdDoesNotExist) {
    Json::Value config;
    config["cwd"] = "/no/such/repo/dir";

    std::string output;
    auto result =
        gitPullStep(config, [&](const std::string& c) { output += c; });

    EXPECT_NE(result.exitCode, 0);
    EXPECT_FALSE(output.empty());
}
