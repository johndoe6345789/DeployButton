#include "StubPath.h"
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <sys/stat.h>

namespace deploybutton::test {
void StubPath::SetUp() {
    char buf[] = "/tmp/deploybutton_stub_bin_XXXXXX";
    dir_ = mkdtemp(buf);

    const char *existing = getenv("PATH");
    oldPath_ = existing ? existing : "";
    setenv("PATH", (dir_ + ":" + oldPath_).c_str(), 1);
}

void StubPath::TearDown() { setenv("PATH", oldPath_.c_str(), 1); }

void StubPath::addStub(const std::string &name) {
    std::string path = dir_ + "/" + name;
    std::ofstream out(path);
    out << "#!/bin/sh\necho STUB:" << name << " \"$@\"\nexit 0\n";
    out.close();
    chmod(path.c_str(), 0755);
}
}  // namespace deploybutton::test
