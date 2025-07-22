import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { getToken } from './src/utils/auth';
import { setBootstrapped, setToken } from './src/slices/authSlice';

const Bootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      if (token) {
        dispatch(setToken(token));
      }
      dispatch(setBootstrapped(true));
    };

    loadToken();
  }, []);

  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <Bootstrap />
  </Provider>
);

export default App;
