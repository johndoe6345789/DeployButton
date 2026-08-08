#include "../repositories/DeployStateRepo.h"
#include "support/TempSqliteDb.h"
#include <gtest/gtest.h>

using namespace deploybutton;
using deploybutton::test::freshTestDb;

TEST(DeployStateRepo, DefaultsToBlue) {
    auto db = freshTestDb();
    EXPECT_EQ(getActiveSlot(db), "blue");
}

TEST(DeployStateRepo, SetPersists) {
    auto db = freshTestDb();
    setActiveSlot(db, "green");
    EXPECT_EQ(getActiveSlot(db), "green");
}
