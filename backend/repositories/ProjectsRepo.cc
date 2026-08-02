#include "ProjectsRepo.h"
#include "JsonUtil.h"

using namespace drogon::orm;

namespace {
Json::Value rowToJson(const Row &row) {
    Json::Value obj;
    obj["id"] = deploybutton::toJsonInt64(row["id"].as<long long>());
    obj["name"] = row["name"].as<std::string>();
    obj["slug"] = row["slug"].as<std::string>();
    obj["repo_url"] = deploybutton::nullableString(row["repo_url"]);
    obj["workflow_id"] =
        deploybutton::toJsonInt64(row["workflow_id"].as<long long>());
    obj["workflow_name"] = row["workflow_name"].as<std::string>();
    obj["last_run_status"] =
        deploybutton::nullableString(row["last_run_status"]);
    obj["last_run_started_at"] =
        deploybutton::nullableString(row["last_run_started_at"]);
    obj["last_run_finished_at"] =
        deploybutton::nullableString(row["last_run_finished_at"]);
    return obj;
}

const char *kSelectBase =
    "SELECT p.id, p.name, p.slug, p.repo_url, p.workflow_id, w.name AS "
    "workflow_name, "
    "(SELECT status FROM workflow_runs r WHERE r.project_id = p.id "
    " ORDER BY r.started_at DESC, r.id DESC LIMIT 1) AS last_run_status, "
    "(SELECT started_at FROM workflow_runs r WHERE r.project_id = p.id "
    " ORDER BY r.started_at DESC, r.id DESC LIMIT 1) AS last_run_started_at, "
    "(SELECT finished_at FROM workflow_runs r WHERE r.project_id = p.id "
    " ORDER BY r.started_at DESC, r.id DESC LIMIT 1) AS last_run_finished_at "
    "FROM projects p JOIN workflows w ON w.id = p.workflow_id ";
}  // namespace

namespace deploybutton {
Json::Value listProjects(const DbClientPtr &db) {
    Json::Value arr(Json::arrayValue);
    auto result =
        db->execSqlSync(std::string(kSelectBase) + "ORDER BY p.id DESC");
    for (const auto &row : result) {
        arr.append(rowToJson(row));
    }
    return arr;
}

Json::Value getProject(const DbClientPtr &db, long long id) {
    auto result =
        db->execSqlSync(std::string(kSelectBase) + "WHERE p.id = ?", id);
    return result.empty() ? Json::Value() : rowToJson(result[0]);
}

Json::Value getProjectBySlug(const DbClientPtr &db, const std::string &slug) {
    auto result =
        db->execSqlSync(std::string(kSelectBase) + "WHERE p.slug = ?", slug);
    return result.empty() ? Json::Value() : rowToJson(result[0]);
}
}  // namespace deploybutton
