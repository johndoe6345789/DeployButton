#include "JsonUtil.h"
#include "WorkflowsRepo.h"

using namespace drogon::orm;

namespace deploybutton {
void replaceSteps(const DbClientPtr &db, long long workflowId,
                  const Json::Value &steps) {
    auto trans = db->newTransaction();
    trans->execSqlSync("DELETE FROM workflow_steps WHERE workflow_id = ?",
                       workflowId);

    int position = 0;
    for (const auto &step : steps) {
        std::string name = step.get("name", "").asString();
        std::string type = step.get("type", "").asString();
        std::string config = step.isMember("config")
                                 ? jsonToCompactString(step["config"])
                                 : "{}";
        trans->execSqlSync(
            "INSERT INTO workflow_steps (workflow_id, position, name, type, "
            "config) "
            "VALUES (?, ?, ?, ?, ?)",
            workflowId, position, name, type, config);
        ++position;
    }
}

std::vector<StepDef> getStepsForWorkflow(const DbClientPtr &db,
                                         long long workflowId) {
    std::vector<StepDef> steps;
    auto result = db->execSqlSync(
        "SELECT id, position, name, type, config FROM workflow_steps "
        "WHERE workflow_id = ? ORDER BY position ASC",
        workflowId);
    for (const auto &row : result) {
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
