#include "RunsRepo.h"

using namespace drogon::orm;

namespace deploybutton {
long long createRun(const DbClientPtr &db, long long projectId,
                    long long workflowId, const std::string &triggerType) {
    auto result = db->execSqlSync(
        "INSERT INTO workflow_runs (project_id, workflow_id, trigger_type, "
        "status) "
        "VALUES (?, ?, ?, 'running')",
        projectId, workflowId, triggerType);
    return static_cast<long long>(result.insertId());
}

void finishRun(const DbClientPtr &db, long long runId,
               const std::string &status) {
    db->execSqlSync(
        "UPDATE workflow_runs SET status = ?, finished_at = datetime('now') "
        "WHERE id = ?",
        status, runId);
}
}  // namespace deploybutton
