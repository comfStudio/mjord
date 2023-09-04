from contextlib import contextmanager
import random

import time

from pprint import pprint
from sqlalchemy.orm import Session
from faker import Faker
from sqlalchemy.exc import IntegrityError
from random import choice
from .sql import *
from . import sql
import httpx

fake = Faker()

get_short_word_count = lambda: choice(list(range(2, 5)))

get_default_word_count = lambda: choice(list(range(10, 20)))

get_long_word_count = lambda: choice(list(range(20, 50)))

get_enum = lambda e: choice(list(e))

@contextmanager
def get_supabase():
    supabaseUrl = "http://127.0.0.1:8484"
    supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q"


    class Client:
        def __init__(self, req: httpx.Client) -> None:
            self.req = req

    with httpx.Client(
        base_url=supabaseUrl,
        headers={
        "apikey": supabaseKey,
        "context-type": "application/json",
    }) as req:
        c = Client(req)
        yield c



def create_user(email: str, password: str):
    with get_supabase() as client:
        res = client.req.post("/auth/v1/signup", json={
            "email": email,
            "password": password
        })

        res.raise_for_status()

    uid = res.json()['user']['id']

    with Session(get_engine()) as session:
        p = session.get(Profile, uid)
    return p
    

def generate_test_data(num_users, num_groups, num_discussions, num_comments, num_reactions, num_tags, num_media):
    media_types = [x.value for x in Media_Type]
    visibility_types = [x.value for x in Visibility_Type]
    member_roles = [x.value for x in Member_Role]

    with Session(get_engine()) as session:
        session.autoflush = False

        print("Generating test data for Media...")
        # Generate test data for Media
        for _ in range(num_media):
            media = Media(
                type=random.choice(media_types),
                url=fake.url()
            )
            session.add(media)

        session.commit()

        print(f"Generated {num_media} Media entries.")

        print("Generating test data for Users and Profiles...")
        # Generate test data for Users and Profiles
        user_ids = []
        for _ in range(num_users):
            profile = create_user(fake.email(), fake.password())
            profile.name = fake.name()
            profile.occupation = fake.job()
            profile.description = fake.text(get_long_word_count())
            profile.media_id=random.choice([media.id for media in session.query(Media)] + [None])

            session.add(profile)
            user_ids.append(profile.id)

        session.commit()
        print(f"Generated {num_users} Users and Profiles.")

        print("Generating test data for Tags...")
        # Generate test data for Tags
        tag_ids = []
        for _ in range(num_tags):
            tag = Tag(
                name=fake.words(choice(list(range(1, 2, 3))))
            )
            try:
                session.add(tag)
                session.commit()
                tag_ids.append(tag.id)
            except IntegrityError:
                # Handle integrity errors (duplicate entries) gracefully
                session.rollback()

        print(f"Generated {num_tags} Tags.")

        print("Generating test data for Groups...")
        # Generate test data for Groups
        group_ids = []
        for _ in range(num_groups):
            group = Group(
                title=fake.sentence(),
                content=fake.text(get_long_word_count()),
                visibility=random.choice(visibility_types),
                media_id=random.choice([media.id for media in session.query(Media)] + [None])
            )
            session.add(group)
            session.flush()
            group_ids.append(group.id)

        session.commit()
        print(f"Generated {num_groups} Groups.")

        print("Generating test data for Events...")
        # Generate test data for Events
        for group_id in group_ids:
            num_events = random.randint(0, 10)
            for _ in range(num_events):
                event = Event(
                    title=fake.sentence(),
                    content=fake.text(get_long_word_count()),
                    visibility=random.choice(visibility_types),
                    start_time=fake.date_time_between(start_date='-30d', end_date='now'),
                    end_time=fake.date_time_between(start_date='now', end_date='+30d')
                )
                session.add(event)
                event.group_id = group_id

        session.commit()
        print(f"Generated {num_events} Events.")

        print("Generating test data for GroupMembers...")
        # Generate test data for GroupMembers
        for group_id in group_ids:
            num_group_members = random.randint(1, 20)
            for _ in range(num_group_members):
                group_member = groupMembers(
                    group_id=group_id,
                    profile_id=random.choice(user_ids),
                    role=random.choice(member_roles)
                )
                try:
                    session.add(group_member)
                    session.commit()
                except IntegrityError:
                    # Handle integrity errors (duplicate entries) gracefully
                    session.rollback()
        
        print(f"Generated {num_group_members} GroupMembers.")

        print("Generating test data for Discussions...")
        # Generate test data for Discussions
        for _ in range(num_discussions):
            discussion = Discussion(
                title=fake.sentence(),
                content=fake.text(get_long_word_count()),
                visibility=random.choice(visibility_types),
                group_id=random.choice(group_ids),
                event_id=random.choice([event.id for event in session.query(Event)] + [None]),
                profile_id=random.choice(user_ids)
            )
            session.add(discussion)

        session.commit()
        print(f"Generated {num_discussions} Discussions.")

        print("Generating test data for Comments...")
        # Generate test data for Comments
        for _ in range(num_comments):
            comment = Comment(
                content=fake.text(get_long_word_count()),
                discussion_id=random.choice([discussion.id for discussion in session.query(Discussion)]),
                profile_id=random.choice(user_ids)
            )
            session.add(comment)

        session.commit()
        print(f"Generated {num_comments} Comments.")

        # Generate test data for Reactions
        reaction_types = ['like', 'dislike', 'heart', 'clap']
        for _ in range(num_reactions):
            rels = dict(
            discussion_id = random.choice([discussion.id for discussion in session.query(Discussion)] + [None]),
            comment_id = random.choice([comment.id for comment in session.query(Comment)] + [None])
            )

            if all(map(lambda x: x is None, rels.values())):
                continue

            # these are mutually exclusive, so only one can be non-null, pick random one
            idx = random.choice([k for k in rels.keys() if rels[k] is not None])
            for k in rels.keys():
                if k != idx:
                    rels[k] = None

            reaction = Reaction(
                reaction=random.choice(reaction_types),
                profile_id=random.choice(user_ids),
                **rels
            )
            session.add(reaction)

        session.commit()

        # Generate test data for CommentTags
        for comment_id in [comment.id for comment in session.query(Comment)]:
            num_comment_tags = random.randint(1, 5)
            for _ in range(num_comment_tags):
                try:
                    comment_tag = commentTags(
                        comment_id=comment_id,
                        tag_id=random.choice(tag_ids)
                    )
                    session.add(comment_tag)
                    session.flush()
                except IntegrityError:
                    # Handle integrity errors (duplicate entries) gracefully
                    session.rollback()

        session.commit()

        # Generate test data for CommentMedia
        for comment_id in [comment.id for comment in session.query(Comment)]:
            comment_media = commentMedias(
                comment_id=comment_id,
                media_id=random.choice([media.id for media in session.query(Media)])
            )
            session.add(comment_media)

        session.commit()

        # Generate test data for DiscussionTags
        for discussion_id in [discussion.id for discussion in session.query(Discussion)]:
            num_discussion_tags = random.randint(1, 5)
            for _ in range(num_discussion_tags):
                try:
                    discussion_tag = discussionTags(
                        discussion_id=discussion_id,
                        tag_id=random.choice(tag_ids)
                    )
                    session.add(discussion_tag)
                    session.flush()
                except IntegrityError:
                    # Handle integrity errors (duplicate entries) gracefully
                    session.rollback()
                

        session.commit()

        # Generate test data for DiscussionMedia
        for discussion_id in [discussion.id for discussion in session.query(Discussion)]:
            discussion_media = discussionMedias(
                discussion_id=discussion_id,
                media_id=random.choice([media.id for media in session.query(Media)])
            )
            session.add(discussion_media)

        session.commit()

        # Generate test data for EventTags
        for event_id in [event.id for event in session.query(Event)]:
            num_event_tags = random.randint(1, 5)
            for _ in range(num_event_tags):
                try:
                    event_tag = eventTags(
                        event_id=event_id,
                        tag_id=random.choice(tag_ids)
                    )
                    session.add(event_tag)
                    session.flush()
                except IntegrityError:
                    # Handle integrity errors (duplicate entries) gracefully
                    session.rollback()
                

        session.commit()

        # Generate test data for EventMedia
        for event_id in [event.id for event in session.query(Event)]:
            event_media = eventMedias(
                event_id=event_id,
                media_id=random.choice([media.id for media in session.query(Media)])
            )
            session.add(event_media)

        session.commit()

        # Generate test data for GroupMedia
        for group_id in group_ids:
            group_media = groupMedias(
                group_id=group_id,
                media_id=random.choice([media.id for media in session.query(Media)])
            )
            session.add(group_media)

        session.commit()

        # Generate test data for Url
        for _ in range(num_groups):
            for _ in range(random.randint(0, 5)):
                url = Url(
                    name=fake.url()
                )
                session.add(url)

        session.commit()

        # Generate test data for GroupURL
        for group_id in group_ids:
            group_url = groupUrls(
                group_id=group_id,
                url_id=random.choice([url.id for url in session.query(Url)])
            )
            session.add(group_url)

        session.commit()

        # Generate test data for Location
        for group_id in group_ids:
            location = Location(
                name=fake.city(),
                address=fake.street_address(),
                group_id=group_id
            )
            session.add(location)

        for event_id in [event.id for event in session.query(Event)]:
            location = Location(
                name=fake.city(),
                address=fake.street_address(),
                event_id=event_id
            )
            session.add(location)

        session.commit()

        # Generate test data for Update
        # for _ in range(num_users):
        #     update = Update(
        #         profile_id=random.choice(user_ids),
        #         action=fake.word(),
        #         row_id=random.choice([media.id for media in session.query(Media)]),
        #         table_name=fake.word()
        #     )
        #     session.add(update)

        # session.commit()

        session.close()
    print("Test data generation completed.")



def main():
    sql.main()
    generate_test_data(250, 1000, 5000, 10000, 10000, 100, 100)
    # generate_test_data(5, 10, 50, 10, 10, 10, 10)

if __name__ == '__main__':
    main()
    