import React, { useState } from "react";
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from "native-base"
import AppNavigator from "./AppNavigator";
import store from './redux/store/store';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs()


App = () => {
    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <AppNavigator />
            </NativeBaseProvider>
        </Provider>
    )
}

export default App
