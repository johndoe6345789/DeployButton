#include "../engine/RunGuard.h"
#include <gtest/gtest.h>

using namespace deploybutton;

TEST(RunGuard, FirstAcquireSucceeds) {
    EXPECT_TRUE(tryAcquireRunGuard(101));
    releaseRunGuard(101);
}

TEST(RunGuard, SecondAcquireFailsWhileHeld) {
    ASSERT_TRUE(tryAcquireRunGuard(102));
    EXPECT_FALSE(tryAcquireRunGuard(102));
    releaseRunGuard(102);
}

TEST(RunGuard, AcquireSucceedsAgainAfterRelease) {
    ASSERT_TRUE(tryAcquireRunGuard(103));
    releaseRunGuard(103);
    EXPECT_TRUE(tryAcquireRunGuard(103));
    releaseRunGuard(103);
}

TEST(RunGuard, DifferentProjectIdsDoNotInterfere) {
    ASSERT_TRUE(tryAcquireRunGuard(104));
    EXPECT_TRUE(tryAcquireRunGuard(105));
    releaseRunGuard(104);
    releaseRunGuard(105);
}
