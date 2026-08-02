#pragma once

#include <string>

namespace deploybutton
{
// Applies the given schema.sql file against the default db client.
// Safe to call on every startup: all statements use CREATE TABLE/INDEX IF NOT EXISTS.
void applySchema(const std::string &schemaPath);

// Inserts the default workflow templates (and their steps) if the
// workflows table is currently empty. No-op on subsequent restarts.
void seedDefaultWorkflows();
}  // namespace deploybutton
