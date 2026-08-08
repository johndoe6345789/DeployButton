#include "ProjectsRepo.h"

using namespace drogon::orm;

namespace deploybutton {
long long createProject(const DbClientPtr& db, const std::string& name,
                        const std::string& slug, const std::string& repoUrl,
                        long long workflowId) {
    auto result = db->execSqlSync(
        "INSERT INTO projects (name, slug, repo_url, workflow_id) VALUES (?, "
        "?, ?, ?)",
        name, slug, repoUrl, workflowId);
    return static_cast<long long>(result.insertId());
}

void updateProject(const DbClientPtr& db, long long id, const std::string& name,
                   const std::string& slug, const std::string& repoUrl,
                   long long workflowId) {
    db->execSqlSync(
        "UPDATE projects SET name = ?, slug = ?, repo_url = ?, workflow_id = "
        "?, "
        "updated_at = datetime('now') WHERE id = ?",
        name, slug, repoUrl, workflowId, id);
}

void deleteProject(const DbClientPtr& db, long long id) {
    db->execSqlSync("DELETE FROM projects WHERE id = ?", id);
}
}  // namespace deploybutton
