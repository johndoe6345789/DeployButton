#pragma once

#include <string>

namespace deploybutton
{
// Creates a workflow_runs row and starts executing the workflow's steps
// sequentially on a detached background thread. Returns the new run's id,
// or -1 if a run for this project is already in progress.
long long startWorkflowRun(long long projectId,
                            long long workflowId,
                            const std::string &triggerType);
}  // namespace deploybutton
