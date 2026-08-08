#pragma once

#include <string>

namespace deploybutton {
struct HttpResult {
    bool ok;
    long httpCode;
    std::string body;
    std::string error;
};

// Thin synchronous libcurl wrapper -- safe to call from a non-Drogon-IO
// thread (see WorkflowExecutor), which is exactly where this runs.
HttpResult performHttpRequest(const std::string& url, const std::string& method,
                              const std::string& body);
}  // namespace deploybutton
