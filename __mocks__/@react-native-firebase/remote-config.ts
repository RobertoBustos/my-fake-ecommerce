// Jest has no native modules. Tests drive these mocks to stand in for Remote Config
export const getRemoteConfig = jest.fn(() => ({}));
export const activate = jest.fn(() => Promise.resolve(true));
export const fetchConfig = jest.fn(() => Promise.resolve());
export const getValue = jest.fn(() => ({ getSource: () => "static", asString: () => "" }));
export const onConfigUpdate = jest.fn(() => () => undefined);
