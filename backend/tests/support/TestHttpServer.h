#pragma once

#include <atomic>
#include <string>
#include <thread>

namespace deploybutton::test {
// A minimal, single-request-at-a-time HTTP server for exercising
// httpWebhookStep/performHttpRequest without any real network dependency.
class TestHttpServer {
public:
    TestHttpServer() = default;
    ~TestHttpServer();

    // Starts listening on 127.0.0.1 and returns the bound port. Each
    // accepted connection replies with `responseStatusLine` and captures
    // the request into lastRequest().
    int start(const std::string &responseStatusLine = "200 OK");
    void stop();

    const std::string &lastRequest() const { return lastRequest_; }

private:
    void acceptLoop();

    int listenFd_ = -1;
    std::thread thread_;
    std::atomic<bool> running_{false};
    std::string lastRequest_;
    std::string responseStatusLine_;
};
}  // namespace deploybutton::test
