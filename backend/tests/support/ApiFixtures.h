#pragma once

#include <json/json.h>
#include <string>

namespace deploybutton::test {
// Shared helpers for controller tests: create a workflow/project through
// the live HTTP API (not the repo layer directly) and return its id.
long long makeWorkflowViaApi(const std::string &name);
long long makeWorkflowWithShellStep(const std::string &name,
                                    const std::string &command);
long long makeProjectViaApi(const std::string &name, const std::string &slug,
                            long long workflowId);

// Polls GET /api/runs/{runId} until it leaves "running" (or timeoutMs
// elapses) and returns the last-seen run body.
Json::Value waitForRun(long long runId, int timeoutMs = 5000);

// Creates and runs a workflow with a single shell step running `command`,
// waits for it to finish, and returns that step's step_run id. `slug` must
// be unique per test (used as both the workflow name and project slug).
long long runShellStepAndGetId(const std::string &slug,
                               const std::string &command);
}  // namespace deploybutton::test
