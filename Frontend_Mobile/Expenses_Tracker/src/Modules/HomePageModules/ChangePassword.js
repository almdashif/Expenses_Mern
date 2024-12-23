import React, { useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  BackHandler,
} from 'react-native';
import { Card } from 'native-base';
import { GlobalContext } from '../../../App';
import Commoncolor from '../../CommonFolder/CommonColor';
import {
  Commonheight,
  Commonsize,
  Commonwidth,
} from '../../CommonFolder/CommonDimensions';
import CommonStyles from '../../CommonFolder/CommonStyles';
import Icon0 from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import { CommonParams } from '../../APIMethods/CommonAPIParams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonAPISelectWT from '../../APIMethods/CommonAPISelectWT';
import { CirclesLoader, TextLoader } from 'react-native-indicator';
import { BottomSheet } from 'react-native-btr';
import CommonGridView from '../../CommonFolder/CommonGridView';
import CommonTextInput from '../../CommonFolder/CommonTextInput';
import { decode as atob, encode as btoa } from "react-native-base64";
import LinearGradient from 'react-native-linear-gradient';
import CommonAPISelectWOT from '../../APIMethods/CommonAPISelectWOT';
import { useToast } from '../../Context/ToastProvider';
import logger from '../../Utils/logger';
const ChangePassword = ({ navigation }) => {
  const [OldPassword, setOldPassword] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
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

  const PasswordFunction = (index, val) => {
   
    if (index == 1) {
      setOldPassword(val);
    } else if (index == 2) {
      setNewPassword(val);
    } else if (index == 3) {
      setConfirmPassword(val);
    } else {
      logger.log('PasswordFunction');
    }
  };

  const PasswordSubmit = async () => {
    setIsLoader(true);

    const TokenId = await AsyncStorage.getItem('TokenID');
    const TokenName = await AsyncStorage.getItem('TokenName');
    
    const MainUrl = await AsyncStorage.getItem('KeyUrl');

    if (OldPassword == '' || OldPassword == undefined) {
      showToast({ message: "Kindly enter your old password", type: 'error', position: 'bottom', duration: 3000 });

    
      setIsLoader(false);
    } else if (NewPassword == '' || NewPassword == undefined) {
      showToast({ message: "Kindly enter your new password", type: 'error', position: 'bottom', duration: 3000 });


      setIsLoader(false);
    } else if (NewPassword.length <= 5) {
      showToast({ message: "Password should be minimum of six characters", type: 'error', position: 'bottom', duration: 3000 });

      setIsLoader(false);
    } else if (ConfirmPassword != NewPassword) {

      showToast({ message: "Password mismatched", type: 'error', position: 'bottom', duration: 3000 });

      setIsLoader(false);
    } else {
      let params = {
        data: {
          UserID: cstate.UserID,
          OldPassword: btoa(OldPassword),
          NewPassword: btoa(NewPassword),
          ConfirmPassword: btoa(ConfirmPassword),
        },
      };

      var Url = cstate.KeyUrl + 'FPU8S3/';

      await CommonAPISelectWT(Url, params, TokenId, TokenName)
        .then(async res => {
          let status = res.Output.status;
          if (status.code == 200) {
            const password = JSON.stringify(NewPassword);  
            LogoutFunction()       
          } else {
            setIsLoader(false);
            navigation.navigate('ChangePassword');
            showToast({ message: "Old password is not correct please enter the correct password", type: 'error', position: 'bottom', duration: 3000 });
          }
        })
        .catch(error => {
          setIsLoader(false);
          logger.log(error);
        });
    }
  };

  

  const LogoutFunction = async () => {
    const SetEntityKey = await AsyncStorage.getItem("SetEntityKey");
    // let Url = cstate.KeyUrl + "CommonCustomUpdate/";  old
    // let params = { data: { SessionID: cstate.SessionID } };  old
    let Url = cstate.KeyUrl + "FPU17S3/";

    let params = 
    {
      "data": {
        "p1": cstate.UserID,
        "p2": cstate.SessionID
      }
    }

    await CommonAPISelectWOT(Url, params)
      .then(async (res) => {
        const status = res.Output.status;
        if (status.code == 200) {
          setIsLoader(false);
          AsyncStorage.setItem("UserID", "");
          AsyncStorage.setItem("SessionID", "");
          AsyncStorage.setItem("UserName", "");
          AsyncStorage.setItem("UserEmail", "");
          // navigation.navigate("LoginPage");
          navigation.navigate("WebViewPage", {"EntityKey" : SetEntityKey});
          showToast({ message: "Password has been changed successfully", type: 'success', position: 'bottom', duration: 3000 });
        } else {
          navigation.navigate('MainContainerModule');
          showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
        }
      })
      .catch((error) => {
        navigation.navigate('MainContainerModule');
        logger.log(error);
      });
  };

  return (
    <View style={CommonStyles.CommonFlex}>
      <LinearGradient
        useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }} colors={[Commoncolor.CommonAppColor,Commoncolor.CommonAppColor,Commoncolor.CommonAppColor]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[CommonStyles.CommonHeaderView2]}>

        <TouchableOpacity
          onPress={() => backAction()}
          style={CommonStyles.CommonHeaderViewTouch}>
          <Icon0
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
          Change Password
        </Text>
      </LinearGradient>
      <View style={CommonStyles.CommonHeaderView3}>
        {/* <View style={CommonStyles.CommonHeaderTop} /> */}
        {IsLoader == true ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: Commoncolor.CommonBackgroundColor,
            }}>
            <View
              style={{
                width: '100%',
                height: Commonheight(100),
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <CirclesLoader
                style={{ alignSelf: 'center' }}
                color={
                  Commoncolor.CommonAppColor
                }
                dotRadius={10}
                size={40}
              />
              <TextLoader
                textStyle={{
                  color: Commoncolor.CommonAppColor,
                  fontSize: Commonsize(14),
                  fontWeight: '400',
                }}
                text={'Please wait...'}
              />
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flex: 0.5, justifyContent: "space-evenly" }}>
              <CommonTextInput
                width={'80%'}
                height={Commonheight(40)}
                fontsize={Commonsize(15)}
                value={OldPassword}
                onChangeText={text => PasswordFunction(1, text.replace(/ /g, ''))}
                color={Commoncolor.CommonBlackColor}
                placeholder={'Old Password'}
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
                value={NewPassword}
                onChangeText={text => PasswordFunction(2, text.replace(/ /g, ''))}
                color={Commoncolor.CommonBlackColor}
                placeholder={'New Password'}
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
                value={ConfirmPassword}
                onChangeText={text => PasswordFunction(3, text.replace(/ /g, ''))}
                color={Commoncolor.CommonBlackColor}
                placeholder={'Confirm Password'}
                placeholderTextColor={
                  Commoncolor.CommonAppColor
                }
                borderBottomColor={
                  Commoncolor.CommonAppColor
                }
              />

              <LinearGradient
                useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5 }} colors={[Commoncolor.CommonAppColor,Commoncolor.CommonAppColor,Commoncolor.CommonAppColor]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                  CommonStyles.LoginTouch3,
                  {
                    marginTop: Commonheight(25),
                  },
                ]}>

                <TouchableOpacity
                  onPress={() => PasswordSubmit()}
                  style={{ width: "100%", height: "100%", justifyContent: "center" }}>
                  <Text
                    style={[
                      CommonStyles.LoginTouchText2,
                      { color: Commoncolor.CommonWhiteColor },
                    ]}>
                    Change Password
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ChangePassword;
