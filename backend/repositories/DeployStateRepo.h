#pragma once

#include <drogon/drogon.h>
#include <string>

namespace deploybutton {
// The slot ("blue"/"green") nginx currently routes traffic to. Stored in
// the database, shared by both slots, rather than in-process memory --
// see deploy_state in schema.sql.
std::string getActiveSlot(const drogon::orm::DbClientPtr& db);
void setActiveSlot(const drogon::orm::DbClientPtr& db, const std::string& slot);
}  // namespace deploybutton
