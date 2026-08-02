#include "ApiFixtures.h"
#include "HttpTestClient.h"

namespace deploybutton::test {
long long makeWorkflowViaApi(const std::string &name) {
    Json::Value body;
    body["name"] = name;
    body["description"] = "";
    return apiPost("/api/workflows", body).body["id"].asInt64();
}

long long makeWorkflowWithShellStep(const std::string &name,
                                    const std::string &command) {
    auto id = makeWorkflowViaApi(name);

    Json::Value steps(Json::arrayValue);
    Json::Value step;
    step["name"] = "run";
    step["type"] = "shell";
    step["config"]["command"] = command;
    steps.append(step);
    apiPut("/api/workflows/" + std::to_string(id) + "/steps", steps);
    return id;
}

long long makeProjectViaApi(const std::string &name, const std::string &slug,
                            long long workflowId) {
    Json::Value create;
    create["name"] = name;
    create["slug"] = slug;
    create["repo_url"] = "";
    create["workflow_id"] = static_cast<Json::Int64>(workflowId);
    return apiPost("/api/projects", create).body["id"].asInt64();
}
}  // namespace deploybutton::test
