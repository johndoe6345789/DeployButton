#pragma once

#include <drogon/drogon.h>
#include <json/json.h>
#include <string>

namespace deploybutton
{
// Returns an array of all projects, each with its last-run status/time joined in.
Json::Value listProjects(const drogon::orm::DbClientPtr &db);

// Returns a single project object, or Json::nullValue if not found.
Json::Value getProject(const drogon::orm::DbClientPtr &db, long long id);

// Returns a single project object by slug, or Json::nullValue if not found.
Json::Value getProjectBySlug(const drogon::orm::DbClientPtr &db,
                              const std::string &slug);

// Inserts a project and returns its new id.
long long createProject(const drogon::orm::DbClientPtr &db,
                         const std::string &name,
                         const std::string &slug,
                         const std::string &repoUrl,
                         long long workflowId);

void updateProject(const drogon::orm::DbClientPtr &db,
                    long long id,
                    const std::string &name,
                    const std::string &slug,
                    const std::string &repoUrl,
                    long long workflowId);

void deleteProject(const drogon::orm::DbClientPtr &db, long long id);
}  // namespace deploybutton
