#include "Steps.h"
#include "RunCommand.h"
#include <chrono>
#include <curl/curl.h>
#include <sstream>
#include <thread>

namespace
{
std::string configStr(const Json::Value &config, const std::string &key, const std::string &def = "")
{
    return (config.isMember(key) && config[key].isString()) ? config[key].asString() : def;
}

int configInt(const Json::Value &config, const std::string &key, int def = 0)
{
    return (config.isMember(key) && config[key].isInt()) ? config[key].asInt() : def;
}

size_t curlWriteCallback(char *ptr, size_t size, size_t nmemb, void *userdata)
{
    auto *out = static_cast<std::string *>(userdata);
    out->append(ptr, size * nmemb);
    return size * nmemb;
}

deploybutton::StepResult httpWebhookStep(const Json::Value &config,
                                          const std::function<void(const std::string &)> &onOutput)
{
    std::string url = configStr(config, "url");
    std::string method = configStr(config, "method", "POST");
    std::string body = configStr(config, "body");

    if (url.empty())
    {
        onOutput("http_webhook step missing 'url'\n");
        return {1};
    }

    CURL *curl = curl_easy_init();
    if (!curl)
    {
        onOutput("Failed to initialize CURL\n");
        return {1};
    }

    std::string responseBody;
    long httpCode = 0;

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, curlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseBody);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 60L);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

    if (method == "GET")
    {
        curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
    }
    else if (method == "POST")
    {
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, static_cast<long>(body.size()));
    }
    else
    {
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, method.c_str());
        if (!body.empty())
        {
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
            curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, static_cast<long>(body.size()));
        }
    }

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK)
    {
        onOutput(std::string("HTTP request failed: ") + curl_easy_strerror(res) + "\n");
        curl_easy_cleanup(curl);
        return {1};
    }

    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
    curl_easy_cleanup(curl);

    std::ostringstream oss;
    oss << method << " " << url << " -> HTTP " << httpCode << "\n";
    if (!responseBody.empty())
    {
        oss << responseBody << "\n";
    }
    onOutput(oss.str());

    return {(httpCode >= 200 && httpCode < 300) ? 0 : 1};
}
}  // namespace

namespace deploybutton
{
StepResult executeStep(const std::string &type,
                        const Json::Value &config,
                        const std::function<void(const std::string &)> &onOutput)
{
    std::string cwd = configStr(config, "cwd");

    if (type == "git_pull")
    {
        auto result = runCommand(cwd, "git pull", onOutput);
        return {result.exitCode};
    }
    if (type == "shell")
    {
        auto result = runCommand(cwd, configStr(config, "command"), onOutput);
        return {result.exitCode};
    }
    if (type == "npm_install")
    {
        std::string manager = configStr(config, "manager", "npm");
        auto result = runCommand(cwd, manager + " install", onOutput);
        return {result.exitCode};
    }
    if (type == "npm_build")
    {
        std::string manager = configStr(config, "manager", "npm");
        std::string script = configStr(config, "script", "build");
        std::string command =
            (manager == "npm") ? (manager + " run " + script) : (manager + " " + script);
        auto result = runCommand(cwd, command, onOutput);
        return {result.exitCode};
    }
    if (type == "docker_build")
    {
        std::string tag = configStr(config, "tag", "app:latest");
        std::string dockerfile = configStr(config, "dockerfile", "Dockerfile");
        std::string command = "docker build -t " + tag + " -f " + dockerfile + " .";
        auto result = runCommand(cwd, command, onOutput);
        return {result.exitCode};
    }
    if (type == "http_webhook")
    {
        return httpWebhookStep(config, onOutput);
    }
    if (type == "delay")
    {
        int seconds = configInt(config, "seconds", 0);
        onOutput("Waiting " + std::to_string(seconds) + " seconds...\n");
        std::this_thread::sleep_for(std::chrono::seconds(seconds));
        return {0};
    }
    if (type == "notify")
    {
        std::string message = configStr(config, "message");
        onOutput(message + "\n");
        std::string webhookUrl = configStr(config, "webhookUrl");
        if (!webhookUrl.empty())
        {
            Json::Value notifyConfig;
            notifyConfig["url"] = webhookUrl;
            notifyConfig["method"] = "POST";
            notifyConfig["body"] = message;
            httpWebhookStep(notifyConfig, onOutput);
        }
        return {0};
    }

    onOutput("Unknown step type: " + type + "\n");
    return {1};
}
}  // namespace deploybutton
