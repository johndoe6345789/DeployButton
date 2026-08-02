#include "AppTestEnvironment.h"
#include "../../db/Schema.h"
#include <condition_variable>
#include <drogon/drogon.h>
#include <fstream>
#include <mutex>

namespace deploybutton::test {
namespace {
const char *kConfigPath = "./test_app_config.json";
const int kTestPort = 18080;

void writeConfig() {
    std::ofstream out(kConfigPath);
    out << R"({
  "listeners": [
    { "address": "127.0.0.1", "port": )"
        << kTestPort << R"(, "https": false }
  ],
  "db_clients": [
    { "rdbms": "sqlite3", "filename": ":memory:", "is_fast": false,
      "client_name": "default", "connection_number": 1 }
  ],
  "app": { "threads_num": 1 }
})";
}
}  // namespace

const std::string &AppTestEnvironment::baseUrl() {
    static const std::string url =
        "http://127.0.0.1:" + std::to_string(kTestPort);
    return url;
}

void AppTestEnvironment::SetUp() {
    writeConfig();
    drogon::app().loadConfigFile(kConfigPath);

    std::mutex m;
    std::condition_variable cv;
    bool ready = false;

    drogon::app().registerBeginningAdvice([&]() {
        deploybutton::applySchema("./db/schema.sql");
        std::lock_guard<std::mutex> lock(m);
        ready = true;
        cv.notify_one();
    });

    runner_ = std::thread([]() { drogon::app().run(); });

    std::unique_lock<std::mutex> lock(m);
    cv.wait(lock, [&]() { return ready; });
}

void AppTestEnvironment::TearDown() {
    drogon::app().getLoop()->queueInLoop([]() { drogon::app().quit(); });
    if (runner_.joinable()) runner_.join();
}
}  // namespace deploybutton::test
