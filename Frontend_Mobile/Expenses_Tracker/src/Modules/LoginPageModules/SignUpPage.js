import React, { useEffect, useState, useContext } from 'react';
import { Text, View, TouchableOpacity, ScrollView, BackHandler, Alert, TextInput } from 'react-native';




// import StepIndicator from 'react-native-step-indicator-v2';


import { GlobalContext } from '../../../App';
import Commoncolor from '../../CommonFolder/CommonColor';
import { Commonheight, Commonsize, Commonwidth } from '../../Utils/ResponsiveWidget';
import CommonStyles from '../../CommonFolder/CommonStyles';
import { Icon1, Icon2 } from '../../CommonFolder/CommonIcons';
import { CircularLoader, TextLoader } from '../../Components/Indicators';
import CommonTextInput from '../../CommonFolder/CommonTextInput';
import CommonAPISelectWOT from '../../APIMethods/CommonAPISelectWOT';
import { useToast } from '../../Context/ToastProvider';
import logger from '../../Utils/logger';

const SignUpPage = ({ navigation }) => {
  const [CurrentPosition, setCurrentPosition] = useState(0);
  const [Email, setEmail] = useState('');
  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [CPassword, setCPassword] = useState('');
  const [OTP, setOTP] = useState('');
  const [IsLoader, setIsLoader] = useState(false);
  const [PasswordShowHide, setPasswordShowHide] = useState(false);
  const [ConfirmPasswordShowHide, setConfirmPasswordShowHide] = useState(false);

  const { showToast } = useToast();


  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;


  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    navigation.navigate("LoginPage")
    return true;
  };

  const GetOtp = async () => {
    setIsLoader(true);

    let Url = cstate.KeyUrl + 'signup/'

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
        p9: 3,
        p10: UserName,
        p11: Password,
        p12: Email,
        p13: null,
        p14: null,
        p15: 1,
        p16: 10,
        p17: "OTPINSERT",
        p18: null,
        p19: null,
      },
    };

    await CommonAPISelectWOT(Url, params).then(async (res) => {

      if (res?.Output?.status?.code == '400' || res?.status?.code == '400') {
        setIsLoader(false);
        if (res?.Output?.error?.message) {
          showToast({ message: res?.Output?.error?.message, type: 'error', position: 'bottom', duration: 3000 });
        }
        else {
          showToast({ message: "Please check your email and Try Again", type: 'error', position: 'bottom', duration: 3000 });

        }
      } else {
        setIsLoader(false);
        showToast({ message: "OTP sent successfully to your email", type: 'success', position: 'bottom', duration: 3000 });

        setCurrentPosition(1);
      }
    })
      .catch(error => {
        setIsLoader(false);
        logger.log(error);
      });
  };


  const OTPCheck = async () => {
    if (!OTP) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Please enter the otp code',
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

      let Url = cstate.KeyUrl + 'checksignupotp/';

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
          p9: OTP,
          p10: "",
          p11: "",
          p12: Email,
          p13: null,
          p14: null,
          p15: 1,
          p16: 10,
          p17: "OTPSELECT",
          p18: cstate.UserGroupID,
          p19: cstate.UserID,
        },
      };

      await CommonAPISelectWOT(Url, params).then(async (res) => {

        let status = res?.Output?.status;
        if (status?.code == '200') {
          setIsLoader(false);
          if (res?.Output?.data?.message == "Invalid OTP") {
            showToast({ message: "Invalid OTP", type: 'error', position: 'bottom', duration: 3000 });

          }
          else {
            navigation.navigate('LoginPage')
            Alert.alert(
              "Sign Up request,",
              "We received your request and your account will be activated soon after admin verification.",
              [{
                text: "OK",
                onPress: () => logger.log("Cancel Pressed"),
              }],
              { cancelable: false }
            );
          }
        } else {
          setIsLoader(false);
          showToast({ message: 'Invalid OTP', type: 'error', position: 'bottom', duration: 3000 });
        }
      })
        .catch(error => {
          setIsLoader(false);
          logger.log(error);
        });
    }
  };

  const Validatefeilds = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!UserName) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'User name should not be empty',
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

    } else if (!Password) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Password should not be empty',
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
    } else if (Password.length <= 5) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Password should be minimum of six characters',
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
    } else if (!CPassword) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Confirm Password should not be empty',
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
    } else if (Password != CPassword) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Password mismatched',
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
    } else if (!Email) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Email should not be empty',
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
    } else if (reg.test(Email) === false) {

      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Please enter valid email id',
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
      GetOtp();
    }
  }

  const labels = [
    'Email',
    'Verify OTP'
  ];

  const BGColor = Commoncolor.CommonAppColor;

  const customStyles = {
    labelColor: BGColor,
    labelSize: Commonsize(12),
    currentStepLabelColor: BGColor,
    separatorStrokeWidth: Commonwidth(2),
    currentStepStrokeWidth: Commonwidth(3),
    stepStrokeCurrentColor: BGColor,
    stepStrokeWidth: Commonwidth(3),
    stepStrokeFinishedColor: BGColor,
    stepStrokeUnFinishedColor: 'lightgray', //outer line
    separatorFinishedColor: BGColor,
    separatorUnFinishedColor: 'lightgray', // center line
    stepIndicatorFinishedColor: BGColor,
    stepIndicatorUnFinishedColor: 'lightgray',
    stepIndicatorCurrentColor: BGColor,
    stepIndicatorLabelFontSize: Commonwidth(12),
    currentStepIndicatorLabelFontSize: Commonwidth(12),
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#ffffff',
  };

  const PasswordFunction = (index, val) => {
    if (index == 1) {
      setUserName(val);
    } else if (index == 2) {
      setPassword(val);
    } else if (index == 3) {
      setCPassword(val);
    } else if (index == 4) {
      setEmail(val);
    } else if (index == 5) {
      setOTP(val);
    }
    else {
      logger.log('No Password Function');
    }
  };

  const Showhidefunction = () => {
    setPasswordShowHide(!PasswordShowHide);
  };

  const ConfirmShowhidefunction = () => {
    setConfirmPasswordShowHide(!ConfirmPasswordShowHide);
  };

  return (
    <View style={CommonStyles.CommonFlex}>
      <View style={[CommonStyles.CommonHeaderView2, { backgroundColor: Commoncolor.CommonAppColor }]}>

        <TouchableOpacity
          onPress={() => backAction()}
          style={CommonStyles.CommonHeaderViewTouch}>
          <Icon1
            name={'arrowleft'}
            size={Commonsize(23)}
            style={CommonStyles.CommonHeaderViewIcon}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonStyles.CommonHeaderViewText,
            { marginLeft: Commonwidth(0) },
          ]}>
          Sign Up
        </Text>
      </View>
      <View style={CommonStyles.CommonHeaderView3}>
        <View style={CommonStyles.CommonFlex}>
          <ScrollView>
            <View
              style={{
                width: '100%',
                height: Commonheight(100),
                marginTop: Commonheight(10),
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              {/* <StepIndicator
                customStyles={customStyles}
                stepCount={2}
                currentPosition={CurrentPosition}
                labels={labels}
              /> */}
            </View>
            {IsLoader == true ? (
              <View
                style={{
                  height: Commonheight(250),
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    height: Commonheight(100),
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <CircularLoader
                    style={{ alignSelf: 'center' }}
                    color={
                      Commoncolor.CommonAppColor
                    }
                    dotSize={10}
                    size={40}
                  />
                  <TextLoader
                    contentStyle={{
                      color: Commoncolor.CommonAppColor,
                      fontSize: Commonsize(14),
                      fontWeight: '400',
                    }}
                    content={'Please wait...'}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: Commonheight(300),
                }}>
                {CurrentPosition == 0 ? (
                  <>
                    <CommonTextInput
                      width={'80%'}
                      height={Commonheight(40)}
                      fontsize={Commonsize(15)}
                      value={UserName}
                      onChangeText={text => PasswordFunction(1, text.replace(/ /g, ''))}
                      color={Commoncolor.CommonBlackColor}
                      placeholder={'User Name'}
                      placeholderTextColor={
                        Commoncolor.CommonAppColor
                      }
                      borderBottomColor={
                        Commoncolor.CommonAppColor
                      }
                    />
                    <View style={{ width: "100%", height: Commonheight(10) }} />

                    <View style={CommonStyles.LoginInputView}>
                      <TextInput
                        value={Password}
                        onChangeText={text => PasswordFunction(2, text.replace(/ /g, ''))}
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
                          marginTop: Commonheight(10)
                        },
                      ]}
                    ></View>

                    <View style={CommonStyles.LoginInputView}>
                      <TextInput
                        value={CPassword}
                        onChangeText={text => PasswordFunction(3, text.replace(/ /g, ''))}
                        placeholder={'Confirm Password'}
                        placeholderTextColor={
                          Commoncolor.CommonAppColor
                            ? Commoncolor.CommonAppColor
                            : Commoncolor.CommonBlackColor
                        }
                        secureTextEntry={ConfirmPasswordShowHide ? false : true}
                        style={CommonStyles.LoginInput}
                      />
                      <TouchableOpacity
                        onPress={() => ConfirmShowhidefunction()}
                        style={{ justifyContent: "center" }}
                      >
                        <Icon2
                          name={ConfirmPasswordShowHide ? "eye" : "eye-with-line"}
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
                          marginTop: Commonheight(10)
                        },
                      ]}
                    ></View>

                    <CommonTextInput
                      width={'80%'}
                      height={Commonheight(40)}
                      fontsize={Commonsize(15)}
                      value={Email}
                      onChangeText={text => PasswordFunction(4, text.replace(/ /g, ''))}
                      color={Commoncolor.CommonBlackColor}
                      placeholder={'Enter Your Email'}
                      placeholderTextColor={
                        Commoncolor.CommonAppColor
                      }
                      borderBottomColor={
                        Commoncolor.CommonAppColor
                      }
                    />

                    <View style={[
                      CommonStyles.LoginTouch3,
                      {
                        marginTop: Commonheight(25),
                        backgroundColor: Commoncolor.CommonAppColor,
                      },
                    ]}>

                      <TouchableOpacity
                        onPress={() => Validatefeilds()}
                        style={{ width: "100%", height: "100%", justifyContent: "center" }}>
                        <Text
                          style={[
                            CommonStyles.LoginTouchText2,
                            { color: Commoncolor.CommonWhiteColor },
                          ]}>
                          Get Otp
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}

                {CurrentPosition == 1 ? (
                  <>
                    <View style={{ width: "100%", height: Commonheight(20) }} />
                    <CommonTextInput
                      width={'80%'}
                      height={Commonheight(40)}
                      fontsize={Commonsize(15)}
                      value={OTP}
                      onChangeText={text => PasswordFunction(5, text.replace(/ /g, ''))}
                      color={Commoncolor.CommonBlackColor}
                      placeholder={'Enter Your OTP'}
                      placeholderTextColor={
                        Commoncolor.CommonAppColor
                      }
                      borderBottomColor={
                        Commoncolor.CommonAppColor
                      }
                    />
                    <View style={{ width: "100%", height: Commonheight(20) }} />

                    <View style={[
                      CommonStyles.LoginTouch3,
                      {
                        marginTop: Commonheight(25),
                        backgroundColor: Commoncolor.CommonAppColor
                      },
                    ]}>

                      <TouchableOpacity
                        onPress={() => OTPCheck()}
                        style={{ width: "100%", height: "100%", justifyContent: "center" }}>
                        <Text
                          style={[
                            CommonStyles.LoginTouchText2,
                            { color: Commoncolor.CommonWhiteColor },
                          ]}>
                          Verify OTP
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default SignUpPage;
