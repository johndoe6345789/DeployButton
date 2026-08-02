#pragma once

#include <json/json.h>

namespace deploybutton::test {
// Polls GET-equivalent getRunDetail (via the shared app db) until the run
// leaves the "running" state or timeoutMs elapses.
Json::Value waitForTerminal(long long runId, int timeoutMs = 5000);

// A single-step shell workflow step definition.
Json::Value shellStepConfig(const std::string &command);
}  // namespace deploybutton::test
