#include "TestHttpServer.h"
#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

namespace deploybutton::test {
TestHttpServer::~TestHttpServer() { stop(); }

int TestHttpServer::start(const std::string &responseStatusLine) {
    responseStatusLine_ = responseStatusLine;

    listenFd_ = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(listenFd_, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    addr.sin_port = 0;  // let the OS pick a free port

    bind(listenFd_, reinterpret_cast<sockaddr *>(&addr), sizeof(addr));
    listen(listenFd_, 4);

    socklen_t len = sizeof(addr);
    getsockname(listenFd_, reinterpret_cast<sockaddr *>(&addr), &len);
    int port = ntohs(addr.sin_port);

    running_ = true;
    thread_ = std::thread([this]() { acceptLoop(); });
    return port;
}

void TestHttpServer::acceptLoop() {
    while (running_) {
        int clientFd = accept(listenFd_, nullptr, nullptr);
        if (clientFd < 0) break;

        char buf[4096];
        ssize_t n = read(clientFd, buf, sizeof(buf) - 1);
        if (n > 0) {
            lastRequest_ = std::string(buf, static_cast<size_t>(n));
        }

        std::string body = "ok";
        std::string response =
            "HTTP/1.1 " + responseStatusLine_ +
            "\r\nContent-Length: " + std::to_string(body.size()) +
            "\r\nConnection: close\r\n\r\n" + body;
        write(clientFd, response.c_str(), response.size());
        close(clientFd);
    }
}

void TestHttpServer::stop() {
    if (!running_) return;
    running_ = false;
    if (listenFd_ >= 0) {
        shutdown(listenFd_, SHUT_RDWR);
        close(listenFd_);
        listenFd_ = -1;
    }
    if (thread_.joinable()) thread_.join();
}
}  // namespace deploybutton::test
