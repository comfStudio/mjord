import { renderRouter, screen } from "expo-router/src/testing-library";
import { View } from "react-native";
import renderer from "react-test-renderer";

import HomeScreen from "@app/app/(main)/home";

describe("HomeScreen", () => {
  beforeEach(() => {
    console.log("node env", process.env.NODE_ENV);
  });

  it("renders router", async () => {
    const MockComponent = jest.fn(() => <View />);

    const initialUrl = "/home";

    renderRouter(
      {
        index: MockComponent,
      },
      {
        initialUrl,
      }
    );

    expect(screen).toHavePathname(initialUrl);


    const tree = screen.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders snapshot", () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
