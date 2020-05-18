import React from 'react';

export const { Provider: ThemeContextProvider, Consumer: ThemeContextConsumer } = React.createContext();
export const { Provider: RoleContextProvider, Consumer: RoleContextCosumer } = React.createContext();
export const { Provider: FetchServiceProvider, Consumer: FetchServiceCosumer } = React.createContext();
