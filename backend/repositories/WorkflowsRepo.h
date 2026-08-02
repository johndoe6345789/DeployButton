#pragma once

#include <drogon/drogon.h>
#include <json/json.h>
#include <string>
#include <vector>

namespace deploybutton {
struct StepDef {
    long long id;
    int position;
    std::string name;
    std::string type;
    std::string config;  // raw JSON text
};

// Returns an array of all workflows (without steps).
Json::Value listWorkflows(const drogon::orm::DbClientPtr &db);

// Returns a single workflow object with its ordered "steps" array,
// or Json::nullValue if not found.
Json::Value getWorkflowWithSteps(const drogon::orm::DbClientPtr &db,
                                 long long id);

long long createWorkflow(const drogon::orm::DbClientPtr &db,
                         const std::string &name,
                         const std::string &description);

void updateWorkflow(const drogon::orm::DbClientPtr &db, long long id,
                    const std::string &name, const std::string &description);

void deleteWorkflow(const drogon::orm::DbClientPtr &db, long long id);

// Bulk-replaces every step of a workflow with the given ordered array.
// Each element must have "name", "type", and optionally "config" (object or
// string).
void replaceSteps(const drogon::orm::DbClientPtr &db, long long workflowId,
                  const Json::Value &steps);

// Ordered steps for a workflow, used by the execution engine.
std::vector<StepDef> getStepsForWorkflow(const drogon::orm::DbClientPtr &db,
                                         long long workflowId);
}  // namespace deploybutton
