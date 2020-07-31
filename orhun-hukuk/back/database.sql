CREATE TABLE users (
	user_id TEXT PRIMARY KEY,
	username TEXT UNIQUE,
	hash TEXT
);

CREATE TABLE info (
	info_id TEXT PRIMARY KEY,
	col1 TEXT,
	col2 TEXT,
	col3 TEXT,
	col4 TEXT,
	col5 TEXT,
	col6 TEXT,
	col7 TEXT,
	col8 TEXT,
	col9 TEXT,
	user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE
);