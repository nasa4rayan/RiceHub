CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE themes (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  window_manager TEXT NOT NULL,
  github_repo TEXT NOT NULL,
  author_id BIGINT REFERENCES users(id),
  rating_avg NUMERIC(2,1) DEFAULT 0,
  downloads BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE theme_versions (
  id BIGSERIAL PRIMARY KEY,
  theme_id BIGINT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  changelog TEXT,
  manifest JSONB NOT NULL,
  install_script_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(theme_id, version)
);

CREATE TABLE theme_assets (
  id BIGSERIAL PRIMARY KEY,
  theme_version_id BIGINT NOT NULL REFERENCES theme_versions(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('screenshot','banner','thumbnail')),
  url TEXT NOT NULL
);

CREATE TABLE theme_dependencies (
  id BIGSERIAL PRIMARY KEY,
  theme_version_id BIGINT NOT NULL REFERENCES theme_versions(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  distro TEXT NOT NULL DEFAULT 'common'
);

CREATE TABLE ratings (
  id BIGSERIAL PRIMARY KEY,
  theme_id BIGINT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(theme_id, user_id)
);

CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  theme_id BIGINT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
