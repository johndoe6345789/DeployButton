#pragma once

#include <gtest/gtest.h>
#include <thread>

namespace deploybutton::test {
// Runs a real drogon::app() (one HTTP listener, one in-memory sqlite
// db_client) for the whole test binary, so both the controllers and
// WorkflowExecutor -- which calls app().getDbClient() internally -- can be
// tested end-to-end like they run in production.
class AppTestEnvironment : public ::testing::Environment {
public:
    void SetUp() override;
    void TearDown() override;

    static const std::string& baseUrl();

private:
    std::thread runner_;
};
}  // namespace deploybutton::test
