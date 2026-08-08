#include "DeployStateRepo.h"

using namespace drogon::orm;

namespace deploybutton {
std::string getActiveSlot(const DbClientPtr &db) {
    auto result =
        db->execSqlSync("SELECT active_slot FROM deploy_state WHERE id = 1");
    if (result.empty()) {
        return "blue";
    }
    return result[0]["active_slot"].as<std::string>();
}

void setActiveSlot(const DbClientPtr &db, const std::string &slot) {
    db->execSqlSync("UPDATE deploy_state SET active_slot = ? WHERE id = 1",
                    slot);
}
}  // namespace deploybutton
