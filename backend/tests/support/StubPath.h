#pragma once

#include <gtest/gtest.h>
#include <string>

namespace deploybutton::test {
// Prepends a fresh temp dir to PATH for the test and lets it drop stub
// executables (e.g. a fake "npm") into it, so CommandSteps tests can
// assert exactly what command line got run, without touching real tools.
class StubPath : public ::testing::Test {
protected:
    void SetUp() override;
    void TearDown() override;
    void addStub(const std::string& name);

    std::string dir_;

private:
    std::string oldPath_;
};
}  // namespace deploybutton::test
