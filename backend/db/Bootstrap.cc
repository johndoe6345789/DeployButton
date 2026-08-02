#include "Bootstrap.h"
#include <drogon/drogon.h>
#include <fstream>
#include <sstream>
#include <vector>

using namespace drogon;
using namespace drogon::orm;

namespace
{
std::vector<std::string> splitStatements(const std::string &sql)
{
    std::vector<std::string> statements;
    std::string current;
    for (char c : sql)
    {
        current += c;
        if (c == ';')
        {
            auto start = current.find_first_not_of(" \t\r\n");
            if (start != std::string::npos)
            {
                statements.push_back(current);
            }
            current.clear();
        }
    }
    auto start = current.find_first_not_of(" \t\r\n");
    if (start != std::string::npos)
    {
        statements.push_back(current);
    }
    return statements;
}
}  // namespace

namespace deploybutton
{
void applySchema(const std::string &schemaPath)
{
    std::ifstream file(schemaPath);
    if (!file.is_open())
    {
        LOG_ERROR << "Could not open schema file at " << schemaPath;
        return;
    }
    std::stringstream buffer;
    buffer << file.rdbuf();

    auto db = app().getDbClient();
    for (auto &stmt : splitStatements(buffer.str()))
    {
        try
        {
            db->execSqlSync(stmt);
        }
        catch (const DrogonDbException &e)
        {
            LOG_ERROR << "Schema statement failed: " << e.base().what();
            LOG_ERROR << "Statement was: " << stmt;
        }
    }
    LOG_INFO << "Database schema applied.";
}

namespace
{
long long insertWorkflow(const DbClientPtr &db,
                          const std::string &name,
                          const std::string &description)
{
    auto result = db->execSqlSync(
        "INSERT INTO workflows (name, description, is_template) VALUES (?, ?, 1)",
        name,
        description);
    return static_cast<long long>(result.insertId());
}

void insertStep(const DbClientPtr &db,
                 long long workflowId,
                 int position,
                 const std::string &name,
                 const std::string &type,
                 const std::string &config)
{
    db->execSqlSync(
        "INSERT INTO workflow_steps (workflow_id, position, name, type, config) "
        "VALUES (?, ?, ?, ?, ?)",
        workflowId,
        position,
        name,
        type,
        config);
}
}  // namespace

void seedDefaultWorkflows()
{
    auto db = app().getDbClient();

    auto countResult = db->execSqlSync("SELECT COUNT(*) AS cnt FROM workflows");
    long long count = countResult[0]["cnt"].as<long long>();
    if (count > 0)
    {
        LOG_INFO << "Workflows already present, skipping seed.";
        return;
    }

    const std::string caproverWebhook =
        "https://captain.example.com/api/v2/user/apps/webhooks/"
        "triggerbuild?namespace=captain&token=REPLACE_ME";

    // Template 1: React static build via CapRover
    {
        auto id = insertWorkflow(
            db,
            "React App via CapRover",
            "Pulls latest code, installs deps, builds a React app, then "
            "triggers CapRover to build+deploy the container.");
        insertStep(db, id, 0, "Pull latest code", "git_pull",
                   R"({"cwd": "/srv/repos/PROJECT_NAME"})");
        insertStep(db, id, 1, "Install dependencies", "npm_install",
                   R"({"cwd": "/srv/repos/PROJECT_NAME", "manager": "npm"})");
        insertStep(db, id, 2, "Build production bundle", "npm_build",
                   R"({"cwd": "/srv/repos/PROJECT_NAME", "manager": "npm", "script": "build"})");
        insertStep(db, id, 3, "Trigger CapRover build", "http_webhook",
                   std::string(R"({"url": ")") + caproverWebhook + R"(", "method": "POST"})");
        insertStep(db, id, 4, "Notify done", "notify",
                   R"({"message": "React app deployed successfully"})");
    }

    // Template 2: Node/Docker backend via CapRover
    {
        auto id = insertWorkflow(
            db,
            "Node/Docker Backend via CapRover",
            "Pulls latest code and triggers CapRover, which builds the "
            "Docker image from captain-definition and redeploys.");
        insertStep(db, id, 0, "Pull latest code", "git_pull",
                   R"({"cwd": "/srv/repos/PROJECT_NAME"})");
        insertStep(db, id, 1, "Trigger CapRover build", "http_webhook",
                   std::string(R"({"url": ")") + caproverWebhook + R"(", "method": "POST"})");
        insertStep(db, id, 2, "Wait for container restart", "delay",
                   R"({"seconds": 15})");
        insertStep(db, id, 3, "Notify done", "notify",
                   R"({"message": "Backend deployed successfully"})");
    }

    LOG_INFO << "Seeded default workflow templates.";
}

}  // namespace deploybutton
