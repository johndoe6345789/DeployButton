#include "WorkflowsRepo.h"

using namespace drogon::orm;

namespace deploybutton {
long long createWorkflow(const DbClientPtr &db, const std::string &name,
                         const std::string &description) {
    auto result = db->execSqlSync(
        "INSERT INTO workflows (name, description, is_template) VALUES (?, ?, "
        "0)",
        name, description);
    return static_cast<long long>(result.insertId());
}

void updateWorkflow(const DbClientPtr &db, long long id,
                    const std::string &name, const std::string &description) {
    db->execSqlSync(
        "UPDATE workflows SET name = ?, description = ?, updated_at = "
        "datetime('now') "
        "WHERE id = ?",
        name, description, id);
}

void deleteWorkflow(const DbClientPtr &db, long long id) {
    db->execSqlSync("DELETE FROM workflows WHERE id = ?", id);
}
}  // namespace deploybutton
