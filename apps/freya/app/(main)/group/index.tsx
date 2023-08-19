import { useSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { t } from '@mjord/common';

import Button from '../../../components/Button';
import Segment from '../../../components/Segment';
import Separator from '../../../components/Separator';
import { ImageSkeleton, LineSkeleton } from '../../../components/Skeleton';
import FeaturedEvents from '../../../feature/event/FeaturedEvents';
import LocationLabel from '../../../feature/location/LocationLabel';
import MembersModal from '../../../feature/member/MembersModal';
import ShareButton from '../../../feature/share/ShareButton';
import { useGroup } from '../../../services/group';

type IconNames = React.ComponentProps<typeof MaterialIcons>["name"];

function AdvisoryLabel({
  children,
  icon = "info",
}: {
  children?: string;
  icon?: React.ReactNode | IconNames;
}) {
  let iconEl: React.ReactNode;

  if (typeof icon === "string") {
    iconEl = (
      <MaterialIcons
        style={[advisoryStyles.advisoryIcon]}
        name={icon as IconNames}
      />
    );
  } else {
    iconEl = icon;
  }

  return (
    <View style={advisoryStyles.label}>
      <View>{iconEl}</View>
      <Text style={advisoryStyles.advisoryText}>{children}</Text>
    </View>
  );
}

function AdvisorySegment({}: {}) {
  return (
    <Segment padded rounded secondary style={advisoryStyles.container}>
      <AdvisoryLabel icon="money">
        {t`This community might incur a fee to join.`}
      </AdvisoryLabel>
      <AdvisoryLabel icon="money">
        {t`This community have activities that might incur a fee.`}
      </AdvisoryLabel>
      <AdvisoryLabel>
        {t`This community is not moderated by the app's administrators.`}
      </AdvisoryLabel>
    </Segment>
  );
}

const advisoryStyles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  advisoryText: {
    paddingHorizontal: 10,
    color: "#666",
  },
  advisoryIcon: {
    color: "#666",
    fontSize: 25,
  },
});

export default function DetailScreen() {
  const [membersVisible, setMembersVisible] = useState(false);
  const { id } = useSearchParams();
  const groupId = parseInt((id as string) || "0");

  const { data: group } = useGroup(groupId);

  const handleApplyToJoin = () => {
    // Handle the action when the user taps the "Apply to join" button
    console.log("Apply to join group ");
  };

  return (
    <ScrollView style={styles.container}>
      <MembersModal
        groupId={groupId}
        visible={membersVisible}
        onClose={() => setMembersVisible(false)}
      />
      <ImageSkeleton
        width={1000}
        // loading={!group?.primary_media?.url}
        style={styles.image}
      >
        <Image
          source={{ uri: group?.primary_media?.url }}
          style={styles.image}
        />
      </ImageSkeleton>
      <LineSkeleton style={styles.title} loading={!group?.title}>
        <Text style={styles.title}>{group?.title}</Text>
      </LineSkeleton>

      <View style={styles.tagLine}>
        <TouchableOpacity
          style={styles.members}
          onPress={(e) => {
            e.preventDefault();
            setMembersVisible(true);
          }}
        >
          <MaterialIcons name="group" size={24} />
          <Text style={styles.membersText}>{group?.members?.count || 0}</Text>
        </TouchableOpacity>
        <Separator />
        <LocationLabel data={group} style={styles.locationLabel} />
        <Separator />
        <ShareButton url="" secondary />
      </View>

      <LineSkeleton
        lines={3}
        style={styles.description}
        loading={!group?.description}
      >
        <Text style={styles.description}>{group?.description}</Text>
      </LineSkeleton>
      <Button
        primary
        style={styles.applyButton}
        value={t`Apply to join`}
        onPress={handleApplyToJoin}
      />

      <AdvisorySegment />

      <Text style={styles.sectionTitle}>{t`Activity`}</Text>
      <FeaturedEvents groupId={groupId} />
      <Text style={styles.sectionTitle}>{t`Discussions`}</Text>

      {[].map(({ item }) => (
        <View style={styles.discussion}>
          <Text style={styles.discussionTitle}>{item.title}</Text>
          <Text style={styles.discussionContent}>
            {item.content.substring(0, 100)}...
          </Text>
          <View style={styles.reactions}>
            {item.reactions.map((reaction) => (
              <Text key={reaction.id} style={styles.reaction}>
                {reaction.type}
              </Text>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.sectionSubTitle}>{t`Tags`}</Text>
      <Segment secondary padded rounded margin="large">
        <Text>Tag 1</Text>
      </Segment>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    margin: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  tagLine: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  locationLabel: {
    flexGrow: 2,
  },
  members: {
    flexDirection: "row",
  },
  membersText: {
    fontSize: 14,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionSubTitle: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 16,
    marginVertical: 5,
  },
  discussion: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  discussionContent: {
    fontSize: 14,
  },
  reactions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  reaction: {
    fontSize: 12,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  applyButton: {
    marginHorizontal: 50,
    marginTop: 10,
    marginBottom: 16,
  },
});
