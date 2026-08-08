#include "RunCommand.h"
#include "SelfDeployInternal.h"
#include <fstream>

namespace deploybutton {
namespace {
const char *kTempUpstreamPath = "/tmp/deploybutton-active-upstream.conf";
}  // namespace

bool cutOverNginx(const std::string &slot, const OutputFn &onOutput) {
    std::ofstream out(kTempUpstreamPath);
    if (!out) {
        onOutput("Failed to write active-upstream.conf\n");
        return false;
    }
    out << "set $active_backend backend-" << slot << ":8080;\n";
    out << "set $active_frontend frontend-" << slot << ":3000;\n";
    out.close();

    std::string copyCommand = std::string("docker cp ") + kTempUpstreamPath +
                              " nginx:/etc/nginx/active/active-upstream.conf";
    if (runCommand("", copyCommand, onOutput).exitCode != 0) {
        return false;
    }
    return runCommand("", "docker exec nginx nginx -s reload", onOutput)
               .exitCode == 0;
}

void tearDownSlot(const std::string &cwd, const std::string &slot,
                  bool detached, const OutputFn &onOutput) {
    std::string downCommand = "SLOT=" + slot +
                              " docker compose -p deploybutton-" + slot +
                              " -f docker-compose.app.yml down";
    if (!detached) {
        runCommand(cwd, downCommand, onOutput);
        return;
    }

    // This may tear down the very container running this step (the old
    // slot, right after cutover) -- hand it off to a detached sibling
    // container over the host docker socket so it isn't killed mid-command,
    // and this step can still return and be recorded successful before
    // that happens. `sleep 2` gives that DB write a head start.
    std::string launch =
        "docker run -d --rm -v /var/run/docker.sock:/var/run/docker.sock "
        "-v " +
        cwd + ":" + cwd + " -w " + cwd + " docker:cli sh -c 'sleep 2; " +
        downCommand + "'";
    runCommand("", launch, onOutput);
}
}  // namespace deploybutton
