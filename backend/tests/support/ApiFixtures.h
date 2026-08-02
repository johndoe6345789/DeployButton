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
}  // namespace deploybutton::test
