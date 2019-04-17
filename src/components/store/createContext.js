import { createContext } from 'react';

export const MyContext = createContext();

const { Provider, Consumer } = MyContext;

export { Provider, Consumer };
