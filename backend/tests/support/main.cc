#include "AppTestEnvironment.h"
#include <gtest/gtest.h>

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    ::testing::AddGlobalTestEnvironment(
        new deploybutton::test::AppTestEnvironment());
    return RUN_ALL_TESTS();
}
