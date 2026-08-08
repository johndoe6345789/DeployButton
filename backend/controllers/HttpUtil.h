#pragma once

#include <drogon/HttpResponse.h>
#include <json/json.h>

namespace deploybutton {
inline drogon::HttpResponsePtr jsonResponse(
    const Json::Value& body, drogon::HttpStatusCode code = drogon::k200OK) {
    auto resp = drogon::HttpResponse::newHttpJsonResponse(body);
    resp->setStatusCode(code);
    return resp;
}

inline drogon::HttpResponsePtr errorResponse(drogon::HttpStatusCode code,
                                             const std::string& message) {
    Json::Value body;
    body["error"] = message;
    return jsonResponse(body, code);
}

inline drogon::HttpResponsePtr notFound(const std::string& what) {
    return errorResponse(drogon::k404NotFound, what + " not found");
}
}  // namespace deploybutton
