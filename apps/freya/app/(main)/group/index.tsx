import { Tabs, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import Button from "@/components/Button";
import { AnimatedHeaderScrollView } from "@/components/Header";
import Segment from "@/components/Segment";
import { ImageSkeleton, LineSkeleton } from "@/components/Skeleton";
import FeaturedEvents from "@/feature/event/FeaturedEvents";
import LocationLabel from "@/feature/location/LocationLabel";
import MembersModal from "@/feature/member/MembersModal";
import ShareButton from "@/feature/share/ShareButton";
import { useGroup } from "@/services/group";
import Divider from "@app/components/Divider";
import Icon from "@app/components/Icon";
import StyleText from "@app/components/StyleText";
import { createStyles, useStyles, useTheme } from "@app/styles/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { t } from "@mjord/common";

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
      <Icon style={[advisoryStyles.advisoryIcon]} name={icon as IconNames} />
    );
  } else {
    iconEl = icon;
  }

  return (
    <View style={advisoryStyles.label}>
      <View>{iconEl}</View>
      <StyleText style={advisoryStyles.advisoryText}>{children}</StyleText>
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
  const { id } = useLocalSearchParams();
  const groupId = parseInt((id as string) || "0");

  const theme = useTheme();

  const { data: group } = useGroup(groupId);

  const handleApplyToJoin = () => {
    // Handle the action when the user taps the "Apply to join" button
    console.log("Apply to join group ");
  };

  const stl = useStyles(styles);

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <>
              <ShareButton url="" style={stl.shareButton} />
            </>
          ),
        }}
      />
      <AnimatedHeaderScrollView
        header={{
          startOffset: 50,
          endOffset: 110,
        }}
        style={stl.container}
      >
        <MembersModal
          groupId={groupId}
          visible={membersVisible}
          onClose={() => setMembersVisible(false)}
        />
        <ImageSkeleton
          width={1000}
          // loading={!group?.primary_media?.url}
          style={stl.image}
        >
          <Image
            source={{ uri: group?.primary_media?.url }}
            style={stl.image}
          />
        </ImageSkeleton>
        <LineSkeleton style={stl.title} loading={!group?.title}>
          <StyleText style={stl.title}>{group?.title}</StyleText>
        </LineSkeleton>

        <View style={stl.tagLine}>
          <TouchableOpacity
            style={stl.members}
            onPress={(e) => {
              e.preventDefault();
              setMembersVisible(true);
            }}
          >
            <MaterialIcons name="group" size={24} />
            <StyleText style={stl.membersText}>
              {group?.members?.count || 0}
            </StyleText>
          </TouchableOpacity>
          <Divider />
          <LocationLabel data={group} style={stl.locationLabel} />
          <Divider />
        </View>

        <LineSkeleton
          lines={3}
          style={stl.description}
          loading={!group?.description}
        >
          <StyleText style={stl.description}>{group?.description}</StyleText>
        </LineSkeleton>
        <Button
          primary
          style={stl.applyButton}
          value={t`Apply to join`}
          onPress={handleApplyToJoin}
        />

        <AdvisorySegment />

        <StyleText style={stl.sectionTitle}>{t`Activity`}</StyleText>
        <FeaturedEvents groupId={groupId} />
        <StyleText style={stl.sectionTitle}>{t`Discussions`}</StyleText>

        {[].map(({ item }) => (
          <View style={stl.discussion}>
            <StyleText style={stl.discussionTitle}>{item.title}</StyleText>
            <StyleText style={stl.discussionContent}>
              {item.content.substring(0, 100)}...
            </StyleText>
            <View style={stl.reactions}>
              {item.reactions.map((reaction) => (
                <StyleText key={reaction.id} style={stl.reaction}>
                  {reaction.type}
                </StyleText>
              ))}
            </View>
          </View>
        ))}

        <StyleText style={stl.sectionSubTitle}>{t`Tags`}</StyleText>
        <Segment secondary padded rounded margin="large">
          <StyleText>Tag 1</StyleText>
        </Segment>
      </AnimatedHeaderScrollView>
    </>
  );
}

const styles = createStyles((t) => ({
  container: {
    flex: 1,
  },
  image: {
    width: t.sizing.image.hero.width,
    height: t.sizing.image.hero.height,
  },
  title: {
    fontSize: t.sizing.text.heading.h1,
    fontWeight: "bold",
    marginHorizontal: t.spacing.edge.default,
    marginVertical: t.spacing.edge.default,
    marginBottom: t.spacing.edge.sm,
  },
  description: {
    margin: t.spacing.edge.default,
    marginTop: t.spacing.edge.sm,
  },
  tagLine: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: t.spacing.edge.default,
  },
  locationLabel: {
    flexGrow: 2,
  },
  members: {
    flexDirection: "row",
  },
  membersText: {
    marginLeft: t.spacing.edge.xs,
  },
  sectionTitle: {
    fontSize: t.sizing.text.heading.h3,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionSubTitle: {
    fontSize: t.sizing.text.heading.h4,
    color: t.colors.lightText,
    marginHorizontal: t.spacing.edge.default,
    marginVertical: t.spacing.edge.sm,
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
    fontSize: t.sizing.text.md,
    fontWeight: "bold",
  },
  discussionContent: {
    fontSize: t.sizing.text.sm,
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
    marginHorizontal: t.spacing.size[12],
    marginVertical: t.spacing.edge.default,
  },

  shareButton: {
    marginRight: t.insets.right + t.spacing.edge.default,
    backgroundColor: "transparent",
  },
}));
