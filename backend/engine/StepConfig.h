#pragma once

#include <json/json.h>
#include <string>

// Small helpers for reading a step's JSON config with defaults.
namespace deploybutton {
inline std::string configStr(const Json::Value& config, const std::string& key,
                             const std::string& def = "") {
    return (config.isMember(key) && config[key].isString())
               ? config[key].asString()
               : def;
}

inline int configInt(const Json::Value& config, const std::string& key,
                     int def = 0) {
    return (config.isMember(key) && config[key].isInt()) ? config[key].asInt()
                                                         : def;
}
}  // namespace deploybutton
