import pgPromise from 'pg-promise';

import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

const pgp = pgPromise();


const supabaseConfig = {
    supabaseUrl: 'http://localhost:8484',
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q",
};


const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);


const dbConfig = {
    host: "localhost",
    port: 8482,
    database: "postgres",
    user: "postgres",
    password: "your-super-secret-and-long-postgres-password",
};

const db = pgp(dbConfig);

const createUser = async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.admin.createUser({ email, password });

    if (error) {
        console.error("Error creating user:", error.message);
        return null;
    } else {
        return user?.id;
    }
};

// const listUsers = async () => {
//     const { data: { users }, error } = await supabase.auth.admin.listUsers()

//     if (error) {
//         console.error("Error listing users:", error.message);
//         return [];
//     } else {
//         return users.map(user => user.id);
//     }
// }



const generateTestData = async (numUsers: number, numGroups: number, numDiscussions: number, numComments: number, numReactions: number, numTags: number, numMedia: number) => {
    const userIds: string[] = [];

    console.log("Generating test data...")

    // Create test users
    for (let i = 0; i < numUsers; i++) {
        const email = faker.internet.email();
        const password = faker.internet.password();
        const userId = await createUser(email, password);

        if (userId) {
            userIds.push(userId);
        }
    }

    console.log("Test users created successfully")



    const groupIds: number[] = [];
    const discussionIds: number[] = [];
    const commentIds: number[] = [];

    const mediaIds: number[] = [];

    // Insert test data for media
    for (let i = 0; i < numMedia; i++) {
        const mediaType = faker.helpers.arrayElement(["image", "video"]);
        const mediaUrl = faker.internet.url();

        const result = await db.one("INSERT INTO media (media_type, url) VALUES ($1, $2) RETURNING id", [mediaType, mediaUrl]);
        mediaIds.push(result.id);
    }

    console.log("Test media created successfully")


    // Insert test data for groups
    for (let i = 0; i < numGroups; i++) {
        const groupName = faker.lorem.words(3);
        const groupDescription = faker.lorem.sentences(3);
        const groupVisibility = faker.helpers.arrayElement(["public", "private", "hidden"]);
        const primaryMediaId = faker.helpers.arrayElement(mediaIds.concat([null as any]));

        const result = await db.one("INSERT INTO groups (name, description, primary_media_id, visibility) VALUES ($1, $2, $3, $4) RETURNING id", [
            groupName,
            groupDescription,
            primaryMediaId,
            groupVisibility,
        ]);

        groupIds.push(result.id);
    }

    console.log("Test groups created successfully")

    // Insert test data for group_members
    for (let groupID of groupIds) {
        const numGroupMembers = faker.datatype.number({ min: 1, max: 20 });

        for (let j = 0; j < numGroupMembers; j++) {
            const userID = faker.helpers.arrayElement(userIds);

            await db.none("INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [groupID, userID]);
        }
    }

    console.log("Test group members created successfully")

    // Insert test data for group_discussions
    for (let i = 0; i < numDiscussions; i++) {
        const groupID = faker.helpers.arrayElement(groupIds);
        const userID = faker.helpers.arrayElement(userIds);
        const discussionTitle = faker.lorem.words(5);
        const discussionContent = faker.lorem.sentences(5);
        const discussionVisibility = faker.helpers.arrayElement(["public", "private", "hidden"]);

        const result = await db.one(
            "INSERT INTO group_discussions (group_id, user_id, title, content, visibility) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [groupID, userID, discussionTitle, discussionContent, discussionVisibility]
        );

        discussionIds.push(result.id);
    }

    console.log("Test discussions created successfully")

    // Insert test data for discussion_comments
    for (let i = 0; i < numComments; i++) {
        const discussionID = faker.helpers.arrayElement(discussionIds);
        const userID = faker.helpers.arrayElement(userIds);
        const commentContent = faker.lorem.sentences(2);

        const result = await db.one("INSERT INTO discussion_comments (discussion_id, user_id, content) VALUES ($1, $2, $3) RETURNING id", [
            discussionID,
            userID,
            commentContent,
        ]);

        commentIds.push(result.id);
    }

    console.log("Test comments created successfully")

    // Insert test data for discussion_reactions
    for (let i = 0; i < numReactions; i++) {
        const discussionID = faker.helpers.arrayElement(discussionIds);
        const userID = faker.helpers.arrayElement(userIds);
        const reactionType = faker.helpers.arrayElement(["like", "dislike", "heart", "clap"]);

        await db.none("INSERT INTO discussion_reactions (discussion_id, user_id, reaction) VALUES ($1, $2, $3)", [
            discussionID,
            userID,
            reactionType,
        ]);
    }

    // Insert test data for comment_reactions
    for (let i = 0; i < numReactions; i++) {
        const commentID = faker.helpers.arrayElement(commentIds);
        const userID = faker.helpers.arrayElement(userIds);
        const reactionType = faker.helpers.arrayElement(["like", "dislike", "heart", "clap"]);

        await db.none("INSERT INTO comment_reactions (comment_id, user_id, reaction) VALUES ($1, $2, $3)", [
            commentID,
            userID,
            reactionType,
        ]);
    }

    console.log("Test reactions created successfully")

    const tagIds: number[] = [];

    // Insert test data for tags
    for (let i = 0; i < numTags; i++) {
        const tagName = faker.lorem.word();

        let result

        try {
            result = await db.one("INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id", [tagName]);
        } catch (error) {
            result = await db.one("SELECT id FROM tags WHERE name = $1", [tagName]);
        }

        tagIds.push(result.id);
    }

    console.log("Test tags created successfully")

    // Insert test data for group_tags
    for (let i = 0; i < numGroups; i++) {
        const groupID = i + 1;
        const numGroupTags = faker.datatype.number({ min: 1, max: 5 });

        for (let j = 0; j < numGroupTags; j++) {
            const tagID = faker.helpers.arrayElement(tagIds);

            await db.none("INSERT INTO group_tags (group_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [groupID, tagID]);
        }
    }

    console.log("Test group tags created successfully")

    // Insert test data for discussion_tags
    for (let i = 0; i < numDiscussions; i++) {
        const discussionID = i + 1;
        const numDiscussionTags = faker.datatype.number({ min: 1, max: 5 });

        for (let j = 0; j < numDiscussionTags; j++) {
            const tagID = faker.helpers.arrayElement(tagIds);

            await db.none(
                "INSERT INTO discussion_tags (discussion_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [discussionID, tagID],
            );
        }
    }

    console.log("Test discussion tags created successfully")


    // Insert test data for discussion_media
    for (let discussionID of discussionIds) {
        const mediaID = faker.helpers.arrayElement(mediaIds);

        await db.none("INSERT INTO discussion_media (discussion_id, media_id) VALUES ($1, $2)", [discussionID, mediaID]);
    }

    // Insert test data for group_media
    for (let groupID of groupIds) {
        const mediaID = faker.helpers.arrayElement(mediaIds);

        await db.none("INSERT INTO group_media (group_id, media_id) VALUES ($1, $2)", [groupID, mediaID]);
    }

};

(async () => {
    try {
        await generateTestData(100, 1000, 5000, 10000, 10000, 100, 400);
        console.log("Test data generated successfully");
    } catch (error) {
        console.error("Error generating test data:", error);
    } finally {
        pgp.end(); // Close the database connection
    }
})();
