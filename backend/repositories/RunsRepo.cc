#include "JsonUtil.h"
#include "RunsRepo.h"

using namespace drogon::orm;

namespace {
Json::Value runRowToJson(const Row& row) {
    Json::Value obj;
    obj["id"] = deploybutton::toJsonInt64(row["id"].as<long long>());
    obj["project_id"] =
        deploybutton::toJsonInt64(row["project_id"].as<long long>());
    obj["workflow_id"] =
        deploybutton::toJsonInt64(row["workflow_id"].as<long long>());
    obj["trigger_type"] = row["trigger_type"].as<std::string>();
    obj["status"] = row["status"].as<std::string>();
    obj["started_at"] = row["started_at"].as<std::string>();
    obj["finished_at"] = deploybutton::nullableString(row["finished_at"]);
    return obj;
}

Json::Value stepRunRowToJson(const Row& row) {
    Json::Value obj;
    obj["id"] = deploybutton::toJsonInt64(row["id"].as<long long>());
    obj["position"] = row["position"].as<int>();
    obj["name"] = row["name"].as<std::string>();
    obj["type"] = row["type"].as<std::string>();
    obj["status"] = row["status"].as<std::string>();
    obj["output_length"] =
        deploybutton::toJsonInt64(row["output_length"].as<long long>());
    obj["exit_code"] = deploybutton::nullableInt(row["exit_code"]);
    obj["started_at"] = row["started_at"].as<std::string>();
    obj["finished_at"] = deploybutton::nullableString(row["finished_at"]);
    return obj;
}
}  // namespace

namespace deploybutton {
Json::Value listRunsForProject(const DbClientPtr& db, long long projectId) {
    Json::Value arr(Json::arrayValue);
    auto result = db->execSqlSync(
        "SELECT id, project_id, workflow_id, trigger_type, status, started_at, "
        "finished_at "
        "FROM workflow_runs WHERE project_id = ? ORDER BY started_at DESC, id "
        "DESC",
        projectId);
    for (const auto& row : result) {
        arr.append(runRowToJson(row));
    }
    return arr;
}

Json::Value getRunDetail(const DbClientPtr& db, long long runId) {
    auto result = db->execSqlSync(
        "SELECT id, project_id, workflow_id, trigger_type, status, started_at, "
        "finished_at "
        "FROM workflow_runs WHERE id = ?",
        runId);
    if (result.empty()) {
        return Json::Value();
    }
    auto run = runRowToJson(result[0]);

    Json::Value stepRuns(Json::arrayValue);
    auto stepResult = db->execSqlSync(
        "SELECT id, position, name, type, status, length(output) AS "
        "output_length, exit_code, started_at, finished_at "
        "FROM step_runs WHERE run_id = ? ORDER BY position ASC",
        runId);
    for (const auto& row : stepResult) {
        stepRuns.append(stepRunRowToJson(row));
    }
    run["step_runs"] = stepRuns;
    return run;
}
}  // namespace deploybutton
