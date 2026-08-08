#include "ApiFixtures.h"
#include "HttpTestClient.h"
#include <chrono>
#include <thread>

namespace deploybutton::test {
long long makeWorkflowViaApi(const std::string& name) {
    Json::Value body;
    body["name"] = name;
    body["description"] = "";
    return apiPost("/api/workflows", body).body["id"].asInt64();
}

long long makeWorkflowWithShellStep(const std::string& name,
                                    const std::string& command) {
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

long long makeProjectViaApi(const std::string& name, const std::string& slug,
                            long long workflowId) {
    Json::Value create;
    create["name"] = name;
    create["slug"] = slug;
    create["repo_url"] = "";
    create["workflow_id"] = static_cast<Json::Int64>(workflowId);
    return apiPost("/api/projects", create).body["id"].asInt64();
}

Json::Value waitForRun(long long runId, int timeoutMs) {
    auto start = std::chrono::steady_clock::now();
    while (true) {
        auto resp = apiGet("/api/runs/" + std::to_string(runId));
        if (resp.body["status"].asString() != "running") return resp.body;
        if (std::chrono::steady_clock::now() - start >
            std::chrono::milliseconds(timeoutMs)) {
            return resp.body;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
    }
}

long long runShellStepAndGetId(const std::string& slug,
                               const std::string& command) {
    auto workflowId = makeWorkflowWithShellStep(slug, command);
    auto projectId = makeProjectViaApi(slug, slug, workflowId);
    auto deploy =
        apiPost("/api/projects/" + std::to_string(projectId) + "/deploy",
                Json::Value());
    auto run = waitForRun(deploy.body["runId"].asInt64());
    return run["step_runs"][0]["id"].asInt64();
}
}  // namespace deploybutton::test
