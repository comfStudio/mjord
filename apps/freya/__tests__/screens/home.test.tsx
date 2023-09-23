import renderer from "react-test-renderer";

import HomeScreen from "@app/app/(main)/home";

describe("HomeScreen", () => {
  beforeEach(() => {
    console.log("node env", process.env.NODE_ENV);
  });

  it("renders correctly", () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
