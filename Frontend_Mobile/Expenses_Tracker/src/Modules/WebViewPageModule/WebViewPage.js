import React, { useEffect, useState, useContext } from "react";
import { View } from "react-native";
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-async-storage/async-storage"
import CookieManager from '@react-native-cookies/cookies';

import { GlobalContext } from "../../../App";
import CommonAPISelectWOT from "../../APIMethods/CommonAPISelectWOT";
import ApiResponseJson from "../../APIMethods/ApiResponseJson";
import { encryptData } from "../../Utils/DECODE";
import { useToast } from "../../Context/ToastProvider";
import logger from "../../Utils/logger";


const WebViewPage = ({ route, navigation }) => {
  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;
  const { EntityKey } = route.params;
  const [WebUrlGet, setWebUrlGet] = useState('');
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);

  const { showToast } = useToast();


  useEffect(() => {
    logger.log('first')
    WebUrlCheck();
  }, []);

  const WebUrlCheck = async () => {
    let AlteredEntityKey = EntityKey.toLowerCase();
    let filteredObject = ApiResponseJson[0][AlteredEntityKey];
    if (filteredObject) {
      logger.log('first')
      const Encrypted_GetMainUrl = encryptData(filteredObject.ServerURL);
      logger.log(Encrypted_GetMainUrl, 'first1')
      await AsyncStorage.setItem("KeyUrl", Encrypted_GetMainUrl);
      cdispatch({ type: "KeyUrl", payload: filteredObject.ServerURL });
      setWebUrlGet(filteredObject.MobilePortalURL);
    } else {
      logger.log("Entity key not found.");
    }
  };



  const LoginApi = async (array) => {

    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    await CookieManager.clearAll();
    const Biscuit = array;
    let Url = cstate.KeyUrl + 'FPM18S3/';
    let param = {
      data: {
        p1: "0000",
        p2: "0000",
        p3: "",
        p4: "1",
        p5: "mobileportal",
        p6: "login",
      },
    };
    const header = {
      'Accept': 'application/json',
      "Content-Type": "application/json",
      'x-matka': Biscuit
    };
    fetch(Url, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(param)
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const headers = response.headers;
        const data = await response.json();
        const xAccessToken = headers.get('x-access-token');
        const xRefreshToken = headers.get('x-refresh-token');
        return [data, xAccessToken, xRefreshToken];
      })
      .then(async ([res, xAccessToken, xRefreshToken]) => {
        let status = res.Output.status;
        let error = res.Output.error;
        if (status.code === 400) {
          let message = error?.message;
          showToast({ message: message, type: 'error', position: 'bottom', duration: 3000 });

        } else {
          logger.log({ res })
          const userid = JSON.stringify(res.Output.data.p2);
          const userGroupid = res.Output.data.p5.toString();
          const username = res.Output.data.p1;
          const userEmail = res.Output.data.p10;
          const Session = res.Output.data.p3;
          const productID = res.Output.data.p8;
          const xuid = res.Output.data.p13;
          const Encrypted_userid = encryptData(userid);
          const Encrypted_userGroupid = encryptData(userGroupid);
          const Encrypted_username = encryptData(username);
          const Encrypted_email = encryptData(userEmail);
          const Encrypted_Session = encryptData(Session);
          await AsyncStorage.setItem("xAccessToken", xAccessToken);
          await AsyncStorage.setItem("xRefreshToken", xRefreshToken);
          await AsyncStorage.setItem("xuid", xuid);
          await AsyncStorage.setItem("UserID", Encrypted_userid);
          await AsyncStorage.setItem("UserGroupID", Encrypted_userGroupid);
          await AsyncStorage.setItem("UserName", Encrypted_username);
          await AsyncStorage.setItem("UserEmail", Encrypted_email);
          await AsyncStorage.setItem("SessionID", Encrypted_Session);
          await AsyncStorage.setItem("decryptedSessionID", Session);
          await AsyncStorage.setItem("ProductID", productID);
          cdispatch({ type: "UserID", payload: userid });
          cdispatch({ type: "UserGroupID", payload: userGroupid });
          cdispatch({ type: "UserName", payload: username });
          cdispatch({ type: "UserEmail", payload: userEmail });
          cdispatch({ type: "SessionID", payload: Session });

          PushNotificationToken(username, userid, userGroupid);
          isDefaultLocationActive(userid, userGroupid)

          let message = "Signed in Successfully";

        }
      }).catch((error) => {
        logger.log(error, 'error');
        let message = error.message;

      }).finally(() => {
        logger.log(isApiCallInProgress, 'isApiCallInProgress finally')
        setIsApiCallInProgress(false);
      });
  };

  const PushNotificationToken = async (Uname, UserID, UserGroupID) => {
    const NewToken = await AsyncStorage.getItem("pushtoken");
    let url = cstate.KeyUrl + "ReachCommonSelect_API/";
    const param = {
      data: {
        p1: 1,
        p2: 3,
        p3: UserID,
        p4: null,
        p5: null,
        p6: UserID,
        p7: Uname,
        p8: NewToken,
        p9: null,
        p10: null,
        PageIndex_int: 1,
        PageSize_int: 10,
        Type_varchar: "NOTIFICATIONINSERT",
        UserGroupKey: UserGroupID,
        UserAccessKey: UserID,
      },
    };
    await CommonAPISelectWOT(url, param).then(async (res) => {
      let status = res.Output.status;
      if (status.code === "200") {
        logger.log(res, "success");
      } else {
        logger.log("error");
      }
    }).catch((error) => {
      logger.log(error, 'error');
    });
  };


  const isDefaultLocationActive = async (UserID, UserGroupID) => {
    try {


      let Url = cstate.KeyUrl + 'FPC13S3/';

      const params = {
        data: {
          p1: null,
          p2: null,
          p3: null,
          p4: null,
          p5: null,
          p6: null,
          p7: null,
          p8: null,  // complaint id
          p9: null,
          p10: "",
          p11: "",
          p12: "",
          p13: null,
          p14: 1,
          p15: 10,
          p16: "CONLOCEXISTS",
          p17: UserGroupID,
          p18: UserID,
        },
      };


      await CommonAPISelectWOT(Url, params).then(async (res) => {
        logger.log({ Url, params, res }, 'CONLOCEXISTS')

        var data = res.Output?.data;
        var Status = res.Output.status;
        const needLocationUpdate = data[0]?.ConLocExists?.toString()
        if (Status.code == '200' || Status.code == 200) {
          await AsyncStorage.setItem("NeedLocationUpdate", needLocationUpdate)
          cdispatch({ type: "NeedLocationUpdate", payload: needLocationUpdate });
          if (needLocationUpdate == 1) {
            navigation.navigate("MainContainerModule");
          } else {
            navigation.navigate("ChangeLocationPage");
          }
        }
        else {
          showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });

        }
      });
    } catch (error) {
      logger.log(error, 'error');
      showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });

    }
  };

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: 'red' }}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: WebUrlGet }}
        startInLoadingState={true}
        thirdPartyCookiesEnabled={true}
        incognito={true}
        scalesPageToFit={true}
        onMessage={(event) => {
          const myArray = event.nativeEvent.data;
          LoginApi(myArray);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
        }}
      />
    </View>
  );
};

export default WebViewPage;
