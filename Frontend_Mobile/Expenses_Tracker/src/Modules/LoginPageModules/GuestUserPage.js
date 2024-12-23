import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  ImageBackground,
  Linking,
} from 'react-native';


import { GlobalContext } from '../../../App';
import CommonStyles from '../../CommonFolder/CommonStyles';
import Commoncolor from '../../CommonFolder/CommonColor';
import { Commonwidth, Commonheight, Commonsize, } from '../../Utils/ResponsiveWidget';
import { Icon10, Icon2, Icon6, Icon7 } from '../../CommonFolder/CommonIcons';
import { CircularLoader, TextLoader } from '../../Components/Indicators';
import { Card } from '../../Components/Card';
import { useToast } from '../../Context/ToastProvider';
import logger from '../../Utils/logger';

const GuestUserPage = ({ navigation }) => {
  const [IsLoader, setIsLoader] = useState(false);
  const [AdvertisementDatas, setAdvertisementDatas] = useState([]);
  const [AnnouncementDatas, setAnnouncementDatas] = useState([]);
  const [greetings, setgreetings] = useState('');

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  const { showToast } = useToast();

  useEffect(() => {
    mainurl();
    greeting();
  }, []);

  const greeting = () => {
    var d = new Date();
    var time = d.getHours();
    if (time < 12) {
      setgreetings('Good Morning');
    } else if (time >= 12 && time <= 17) {
      setgreetings('Good Afternoon');
    } else if (time >= 17 && time <= 24) {
      setgreetings('Good Evening');
    } else {
      setgreetings('Good Morning');
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    Alert.alert('Confirmation', 'Are you sure you want to exit the app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  const mainurl = async () => {
    AdminAdvertisementRegistry_Select()
    AdminAdvertisementRegistry_Select1()
  };

  const AdminAdvertisementRegistry_Select = async () => {
    try {

      setIsLoader(true)

      const Url = cstate.KeyUrl + 'PortalGuestAdvertisement/';

      fetch(Url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(res => {

          var Status = res.Output.status;
          if (Status.code == '200') {
            setIsLoader(false);
            var AdvDatas = res.Output.data;
            setAdvertisementDatas(AdvDatas);

            cdispatch({ type: 'GuestAdvertisementDataDetails', payload: AdvDatas });
          } else {
            setIsLoader(false);
            setAdvertisementDatas([]);
          }
        },
        );
    } catch (error) {
      setIsLoader(false);
      logger.log(error);
    }
  };

  const AdminAdvertisementRegistry_Select1 = async () => {
    try {
      const Url = cstate.KeyUrl + 'PortalGuestAannouncement/';



      fetch(Url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(res => {

          var Status = res.Output.status;
          if (Status.code == '200') {
            setIsLoader(false);
            var AnnounceDatas = res.Output.data;
            setAnnouncementDatas(AnnounceDatas);
            cdispatch({
              type: 'GuestAnnouncementDataDetails',
              payload: AnnounceDatas,
            });
          } else {
            setIsLoader(false);
            setAnnouncementDatas([]);
          }
        },
        );
    } catch (error) {
      setIsLoader(false);
      logger.log(error);
    }
  };



  const ModuleLists = [
    {
      id: '1',
      name: 'Submit Request',
      icon: require("../../Assets/Images/Submit.png"),
      navigation: 'SubmitPage',
    },
    {
      id: '2',
      name: 'Track Request',
      icon: require("../../Assets/Images/Track.png"),
      navigation: 'TrackPage',
    },
    {
      id: '3',
      name: 'FeedBack',
      icon: require("../../Assets/Images/Feedback.png"),
      navigation: 'FeedBackPage',
    },
    {
      id: '4',
      name: 'My Units',
      icon: require("../../Assets/Images/Unit.png"),
      navigation: 'MyUnitsPage',
    },
    {
      id: '5',
      name: 'My Assets',
      icon: require("../../Assets/Images/Asset.png"),
      navigation: 'MyAssetsPage',
    },
    {
      id: '6',
      name: 'My Contracts',
      icon: require("../../Assets/Images/Contract.png"),
      navigation: 'MyContractsPage',
    },
    {
      id: '7',
      name: 'Billing Info',
      icon: require("../../Assets/Images/Billing.png"),
      navigation: 'BillingPage',
    },
    {
      id: '8',
      name: 'About Us',
      icon: require("../../Assets/Images/Aboutus.png"),
      navigation: 'AboutUsPage',
    },
  ];

  const Menufunctioncall = val => {
    let Contact = cstate.CommonWMContactNo1
      ? cstate.CommonWMContactNo1
      : cstate.CommonWMContactNo2
        ? cstate.CommonWMContactNo2
        : cstate.CommonWMContactNo3
          ? cstate.CommonWMContactNo3
          : '';

    let Email = cstate.CommonWMEmailAddress1
      ? cstate.CommonWMEmailAddress1
      : cstate.CommonWMEmailAddress2
        ? cstate.CommonWMEmailAddress2
        : '';

    if (val == 1) {
      UserAlert()
    } else if (val == 2) {
      navigation.navigate("SignUpPage")
    } else if (val == 3) {
      UserAlert()
    } else if (val == 4) {
      UserAlert()
    } else if (val == 5) {
      Linking.openURL(`tel:${Contact}`);
    } else if (val == 6) {
      Linking.openURL(`mailto:${Email}`);
    }
  };

  const UserAlert = () => {
    showToast({ message: 'Please login with user', type: 'error', position: 'bottom', duration: 3000 });
  }

  return (
    <View style={CommonStyles.CommonFlex}>
      <View
        style={[
          CommonStyles.HomeTopView,
          {
            backgroundColor: Commoncolor.CommonAppColor
              ? Commoncolor.CommonAppColor
              : Commoncolor.CommonBlackColor,
          },
        ]}>
        <View style={CommonStyles.HomeTopMainView}>
          <View style={CommonStyles.HomeTopSubView}>
            <TouchableOpacity onPress={() => Menufunctioncall(1)}>
              <Icon2
                name={'menu'}
                size={Commonsize(25)}
                style={CommonStyles.HomeTopIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={[CommonStyles.HomeTopSubView1, {}]}>
            <Image
              style={CommonStyles.HomeTopSubView1Image}
              source={require('../../Assets/Images/mainhelpdesk.png')}
            />
          </View>
        </View>

        <View style={CommonStyles.HomeTopMainView1}>
          <TouchableOpacity onPress={() => Menufunctioncall(2)}>
            <Icon6
              name={'user-plus'}
              size={Commonsize(20)}
              style={CommonStyles.HomeTopIcon}
            />
            <Text style={CommonStyles.HomeTopViewText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            <CircularLoader
              style={{ alignSelf: 'center' }}
              color={
                Commoncolor.CommonAppColor
                  ? Commoncolor.CommonAppColor
                  : Commoncolor.CommonBlackColor
              }
              size={40}
              dotSize={10}

            />
            <TextLoader
              contentStyle={{
                color: Commoncolor.CommonAppColor
                  ? Commoncolor.CommonAppColor
                  : Commoncolor.CommonBlackColor,
                fontSize: Commonsize(14),
                fontWeight: '400',
              }}
              content={'Please wait...'}
            />
          </View>
        </View>
      ) : (
        <View style={CommonStyles.HomeBottomMainView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                CommonStyles.HomeMiddleSubView,
                { marginTop: Commonheight(10) },
              ]}>
              <Text style={CommonStyles.HomeMiddleSubViewText1}>
                {greetings},{' '}
                <Text style={[CommonStyles.HomeMiddleSubViewText2, { color: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBlackColor, }]}>
                  Guest User
                </Text>
              </Text>
            </View>

            <View style={CommonStyles.HomeBottomSubView}>

              {AdvertisementDatas == [] ?

                <Card disabled={true} style={{ width: "95%", height: Commonheight(150), borderRadius: Commonwidth(10), alignSelf: "center", justifyContent: "space-evenly", backgroundColor: Commoncolor.CommonWhiteColor, shadowColor: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBlackColor }}>
                  <Image
                    style={{ width: Commonwidth(125), height: Commonheight(125), alignSelf: "center" }}
                    source={require("../../Assets/Images/noads1.jpg")}
                  />
                  <Text style={{ fontSize: Commonsize(18), fontWeight: "400", color: Commoncolor.CommonBlackColor, alignSelf: "center", letterSpacing: Commonwidth(0.3) }}>No Ads Posted!</Text>
                </Card>
                :
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {AdvertisementDatas.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => Menufunctioncall(3)}
                        style={{
                          marginTop: Commonheight(5),
                          justifyContent: 'center',
                          shadowColor: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBlackColor,
                        }}>
                        <ImageBackground
                          style={[CommonStyles.HomeAdvertiseImage, { marginLeft: Commonwidth(10), shadowColor: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBlackColor }]}
                          imageStyle={{ borderRadius: Commonwidth(10) }}
                          source={
                            item.FilePath
                              ? { uri: item.FilePath }
                              : require('../../Assets/Images/empty.jpeg')
                          }>
                          <Text
                            style={[
                              CommonStyles.HomeAdvertiseImageText1,
                              { fontSize: Commonsize(14), fontWeight: 'bold' },
                            ]}>
                            {item.AdvTitle}
                          </Text>
                          <Text
                            style={[
                              CommonStyles.HomeAdvertiseImageText1,
                              { fontSize: Commonsize(12), fontWeight: '400' },
                            ]}>
                            {item.AdvCategoryName}
                          </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              }
            </View>

            <View style={CommonStyles.HomeBottomSubView1}>
              {/* <FlatGrid
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: 'center',
                  height: Commonheight(170),
                }}
                itemDimension={Commonwidth(60)}
                data={ModuleLists}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => UserAlert()}
                    style={[CommonStyles.HomeBottomSubViewTouch, { shadowColor: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBlackColor }]}>
                    <Image
                      style={{ width: Commonwidth(28), height: Commonheight(28), alignSelf: 'center' }}
                      source={item.icon}
                    />
                    <Text style={[CommonStyles.HomeBottomSubViewText1, { color: Commoncolor.CommonBlackColor }]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              /> */}
            </View>

            <View style={[CommonStyles.HomeBottomSubView2, { justifyContent: "center" }]}>
              {AnnouncementDatas == [] ?

                <Card disabled={true} style={{ width: "95%", height: Commonheight(160), borderRadius: Commonwidth(10), alignSelf: "center", justifyContent: "space-evenly", backgroundColor: Commoncolor.CommonWhiteColor, shadowColor: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBlackColor }}>
                  <Image
                    style={{ width: Commonwidth(100), height: Commonheight(100), alignSelf: "center" }}
                    source={require("../../Assets/Images/noannouncement.png")}
                  />
                  <Text style={{ fontSize: Commonsize(16), fontWeight: "400", color: Commoncolor.CommonBlackColor, alignSelf: "center", letterSpacing: Commonwidth(0.3) }}>No New Announcements Today!</Text>
                </Card>
                :
                <>
                  <View style={CommonStyles.HomeAdvertisementTopView}>
                    <Text style={CommonStyles.HomeAdvertisementTopViewText1}>
                      Announcements
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Menufunctioncall(4);
                      }}
                      style={{ alignSelf: 'center' }}>
                      <Text
                        style={[
                          CommonStyles.HomeAdvertisementTopViewText2,
                          {
                            color: Commoncolor.CommonAppColor
                              ? Commoncolor.CommonAppColor
                              : Commoncolor.CommonBlackColor,
                          },
                        ]}>
                        View All
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {AnnouncementDatas.map((item, index) => {
                      return (
                        <View
                          style={[
                            CommonStyles.HomeBottomSubView2Div1,
                            { bottom: Commonheight(10) },
                          ]}>
                          <View style={[CommonStyles.HomeBottomSubView2Div2, { shadowColor: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBlackColor }]}>
                            <Image
                              style={CommonStyles.HomeAdvertisementImage}
                              source={
                                item.FilePath
                                  ? { uri: item.FilePath }
                                  : require('../../Assets/Images/empty.jpeg')
                              }
                            />

                            <Text
                              numberOfLines={1}
                              style={[
                                CommonStyles.HomeAdvertisementText,
                                {
                                  fontSize: Commonsize(10),
                                  fontWeight: 'bold',
                                  marginTop: Commonheight(5),
                                },
                              ]}>
                              {item.AdvTitle}
                            </Text>
                            <Text
                              style={[
                                CommonStyles.HomeAdvertisementText,
                                { fontSize: Commonsize(8), fontWeight: '500' },
                              ]}>
                              {item.AdvCategoryName}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </>
              }
            </View>

            <View style={CommonStyles.HomeLastMainView}>
              <TouchableOpacity
                onPress={() => {
                  Menufunctioncall(5);
                }}
                style={[
                  CommonStyles.HomeLastMainViewTouch,
                  {
                    backgroundColor: Commoncolor.CommonAppColor
                      ? Commoncolor.CommonAppColor
                      : Commoncolor.CommonBlackColor,
                  },
                ]}>
                <View style={CommonStyles.HomeLastSubView1}>
                  <View style={[CommonStyles.HomeLastSubView2, { width: '30%', alignSelf: "center" }]}>
                    <Icon10
                      name={'phone-in-talk'}
                      size={Commonsize(18)}
                      style={CommonStyles.HomeTopIcon}
                    />
                  </View>
                  <View style={[CommonStyles.HomeLastSubView2, { width: '60%', alignSelf: "center" }]}>
                    <Text style={CommonStyles.HomeLastSubViewText}>
                      Contact Us
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    CommonStyles.HomeLastSubView2,
                    { width: '20%', alignSelf: 'center' },
                  ]}>
                  <Icon7
                    name={'angle-right'}
                    size={Commonsize(15)}
                    style={CommonStyles.HomeTopIcon}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Menufunctioncall(6);
                }}
                style={[
                  CommonStyles.HomeLastMainViewTouch,
                  {
                    backgroundColor: Commoncolor.CommonAppColor
                      ? Commoncolor.CommonAppColor
                      : Commoncolor.CommonBlackColor,
                  },
                ]}>
                <View style={CommonStyles.HomeLastSubView1}>
                  <View style={[CommonStyles.HomeLastSubView2, { width: '30%', alignSelf: "center" }]}>
                    <Icon10
                      name={'email'}
                      size={Commonsize(18)}
                      style={CommonStyles.HomeTopIcon}
                    />
                  </View>
                  <View style={[CommonStyles.HomeLastSubView2, { width: '60%', alignSelf: "center" }]}>
                    <Text style={CommonStyles.HomeLastSubViewText}>
                      Email Us
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    CommonStyles.HomeLastSubView2,
                    { width: '20%', alignSelf: 'center' },
                  ]}>
                  <Icon7
                    name={'angle-right'}
                    size={Commonsize(15)}
                    style={CommonStyles.HomeTopIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={[CommonStyles.CommonEndView, {}]}></View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default GuestUserPage