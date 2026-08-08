#pragma once

#include "CommandSteps.h"
#include <string>

// Shared between SelfDeployStep.cc (orchestration) and
// SelfDeployCutover.cc (nginx cutover + slot teardown) -- split across
// files to stay under the repo's 80-line-per-file limit.
namespace deploybutton {
std::string otherSlot(const std::string &slot);

bool buildAndStartSlot(const std::string &cwd, const std::string &slot,
                       const OutputFn &onOutput);

bool waitForHealthy(const std::string &slot, int timeoutSeconds,
                    const OutputFn &onOutput);

bool cutOverNginx(const std::string &slot, const OutputFn &onOutput);

// `detached`: true when tearing down the slot this step may itself be
// running in (see SelfDeployCutover.cc for why).
void tearDownSlot(const std::string &cwd, const std::string &slot,
                  bool detached, const OutputFn &onOutput);
}  // namespace deploybutton
