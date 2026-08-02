#include "WorkflowsRepo.h"
#include "JsonUtil.h"

using namespace drogon::orm;

namespace {
Json::Value workflowRowToJson(const Row &row) {
    Json::Value obj;
    obj["id"] = deploybutton::toJsonInt64(row["id"].as<long long>());
    obj["name"] = row["name"].as<std::string>();
    obj["description"] = deploybutton::nullableString(row["description"]);
    obj["is_template"] = row["is_template"].as<int>() != 0;
    return obj;
}

Json::Value stepRowToJson(const Row &row) {
    Json::Value obj;
    obj["id"] = deploybutton::toJsonInt64(row["id"].as<long long>());
    obj["position"] = row["position"].as<int>();
    obj["name"] = row["name"].as<std::string>();
    obj["type"] = row["type"].as<std::string>();
    obj["config"] =
        deploybutton::parseJsonText(row["config"].as<std::string>());
    return obj;
}
}  // namespace

namespace deploybutton {
Json::Value listWorkflows(const DbClientPtr &db) {
    Json::Value arr(Json::arrayValue);
    auto result = db->execSqlSync(
        "SELECT id, name, description, is_template FROM workflows ORDER BY id "
        "DESC");
    for (const auto &row : result) {
        arr.append(workflowRowToJson(row));
    }
    return arr;
}

Json::Value getWorkflowWithSteps(const DbClientPtr &db, long long id) {
    auto result = db->execSqlSync(
        "SELECT id, name, description, is_template FROM workflows WHERE id = ?",
        id);
    if (result.empty()) {
        return Json::Value();
    }
    auto workflow = workflowRowToJson(result[0]);

    Json::Value steps(Json::arrayValue);
    auto stepsResult = db->execSqlSync(
        "SELECT id, position, name, type, config FROM workflow_steps "
        "WHERE workflow_id = ? ORDER BY position ASC",
        id);
    for (const auto &row : stepsResult) {
        steps.append(stepRowToJson(row));
    }
    workflow["steps"] = steps;
    return workflow;
}
}  // namespace deploybutton
