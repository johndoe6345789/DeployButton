#include "RunCommand.h"
#include <array>
#include <cstdio>
#include <sys/wait.h>

namespace
{
std::string shellQuote(const std::string &s)
{
    std::string out = "'";
    for (char c : s)
    {
        if (c == '\'')
        {
            out += "'\\''";
        }
        else
        {
            out += c;
        }
    }
    out += "'";
    return out;
}
}  // namespace

namespace deploybutton
{
CommandResult runCommand(const std::string &cwd,
                          const std::string &command,
                          const std::function<void(const std::string &)> &onOutput)
{
    std::string fullCommand;
    if (!cwd.empty())
    {
        // The whole compound command is wrapped in one subshell before
        // redirecting, so a failing `cd` (nonexistent directory, etc.) has its
        // stderr captured too, not just the trailing command's.
        fullCommand = "(cd " + shellQuote(cwd) + " && " + command + ") 2>&1";
    }
    else
    {
        fullCommand = "(" + command + ") 2>&1";
    }

    FILE *pipe = popen(fullCommand.c_str(), "r");
    if (!pipe)
    {
        onOutput("Failed to start command: " + command + "\n");
        return {-1};
    }

    std::array<char, 4096> buffer{};
    while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
    {
        onOutput(std::string(buffer.data()));
    }

    int status = pclose(pipe);
    int exitCode = -1;
    if (WIFEXITED(status))
    {
        exitCode = WEXITSTATUS(status);
    }
    return {exitCode};
}
}  // namespace deploybutton
