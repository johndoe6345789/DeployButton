#include "Schema.h"
#include <drogon/drogon.h>
#include <fstream>
#include <sstream>

using namespace drogon;
using namespace drogon::orm;

namespace deploybutton {
std::vector<std::string> splitStatements(const std::string& sql) {
    std::vector<std::string> statements;
    std::string current;
    for (char c : sql) {
        current += c;
        if (c == ';') {
            auto start = current.find_first_not_of(" \t\r\n");
            if (start != std::string::npos) {
                statements.push_back(current);
            }
            current.clear();
        }
    }
    auto start = current.find_first_not_of(" \t\r\n");
    if (start != std::string::npos) {
        statements.push_back(current);
    }
    return statements;
}

void applySchema(const std::string& schemaPath) {
    std::ifstream file(schemaPath);
    if (!file.is_open()) {
        LOG_ERROR << "Could not open schema file at " << schemaPath;
        return;
    }
    std::stringstream buffer;
    buffer << file.rdbuf();

    auto db = app().getDbClient();

    // WAL lets one writer and many readers proceed concurrently instead of
    // locking the whole file, and busy_timeout makes a writer retry for 5s
    // instead of failing immediately -- both matter once two backend
    // processes (the old and new slot during a blue/green self-deploy)
    // share this same database file for the brief cutover window.
    db->execSqlSync("PRAGMA journal_mode=WAL;");
    db->execSqlSync("PRAGMA busy_timeout=5000;");

    for (auto& stmt : splitStatements(buffer.str())) {
        try {
            db->execSqlSync(stmt);
        } catch (const DrogonDbException& e) {
            LOG_ERROR << "Schema statement failed: " << e.base().what();
            LOG_ERROR << "Statement was: " << stmt;
        }
    }
    LOG_INFO << "Database schema applied.";
}
}  // namespace deploybutton
