#include "SeedTemplates.h"

namespace {
const char *kCaproverWebhook =
    "https://captain.example.com/api/v2/user/apps/webhooks/"
    "triggerbuild?namespace=captain&token=REPLACE_ME";

std::string webhookConfig() {
    return std::string(R"({"url": ")") + kCaproverWebhook +
           R"(", "method": "POST"})";
}
}  // namespace

namespace deploybutton {
std::vector<SeedWorkflow> defaultSeedWorkflows() {
    return {
        {"React App via CapRover",
         "Pulls latest code, installs deps, builds a React app, then "
         "triggers CapRover to build+deploy the container.",
         {
             {"Pull latest code", "git_pull",
              R"({"cwd": "/srv/repos/PROJECT_NAME"})"},
             {"Install dependencies", "npm_install",
              R"({"cwd": "/srv/repos/PROJECT_NAME", "manager": "npm"})"},
             {"Build production bundle", "npm_build",
              R"({"cwd": "/srv/repos/PROJECT_NAME", )"
              R"("manager": "npm", "script": "build"})"},
             {"Trigger CapRover build", "http_webhook", webhookConfig()},
             {"Notify done", "notify",
              R"({"message": "React app deployed successfully"})"},
         }},
        {"Node/Docker Backend via CapRover",
         "Pulls latest code and triggers CapRover, which builds the "
         "Docker image from captain-definition and redeploys.",
         {
             {"Pull latest code", "git_pull",
              R"({"cwd": "/srv/repos/PROJECT_NAME"})"},
             {"Trigger CapRover build", "http_webhook", webhookConfig()},
             {"Wait for container restart", "delay", R"({"seconds": 15})"},
             {"Notify done", "notify",
              R"({"message": "Backend deployed successfully"})"},
         }},
    };
}
}  // namespace deploybutton
