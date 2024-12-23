import React, { useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';




// import StepIndicator from 'react-native-step-indicator-v2';



import { GlobalContext } from '../../../App';
import Commoncolor from '../../CommonFolder/CommonColor';
import { Commonheight, Commonsize, Commonwidth } from '../../Utils/ResponsiveWidget';
import CommonStyles from '../../CommonFolder/CommonStyles';
import { Icon1 } from '../../CommonFolder/CommonIcons';
import { CircularLoader, TextLoader } from '../../Components/Indicators';
import CommonTextInput from '../../CommonFolder/CommonTextInput';
import { decode as atob, encode as btoa } from 'react-native-base64';
import CommonAPISelectWOT from '../../APIMethods/CommonAPISelectWOT';
import { useToast } from '../../Context/ToastProvider';
import logger from '../../Utils/logger';


const ForgotPasswordPage = ({ navigation }) => {
  const [CurrentPosition, setCurrentPosition] = useState(0);
  const [Email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [Newpassword, setNewpassword] = useState('');
  const [Confirmpassword, setConfirmpassword] = useState('');
  const [IsLoader, setIsLoader] = useState(false);

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  const { showToast } = useToast();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  const GetOtp = async () => {
    setIsLoader(true);

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(Email) === false) {


      showToast({ message: "Please enter valid email id", type: 'error', position: 'bottom', duration: 3000 });

      setIsLoader(false);
    } else {

      let Url = cstate.KeyUrl + 'FPU7S3/';

      let param = {
        email: Email,
      };

      await CommonAPISelectWOT(Url, param)
        .then(async res => {
          let status = res.Output.status;
          if (status.code == '400') {
            setIsLoader(false);
            showToast({ message: "Check your email ID and Try Again", type: 'error', position: 'bottom', duration: 3000 });
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
    }
  };

  const OTPCheck = async () => {
    setIsLoader(false);
    if (OTP == '') {
      showToast({ message: "Please enter the otp code", type: 'error', position: 'bottom', duration: 3000 });
      setIsLoader(false);
    } else {

      let Url = cstate.KeyUrl + 'FPU9S3/';

      let params = {
        data: {
          SecurityCode_int: OTP,
          UserEmail_varchar: Email,
          Password_varchar: '',
        },
      };

      await CommonAPISelectWOT(Url, params)
        .then(async res => {
          let status = res.Output.status;
          if (status.message == 'Email or OTP Invalid') {
            setIsLoader(false);
            showToast({ message: "Email or OTP Invalid", type: 'error', position: 'bottom', duration: 3000 });

          } else {
            setIsLoader(false);
            showToast({ message: "Please Set the New Password", type: 'error', position: 'bottom', duration: 3000 });

            setCurrentPosition(2);
          }
        })
        .catch(error => {
          setIsLoader(false);
          logger.log(error);
        });
    }
  };

  const ChangePassword = async () => {
    setIsLoader(true);
    if (Newpassword == '' || Newpassword == undefined) {

      showToast({ message: "Kindly enter new password", type: 'error', position: 'bottom', duration: 3000 });

      setIsLoader(false);
    } else if (Confirmpassword == '' || Confirmpassword == undefined) {
      setIsLoader(false);


      showToast({ message: "Kindly enter confirm password", type: 'error', position: 'bottom', duration: 3000 });

    } else if (Newpassword.length <= 5) {
      setIsLoader(false);

      showToast({ message: "Password should be minimum of six characters", type: 'error', position: 'bottom', duration: 3000 });

    } else if (Newpassword != Confirmpassword) {
      setIsLoader(false);

      showToast({ message: "Password mismatched", type: 'error', position: 'bottom', duration: 3000 });

    } else {

      let Url = cstate.KeyUrl + 'FPU9S3/';

      let params = {
        data: {
          SecurityCode_int: OTP,
          UserEmail_varchar: Email,
          Password_varchar: btoa(Newpassword),
        },
      };

      await CommonAPISelectWOT(Url, params)
        .then(async res => {


          let status = res.Output.status;

          if (status.code == '400') {
            setIsLoader(false);
            showToast({ message: "Something went wrong", type: 'error', position: 'bottom', duration: 3000 });

          } else {
            setIsLoader(false);
            navigation.navigate('LoginPage');
            showToast({ message: "The password is Reset successfully", type: 'success', position: 'bottom', duration: 3000 });

          }
        })
        .catch(error => {
          setIsLoader(false);
          logger.log(error);
        });
    }
  };

  const labels = [
    'Verify Email ID',
    'Verify Confirmation Code',
    'Reset Password',
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
      setEmail(val);
    } else if (index == 2) {
      setOTP(val);
    } else if (index == 3) {
      setNewpassword(val);
    } else if (index == 4) {
      setConfirmpassword(val);
    } else {
      logger.log('No Password Function');
    }
  };

  const PasswordSubmit = val => {

    if (val == 1) {
      GetOtp();
    } else if (val == 2) {
      OTPCheck();
    } else if (val == 3) {
      ChangePassword();
    } else {
      logger.log('No PasswordSubmit');
    }
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
          Forgot Password
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
                stepCount={3}
                currentPosition={CurrentPosition}
                labels={labels}
              /> */}
            </View>
            <View
              style={{
                width: '100%',
                height: Commonheight(100),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  color: Commoncolor.CommonBlackColor,
                  fontSize: Commonsize(14),
                  letterSpacing: Commonwidth(0.3),
                  lineHeight: Commonheight(25),
                  fontWeight: '400',
                }}>
                {CurrentPosition == 0 ? "Please enter the email address you'd like your password reset information sent to" : CurrentPosition == 1 ? "Please enter the received OTP to Set New Password" : "New Password should be in minimum six characters, and New Password and Confirm Password Should be Same"}
              </Text>
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
                  height: Commonheight(250),
                  justifyContent: 'space-evenly',
                }}>
                {CurrentPosition == 0 ? (
                  <>
                    <CommonTextInput
                      width={'80%'}
                      height={Commonheight(40)}
                      fontsize={Commonsize(15)}
                      value={Email}
                      onChangeText={text => PasswordFunction(1, text.replace(/ /g, ''))}
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
                        backgroundColor: Commoncolor.CommonAppColor
                      },
                    ]}>

                      <TouchableOpacity
                        onPress={() => PasswordSubmit(1)}
                        style={{ width: "100%", height: "100%", justifyContent: "center" }}>
                        <Text
                          style={[
                            CommonStyles.LoginTouchText2,
                            { color: Commoncolor.CommonWhiteColor },
                          ]}>
                          Verify Email
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}

                {CurrentPosition == 1 ? (
                  <>
                    <CommonTextInput
                      width={'80%'}
                      height={Commonheight(40)}
                      fontsize={Commonsize(15)}
                      value={OTP}
                      onChangeText={text => PasswordFunction(2, text.replace(/ /g, ''))}
                      color={Commoncolor.CommonBlackColor}
                      placeholder={'Enter Your OTP'}
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
                        backgroundColor: Commoncolor.CommonAppColor
                      },
                    ]}>

                      <TouchableOpacity
                        onPress={() => PasswordSubmit(2)}
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

                {CurrentPosition == 2 ? (
                  <>
                    <CommonTextInput
                      width={'80%'}
                      height={Commonheight(40)}
                      fontsize={Commonsize(15)}
                      value={Newpassword}
                      onChangeText={text => PasswordFunction(3, text.replace(/ /g, ''))}
                      color={Commoncolor.CommonBlackColor}
                      placeholder={'Enter Your New Password'}
                      placeholderTextColor={
                        Commoncolor.CommonAppColor
                      }
                      borderBottomColor={
                        Commoncolor.CommonAppColor
                      }
                    />

                    <CommonTextInput
                      width={'80%'}
                      height={Commonheight(40)}
                      fontsize={Commonsize(15)}
                      value={Confirmpassword}
                      onChangeText={text => PasswordFunction(4, text.replace(/ /g, ''))}
                      color={Commoncolor.CommonBlackColor}
                      placeholder={'Enter Your Confirm Password'}
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
                        backgroundColor: Commoncolor.CommonAppColor
                      },
                    ]}>

                      <TouchableOpacity
                        onPress={() => PasswordSubmit(3)}
                        style={{ width: "100%", height: "100%", justifyContent: "center" }}>
                        <Text
                          style={[
                            CommonStyles.LoginTouchText2,
                            { color: Commoncolor.CommonWhiteColor },
                          ]}>
                          Change Password
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

export default ForgotPasswordPage;
