import React, { useEffect, useContext } from "react";
import {
  View,
  Text,
  Platform,
  Image,
  Linking,
  BackHandler,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import NetInfo from "@react-native-community/netinfo";
import VersionCheck from "react-native-version-check";
import CommonStyles from "../../CommonFolder/CommonStyles";
import { GlobalContext } from "../../../App";
import { Commonheight } from "../../Utils/ResponsiveWidget";
import { decryptData } from "../../Utils/DECODE";
import logger from "../../Utils/logger";

const SplashScreen = ({ navigation }) => {
  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;


  useEffect(() => {
    checkUpdateNeeded();
    mainurl();
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      if (offline == false) {
        cdispatch({ type: "Internet", payload: true });

      } else if (offline == true) {
        cdispatch({ type: "Internet", payload: false });

      }
    }
    );
    return () => removeNetInfoSubscription();
  }, []);

  const checkUpdateNeeded = async () => {
    try {
      const AppCurrentVersion = VersionCheck.getCurrentVersion();
      logger.log(AppCurrentVersion,'AppCurrentVersion')
      VersionCheck.getLatestVersion({
        provider: Platform.OS === "android" ? "playStore" : "appStore", // for Android && IOS
      }).then((latestVersion) => {
        const AppLatestVersion = latestVersion;

        if (AppCurrentVersion < AppLatestVersion) {
          VersionCheck.needUpdate().then(async (res) => {
            if (res.isNeeded) {
              Alert.alert(
                "App Update Required",
                "New version available to make your experience seamlessly.",
                [
                  {
                    text: "Update App",
                    onPress: () => {
                      BackHandler.exitApp();
                      Linking.openURL(res.storeUrl);
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          });
        } else {
          mainurl();
        }
      });
    } catch (error) {
      logger.log("something error", error);
    }
  };

  const mainurl = async () => {
    // var decryptDataed_KeyUrl
    const KeyUrl = await AsyncStorage.getItem("KeyUrl");
    const UserID = await AsyncStorage.getItem("UserID");
    const SetEntityKey = await AsyncStorage.getItem("SetEntityKey");

    const ShowAdvertisementCount = await AsyncStorage.getItem("ShowAdvertisementCount");
    const ShowAnnouncementCount = await AsyncStorage.getItem("ShowAnnouncementCount");

    let TotalAsyncADVCountData = JSON.parse(ShowAdvertisementCount)
    let TotalAsyncAnnoCountData = JSON.parse(ShowAnnouncementCount)

    logger.log(TotalAsyncADVCountData, "TotalAsyncADVCountData")
    logger.log(TotalAsyncAnnoCountData, "TotalAsyncAnnoCountData")

    if (ShowAdvertisementCount == null || ShowAnnouncementCount == null) {
      cdispatch({ type: "ShowTotalCount", payload: "0" });
    }
    else {
      let CombainedADVANNOCount = [...TotalAsyncADVCountData, ...TotalAsyncAnnoCountData];

      logger.log(CombainedADVANNOCount, "CombainedADVANNOCount")

      cdispatch({ type: "TotalCombainedCountData", payload: CombainedADVANNOCount });
    }

    logger.log({SetEntityKey, KeyUrl }, 'SetEntityKey KeyUrl')

    if (KeyUrl == null) {
      decryptDataed_KeyUrl = null
    } else {
      decryptDataed_KeyUrl = decryptData(KeyUrl);
    }
    if (KeyUrl == "" || KeyUrl == null || KeyUrl == undefined) {
      navigation.navigate("EntityKeyPage");
    } else {
      if (UserID == "" || UserID == null || UserID == undefined) {
        navigation.navigate("WebViewPage", { "EntityKey": SetEntityKey });
      }
      else {

        navigation.navigate("WebViewPage", { "EntityKey": SetEntityKey });
      }
    }
  };







  return (
    <>
      <View style={[CommonStyles.SplashMainView, {}]}>

        <View style={{ width: "100%", height: Commonheight(250), justifyContent: "center", alignSelf: "center" }}>
          <Image
            style={{ width: "100%", height: "70%" }}
            source={cstate.LoginPageClientLogoPath ? { uri: cstate.LoginPageClientLogoPath } : require('../../Assets/Images/512.png')}
          />
        </View>
        <View style={{ width: "100%", height: Commonheight(230), alignSelf: "center" }}>
        </View>
        <View style={{ width: "100%", height: Commonheight(20), backgroundColor: "white", alignSelf: "center" }}>
          {Platform.OS == "android" ? (
            <Text style={CommonStyles.SplashDivText}>Version 1.17</Text>
          ) : (
            <Text style={CommonStyles.SplashDivText}>Version 1.15</Text>
          )}
        </View>
      </View>
    </>
  );
};

export default SplashScreen;
