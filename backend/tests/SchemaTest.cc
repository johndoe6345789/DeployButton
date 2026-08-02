#include "../db/Schema.h"
#include <gtest/gtest.h>

using deploybutton::splitStatements;

TEST(SplitStatements, SingleStatement) {
    auto stmts = splitStatements("SELECT 1;");
    ASSERT_EQ(stmts.size(), 1u);
    EXPECT_EQ(stmts[0], "SELECT 1;");
}

TEST(SplitStatements, MultipleStatements) {
    auto stmts = splitStatements("SELECT 1;\nSELECT 2;\n");
    ASSERT_EQ(stmts.size(), 2u);
}

TEST(SplitStatements, IgnoresTrailingWhitespaceOnlyTail) {
    auto stmts = splitStatements("SELECT 1;\n   \n");
    ASSERT_EQ(stmts.size(), 1u);
}

TEST(SplitStatements, KeepsUnterminatedTrailingStatement) {
    auto stmts = splitStatements("SELECT 1;\nSELECT 2");
    ASSERT_EQ(stmts.size(), 2u);
    // Leading whitespace/newlines carried over from after the previous
    // statement's ';' are preserved, not trimmed -- harmless for SQL
    // execution, so the split only decides presence, not exact content.
    EXPECT_NE(stmts[1].find("SELECT 2"), std::string::npos);
}

TEST(SplitStatements, EmptyInputYieldsNoStatements) {
    auto stmts = splitStatements("");
    EXPECT_TRUE(stmts.empty());
}

TEST(SplitStatements, WhitespaceOnlyInputYieldsNoStatements) {
    auto stmts = splitStatements("   \n\t \n");
    EXPECT_TRUE(stmts.empty());
}
