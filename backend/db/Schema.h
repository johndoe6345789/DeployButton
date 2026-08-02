#pragma once

#include <string>
#include <vector>

namespace deploybutton {
// Splits a .sql file's text into individual statements on top-level ';'.
std::vector<std::string> splitStatements(const std::string &sql);

// Applies the given schema.sql file against the default db client.
// Safe to call on every startup: all statements use CREATE TABLE/INDEX IF NOT
// EXISTS.
void applySchema(const std::string &schemaPath);
}  // namespace deploybutton
