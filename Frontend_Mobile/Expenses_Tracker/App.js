

import React, { createContext, useReducer } from 'react';
import { LogBox, Text, TextInput, StatusBar, View ,Platform} from "react-native"
import Navigation from './src/Routes/Navigation';
import { AllReducer, initialState } from './src/Context/ContextReducer';
import { Commonheight } from './src/Utils/ResponsiveWidget';
import NetworkPage from './src/Components/NetworkPage';
import Commoncolor from './src/CommonFolder/CommonColor';
import Toast from './src/Components/Toast';
import { ToastProvider } from './src/Context/ToastProvider';

export const GlobalContext = createContext();

LogBox.ignoreAllLogs(true)

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

const App = () => {
  const [cstate, cdispatch] = useReducer(AllReducer, initialState);

  // const NetInfoSubscription = (() => {
  //   const state = NetInfo.fetch()
  //   console.log(state, "State")
  //   const Internet = state.isConnected
  //   const Internet_Reachability = state.isInternetReachable
  //   if (Internet == true && Internet_Reachability == true) {
  //     cdispatch({ type: "Internet", payload: true });
  //   }
  //   else {
  //     cdispatch({ type: "Internet", payload: false });
  //   }
  // });
  return (
    <ToastProvider>
      <GlobalContext.Provider value={{ cstate, cdispatch }}>

        <>
          {Platform.OS == "android" ?
            <View style={{ width: "100%", height: Commonheight(30), backgroundColor: Commoncolor.CommonAppColor }}>
              <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            </View >
            :
            <View style={{ width: "100%", height: Commonheight(30), backgroundColor: Commoncolor.CommonAppColor }}>
              <View style={{ width: "100%", height: Commonheight(25) }}></View>
            </View >
          }
          {cstate.Internet == false ? <NetworkPage /> : <Navigation />}

          <Toast />
        </>
      </GlobalContext.Provider>
    </ToastProvider>
  );
};

export default App;

