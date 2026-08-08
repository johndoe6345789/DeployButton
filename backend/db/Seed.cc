#include "Seed.h"
#include "SeedTemplates.h"
#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace {
long long insertWorkflow(const DbClientPtr& db,
                         const deploybutton::SeedWorkflow& wf) {
    auto result = db->execSqlSync(
        "INSERT INTO workflows (name, description, is_template) VALUES (?, ?, "
        "1)",
        wf.name, wf.description);
    return static_cast<long long>(result.insertId());
}

void insertSteps(const DbClientPtr& db, long long workflowId,
                 const std::vector<deploybutton::SeedStep>& steps) {
    int position = 0;
    for (const auto& step : steps) {
        db->execSqlSync(
            "INSERT INTO workflow_steps (workflow_id, position, name, type, "
            "config) "
            "VALUES (?, ?, ?, ?, ?)",
            workflowId, position, step.name, step.type, step.config);
        ++position;
    }
}
}  // namespace

namespace deploybutton {
void seedDefaultWorkflows() {
    auto db = app().getDbClient();
    auto countResult = db->execSqlSync("SELECT COUNT(*) AS cnt FROM workflows");
    if (countResult[0]["cnt"].as<long long>() > 0) {
        LOG_INFO << "Workflows already present, skipping seed.";
        return;
    }

    for (const auto& workflow : defaultSeedWorkflows()) {
        auto id = insertWorkflow(db, workflow);
        insertSteps(db, id, workflow.steps);
    }

    LOG_INFO << "Seeded default workflow templates.";
}
}  // namespace deploybutton
