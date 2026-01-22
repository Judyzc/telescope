-- Test results table
CREATE TABLE IF NOT EXISTS tests (
  test_id TEXT PRIMARY KEY,
  name TEXT,
  source TEXT,
  owner TEXT,
  cli_command TEXT,
  url TEXT NOT NULL,
  browser TEXT NOT NULL,
  device TEXT,
  headers TEXT,
  cookies TEXT,
  flags TEXT,
  block_domains TEXT,
  block TEXT,
  firefox_prefs TEXT,
  cpu_throttle REAL,
  connection_type TEXT,
  width INTEGER,
  height INTEGER,
  frame_rate INTEGER,
  disable_js BOOLEAN,
  debug BOOLEAN,
  auth TEXT,
  timeout INTEGER,
  status INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status DESC);
CREATE INDEX IF NOT EXISTS idx_tests_owner ON tests(owner);
CREATE INDEX IF NOT EXISTS idx_tests_created_at ON tests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tests_updated_at ON tests(updated_at DESC);