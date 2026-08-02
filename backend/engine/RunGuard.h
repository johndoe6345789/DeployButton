#pragma once

namespace deploybutton {
// Tracks which project IDs currently have a workflow run in flight, so a
// second trigger for the same project is rejected instead of racing.
bool tryAcquireRunGuard(long long projectId);
void releaseRunGuard(long long projectId);
}  // namespace deploybutton
