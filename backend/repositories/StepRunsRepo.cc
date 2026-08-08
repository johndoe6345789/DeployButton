#include "RunsRepo.h"

using namespace drogon::orm;

namespace deploybutton {
long long createStepRun(const DbClientPtr& db, long long runId,
                        long long stepId, int position, const std::string& name,
                        const std::string& type) {
    auto result = db->execSqlSync(
        "INSERT INTO step_runs (run_id, step_id, position, name, type, status) "
        "VALUES (?, ?, ?, ?, ?, 'running')",
        runId, stepId, position, name, type);
    return static_cast<long long>(result.insertId());
}

void appendStepOutput(const DbClientPtr& db, long long stepRunId,
                      const std::string& chunk) {
    db->execSqlSync("UPDATE step_runs SET output = output || ? WHERE id = ?",
                    chunk, stepRunId);
}

void finishStepRun(const DbClientPtr& db, long long stepRunId,
                   const std::string& status, int exitCode) {
    db->execSqlSync(
        "UPDATE step_runs SET status = ?, exit_code = ?, finished_at = "
        "datetime('now') "
        "WHERE id = ?",
        status, exitCode, stepRunId);
}
}  // namespace deploybutton
