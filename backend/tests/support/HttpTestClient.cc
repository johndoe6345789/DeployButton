#include "HttpTestClient.h"
#include "../../repositories/JsonUtil.h"
#include "AppTestEnvironment.h"
#include <curl/curl.h>

namespace deploybutton::test {
namespace {
size_t writeCallback(char* ptr, size_t size, size_t nmemb, void* userdata) {
    auto* out = static_cast<std::string*>(userdata);
    out->append(ptr, size * nmemb);
    return size * nmemb;
}

ApiResponse call(const std::string& method, const std::string& path,
                 const Json::Value* jsonBody) {
    std::string url = AppTestEnvironment::baseUrl() + path;
    std::string requestBody =
        jsonBody ? deploybutton::jsonToCompactString(*jsonBody) : "";

    CURL* curl = curl_easy_init();
    curl_slist* headers =
        curl_slist_append(nullptr, "Content-Type: application/json");

    std::string responseBody;
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseBody);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

    if (method == "POST") {
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, requestBody.c_str());
    } else if (method != "GET") {
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, method.c_str());
        if (!requestBody.empty()) {
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, requestBody.c_str());
        }
    }

    curl_easy_perform(curl);

    long httpCode = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    ApiResponse resp;
    resp.httpCode = httpCode;
    resp.body = responseBody.empty()
                    ? Json::Value()
                    : deploybutton::parseJsonText(responseBody);
    return resp;
}
}  // namespace

ApiResponse apiGet(const std::string& path) {
    return call("GET", path, nullptr);
}

ApiResponse apiPost(const std::string& path, const Json::Value& body) {
    return call("POST", path, &body);
}

ApiResponse apiPut(const std::string& path, const Json::Value& body) {
    return call("PUT", path, &body);
}

ApiResponse apiDelete(const std::string& path) {
    return call("DELETE", path, nullptr);
}
}  // namespace deploybutton::test
