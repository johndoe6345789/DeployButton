#pragma once

#include <drogon/orm/Field.h>
#include <drogon/orm/Row.h>
#include <json/json.h>
#include <sstream>
#include <string>

// Small shared helpers used across the repository layer to keep individual
// row-to-JSON functions short.
namespace deploybutton {
inline Json::Value toJsonInt64(long long value) {
    return Json::Value(static_cast<Json::Int64>(value));
}

inline Json::Value nullableString(const drogon::orm::Field& field) {
    return field.isNull() ? Json::Value()
                          : Json::Value(field.as<std::string>());
}

inline Json::Value nullableInt(const drogon::orm::Field& field) {
    return field.isNull() ? Json::Value() : Json::Value(field.as<int>());
}

inline std::string jsonToCompactString(const Json::Value& value) {
    Json::StreamWriterBuilder builder;
    builder["indentation"] = "";
    return Json::writeString(builder, value);
}

inline Json::Value parseJsonText(const std::string& text) {
    Json::CharReaderBuilder builder;
    Json::Value root;
    std::string errs;
    std::istringstream stream(text);
    if (!Json::parseFromStream(builder, stream, &root, &errs)) {
        return Json::Value(Json::objectValue);
    }
    return root;
}
}  // namespace deploybutton
