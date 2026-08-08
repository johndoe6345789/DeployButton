CREATE TABLE IF NOT EXISTS workflows (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  description TEXT,
  is_template INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workflow_steps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL,
  config      TEXT NOT NULL DEFAULT '{}',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (workflow_id, position)
);

CREATE TABLE IF NOT EXISTS projects (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  repo_url      TEXT,
  workflow_id   INTEGER NOT NULL REFERENCES workflows(id),
  github_secret TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workflow_runs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id   INTEGER NOT NULL REFERENCES projects(id),
  workflow_id  INTEGER NOT NULL REFERENCES workflows(id),
  trigger_type TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'running',
  started_at   TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at  TEXT
);

CREATE TABLE IF NOT EXISTS step_runs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id       INTEGER NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  step_id      INTEGER NOT NULL,
  position     INTEGER NOT NULL,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'running',
  output       TEXT NOT NULL DEFAULT '',
  exit_code    INTEGER,
  started_at   TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_project ON workflow_runs(project_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_step_runs_run ON step_runs(run_id, position);

-- Single-row table: which slot (blue/green) nginx currently routes traffic
-- to. Lives in the database, not process memory, because the process that
-- flips it (running in whichever slot is active before cutover) isn't the
-- same process the other slot starts fresh.
CREATE TABLE IF NOT EXISTS deploy_state (
  id          INTEGER PRIMARY KEY CHECK (id = 1),
  active_slot TEXT NOT NULL DEFAULT 'blue'
);
INSERT OR IGNORE INTO deploy_state (id, active_slot) VALUES (1, 'blue');
