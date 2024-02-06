import { renderRouter, screen } from 'expo-router/testing-library';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

import UserScreen from '@app/app/(main)/home';
import { ROUTES } from '@app/constants';

describe("UserScreen", () => {
  beforeEach(() => {});

  it("renders router", async () => {
    const MockComponent = jest.fn(() => <View />);

    const initialUrl = "/user";

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
    const tree = renderer.create(<UserScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("requires login", async () => {
    const MockComponent = jest.fn(() => <View />);

    const initialUrl = "/user";

    renderRouter(
      {
        index: MockComponent,
        [ROUTES.LOGIN]: MockComponent,
      },
      {
        initialUrl,
      }
    );

    expect(screen).toHavePathname(initialUrl);

    const tree = screen.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
