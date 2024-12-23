import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  BackHandler,
  Alert,
  ToastAndroid
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "../../../App";




import CommonAPISelectWOT from "../../APIMethods/CommonAPISelectWOT";
import { Commonheight, Commonsize, } from "../../Utils/ResponsiveWidget";
import CommonStyles from "../../CommonFolder/CommonStyles";
import Commoncolor from "../../CommonFolder/CommonColor";
import CommonTextInput from "../../CommonFolder/CommonTextInput";
import { Icon2 } from "../../CommonFolder/CommonIcons";
import { CircularLoader } from "../../Components/Indicators";
import { decode as atob, encode as btoa } from "base-64";
import { encryptData,decryptData } from "../../Utils/DECODE";
import { useToast } from "../../Context/ToastProvider";
import logger from "../../Utils/logger";


const LoginPage = ({ navigation }) => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [PasswordShowHide, setPasswordShowHide] = useState(false);
  const [IsLoader, setIsLoader] = useState(false);
  const [UserAlreadyLogin, setUserAlreadyLogin] = useState("");
  const [SessionRemovePopUp, setSessionRemovePopUp] = useState(false);
  const [SessionLoader, setSessionLoader] = useState(false);

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  const { showToast } = useToast();


  useEffect(() => {
    mainurl();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const backAction = () => {
    Alert.alert("Confirmation", "Are you sure you want to exit the app?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  const mainurl = async () => {
    const KeyUrl = await AsyncStorage.getItem("KeyUrl");
    const Decrypted_KeyUrl = decryptData(KeyUrl);
    // colorapi(Decrypted_KeyUrl);
  };

  const colorapi = async (Decrypted_KeyUrl) => {
    try {

      let Url = Decrypted_KeyUrl + 'FPC13S3/';

      const params = {
        data: {
          p1: null,
          p2: null,
          p3: null,
          p4: null,
          p5: null,
          p6: null,
          p7: null,
          p8: null,
          p9: null,
          p10: null,
          p11: "",
          p12: "",
          p13: null,
          p14: null,
          p15: 1,
          p16: 10,
          p17: "PORTALCDATA",
          p18: cstate.UserGroupID,
          p19: cstate.UserID,
        },
      };

      await CommonAPISelectWOT(Url, params).then(async (response) => {

        if (response.Output.data.length > 0) {
          cdispatch({ type: "ColorArray", payload: response });
          cdispatch({
            type: "ReportLeftHeaderPath",
            payload: response.Output.data[0].ReportLeftHeaderPath,
          });
          cdispatch({
            type: "CommonBGMainColor",
            payload: response.Output.data[0].BackGroundMain,
          });
          cdispatch({
            type: "CommonBGButtonColor",
            payload: response.Output.data[0].BackGroundButton,
          });
          cdispatch({
            type: "CommonBGButtonTextColor",
            payload: response.Output.data[0].BackGroundButtonText,
          });
          cdispatch({
            type: "CommonBGIconColor",
            payload: response.Output.data[0].BackGroundIcon,
          });
          cdispatch({
            type: "CommonBGIconTextColor",
            payload: response.Output.data[0].BackGroundIconText,
          });
          cdispatch({
            type: "CommonBGSubColor",
            payload: response.Output.data[0].BackGroundSub,
          });
          cdispatch({
            type: "CommonClientLogoPath",
            payload: response.Output.data[0].LoginPageClientLogoPath,
          });
          cdispatch({
            type: "CommonContent",
            payload: response.Output.data[0].Content,
          });
          cdispatch({
            type: "CommonWMContactNo1",
            payload: response.Output.data[0].WMContactNo1,
          });
          cdispatch({
            type: "CommonWMContactNo2",
            payload: response.Output.data[0].WMContactNo2,
          });
          cdispatch({
            type: "CommonWMContactNo3",
            payload: response.Output.data[0].WMContactNo3,
          });
          cdispatch({
            type: "CommonWMEmailAddress1",
            payload: response.Output.data[0].WMEmailAddress1,
          });
          cdispatch({
            type: "CommonWMEmailAddress2",
            payload: response.Output.data[0].WMEmailAddress2,
          });
          cdispatch({
            type: "WebSaasSliderImage1Path",
            payload: response.Output.data[0].WebSaasSliderImage1Path,
          });
          cdispatch({
            type: "WebSaasSliderImage2Path",
            payload: response.Output.data[0].WebSaasSliderImage2Path,
          });
          changecolor(response.Output.data[0].BackGroundMain)
        } else {
          logger.log("Branding issues");
        }
      });
    } catch (error) {
      logger.log(error);
    }
  };

  const changecolor = (hexCode) => {

    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    logger.log(`rgba(${r},${g},${b},${0.1})`)

    cdispatch({ type: "MainFirstColor", payload: `rgba(${r},${g},${b},${0.5})` });
    cdispatch({ type: "MainMiddleColor", payload: `rgba(${r},${g},${b},${0.7})` });
    cdispatch({ type: "MainLastColor", payload: `rgba(${r},${g},${b},${1.0})` });

  }

  const Showhidefunction = () => {
    setPasswordShowHide(!PasswordShowHide);
  };

  const LoginSubmit = async () => {
    if (Username == "") {
      if (!toast.isActive(id)) {
        toast.show({
          id,

          title: "Username field is Empty",
          duration: 2000,
          textStyle: {
            textAlign: "center",
            fontSize: Commonsize(12),
            fontWeight: 500,
          },
          style: {
            backgroundColor: "#404040",
          },
        });
      }

    } else if (Password == "") {

      if (!toast.isActive(id)) {
        toast.show({
          id,

          title: "Password field is empty",
          duration: 2000,
          textStyle: {
            textAlign: "center",
            fontSize: Commonsize(12),
            fontWeight: 500,
          },
          style: {
            backgroundColor: "#404040",
          },
        });
      }
    } else {
      setIsLoader(true);

      let Url = cstate.KeyUrl + 'FPU20S3/'
        ;
      let param = {
        "data": {
          "p1": btoa(Username),
          "p2": btoa(Password),
          "p3": "",
          "p4": "1",
          "p5": "MobilePortal",
          "p6": "login"
        }
      };
      await CommonAPISelectWOT(Url, param)
        .then(async (res) => {

          logger.log(res, "login");

          let status = res.Output.status;
          let error = res.Output.error;

          if (status.code == 400) {
            setIsLoader(false);

            let message = error.message;
            let UserData = res.Output.error.data;
            setUserAlreadyLogin(UserData);

            if (message == "User already logged in") {
              setSessionRemovePopUp(true);
            } else {
              showToast({ message: message, type: 'error', position: 'bottom', duration: 3000 });
            }
          } else {
            const userid = JSON.stringify(res.Output.data.p2);
            const userGroupid = atob(res.Output.data.p5.toString())
            const username = JSON.stringify(btoa(res.Output.data.p1));
            const needLocationUpdate = res.Output.data?.p20?.toString();
            const password = JSON.stringify(res.Output.data.p12);
            const Session = atob(res.Output.data.p3.toString())
            const productID = res.Output.data.p8.toString();

            const Encrypted_userid = encryptData(userid);
            const Encrypted_userGroupid = encryptData(userGroupid);
            const Encrypted_username = encryptData(username);
            const Encrypted_password = encryptData(password);
            const Encrypted_Session = encryptData(Session);

            AsyncStorage.setItem("UserID", Encrypted_userid);
            AsyncStorage.setItem("UserGroupID", Encrypted_userGroupid);
            AsyncStorage.setItem("UserName", Encrypted_username);
            AsyncStorage.setItem("Password", Encrypted_password);
            AsyncStorage.setItem("SessionID", Encrypted_Session);
            AsyncStorage.setItem("ProductID", productID)
            AsyncStorage.setItem("NeedLocationUpdate", needLocationUpdate)

            cdispatch({ type: "UserID", payload: userid });
            cdispatch({ type: "UserGroupID", payload: userGroupid });
            cdispatch({ type: "UserName", payload: username });
            cdispatch({ type: "Password", payload: password });
            cdispatch({ type: "SessionID", payload: Session });
            cdispatch({ type: "NeedLocationUpdate", payload: needLocationUpdate });

            PushNotificationToken(username, userid, userGroupid);

            setUsername("")
            setPassword("")

            setIsLoader(false);
            logger.log(needLocationUpdate, 'needLocationUpdate', typeof (needLocationUpdate))

            if (needLocationUpdate == 1) {
              navigation.navigate("HomePage");
            } else {
              navigation.navigate("ChangeLocationPage");
            }

            let message = "Signed in Successfully";
            showToast({ message: message, type: 'error', position: 'bottom', duration: 3000 });
          }
        })
        .catch((error) => {
          setIsLoader(false);
          logger.log(error);
        });
    }
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
      if (status.code == "200") {
        logger.log(res, "success");
      } else {
        logger.log("error");
      }
    })
      .catch((error) => {
        logger.log(error);
      });
  };

  const SessionRemoveFunction = async () => {
    try {
      setSessionLoader(true);

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
          p8: null,
          p9: null,
          p10: "",
          p11: "",
          p12: "",
          p13: null,
          p14: null,
          p15: 1,
          p16: 10,
          p17: "USERSESSIONREMOVE",
          p18: null,
          p19: UserAlreadyLogin,
        },
      };

      await CommonAPISelectWOT(Url, params).then(async (res) => {
        let status = res.Output.status;
        if (status.code == "200") {
          setSessionRemovePopUp(false);
          setSessionLoader(false);
          let message = "Session removed successfully";
          showToast({ message: message, type: 'error', position: 'bottom', duration: 3000 });

        } else {
          setSessionRemovePopUp(false);
          setSessionLoader(false);
          let message = "Something went wrong try again";
          showToast({ message: message, type: 'error', position: 'bottom', duration: 3000 });

        }
      });
    } catch (err) {
      logger.log(err);
    }
  };

  return (
    <View
      style={[
        CommonStyles.CommonFlex,
        { backgroundColor: Commoncolor.CommonWhiteColor },
      ]}
    >
      <View style={[CommonStyles.LoginSubView, {}]}>
        <Image
          style={CommonStyles.LoginImage}
          source={cstate.LoginPageClientLogoPath ? { uri: cstate.LoginPageClientLogoPath } : require("../../Assets/Images/512.png")}
        />
      </View>

      <View style={[CommonStyles.LoginSubView1, {}]}>
        <ScrollView>
          <View style={CommonStyles.LoginDivView}>
            <CommonTextInput
              width={"80%"}
              height={Commonheight(40)}
              fontsize={Commonsize(15)}
              color={Commoncolor.CommonBlackColor}
              borderBottomColor={
                Commoncolor.CommonAppColor
                  ? Commoncolor.CommonAppColor
                  : Commoncolor.CommonBlackColor
              }
              value={Username}
              onChangeText={(text) => setUsername(text.replace(/ /g, ""))}
              placeholder={"Username"}
              placeholderTextColor={
                Commoncolor.CommonAppColor
                  ? Commoncolor.CommonAppColor
                  : Commoncolor.CommonBlackColor
              }
            />

            <View style={CommonStyles.LoginInputView}>
              <TextInput
                value={Password}
                onChangeText={(text) => setPassword(text.replace(/ /g, ""))}
                placeholder={"Password"}
                placeholderTextColor={
                  Commoncolor.CommonAppColor
                    ? Commoncolor.CommonAppColor
                    : Commoncolor.CommonBlackColor
                }
                secureTextEntry={PasswordShowHide ? false : true}
                style={CommonStyles.LoginInput}
              />
              <TouchableOpacity
                onPress={() => Showhidefunction()}
                style={{ justifyContent: "center" }}
              >
                <Icon2
                  name={PasswordShowHide ? "eye" : "eye-with-line"}
                  size={25}
                  style={[
                    CommonStyles.LoginIcon,
                    {
                      color: Commoncolor.CommonAppColor
                        ? Commoncolor.CommonAppColor
                        : Commoncolor.CommonBlackColor,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                CommonStyles.LoginDividerView,
                {
                  backgroundColor: Commoncolor.CommonAppColor
                    ? Commoncolor.CommonAppColor
                    : Commoncolor.CommonBlackColor,
                },
              ]}
            ></View>
          </View>

          <View style={CommonStyles.LoginDivView1}>
            <View style={CommonStyles.LoginDivView2}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgotPasswordPage");
                }}
                style={CommonStyles.LoginTouch1}
              >
                <Text
                  style={[
                    CommonStyles.LoginTouchText1,
                    {
                      color: Commoncolor.CommonAppColor
                        ? Commoncolor.CommonAppColor
                        : Commoncolor.CommonBlackColor,
                    },
                  ]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("NeedHelpPage")} style={CommonStyles.LoginTouch2}>
                <Text
                  style={[
                    CommonStyles.LoginTouchText1,
                    {
                      alignSelf: "flex-end",
                      color: Commoncolor.CommonAppColor
                        ? Commoncolor.CommonAppColor
                        : Commoncolor.CommonBlackColor,
                    },
                  ]}
                >
                  Need help?
                </Text>
              </TouchableOpacity>
            </View>

            {IsLoader == true ? (
              <View
                style={{
                  width: "100%",
                  height: Commonheight(60),
                  justifyContent: "center",
                }}
              >
                <View style={{ alignSelf: "center" }}>
                  <CircularLoader
                    color={
                      Commoncolor.CommonAppColor
                        ? Commoncolor.CommonAppColor
                        : Commoncolor.CommonBlackColor
                    }
                    dotSize={10}
                    size={40}
                  />
                </View>
              </View>
            ) : (
              <>
                <View style={CommonStyles.LoginDivView3}>
                  <TouchableOpacity
                    onPress={() => LoginSubmit()}
                  >
                    <View style={[CommonStyles.LoginTouch3, { backgroundColor: Commoncolor.CommonAppColor }]}>
                      <Text
                        style={[
                          CommonStyles.LoginTouchText2,
                          { color: Commoncolor.CommonWhiteColor },
                        ]}
                      >
                        Login
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={[CommonStyles.LoginSubView2, {}]}>
        <View style={[CommonStyles.LoginDivView4, { flexDirection: "row" }]}>
          <Text
            style={[
              CommonStyles.LoginTouchText3,
              { color: Commoncolor.CommonBlackColor },
            ]}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUpPage")}
            style={CommonStyles.LoginSignTextTouch}
          >
            <Text
              style={{
                color: Commoncolor.CommonAppColor
                  ? Commoncolor.CommonAppColor
                  : Commoncolor.CommonBlackColor,
              }}
            >
              {" "}
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[CommonStyles.LoginDivView5, {}]}>

        </View>
      </View>

      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        supportedOrientations={[
          "portrait",
          "portrait-upside-down",
          "landscape",
          "landscape-left",
          "landscape-right",
        ]}
        visible={SessionRemovePopUp}
      >
        <View style={CommonStyles.LoginModalView}>
          <View
            style={[
              CommonStyles.LoginModalSubView,
              { backgroundColor: Commoncolor.CommonWhiteColor, justifyContent: "space-evenly" },
            ]}
          >
            <View style={[CommonStyles.LoginModalSubView2, {}]}>
              <Text
                style={[
                  CommonStyles.LoginModalText,
                  {
                    color: Commoncolor.CommonAppColor
                      ? Commoncolor.CommonAppColor
                      : Commoncolor.CommonBlackColor,
                    marginTop: Commonheight(20)

                  },
                ]}
              >
                {"Remove User?"}
              </Text>
              <Text style={[CommonStyles.LoginModalText1, { lineHeight: 20, marginTop: Commonheight(20) }]}>
                {"User already logged in, If you want to continue please remove the existing session here."}
              </Text>
            </View>

            <View style={[CommonStyles.LoginModalSubView1, {}]}>
              <View
                style={{
                  width: "65%",
                  height: Commonheight(60),
                  justifyContent: "space-evenly",
                  alignSelf: "center",
                  flexDirection: "row",
                }}
              >
                {SessionLoader == true ? (
                  <View
                    style={{
                      width: "65%",
                      height: Commonheight(60),
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  >
                    <CircularLoader
                      color={
                        Commoncolor.CommonAppColor
                          ? Commoncolor.CommonAppColor
                          : Commoncolor.CommonBlackColor
                      }
                      dotSize={10}
                      size={30}
                    />
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setSessionRemovePopUp(false);
                        setSessionLoader(false);
                      }}
                      style={CommonStyles.LoginModalTouch}
                    >
                      <Text
                        style={[
                          CommonStyles.LoginModalTouchText,
                          {
                            color: Commoncolor.CommonAppColor
                              ? Commoncolor.CommonAppColor
                              : Commoncolor.CommonBlackColor,
                          },
                        ]}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <View style={[
                      CommonStyles.LoginModalTouch,
                      , { backgroundColor: Commoncolor.CommonAppColor }
                    ]}>
                      <TouchableOpacity
                        onPress={() => {
                          SessionRemoveFunction();
                        }}
                        style={[
                          CommonStyles.LoginModalTouch,
                          {},
                        ]}
                      >
                        <Text style={CommonStyles.LoginModalTouchText1}>
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginPage;
