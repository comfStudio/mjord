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
from . import function
import httpx

fake = Faker()

get_low_count = lambda: choice(list(range(2, 5)))

get_default_count = lambda: choice(list(range(10, 20)))

get_high_count = lambda: choice(list(range(20, 50)))

get_paragraphs = lambda: "\n".join([fake.paragraph(get_high_count()) for _ in range(random.randint(3,10))])[:5000]

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


def generate_test_data(num_users, num_groups, num_discussions, num_reactions, num_tags):
    media_types = [x.value for x in Media_Type]
    visibility_types = [x.value for x in Visibility_Type]
    member_roles = [x.value for x in Member_Role]

    with Session(get_engine()) as session:
        session.autoflush = False

        print("Generating test data for Users and Profiles...")
        # Generate test data for Users and Profiles
        user_ids = []
        for _ in range(num_users):
            profile = create_user(fake.email(), fake.password())
            profile.name = fake.name()
            profile.occupation = fake.job()
            profile.description = get_paragraphs()

            media = Media(
                id=Media.generate_id(),
                type=random.choice(media_types),
                url=fake.url(),
            )

            session.add(media)

            profile.media_id = media.id

            session.add(profile)
            user_ids.append(profile.id)

        session.commit()
        print(f"Generated {num_users} Users and Profiles.")

        print("Generating test data for Tags...")
        # Generate test data for Tags
        tag_ids = []
        _tag_names = set()
        for _ in range(num_tags):
            tag = Tag(
                id=Tag.generate_id(),
                name=" ".join(fake.words(choice(list(range(1, 2, 3)))))
            )
            if tag.name not in _tag_names:
                _tag_names.add(tag.name)
                session.add(tag)
                tag_ids.append(tag.id)

        print(f"Generated {num_tags} Tags.")

        print("Generating test data for Groups...")
        # Generate test data for Groups
        group_ids = []
        for _ in range(num_groups):
            media = Media(
                id=Media.generate_id(),
                type=random.choice(media_types),
                url=fake.url(),
            )

            session.add(media)
            session.flush()

            group = Group(
                id=Group.generate_id(),
                title=fake.sentence(),
                content=get_paragraphs(),
                visibility=random.choice(visibility_types),
            )

            group.media_id = media.id

            session.add(group)

            for _ in range(random.randint(0, 5)):
                m = Media(
                    id=Media.generate_id(),
                    type=random.choice(media_types),
                    url=fake.url(),
                    group_id=group.id
                )
                session.add(m)

            group_ids.append(group.id)

        session.commit()
        print(f"Generated {num_groups} Groups.")

        print("Generating test data for Events...")
        # Generate test data for Events
        event_ids = []
        for group_id in group_ids:
            num_events = random.randint(0, 10)
            for _ in range(num_events):
                event = Event(
                    id=Event.generate_id(),
                    title=fake.sentence(),
                    content=get_paragraphs(),
                    visibility=random.choice(visibility_types),
                    start_time=fake.date_time_between(start_date='-30d', end_date='now'),
                    end_time=fake.date_time_between(start_date='now', end_date='+30d')
                )
                session.add(event)
                event_ids.append(event.id)
                event.group_id = group_id

                for _ in range(random.randint(0, 5)):
                    media = Media(
                        id=Media.generate_id(),
                        type=random.choice(media_types),
                        url=fake.url(),
                        event_id=event.id
                    )

                    session.add(media)

        session.commit()
        print(f"Generated {num_events} Events.")

        print("Generating test data for GroupMembers...")
        # Generate test data for GroupMembers
        group_member_ids = []
        for group_id in group_ids:
            num_group_members = random.randint(1, 20)
            _group_members = set()
            for _ in range(num_group_members):
                group_member = groupMembers(
                    id=groupMembers.generate_id(),
                    group_id=group_id,
                    profile_id=random.choice(user_ids),
                    role=random.choice(member_roles)
                )
                if group_member.profile_id not in _group_members:
                    _group_members.add(group_member.profile_id)
                    session.add(group_member)
                    group_member_ids.append(group_member.id)

        print(f"Generated {num_group_members} GroupMembers.")

        print("Generating test data for Discussions...")
        # Generate test data for Discussions
        discussion_ids = []
        comment_ids = []
        for _ in range(num_discussions):
            discussion = Discussion(
                id=Discussion.generate_id(),
                title=fake.sentence(),
                content=get_paragraphs(),
                visibility=random.choice(visibility_types),
                group_id=random.choice(group_ids),
                event_id=random.choice(event_ids + [None]),
                profile_id=random.choice(user_ids)
            )
            session.add(discussion)
            discussion_ids.append(discussion.id)

            for _ in range(random.randint(0, 3)):
                    if random.random() < 0.5:
                        continue
                    media = Media(
                        id=Media.generate_id(),
                        type=random.choice(media_types),
                        url=fake.url(),
                        discussion_id=discussion.id
                    )

                    session.add(media)

        session.commit()
        print(f"Generated {num_discussions} Discussions.")

        print("Generating test data for Comments...")
        for discussion_id in discussion_ids:
            # Generate test data for Comments
            for _ in range(random.randint(0, 100)):
                comment = Comment(
                    id=Comment.generate_id(),
                    content=get_paragraphs(),
                    discussion_id=discussion_id,
                    profile_id=random.choice(user_ids)
                )
                session.add(comment)
                comment_ids.append(comment.id)

                for _ in range(random.randint(0, 3)):
                    if random.random() < 0.5:
                        continue
                    media = Media(
                        id=Media.generate_id(),
                        type=random.choice(media_types),
                        url=fake.url(),
                        comment_id=comment.id
                    )

                    session.add(media)


        session.commit()
        print(f"Generated Comments.")



        # Generate test data for Reactions
        reaction_types = ['like', 'dislike', 'heart', 'clap']
        for _ in range(num_reactions):
            rels = dict(
            discussion_id = random.choice(discussion_ids + [None]),
            comment_id = random.choice(comment_ids + [None])
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
        for comment_id in comment_ids:
            if random.random() < 0.5:
                continue
            num_comment_tags = random.randint(1, 3)
            _comment_tags = set()
            for _ in range(num_comment_tags):
                comment_tag = commentTags(
                    comment_id=comment_id,
                    tag_id=random.choice(tag_ids)
                )
                if comment_tag.tag_id not in _comment_tags:
                    _comment_tags.add(comment_tag.tag_id)
                    session.add(comment_tag)

        session.commit()

        # Generate test data for DiscussionTags
        for discussion_id in discussion_ids:
            if random.random() < 0.5:
                continue
            num_discussion_tags = random.randint(1, 5)
            _discussion_tags = set()
            for _ in range(num_discussion_tags):
                discussion_tag = discussionTags(
                    discussion_id=discussion_id,
                    tag_id=random.choice(tag_ids)
                )
                if discussion_tag.tag_id not in _discussion_tags:
                    _discussion_tags.add(discussion_tag.tag_id)
                    session.add(discussion_tag)


        session.commit()

        # Generate test data for EventTags
        for event_id in [event.id for event in session.query(Event)]:
            num_event_tags = random.randint(1, 5)
            _event_tags = set()
            for _ in range(num_event_tags):
                event_tag = eventTags(
                    event_id=event_id,
                    tag_id=random.choice(tag_ids)
                )
                if event_tag.tag_id not in _event_tags:
                    _event_tags.add(event_tag.tag_id)
                    session.add(event_tag)


        session.commit()

        # Generate test data for Url
        url_ids = []
        for _ in range(num_groups):
            for _ in range(random.randint(0, 5)):
                url = Url(
                    id=Url.generate_id(),
                    name=fake.url()
                )
                session.add(url)
                url_ids.append(url.id)

        session.commit()

        # Generate test data for GroupURL
        for group_id in group_ids:
            group_url = groupUrls(
                group_id=group_id,
                url_id=random.choice(url_ids)
            )
            session.add(group_url)

        session.commit()

        # Generate test data for Location
        for group_id in group_ids:
            for _ in range(random.randint(0, 3)):
                location = Location(
                    name=fake.city(),
                    address=fake.street_address(),
                    group_id=group_id
                )
                session.add(location)

        for event_id in [event.id for event in session.query(Event)]:
            for _ in range(random.randint(0, 3)):
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
        #         row_id=random.choice(media_ids),
        #         table_name=fake.word()
        #     )
        #     session.add(update)

        # session.commit()

        session.close()
    print("Test data generation completed.")



def main():
    sql.main()
    function.main()
    # generate_test_data(250, 500, 500, 1000, 50)
    generate_test_data(5, 10, 50, 10, 10)

if __name__ == '__main__':
    main()

