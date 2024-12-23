import React, { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  BackHandler,
  Alert,
  ImageBackground,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Platform,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CommonAPISelectWT from "../../APIMethods/CommonAPISelectWT";



import { AdvParams } from "../../APIMethods/CommonAPIParams";
import Video from 'react-native-video';
import { format } from "date-fns";
import { GlobalContext } from "../../../App";
import CommonAPISelectWOT from "../../APIMethods/CommonAPISelectWOT";
import CommonStyles from "../../CommonFolder/CommonStyles";
import Commoncolor from "../../CommonFolder/CommonColor";
import CommonCard from "../../Components/CommonCard";
import { Commonheight, Commonsize, Commonwidth } from "../../Utils/ResponsiveWidget";

import { useNavigation } from "@react-navigation/native";
import { CircularLoader, EqualizerBarLoader, TextLoader } from "../../Components/Indicators";
import SkeletonSkimmer from "../../Components/Skimmer";
import delay from "../../Utils/delay";
import { Icon2, Icon5, Icon10, Icon11, Icon9, } from "../../CommonFolder/CommonIcons";
import { useToast } from "../../Context/ToastProvider";
import logger from "../../Utils/logger";


const HomePage = () => {
  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;
  const [IsLoader, setIsLoader] = useState(true);
  const [IsLoaderLogOut, setIsLoaderLogOut] = useState(false);
  const [slidermenu, setslidermenu] = useState(false);
  const [Deactivate, setDeactivate] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [playingMedia, setPlayingMedia] = useState({ type: null, index: null });
  const [playingMedia1, setPlayingMedia1] = useState({ type: null, index: null });
  const [CurrentDateTime, setCurrentDateTime] = useState([])

  const navigation = useNavigation()

  const { showToast } = useToast();

  const videoRef = useRef(null);
  const videoRef1 = useRef(null);
  const audioRef = useRef(null);
  const audioRef1 = useRef(null);



  useEffect(() => {
    cdispatch({ type: 'Scanresult', payload: "" })
    cdispatch({ type: "SubmitMediaDatas", payload: [] });
    cdispatch({ type: "SubmitPageImage", payload: [] });
    cdispatch({ type: "SubmitPageAudio", payload: [] });
    cdispatch({ type: "SubmitPageVideo", payload: [] });
    cdispatch({ type: "SubmitPageSign", payload: [] });

    ServicerequestApiCall()
    mainurl();

  }, []);


  useEffect(() => {
    getCurrentDateTime();
    const interval = setInterval(() => {
      getCurrentDateTime();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const mainurl = async () => {
    await cdispatch({ type: "DecodedName", payload: cstate.UserName });
    await LoginAuthentication(cstate.UserName);
  };


  const getCurrentDateTime = () => {

    let today = new Date()

    const time = format(today, 'hh:mm a');
    const month = format(today, 'MMMM')?.slice(0, 3)
    const date = format(today, 'dd')
    const day = format(today, 'EEEE')?.slice(0, 3);
    setCurrentDateTime([{
      month,
      date,
      day,
      time
    }])

  }

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

  const toggleVideoPlay = (index, val) => {

    if (playingMedia.type === 'audio' || playingMedia1.type != '') {
      setPlayingMedia({ type: null, index: null });
      setPlayingMedia1({ type: null, index: null });
    }
    if (playingMedia.type === 'video' && playingMedia.index === index) {
      setPlayingMedia({ type: null, index: null });
    } else {
      setPlayingMedia1({ type: null, index: null });
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
      setPlayingMedia(prevState => ({
        type: 'video',
        index: index
      }));
    }
  };

  const toggleVideoPlay1 = (index, val) => {

    if (playingMedia1.type === 'audio' || playingMedia.type != '') {
      setPlayingMedia({ type: null, index: null });
      setPlayingMedia1({ type: null, index: null });
    }
    if (playingMedia1.type === 'video' && playingMedia1.index === index) {
      setPlayingMedia1({ type: null, index: null });
    } else {
      setPlayingMedia({ type: null, index: null });
      if (videoRef1.current) {
        videoRef1.current.seek(0);
      }
      setPlayingMedia1(prevState => ({
        type: 'video',
        index: index
      }));

    }
  };

  const toggleAudioPlay = (index, val) => {

    if (playingMedia.type === 'video' || playingMedia1.type != '') {
      setPlayingMedia({ type: null, index: null });
      setPlayingMedia1({ type: null, index: null });
    }
    if (playingMedia.type === 'audio' && playingMedia.index === index) {
      setPlayingMedia({ type: null, index: null });
    } else {
      if (audioRef.current) {
        audioRef.current.seek(0);
      }
      setPlayingMedia(prevState => ({
        type: 'audio',
        index: index
      }));
    }
  };

  const toggleAudioPlay1 = (index, val) => {

    if (playingMedia1.type === 'video' || playingMedia.type != '') {
      setPlayingMedia({ type: null, index: null });
      setPlayingMedia1({ type: null, index: null });
    }
    if (playingMedia1.type === 'audio' && playingMedia1.index === index) {
      setPlayingMedia1({ type: null, index: null });
    } else {
      if (audioRef1.current) {
        audioRef1.current.seek(0);
      }
      setPlayingMedia1(prevState => ({
        type: 'audio',
        index: index
      }));
    }
  };

  const onRefresh = React.useCallback(() => {
    setIsLoader(true)
    setRefreshing(true);
    ServicerequestApiCall();
    mainurl();
    delay(1000).then(() => { setRefreshing(false); setIsLoader(false) });
  }, []);

  const LoginAuthentication = async () => {


    let Url = cstate.KeyUrl + "FPU19S3/";
    let SessionId = cstate.SessionID;
    let ProductID = await AsyncStorage.getItem("ProductID")
    let xRefreshToken = await AsyncStorage.getItem("xRefreshToken")

    let params = {
      p1: cstate.UserID,
      p2: SessionId,
      p3: ProductID,
      p4: xRefreshToken
    };

    await CommonAPISelectWOT(Url, params)
      .then(async (res) => {
        res.TokenIDPK ?? 0
        if (
          res.TokenIDPK == ""
        ) {
          // setIsLoader(false);
          showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
          return false;
        } else {
          var mytknid = JSON.stringify(res.TokenIDPK);
          var mytknname = res.TokenName;

          AsyncStorage.setItem("TokenID", mytknid);
          AsyncStorage.setItem("TokenName", mytknname);
          AsyncStorage.setItem("xAccessToken", res.p15);
          AsyncStorage.setItem("xRefreshToken", res.p16);

          cdispatch({ type: "TokenID", payload: mytknid });
          cdispatch({ type: "TokenName", payload: mytknname });
          AdminAdvertisementRegistry_Select_Count(mytknid, mytknname)
          AdminAdvertisementRegistry_Select(mytknid, mytknname);
          // AdminAdvertisementRegistry_Select1(mytknid, mytknname);

        }
      })
      .catch((error) => {
        setIsLoader(false);
        logger.log(error);
      });
  };

  const AdminAdvertisementRegistry_Select_Count = async (tokenID, tokenName) => {

    try {

      const url = `${cstate.KeyUrl}FP802S3/`;
      const params = {
        data: {
          ...AdvParams,
          p89: 1,
          p90: 10,
          p91: "ADVCOUNT",
          p92: null,
          p93: null,
          p94: cstate.UserGroupID,
          p95: cstate.UserID,
        },
      };
      const res = await CommonAPISelectWT(url, params, tokenID, tokenName);

      const status = res.Output.status;
      if (status.code === "200") {

        const ResponseDatas = res.Output.data;

        const storedDataMap = new Map(cstate.TotalCombainedCountData.map(item => [item.AdminAdvertisementIDPK, item]));

        const mergedData = ResponseDatas.map(apiItem => {
          const matchedItem = storedDataMap.get(apiItem.AdminAdvertisementIDPK);
          if (matchedItem) {
            return matchedItem;
          } else {
            return {
              ...apiItem,
              View: "1"
            };
          };
        })


        if (mergedData.length > 0) {

          const Advertisements_Count = mergedData.filter(item => item.AdvCategoryName === "Advertisement");
          const Announcements_Count = mergedData.filter(item => item.AdvCategoryName === "Announcement");

          cdispatch({ type: "ShowAdvertisementCount", payload: Advertisements_Count });
          cdispatch({ type: "ShowAnnouncementCount", payload: Announcements_Count });

          try {
            await AsyncStorage.setItem('ShowAdvertisementCount', JSON.stringify(Advertisements_Count));
          } catch (error) {
            logger.error('Error storing data', error);
          }

          try {
            await AsyncStorage.setItem('ShowAnnouncementCount', JSON.stringify(Announcements_Count));
          } catch (error) {
            logger.error('Error storing data', error);
          }

          const ADVCount = Advertisements_Count.filter(item => item.View === "1").length;
          const ANNOCount = Announcements_Count.filter(item => item.View === "1").length;

          cdispatch({ type: "ShowTotalCount", payload: ADVCount + ANNOCount });

        }
        else {
          logger.log("No Data Available")
        }

      } else {
        logger.log("400 Bad Request")
      }
    } catch (error) {
      logger.error(error);
    }
  };

  const AdminAdvertisementRegistry_Select = async (tokenID, tokenName) => {
    try {

      let url = cstate.KeyUrl + 'FPC13S3/';


      const params = {
        data: {
          p1: null,
          p2: null,
          p3: null,
          p4: null,
          p5: null,
          p6: null,
          p7: '', //search by word
          p8: null,
          p9: null,
          p10: "",
          p11: "",
          p12: "",
          p13: null,
          p14: 1,
          p15: 100,
          p16: "ADVANNOUNCE",
          p17: cstate.UserGroupID,
          p18: cstate.UserID,
        },
      };
      const res = await CommonAPISelectWT(url, params, tokenID, tokenName);

      const status = res.Output?.status;
      const advDatas = res.Output?.data;
      if (status.code === "200") {



        const advertisements = advDatas?.filter(item => item.AdvCategoryName === "Advertisement");

        const Announcements = advDatas?.filter(item => item.AdvCategoryName == "Announcement");

        if (advertisements.length !== cstate.AdvertisementData?.length) {
          cdispatch({ type: "AdvertisementData", payload: advertisements });

          const updateDispatch = (type, filterCondition) => {
            const filteredData = advertisements.filter(filterCondition);
            cdispatch({ type, payload: filteredData.length > 0 ? filteredData : [] });
          };
          updateDispatch("Advertisement_images", item => item.FileType == "image");
          updateDispatch("Advertisement_audio", item => item.FileType == "audio");
          updateDispatch("Advertisement_video", item => item.FileType == "video");

        } else { logger.log("Nothing new to display"); }

        if (Announcements.length != cstate.AnnouncementData.length) {
          cdispatch({ type: "AnnouncementData", payload: Announcements });

          const updateDispatch = (type, filterCondition) => {
            const filteredData = Announcements.filter(filterCondition);
            cdispatch({ type, payload: filteredData.length > 0 ? filteredData : [] });
          };
          updateDispatch("Announcement_images", item => item.FileType == "image");
          updateDispatch("Announcement_audio", item => item.FileType == "audio");
          updateDispatch("Announcement_video", item => item.FileType == "video");
        } else { logger.log("Nothing new to display"); }
        setIsLoader(false)
      } else {
        cdispatch({ type: "AdvertisementData", payload: [] });
      }
    } catch (error) {
      setIsLoader(false);
      logger.error(error);
    }
  };




  const ServicerequestApiCall = async () => {
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
          p7: null, //search by word
          p8: null,  // complaint id
          p9: null,   //10 for feedback data
          p10: "",
          p11: "",
          p12: "",  // start date filter
          p13: null,  // end date filter
          p14: 1,
          p15: 100,
          p16: "RAISESERVICEREQUEST",
          p17: cstate.UserGroupID,
          p18: cstate.UserID,
        },
      };



      await CommonAPISelectWOT(Url, params).then(async (res) => {


        var Data = res?.Output?.data;
        var Status = res.Output.status;


        if (Status.code == '200' || Status.code == 200) {
          cdispatch({ type: "ServiceRequestData", payload: Data });
        }
        else {
          cdispatch({ type: "ServiceRequestData", payload: [] });
          showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
        }
        setIsLoader(false)
      });
    } catch (error) {
      logger.log(error);
      cdispatch({ type: "ServiceRequestData", payload: [] });
      showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
    }
  };


  const LogoutFunction = async () => {
    setIsLoaderLogOut(true);
    const SetEntityKey = await AsyncStorage.getItem("SetEntityKey");

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
          setIsLoaderLogOut(false);
          AsyncStorage.setItem("UserID", "");
          AsyncStorage.setItem("SessionID", "");
          AsyncStorage.setItem("UserName", "");
          AsyncStorage.setItem("UserEmail", "");

          navigation.navigate("WebViewPage", { "EntityKey": SetEntityKey });
          showToast({ message: "Successfully Logged Out", type: 'success', position: 'bottom', duration: 3000 });
        } else {
          setIsLoaderLogOut(false);
          showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
        }
      })
      .catch((error) => {
        setIsLoaderLogOut(false);
        logger.log(error);
      });
  };

  const drawerModuleComponentsList = [
    {
      name: 'Home',
      navigation: () => { setslidermenu(false); },
      icon: <Icon2 name={"home"} size={Commonsize(20)} style={{ color: Commoncolor.darkblue }} />

    },
    {
      name: 'Track',
      navigation: () => { cdispatch({ type: "FeedbackChanged", payload: !cstate.FeedbackChanged }); setslidermenu(false); cdispatch({ type: 'BottomNavigationTab', payload: 1 }) },
      icon: <Icon10 name={"file-document-multiple"} size={Commonsize(20)} style={{ color: Commoncolor.darkblue }} />

    },
    {
      name: 'Feedback',
      navigation: () => { cdispatch({ type: 'BottomNavigationTab', payload: 2 }); setslidermenu(false); },
      icon: <Icon11 name={"verified"} size={Commonsize(20)} style={{ color: Commoncolor.darkblue }} />

    },
    {
      name: 'About us',
      navigation: () => { cdispatch({ type: 'BottomNavigationTab', payload: 3 }); setslidermenu(false); },
      icon: <Icon9 name={"information-circle"} size={Commonsize(20)} style={{ color: Commoncolor.darkblue }} />

    },
    {
      name: 'Change Location',
      navigation: () => { setslidermenu(false); navigation.navigate('ChangeLocationPage') },
      icon: <Icon2 name={"location"} size={Commonsize(20)} style={{ color: Commoncolor.darkblue }} />

    },
    {
      name: 'Log Out',
      navigation: () => { setslidermenu(false); Menufunctioncall(7) },
      icon: <Icon5 name={"sign-out"} size={Commonsize(20)} style={{ color: Commoncolor.darkblue }} />

    },

  ]

  const Menufunctioncall = async (val) => {

    if (val == 1) {
      setslidermenu(!slidermenu);
    } else if (val == 2) {
      navigation.navigate("ApprovalPage");
    } else if (val == 3) {
      navigation.navigate("Advertisement");
    } else if (val == 4) {
      navigation.navigate("Announcement");
    } else if (val == 7) {
      Alert.alert(
        "Confirmation",
        "Do you want to logout?",
        [
          {
            text: "No",
            onPress: () => logger.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              LogoutFunction()
            },
          },
        ],
        { cancelable: false }
      )


    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Commoncolor.CommonAppColor ? Commoncolor.CommonAppColor : Commoncolor.CommonBackgroundColor }}>



      {IsLoader == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: Commoncolor.CommonBackgroundColor,
          }}
        >

          <ScrollView showsVerticalScrollIndicator={false} >

            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingHorizontal: Commonwidth(10), paddingRight: Commonwidth(15), paddingVertical: Commonheight(15), }}>
              <SkeletonSkimmer height={Commonheight(30)} width={Commonwidth(40)} style={{ borderRadius: Commonsize(10) }} />
              <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(140)} style={{ marginLeft: Commonwidth(-80), borderRadius: Commonsize(10) }} />
              <SkeletonSkimmer height={Commonheight(30)} width={Commonwidth(40)} style={{ borderRadius: Commonsize(10) }} />
            </View>


            {/* Second Container  */}
            <View>
              <View style={{ width: '95%', minHeight: Commonheight(50), alignSelf: 'flex-end', justifyContent: 'center', paddingVertical: Commonheight(5) }}>
                <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(160)} style={{ borderRadius: Commonsize(10), marginBottom: Commonheight(10) }} />
                <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(100)} style={{ borderRadius: Commonsize(10) }} />

              </View>

              <SkeletonSkimmer height={Commonheight(60)} width={Commonwidth(260)} style={{ borderRadius: Commonsize(10), marginVertical: Commonheight(10), alignSelf: 'center' }} />

            </View>


            {/* Third Container */}

            <View View style={{ width: '95%', minHeight: Commonheight(100), alignSelf: "flex-end", paddingBottom: Commonheight(10) }}>

              <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(160)} style={{ borderRadius: Commonsize(10), marginVertical: Commonheight(10), }} />


              <View style={{ width: '100%', flexDirection: 'row' }}>

                <SkeletonSkimmer height={Commonheight(80)} width={Commonwidth(80)} style={{ borderRadius: Commonsize(10), marginRight: Commonwidth(20), marginBottom: Commonheight(10), alignSelf: 'center' }} />
                <SkeletonSkimmer height={Commonheight(80)} width={Commonwidth(80)} style={{ borderRadius: Commonsize(10), marginRight: Commonwidth(20), marginBottom: Commonheight(10), alignSelf: 'center' }} />
                <SkeletonSkimmer height={Commonheight(80)} width={Commonwidth(80)} style={{ borderRadius: Commonsize(10), marginRight: Commonwidth(20), marginBottom: Commonheight(10), alignSelf: 'center' }} />

              </View>

            </View>


            {/* Fourth Container Advertisement  */}
            <View style={{ width: '95%', height: Commonheight(170), alignSelf: "flex-end", paddingBottom: Commonheight(10), }}>

              <View style={{ width: '100%', minHeight: Commonheight(25), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Commonheight(10) }}>
                <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(160)} style={{ borderRadius: Commonsize(10), }} />
                <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(60)} style={{ borderRadius: Commonsize(10), marginRight: Commonwidth(10) }} />
              </View>
              <SkeletonSkimmer height={Commonheight(100)} width={Commonwidth(300)} style={{ borderRadius: Commonsize(10), marginBottom: Commonheight(5), }} />
            </View>

            {/* Fifth Container announcement */}
            <View style={{ width: '95%', height: Commonheight(170), alignSelf: "flex-end", paddingBottom: Commonheight(10), }}>

              <View style={{ width: '100%', minHeight: Commonheight(25), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Commonheight(10) }}>
                <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(160)} style={{ borderRadius: Commonsize(10), }} />
                <SkeletonSkimmer height={Commonheight(20)} width={Commonwidth(60)} style={{ borderRadius: Commonsize(10), marginRight: Commonwidth(10) }} />
              </View>
              <SkeletonSkimmer height={Commonheight(100)} width={Commonwidth(300)} style={{ borderRadius: Commonsize(10), marginBottom: Commonheight(5), }} />
            </View>

          </ScrollView>

        </View>
      ) : IsLoaderLogOut == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: Commoncolor.CommonBackgroundColor,
          }}
        >
          <View
            style={{
              width: "100%",
              height: Commonheight(100),
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <CircularLoader
              color={Commoncolor.CommonAppColor}
              dotRadius={8}
              size={30}
            />
            <TextLoader
              contentStyle={{
                fontSize: Commonsize(14),
                fontWeight: "400",
              }}
              color={Commoncolor.CommonAppColor}
              content={Deactivate ? "please wait..." : " Please wait while loging out"}
            />


          </View>
        </View>
      ) : (
        <>
          <ImageBackground
            source={require('../../Assets/Images/HomeBg.jpg')}
            resizeMode='stretch'
            style={{ flex: 1, backgroundColor: '#fff' }}>



            {/* First Container navbar */}
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingHorizontal: Commonwidth(10), paddingRight: Commonwidth(15), paddingVertical: Commonheight(15), }}>
              <TouchableOpacity onPress={() => Menufunctioncall(1)} style={{ marginLeft: Commonsize(5) }}>
                <Icon2 name={"menu"} size={Commonsize(25)} style={[CommonStyles.HomeTopIcon, { color: Commoncolor.darkblue }]} />
              </TouchableOpacity>

              <View style={{ width: '70%', }}>
                <Text style={{ fontSize: Commonsize(16), color: Commoncolor.darkblue, fontWeight: '500' }}>Smart Helpdesk</Text>
              </View>

              <TouchableOpacity onPress={() => Menufunctioncall(7)} style={{}}>
                <Icon2 name={"log-out"} size={Commonsize(20)} style={[CommonStyles.HomeTopIcon, { color: Commoncolor.darkblue }]} />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              nestedScrollEnabled
            >

              {/* Second Container  */}
              <View>
                {/* user details & date  */}
                <View style={{ width: '95%', minHeight: Commonheight(50), alignSelf: 'flex-end', justifyContent: 'center', paddingVertical: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonLightBlack, fontWeight: '500', marginBottom: Commonheight(5), }}>Welcome, {cstate.UserName ? cstate?.UserName : 'user'}</Text>
                  <Text style={{ fontSize: Commonsize(10), color: Commoncolor.CommonDarkTextGray, fontWeight: '500' }}>{CurrentDateTime[0]?.day}, {CurrentDateTime[0]?.month} {CurrentDateTime[0]?.date} | {CurrentDateTime[0]?.time}</Text>
                </View>
                {/* logo  */}
                <Image source={require('../../Assets/Images/ADIBLogo.png')} resizeMode='contain' style={{ alignSelf: 'center', width: '70%', height: Commonheight(60), marginVertical: Commonheight(5) }} />

              </View>


              {/* Third Container */}
              {cstate.ServiceRequestData?.length > 0 &&
                <View key={(item, index) => index?.toString()} View style={{ width: '95%', minHeight: Commonheight(100), alignSelf: "flex-end", paddingBottom: Commonheight(10) }}>

                  <View style={{ width: '100%', minHeight: Commonheight(25), justifyContent: "center", alignItems: 'flex-start', }}>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Raise a Service</Text>
                  </View>

                  <View style={{ width: '100%', flexDirection: 'row' }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                      {/* Card  */}
                      {cstate.ServiceRequestData.map((val, i) => {
                        return (
                          <CommonCard key={i?.toString()} disabled={false} onPress={() => { cdispatch({ type: 'isServiceRequest', payload: true }); navigation.navigate('ServiceRequestPage', { data: val }) }} style={{
                            width: Commonwidth(100), justifyContent: 'center', alignItems: 'center', padding: Commonsize(10), backgroundColor: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(10), marginVertical: Commonwidth(5), marginLeft: Commonwidth(2), shadowColor: "#000000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.17,
                            shadowRadius: 2.54,
                            elevation: 3
                          }}>

                            <View style={{ width: Commonsize(50), height: Commonsize(50), justifyContent: "center", alignItems: 'center', marginBottom: Commonwidth(5), borderRadius: Commonsize(5), overflow: 'hidden' }}>
                              <Image source={val.FilePath ? { uri: val.FilePath } : require('../../Assets/Images/empty.jpeg')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </View>

                            <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', textAlign: 'center' }}>{val.ServiceTypeName}</Text>

                          </CommonCard>

                        )
                      })}


                    </ScrollView>
                  </View>

                </View>
              }

              {/* Fourth Container Advertisement  */}
              <View style={{ width: '95%', height: Commonheight(170), alignSelf: "flex-end", paddingBottom: Commonheight(10), }}>

                <View style={{ width: '100%', minHeight: Commonheight(25), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Advertisements ({cstate?.AdvertisementData?.length})</Text>
                  <TouchableOpacity onPress={() => Menufunctioncall(3)}>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '400', marginRight: Commonwidth(20), textDecorationColor: 'red', textDecorationLine: 'underline' }}>View All</Text>
                  </TouchableOpacity>
                </View>

                {/* advertisement card  */}
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  {/* Card  */}
                  {cstate?.AdvertisementData?.length === 0 ?
                    <CommonCard disabled={false} style={{
                      width: Commonwidth(300), height: Commonheight(120), backgroundColor: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(10), marginVertical: Commonwidth(5), marginLeft: Commonwidth(2), overflow: 'hidden', shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.17,
                      shadowRadius: 2.54,
                      elevation: 3,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Image source={require('../../Assets/Images/noads1.jpg')} resizeMode='contain' style={{ width: Commonwidth(200), height: Commonheight(120), objectFit: 'contain', borderRadius: Commonsize(10) }} />
                    </CommonCard>

                    :
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      {cstate.Advertisement_images.map((item, i) => (
                        <CommonCard key={i?.toString()} onPress={() => Menufunctioncall(3)} disabled={false} style={{
                          width: Commonwidth(300), height: Commonheight(120), backgroundColor: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(10), marginVertical: Commonwidth(5), marginLeft: Commonwidth(2), overflow: 'hidden', shadowColor: "#000000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.17,
                          shadowRadius: 2.54,
                          elevation: 3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <Image source={item.FilePath != '' ? { uri: item.FilePath } : require("../../Assets/Images/empty.jpeg")} resizeMode='cover' style={{ width: Commonwidth(320), height: Commonheight(120), objectFit: 'cover', borderRadius: Commonsize(10) }} />
                        </CommonCard>
                      ))}
                      {cstate.Advertisement_video.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => toggleVideoPlay(index, item.FilePath)}
                          key={index?.toString()}
                          style={{
                            width: Commonwidth(300),
                            height: Commonheight(120),
                            justifyContent: "space-between",
                            alignSelf: "center",
                            overflow: 'hidden',
                            borderRadius: Commonwidth(10),
                            marginLeft: Commonwidth(3),
                            marginRight: Commonwidth(10),
                            backgroundColor: '#fff',
                            shadowColor: "#000000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.17,
                            shadowRadius: 2.54,
                            elevation: 3
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: Commonsize(40),
                              height: Commonsize(40),
                              position: 'absolute',
                              top: '30%',
                              left: '45%',
                              zIndex: (!(playingMedia.type === 'video' && playingMedia.index === index)) ? 1 : -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: Commonwidth(100),
                              borderColor: Commoncolor.CommonAppColor,
                              borderWidth: Commonwidth(1)
                            }}
                            onPress={() => toggleVideoPlay(index, item.FilePath)}
                          >
                            <Icon2 name={"controller-play"} size={Commonsize(25)} style={[CommonStyles.HomeTopIcon, { color: Commoncolor.CommonAppColor }]} />
                          </TouchableOpacity>
                          <View
                            style={{
                              width: Commonwidth(50),
                              height: Commonheight(20),
                              position: 'absolute',
                              top: '0%',
                              right: '0%',
                              zIndex: (!(playingMedia.type === 'video' && playingMedia.index === index)) ? 1 : -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderTopRightRadius: Commonwidth(10),
                              borderColor: Commoncolor.CommonAppColor,
                              borderWidth: Commonwidth(1),
                              backgroundColor: Commoncolor.CommonAppColor,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: Commonsize(10) }}>Video</Text>
                          </View>
                          <Video
                            ref={videoRef}
                            source={{ uri: item.FilePath }}
                            repeat={false}
                            ignoreSilentSwitch={"ignore"}
                            style={{
                              flex: 1,
                              alignSelf: 'center',
                              width: '100%',
                              height: Commonheight(120),
                              borderTopLeftRadius: Commonsize(10),
                              borderTopRightRadius: Commonsize(10)
                            }}
                            resizeMode="cover"
                            paused={!(playingMedia.type === 'video' && playingMedia.index === index)}
                            onEnd={() => setPlayingMedia({ type: null, index: null })}
                          />

                        </TouchableOpacity>
                      ))}

                      {cstate.Advertisement_audio.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => toggleAudioPlay(index, item.FilePath)}
                          key={index?.toString()}
                          style={{
                            width: Commonwidth(300),
                            height: Commonheight(120),
                            justifyContent: "space-between",
                            alignSelf: "center",
                            borderRadius: Commonwidth(10),
                            overflow: 'hidden',
                            marginLeft: Commonwidth(3),
                            marginRight: Commonwidth(10),
                            backgroundColor: '#fff',
                            shadowColor: "#000000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.17,
                            shadowRadius: 2.54,
                            elevation: 3
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: Commonsize(40),
                              height: Commonsize(40),
                              position: 'absolute',
                              top: '30%',
                              left: '45%',
                              zIndex: -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: Commonwidth(100),
                              borderColor: (playingMedia.type !== 'audio' || playingMedia.index !== index) ? Commoncolor.CommonAppColor : "#fff",
                              borderWidth: Commonwidth(1)
                            }}
                            onPress={() => toggleAudioPlay(index, item.FilePath)}
                          >
                            <Icon10
                              name={"play"}
                              size={Commonsize(25)}
                              style={[
                                CommonStyles.HomeTopIcon,
                                { color: (playingMedia.type !== 'audio' || playingMedia.index !== index) ? Commoncolor.CommonAppColor : "#fff" }
                              ]}
                            />
                          </TouchableOpacity>

                          <View
                            style={{
                              width: Commonwidth(50),
                              height: Commonheight(20),
                              position: 'absolute',
                              top: '0%',
                              right: '0%',
                              zIndex: (!(playingMedia.type === 'video' && playingMedia.index === index)) ? 1 : -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderTopRightRadius: Commonwidth(10),
                              borderColor: Commoncolor.CommonAppColor,
                              borderWidth: Commonwidth(1),
                              backgroundColor: Commoncolor.CommonAppColor,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: Commonsize(10) }}>Audio</Text>
                          </View>
                          <Video
                            ref={audioRef}
                            source={{ uri: item.FilePath }}
                            repeat={false}
                            ignoreSilentSwitch={"ignore"}
                            style={{
                              flex: 1,
                              alignSelf: 'center',
                              width: '100%',
                              height: Commonheight(0),
                              borderTopLeftRadius: Commonsize(10),
                              borderTopRightRadius: Commonsize(10)
                            }}
                            resizeMode="cover"
                            paused={!(playingMedia.type === 'audio' && playingMedia.index === index)}
                            onEnd={() => setPlayingMedia({ type: null, index: null })}
                          />
                          {playingMedia.type === 'audio' && playingMedia.index === index && (
                            <View style={{
                              width: Commonwidth(60),
                              height: Commonheight(60),
                              position: 'absolute',
                              top: '30%',
                              left: '45%',
                              zIndex: -2,
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {/* <MusicBarLoader
                                style={{ alignSelf: "center" }}
                                color={cstate.EntityKeyUpColor}
                                betweenSpace={50}
                                barHeight={100}
                              /> */}
                              <EqualizerBarLoader
                                color={Commoncolor.CommonAppColor}
                                size={100}
                              />
                            </View>
                          )}

                        </TouchableOpacity>
                      ))}

                    </ScrollView>
                  }

                </View>



              </View>

              {/* Fifth Container announcement */}
              <View style={{ width: '95%', height: Commonheight(170), alignSelf: "flex-end", paddingBottom: Commonheight(10) }}>

                <View style={{ width: '100%', minHeight: Commonheight(25), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Announcements ({cstate?.AnnouncementData?.length})</Text>
                  <TouchableOpacity onPress={() => Menufunctioncall(4)}>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '400', marginRight: Commonwidth(20), textDecorationColor: 'red', textDecorationLine: 'underline' }}>View All</Text>
                  </TouchableOpacity>
                </View>

                {/* announcement card   */}
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  {/* Card  */}
                  {cstate?.AnnouncementData?.length === 0 ?
                    <CommonCard disabled={false} style={{
                      width: Commonwidth(300), height: Commonheight(120), backgroundColor: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(10), marginVertical: Commonwidth(5), marginLeft: Commonwidth(2), overflow: 'hidden', shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.17,
                      shadowRadius: 2.54,
                      elevation: 3,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Image source={require('../../Assets/Images/noads1.jpg')} resizeMode='contain' style={{ width: Commonwidth(200), height: Commonheight(120), objectFit: 'contain', borderRadius: Commonsize(10) }} />
                    </CommonCard>

                    :
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      {cstate.Announcement_images.map((item, i) => (
                        <CommonCard key={i?.toString()} onPress={() => Menufunctioncall(4)} disabled={false} style={{
                          width: Commonwidth(300), height: Commonheight(120), backgroundColor: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(10), marginVertical: Commonwidth(5), marginLeft: Commonwidth(2), overflow: 'hidden', shadowColor: "#000000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.17,
                          shadowRadius: 2.54,
                          elevation: 3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <Image source={item.FilePath != '' ? { uri: item.FilePath } : require("../../Assets/Images/empty.jpeg")} resizeMode='cover' style={{ width: Commonwidth(320), height: Commonheight(120), objectFit: 'cover', borderRadius: Commonsize(10) }} />
                        </CommonCard>
                      ))}
                      {cstate.Announcement_video.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => toggleVideoPlay1(index, item.FilePath)}
                          key={index}
                          style={{
                            width: Commonwidth(300),
                            height: Commonheight(120),
                            borderRadius: Commonwidth(10),
                            overflow: 'hidden',
                            justifyContent: "space-between",
                            alignSelf: "center",
                            borderRadius: Commonwidth(10),
                            marginLeft: Commonwidth(3),
                            marginRight: Commonwidth(10),
                            borderColor: "lightgrey",
                            borderWidth: Commonsize(1)
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: Commonsize(40),
                              height: Commonsize(40),
                              position: 'absolute',
                              top: '30%',
                              left: '40%',
                              zIndex: (!(playingMedia1.type === 'video' && playingMedia1.index === index)) == true ? 1 : -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: Commonwidth(100),
                              overflow: 'hidden',
                              borderColor: Commoncolor.CommonAppColor,
                              borderWidth: Commonwidth(1)
                            }}
                            onPress={() => toggleVideoPlay1(index, item.FilePath)}
                          >
                            <Icon2 name={"controller-play"} size={Commonsize(25)} style={[CommonStyles.HomeTopIcon, { color: Commoncolor.CommonAppColor }]} />
                          </TouchableOpacity>
                          <View
                            style={{
                              width: Commonwidth(50),
                              height: Commonheight(20),
                              position: 'absolute',
                              top: '0%',
                              right: '0%',
                              zIndex: (!(playingMedia1.type === 'video' && playingMedia1.index === index)) ? 1 : -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderTopRightRadius: Commonwidth(10),
                              borderColor: Commoncolor.CommonAppColor,
                              borderWidth: Commonwidth(1),
                              backgroundColor: Commoncolor.CommonAppColor,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: Commonsize(10) }}>Video</Text>
                          </View>
                          <Video
                            ref={videoRef1}
                            source={{ uri: item.FilePath }}
                            repeat={false}
                            ignoreSilentSwitch={"ignore"}
                            style={{
                              flex: 1,
                              alignSelf: 'center',
                              width: '100%',
                              height: Commonheight(120),
                              borderTopLeftRadius: Commonsize(10),
                              borderTopRightRadius: Commonsize(10)
                            }}
                            resizeMode="cover"
                            paused={!(playingMedia1.type === 'video' && playingMedia1.index === index)}
                            onEnd={() => setPlayingMedia1({ type: null, index: null })}
                          />

                        </TouchableOpacity>
                      ))}

                      {cstate.Announcement_audio.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => toggleAudioPlay1(index, item.FilePath)}
                          key={index}
                          style={{
                            width: Commonwidth(300),
                            height: Commonheight(120),
                            borderRadius: Commonwidth(10),
                            overflow: 'hidden',
                            justifyContent: "space-between",
                            alignSelf: "center",
                            borderRadius: Commonwidth(10),
                            marginLeft: Commonwidth(3),
                            marginRight: Commonwidth(10),
                            borderColor: "lightgrey",
                            borderWidth: Commonsize(1)
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: Commonsize(40),
                              height: Commonsize(40),
                              position: 'absolute',
                              top: '30%',
                              left: '40%',
                              zIndex: -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: Commonwidth(100),
                              borderColor: (playingMedia1.type !== 'audio' || playingMedia1.index !== index) ? Commoncolor.CommonAppColor : "#fff",
                              borderWidth: Commonwidth(1)
                            }}
                            onPress={() => toggleAudioPlay1(index, item.FilePath)}
                          >
                            <Icon10
                              name={"play"}
                              size={Commonsize(30)}
                              style={[
                                CommonStyles.HomeTopIcon,
                                { color: (playingMedia1.type !== 'audio' || playingMedia1.index !== index) ? Commoncolor.CommonAppColor : "#fff" }
                              ]}
                            />
                          </TouchableOpacity>

                          <View
                            style={{
                              width: Commonwidth(50),
                              height: Commonheight(20),
                              position: 'absolute',
                              top: '0%',
                              right: '0%',
                              zIndex: (!(playingMedia1.type === 'video' && playingMedia1.index === index)) ? 1 : -2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderTopRightRadius: Commonwidth(10),
                              borderColor: Commoncolor.CommonAppColor,
                              borderWidth: Commonwidth(1),
                              backgroundColor: Commoncolor.CommonAppColor,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: Commonsize(10) }}>Audio</Text>
                          </View>
                          <Video
                            ref={audioRef1}
                            source={{ uri: item.FilePath }}
                            repeat={false}
                            ignoreSilentSwitch={"ignore"}
                            style={{
                              flex: 1,
                              alignSelf: 'center',
                              width: '100%',
                              height: Commonheight(0),
                              borderTopLeftRadius: Commonsize(10),
                              borderTopRightRadius: Commonsize(10)
                            }}
                            resizeMode="cover"
                            paused={!(playingMedia1.type === 'audio' && playingMedia1.index === index)}
                            onEnd={() => setPlayingMedia1({ type: null, index: null })}
                          />
                          {playingMedia1.type === 'audio' && playingMedia1.index === index && (
                            <View style={{
                              width: Commonwidth(40),
                              height: Commonheight(40),
                              position: 'absolute',
                              top: '30%',
                              left: '37%',
                              zIndex: -2,
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {/* <MusicBarLoader
                                style={{ alignSelf: "center" }}
                                color={cstate.EntityKeyUpColor}
                                betweenSpace={30}
                                barHeight={50}
                              /> */}
                              <EqualizerBarLoader
                                color={Commoncolor.CommonAppColor}
                                size={100}
                              />
                            </View>
                          )}

                        </TouchableOpacity>
                      ))}

                    </ScrollView>
                  }

                </View>



              </View>



            </ScrollView>
          </ImageBackground>


        </>
      )}








      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        supportedOrientations={["portrait"]}
        visible={slidermenu}
      >

        <View style={{ width: '80%', height: '100%', zIndex: 99, backgroundColor: Commoncolor.CommonWhiteColor }}>
          {/* profile div */}
          <View style={{ width: '100%', maxHeight: Commonheight(200), minHeight: Commonheight(140), }}>
            <View style={{ width: '100%', height: Commonheight(80), justifyContent: 'center', alignItems: "center", paddingTop: Commonheight(15), paddingBottom: Commonheight(4) }}>

              {/* image container  */}
              <View style={{
                width: Commonsize(70), height: Commonsize(70), borderRadius: Commonsize(70), borderWidth: Commonsize(3), borderColor: Commoncolor.CommonWhiteColor, justifyContent: 'center', alignItems: "center", overflow: 'hidden', shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 11,
                },
                shadowOpacity: 0.23,
                shadowRadius: 11.78,
                elevation: 15
              }}>
                <Image source={require('../../Assets/Images/avatar.jpg')}
                  resizeMode='cover'
                  style={{ width: '100%', height: '100%', objectFit: 'cover', }}
                />
              </View>

              {/* close icon  */}
              <TouchableOpacity onPress={() => Menufunctioncall(1)} style={{ position: 'absolute', right: Commonwidth(10), top: Commonheight(10) }}>
                <Icon2 name={"menu"} size={Commonsize(25)} style={[CommonStyles.HomeTopIcon, { color: Commoncolor.darkblue }]} />
              </TouchableOpacity>

            </View>
            <View style={{ width: '100%', minHeight: Commonheight(60), justifyContent: 'space-evenly', alignItems: "center", paddingVertical: Commonheight(5), paddingHorizontal: Commonwidth(5) }}>
              <Text style={{ color: Commoncolor.CommonLightBlack, fontSize: Commonsize(15), fontWeight: '600', marginBottom: Commonheight(3) }}>{cstate.UserName ? cstate.UserName : ''}</Text>
              <Text style={{ color: Commoncolor.CommonDarkTextGray, fontSize: Commonsize(12), fontWeight: '500' }}>{cstate.UserEmail ? cstate.UserEmail : ''}</Text>
            </View>
          </View>

          {/* divider  */}
          <View style={{ width: '100%', height: Commonheight(30), justifyContent: 'flex-start', alignItems: 'center', paddingTop: Commonheight(10) }}>
            <View style={{ width: '85%', height: Commonheight(1), backgroundColor: Commoncolor.CommonGrayColor }}>
            </View>
          </View>

          {/* main container  */}
          <View style={{ flex: 1, width: '85%', height: '100%', alignSelf: 'center', paddingLeft: Commonwidth(5) }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {drawerModuleComponentsList.map((item, i) => {
                return (
                  <TouchableOpacity key={i?.toString()} onPress={() => { item.navigation() }} style={{ width: '100%', height: Commonheight(40), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: Commonheight(10) }}>
                    {item.icon}
                    <Text style={{ color: Commoncolor.CommonLightBlack, fontSize: Commonsize(13), marginLeft: Commonwidth(8) }}>{item.name}</Text>
                  </TouchableOpacity>
                )
              })}

            </ScrollView>



          </View>

          {/* version container  */}
          <View style={{ width: '100%', height: Commonheight(50), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Commoncolor.darkblue, fontSize: Commonsize(13), fontWeight: '500', }}>{Platform.OS == "android" ? "Version 1.17" : "Version 1.15"}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setslidermenu(!slidermenu)} style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', zIndex: 1, top: 0, left: 0 }}></TouchableOpacity>
      </Modal>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  FirstContainerMain1: { width: '100%', height: Commonheight(210), position: 'relative', backgroundColor: '#fff' },
  FirstContainerMain1Sub1: { width: '100%', height: Commonheight(140), },
  FirstContainerMain1Sub2: { width: '90%', height: Commonheight(70), marginTop: '-5%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#fff', alignSelf: 'center', borderRadius: Commonsize(10), padding: Commonsize(3), shadowColor: "#000000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.17, shadowRadius: 3.05, elevation: 4 },
  FirstContainerMain1Sub2ChildDiv: { width: '32%', height: Commonheight(50), alignItems: "center", justifyContent: 'space-evenly', padding: Commonsize(1), },
  FirstContainerMain1Sub2ChildDivText1: { fontSize: Commonsize(20), color: Commoncolor.darkblue, fontWeight: '600' },
  FirstContainerMain1Sub2ChildDivText2: { fontSize: Commonsize(10), color: Commoncolor.darkblue, fontWeight: '500' },
})

export default HomePage;
