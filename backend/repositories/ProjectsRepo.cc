#include "ProjectsRepo.h"

using namespace drogon::orm;

namespace
{
Json::Value rowToJson(const Row &row)
{
    Json::Value obj;
    obj["id"] = static_cast<Json::Int64>(row["id"].as<long long>());
    obj["name"] = row["name"].as<std::string>();
    obj["slug"] = row["slug"].as<std::string>();
    obj["repo_url"] = row["repo_url"].isNull() ? Json::Value() : Json::Value(row["repo_url"].as<std::string>());
    obj["workflow_id"] = static_cast<Json::Int64>(row["workflow_id"].as<long long>());
    obj["workflow_name"] = row["workflow_name"].as<std::string>();
    obj["last_run_status"] = row["last_run_status"].isNull()
                                  ? Json::Value()
                                  : Json::Value(row["last_run_status"].as<std::string>());
    obj["last_run_started_at"] = row["last_run_started_at"].isNull()
                                      ? Json::Value()
                                      : Json::Value(row["last_run_started_at"].as<std::string>());
    obj["last_run_finished_at"] = row["last_run_finished_at"].isNull()
                                       ? Json::Value()
                                       : Json::Value(row["last_run_finished_at"].as<std::string>());
    return obj;
}

const char *kSelectBase =
    "SELECT p.id, p.name, p.slug, p.repo_url, p.workflow_id, w.name AS workflow_name, "
    "(SELECT status FROM workflow_runs r WHERE r.project_id = p.id "
    " ORDER BY r.started_at DESC, r.id DESC LIMIT 1) AS last_run_status, "
    "(SELECT started_at FROM workflow_runs r WHERE r.project_id = p.id "
    " ORDER BY r.started_at DESC, r.id DESC LIMIT 1) AS last_run_started_at, "
    "(SELECT finished_at FROM workflow_runs r WHERE r.project_id = p.id "
    " ORDER BY r.started_at DESC, r.id DESC LIMIT 1) AS last_run_finished_at "
    "FROM projects p JOIN workflows w ON w.id = p.workflow_id ";
}  // namespace

namespace deploybutton
{
Json::Value listProjects(const DbClientPtr &db)
{
    Json::Value arr(Json::arrayValue);
    auto result = db->execSqlSync(std::string(kSelectBase) + "ORDER BY p.id DESC");
    for (const auto &row : result)
    {
        arr.append(rowToJson(row));
    }
    return arr;
}

Json::Value getProject(const DbClientPtr &db, long long id)
{
    auto result = db->execSqlSync(std::string(kSelectBase) + "WHERE p.id = ?", id);
    if (result.empty())
    {
        return Json::Value();
    }
    return rowToJson(result[0]);
}

Json::Value getProjectBySlug(const DbClientPtr &db, const std::string &slug)
{
    auto result = db->execSqlSync(std::string(kSelectBase) + "WHERE p.slug = ?", slug);
    if (result.empty())
    {
        return Json::Value();
    }
    return rowToJson(result[0]);
}

long long createProject(const DbClientPtr &db,
                         const std::string &name,
                         const std::string &slug,
                         const std::string &repoUrl,
                         long long workflowId)
{
    auto result = db->execSqlSync(
        "INSERT INTO projects (name, slug, repo_url, workflow_id) VALUES (?, ?, ?, ?)",
        name,
        slug,
        repoUrl,
        workflowId);
    return static_cast<long long>(result.insertId());
}

void updateProject(const DbClientPtr &db,
                    long long id,
                    const std::string &name,
                    const std::string &slug,
                    const std::string &repoUrl,
                    long long workflowId)
{
    db->execSqlSync(
        "UPDATE projects SET name = ?, slug = ?, repo_url = ?, workflow_id = ?, "
        "updated_at = datetime('now') WHERE id = ?",
        name,
        slug,
        repoUrl,
        workflowId,
        id);
}

void deleteProject(const DbClientPtr &db, long long id)
{
    db->execSqlSync("DELETE FROM projects WHERE id = ?", id);
}
}  // namespace deploybutton
