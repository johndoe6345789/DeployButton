#include "RunsRepo.h"

using namespace drogon::orm;

namespace
{
Json::Value runRowToJson(const Row &row)
{
    Json::Value obj;
    obj["id"] = static_cast<Json::Int64>(row["id"].as<long long>());
    obj["project_id"] = static_cast<Json::Int64>(row["project_id"].as<long long>());
    obj["workflow_id"] = static_cast<Json::Int64>(row["workflow_id"].as<long long>());
    obj["trigger_type"] = row["trigger_type"].as<std::string>();
    obj["status"] = row["status"].as<std::string>();
    obj["started_at"] = row["started_at"].as<std::string>();
    obj["finished_at"] = row["finished_at"].isNull()
                              ? Json::Value()
                              : Json::Value(row["finished_at"].as<std::string>());
    return obj;
}

Json::Value stepRunRowToJson(const Row &row)
{
    Json::Value obj;
    obj["id"] = static_cast<Json::Int64>(row["id"].as<long long>());
    obj["position"] = row["position"].as<int>();
    obj["name"] = row["name"].as<std::string>();
    obj["type"] = row["type"].as<std::string>();
    obj["status"] = row["status"].as<std::string>();
    obj["output"] = row["output"].as<std::string>();
    obj["exit_code"] = row["exit_code"].isNull() ? Json::Value() : Json::Value(row["exit_code"].as<int>());
    obj["started_at"] = row["started_at"].as<std::string>();
    obj["finished_at"] = row["finished_at"].isNull()
                              ? Json::Value()
                              : Json::Value(row["finished_at"].as<std::string>());
    return obj;
}
}  // namespace

namespace deploybutton
{
Json::Value listRunsForProject(const DbClientPtr &db, long long projectId)
{
    Json::Value arr(Json::arrayValue);
    auto result = db->execSqlSync(
        "SELECT id, project_id, workflow_id, trigger_type, status, started_at, finished_at "
        "FROM workflow_runs WHERE project_id = ? ORDER BY started_at DESC, id DESC",
        projectId);
    for (const auto &row : result)
    {
        arr.append(runRowToJson(row));
    }
    return arr;
}

Json::Value getRunDetail(const DbClientPtr &db, long long runId)
{
    auto result = db->execSqlSync(
        "SELECT id, project_id, workflow_id, trigger_type, status, started_at, finished_at "
        "FROM workflow_runs WHERE id = ?",
        runId);
    if (result.empty())
    {
        return Json::Value();
    }
    auto run = runRowToJson(result[0]);

    Json::Value stepRuns(Json::arrayValue);
    auto stepResult = db->execSqlSync(
        "SELECT id, position, name, type, status, output, exit_code, started_at, finished_at "
        "FROM step_runs WHERE run_id = ? ORDER BY position ASC",
        runId);
    for (const auto &row : stepResult)
    {
        stepRuns.append(stepRunRowToJson(row));
    }
    run["step_runs"] = stepRuns;
    return run;
}

long long createRun(const DbClientPtr &db,
                     long long projectId,
                     long long workflowId,
                     const std::string &triggerType)
{
    auto result = db->execSqlSync(
        "INSERT INTO workflow_runs (project_id, workflow_id, trigger_type, status) "
        "VALUES (?, ?, ?, 'running')",
        projectId,
        workflowId,
        triggerType);
    return static_cast<long long>(result.insertId());
}

void finishRun(const DbClientPtr &db, long long runId, const std::string &status)
{
    db->execSqlSync(
        "UPDATE workflow_runs SET status = ?, finished_at = datetime('now') WHERE id = ?",
        status,
        runId);
}

long long createStepRun(const DbClientPtr &db,
                         long long runId,
                         long long stepId,
                         int position,
                         const std::string &name,
                         const std::string &type)
{
    auto result = db->execSqlSync(
        "INSERT INTO step_runs (run_id, step_id, position, name, type, status) "
        "VALUES (?, ?, ?, ?, ?, 'running')",
        runId,
        stepId,
        position,
        name,
        type);
    return static_cast<long long>(result.insertId());
}

void appendStepOutput(const DbClientPtr &db, long long stepRunId, const std::string &chunk)
{
    db->execSqlSync(
        "UPDATE step_runs SET output = output || ? WHERE id = ?", chunk, stepRunId);
}

void finishStepRun(const DbClientPtr &db,
                    long long stepRunId,
                    const std::string &status,
                    int exitCode)
{
    db->execSqlSync(
        "UPDATE step_runs SET status = ?, exit_code = ?, finished_at = datetime('now') "
        "WHERE id = ?",
        status,
        exitCode,
        stepRunId);
}
}  // namespace deploybutton
