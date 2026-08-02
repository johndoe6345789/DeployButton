#pragma once

#include <string>
#include <vector>

namespace deploybutton {
struct SeedStep {
    std::string name;
    std::string type;
    std::string config;
};

struct SeedWorkflow {
    std::string name;
    std::string description;
    std::vector<SeedStep> steps;
};

// The default workflow templates seeded into a fresh database.
std::vector<SeedWorkflow> defaultSeedWorkflows();
}  // namespace deploybutton
