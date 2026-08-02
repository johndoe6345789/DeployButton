#include "WorkflowsRepo.h"
#include <sstream>

using namespace drogon::orm;

namespace
{
std::string jsonToCompactString(const Json::Value &v)
{
    Json::StreamWriterBuilder builder;
    builder["indentation"] = "";
    return Json::writeString(builder, v);
}

Json::Value parseJson(const std::string &text)
{
    Json::CharReaderBuilder builder;
    Json::Value root;
    std::string errs;
    std::istringstream stream(text);
    if (!Json::parseFromStream(builder, stream, &root, &errs))
    {
        return Json::Value(Json::objectValue);
    }
    return root;
}

Json::Value workflowRowToJson(const Row &row)
{
    Json::Value obj;
    obj["id"] = static_cast<Json::Int64>(row["id"].as<long long>());
    obj["name"] = row["name"].as<std::string>();
    obj["description"] = row["description"].isNull()
                              ? Json::Value()
                              : Json::Value(row["description"].as<std::string>());
    obj["is_template"] = row["is_template"].as<int>() != 0;
    return obj;
}

Json::Value stepRowToJson(const Row &row)
{
    Json::Value obj;
    obj["id"] = static_cast<Json::Int64>(row["id"].as<long long>());
    obj["position"] = row["position"].as<int>();
    obj["name"] = row["name"].as<std::string>();
    obj["type"] = row["type"].as<std::string>();
    obj["config"] = parseJson(row["config"].as<std::string>());
    return obj;
}
}  // namespace

namespace deploybutton
{
Json::Value listWorkflows(const DbClientPtr &db)
{
    Json::Value arr(Json::arrayValue);
    auto result = db->execSqlSync(
        "SELECT id, name, description, is_template FROM workflows ORDER BY id DESC");
    for (const auto &row : result)
    {
        arr.append(workflowRowToJson(row));
    }
    return arr;
}

Json::Value getWorkflowWithSteps(const DbClientPtr &db, long long id)
{
    auto result = db->execSqlSync(
        "SELECT id, name, description, is_template FROM workflows WHERE id = ?", id);
    if (result.empty())
    {
        return Json::Value();
    }
    auto workflow = workflowRowToJson(result[0]);

    Json::Value steps(Json::arrayValue);
    auto stepsResult = db->execSqlSync(
        "SELECT id, position, name, type, config FROM workflow_steps "
        "WHERE workflow_id = ? ORDER BY position ASC",
        id);
    for (const auto &row : stepsResult)
    {
        steps.append(stepRowToJson(row));
    }
    workflow["steps"] = steps;
    return workflow;
}

long long createWorkflow(const DbClientPtr &db,
                          const std::string &name,
                          const std::string &description)
{
    auto result = db->execSqlSync(
        "INSERT INTO workflows (name, description, is_template) VALUES (?, ?, 0)",
        name,
        description);
    return static_cast<long long>(result.insertId());
}

void updateWorkflow(const DbClientPtr &db,
                     long long id,
                     const std::string &name,
                     const std::string &description)
{
    db->execSqlSync(
        "UPDATE workflows SET name = ?, description = ?, updated_at = datetime('now') "
        "WHERE id = ?",
        name,
        description,
        id);
}

void deleteWorkflow(const DbClientPtr &db, long long id)
{
    db->execSqlSync("DELETE FROM workflows WHERE id = ?", id);
}

void replaceSteps(const DbClientPtr &db, long long workflowId, const Json::Value &steps)
{
    auto trans = db->newTransaction();
    trans->execSqlSync("DELETE FROM workflow_steps WHERE workflow_id = ?", workflowId);

    int position = 0;
    for (const auto &step : steps)
    {
        std::string name = step.get("name", "").asString();
        std::string type = step.get("type", "").asString();
        std::string config = step.isMember("config") ? jsonToCompactString(step["config"]) : "{}";
        trans->execSqlSync(
            "INSERT INTO workflow_steps (workflow_id, position, name, type, config) "
            "VALUES (?, ?, ?, ?, ?)",
            workflowId,
            position,
            name,
            type,
            config);
        ++position;
    }
}

std::vector<StepDef> getStepsForWorkflow(const DbClientPtr &db, long long workflowId)
{
    std::vector<StepDef> steps;
    auto result = db->execSqlSync(
        "SELECT id, position, name, type, config FROM workflow_steps "
        "WHERE workflow_id = ? ORDER BY position ASC",
        workflowId);
    for (const auto &row : result)
    {
        StepDef step;
        step.id = row["id"].as<long long>();
        step.position = row["position"].as<int>();
        step.name = row["name"].as<std::string>();
        step.type = row["type"].as<std::string>();
        step.config = row["config"].as<std::string>();
        steps.push_back(std::move(step));
    }
    return steps;
}
}  // namespace deploybutton
