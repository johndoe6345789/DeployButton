#pragma once

#include <drogon/drogon.h>
#include <json/json.h>
#include <optional>
#include <string>

namespace deploybutton {
Json::Value listRunsForProject(const drogon::orm::DbClientPtr &db,
                               long long projectId);

// Returns the run plus its ordered step_runs array, or Json::nullValue if not
// found.
Json::Value getRunDetail(const drogon::orm::DbClientPtr &db, long long runId);

long long createRun(const drogon::orm::DbClientPtr &db, long long projectId,
                    long long workflowId, const std::string &triggerType);

void finishRun(const drogon::orm::DbClientPtr &db, long long runId,
               const std::string &status);

long long createStepRun(const drogon::orm::DbClientPtr &db, long long runId,
                        long long stepId, int position, const std::string &name,
                        const std::string &type);

void appendStepOutput(const drogon::orm::DbClientPtr &db, long long stepRunId,
                      const std::string &chunk);

void finishStepRun(const drogon::orm::DbClientPtr &db, long long stepRunId,
                   const std::string &status, int exitCode);

// Returns a chunk of a step's output as {text, start_offset, end_offset,
// total_length}, where `text` spans characters [start_offset, end_offset) of
// the full stored output. At most one of `before`/`after` should be set:
//   - neither set: the last `limit` characters (initial "tail" load)
//   - before=X: up to `limit` characters ending at X ("load earlier")
//   - after=Y: everything after Y (live-tail; `limit` ignored)
// `before`/`after`-less "tail" and "before" chunks are snapped so `text`
// always begins at the start of a line. Returns Json::nullValue if the step
// run doesn't exist.
Json::Value getStepOutputChunk(const drogon::orm::DbClientPtr &db,
                               long long stepRunId,
                               std::optional<long long> before,
                               std::optional<long long> after,
                               long long limit);
}  // namespace deploybutton
