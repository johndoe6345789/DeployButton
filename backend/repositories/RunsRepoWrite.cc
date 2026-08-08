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

long long createRunIfNotRunning(const DbClientPtr &db, long long projectId,
                                long long workflowId,
                                const std::string &triggerType) {
    auto result = db->execSqlSync(
        "INSERT INTO workflow_runs (project_id, workflow_id, trigger_type, "
        "status) "
        "SELECT ?, ?, ?, 'running' WHERE NOT EXISTS "
        "(SELECT 1 FROM workflow_runs WHERE project_id = ? AND status = "
        "'running')",
        projectId, workflowId, triggerType, projectId);
    if (result.affectedRows() == 0) {
        return -1;
    }
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
