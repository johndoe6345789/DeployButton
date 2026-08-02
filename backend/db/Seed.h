#pragma once

namespace deploybutton {
// Inserts the default workflow templates (and their steps) if the
// workflows table is currently empty. No-op on subsequent restarts.
void seedDefaultWorkflows();
}  // namespace deploybutton
