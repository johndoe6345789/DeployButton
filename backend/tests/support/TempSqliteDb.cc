#include "TempSqliteDb.h"
#include "../../db/Schema.h"
#include <fstream>
#include <sstream>

using namespace drogon::orm;

namespace deploybutton::test {
DbClientPtr freshTestDb() {
    auto db = DbClient::newSqlite3Client("filename=:memory:", 1);

    std::ifstream file("./db/schema.sql");
    std::stringstream buffer;
    buffer << file.rdbuf();

    for (auto& stmt : deploybutton::splitStatements(buffer.str())) {
        db->execSqlSync(stmt);
    }
    return db;
}
}  // namespace deploybutton::test
