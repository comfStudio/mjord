-- Create enum for visibility
CREATE TYPE visibility_type AS ENUM ('public', 'private', 'hidden');

-- Create enum for media types
CREATE TYPE media_type AS ENUM ('image', 'video');

-- Create enum for roles
CREATE TYPE member_role AS ENUM ('member', 'admin', 'moderator');


-- Create 'media' table to store media information for both groups and group discussions
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    media_type media_type NOT NULL,
    url VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create 'groups' table to store group information
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    primary_media_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    visibility visibility_type NOT NULL DEFAULT 'hidden',

    location_name VARCHAR(255) NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    latitude NUMERIC NOT NULL DEFAULT 0,
    longitude NUMERIC NOT NULL DEFAULT 0,

    FOREIGN KEY (primary_media_id) REFERENCES media (id) ON DELETE SET NULL
);


-- Create 'group_members' table to store user-group relationships and roles
CREATE TABLE group_members (
    user_id UUID NOT NULL,
    group_id INTEGER NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    role member_role NOT NULL DEFAULT 'member',
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
);


-- Create 'group_media' table to store media references for groups
CREATE TABLE group_media (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    media_id INTEGER NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
);

-- Create 'group_discussions' table to store group discussions
CREATE TABLE group_discussions (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    visibility visibility_type NOT NULL DEFAULT 'public',
    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);


-- Create 'discussion_media' table to store media references for discussions
CREATE TABLE discussion_media (
    id SERIAL PRIMARY KEY,
    discussion_id INTEGER NOT NULL,
    media_id INTEGER NOT NULL,
    FOREIGN KEY (discussion_id) REFERENCES group_discussions (id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
);

-- Create 'discussion_comments' table to store comments on discussions
CREATE TABLE discussion_comments (
    id SERIAL PRIMARY KEY,
    discussion_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (discussion_id) REFERENCES group_discussions (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create 'tags' table to store tag information
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create 'group_tags' table to store group-tag relationships
CREATE TABLE group_tags (
    group_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (group_id, tag_id),
    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- Create 'discussion_tags' table to store discussion-tag relationships
CREATE TABLE discussion_tags (
    discussion_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (discussion_id, tag_id),
    FOREIGN KEY (discussion_id) REFERENCES group_discussions (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- Create 'discussion_reactions' table to store reactions on discussions
CREATE TABLE discussion_reactions (
    id SERIAL PRIMARY KEY,
    discussion_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    reaction VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (discussion_id) REFERENCES group_discussions (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create 'comment_reactions' table to store reactions on comments
CREATE TABLE comment_reactions (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    reaction VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (comment_id) REFERENCES discussion_comments (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create 'events' table to store group event information
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    location_name VARCHAR(255) NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    latitude NUMERIC NOT NULL DEFAULT 0,
    longitude NUMERIC NOT NULL DEFAULT 0,
    visibility visibility_type NOT NULL DEFAULT 'public',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
);


-- Create 'event_members' table to store user-event relationships
CREATE TABLE event_members (
    user_id UUID NOT NULL,
    event_id INTEGER NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);


-- Associate events with group discussions
ALTER TABLE group_discussions
ADD COLUMN event_id INTEGER,
ADD FOREIGN KEY (event_id) REFERENCES events (id);