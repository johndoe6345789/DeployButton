#include "RunGuard.h"
#include <mutex>
#include <unordered_set>

namespace {
std::mutex g_mutex;
std::unordered_set<long long> g_running;
}  // namespace

namespace deploybutton {
bool tryAcquireRunGuard(long long projectId) {
    std::lock_guard<std::mutex> lock(g_mutex);
    if (g_running.count(projectId) > 0) {
        return false;
    }
    g_running.insert(projectId);
    return true;
}

void releaseRunGuard(long long projectId) {
    std::lock_guard<std::mutex> lock(g_mutex);
    g_running.erase(projectId);
}
}  // namespace deploybutton
