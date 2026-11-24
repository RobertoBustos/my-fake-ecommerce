// Jest has no native modules. Tests that need a Firebase app make getApps return one
export const getApps = jest.fn(() => []);
export const getApp = jest.fn();
