#pragma once

#include <json/json.h>
#include <string>

namespace deploybutton::test {
struct ApiResponse {
    long httpCode;
    Json::Value body;
};

// Thin JSON-over-HTTP client used only by controller tests, hitting the
// live listener AppTestEnvironment starts (sends Content-Type: application
// /json, unlike the production performHttpRequest which stays header-free
// since a workflow's own webhook target may not want that assumption).
ApiResponse apiGet(const std::string &path);
ApiResponse apiPost(const std::string &path, const Json::Value &body);
ApiResponse apiPut(const std::string &path, const Json::Value &body);
ApiResponse apiDelete(const std::string &path);
}  // namespace deploybutton::test
