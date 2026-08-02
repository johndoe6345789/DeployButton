#pragma once

#include <drogon/orm/DbClient.h>

namespace deploybutton::test {
// A fresh, isolated in-memory SQLite database with the app schema already
// applied -- one connection only, so all queries see the same state.
drogon::orm::DbClientPtr freshTestDb();
}  // namespace deploybutton::test
