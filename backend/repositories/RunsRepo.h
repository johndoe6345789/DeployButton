#pragma once

#include <drogon/drogon.h>
#include <json/json.h>
#include <string>

namespace deploybutton
{
Json::Value listRunsForProject(const drogon::orm::DbClientPtr &db, long long projectId);

// Returns the run plus its ordered step_runs array, or Json::nullValue if not found.
Json::Value getRunDetail(const drogon::orm::DbClientPtr &db, long long runId);

long long createRun(const drogon::orm::DbClientPtr &db,
                     long long projectId,
                     long long workflowId,
                     const std::string &triggerType);

void finishRun(const drogon::orm::DbClientPtr &db, long long runId, const std::string &status);

long long createStepRun(const drogon::orm::DbClientPtr &db,
                         long long runId,
                         long long stepId,
                         int position,
                         const std::string &name,
                         const std::string &type);

void appendStepOutput(const drogon::orm::DbClientPtr &db,
                       long long stepRunId,
                       const std::string &chunk);

void finishStepRun(const drogon::orm::DbClientPtr &db,
                    long long stepRunId,
                    const std::string &status,
                    int exitCode);
}  // namespace deploybutton
