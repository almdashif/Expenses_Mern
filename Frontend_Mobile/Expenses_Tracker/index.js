/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { NativeModules, Platform } from 'react-native';

if (__DEV__ && Platform.OS === 'android') {
    const NativeDevSettings = NativeModules.NativeDevSettings;
    NativeDevSettings?.enableRemoteDebugging(true);
}

AppRegistry.registerComponent(appName, () => App);
