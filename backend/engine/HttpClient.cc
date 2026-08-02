#include "HttpClient.h"
#include <curl/curl.h>

namespace {
size_t curlWriteCallback(char *ptr, size_t size, size_t nmemb, void *userdata) {
    auto *out = static_cast<std::string *>(userdata);
    out->append(ptr, size * nmemb);
    return size * nmemb;
}

void setMethod(CURL *curl, const std::string &method, const std::string &body) {
    if (method == "GET") {
        curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
        return;
    }
    if (method == "POST") {
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
    } else {
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, method.c_str());
    }
    if (!body.empty()) {
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE,
                         static_cast<long>(body.size()));
    }
}
}  // namespace

namespace deploybutton {
HttpResult performHttpRequest(const std::string &url, const std::string &method,
                              const std::string &body) {
    CURL *curl = curl_easy_init();
    if (!curl) {
        return {false, 0, "", "Failed to initialize CURL"};
    }

    std::string responseBody;
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, curlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseBody);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 60L);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    setMethod(curl, method, body);

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        std::string error = curl_easy_strerror(res);
        curl_easy_cleanup(curl);
        return {false, 0, "", error};
    }

    long httpCode = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
    curl_easy_cleanup(curl);
    return {true, httpCode, responseBody, ""};
}
}  // namespace deploybutton
