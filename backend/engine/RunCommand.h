#pragma once

#include <functional>
#include <string>

namespace deploybutton {
struct CommandResult {
    int exitCode;
};

// Runs `command` via `/bin/sh -c` (optionally `cd`-ing into `cwd` first),
// invoking onOutput for each chunk of combined stdout+stderr as it arrives.
CommandResult runCommand(
    const std::string &cwd, const std::string &command,
    const std::function<void(const std::string &chunk)> &onOutput);
}  // namespace deploybutton
