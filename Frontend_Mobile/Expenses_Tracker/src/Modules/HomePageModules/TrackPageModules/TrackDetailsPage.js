import React, { useEffect, useContext, useState, } from "react";
import {
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Image,
} from "react-native";

import CommonStyles from "../../../CommonFolder/CommonStyles";
import { GlobalContext } from "../../../../App";
import { Commonsize, Commonwidth, Commonheight, } from "../../../Utils/ResponsiveWidget";
import Commoncolor from "../../../CommonFolder/CommonColor";
import CommonAPISelectWT from "../../../APIMethods/CommonAPISelectWT";
import CommonCard from "../../../Components/CommonCard";
import Divider from "../../../Components/Divider";
import { useNavigation } from "@react-navigation/native";
import VideoPlayer from "../../../Components/VideoPlayer";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Icon1, Icon10, Icon2, Icon9 } from "../../../CommonFolder/CommonIcons";
import logger from "../../../Utils/logger";



const audioRecorderPlayer = new AudioRecorderPlayer();
const TrackDetailsPage = () => {
  const [TrackImages, setTrackImages] = useState([]);
  const [TrackAudio, setTrackAudio] = useState([]);
  const [TrackVideo, setTrackVideo] = useState([]);
  const [TrackSignature, setTrackSignature] = useState([]);
  const [OpenImagePreview, setOpenImagePreview] = useState(false);
  const [OpenAudioPlayer, setOpenAudioPlayer] = useState(false);
  const [OpenVideoPlayer, setOpenVideoPlayer] = useState(false);



  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);




  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  const navigation = useNavigation()
  useEffect(() => {
    logger.log(TrackAudio, 'TrackAudio')
    cdispatch({ type: "FeedbackChanged", payload: !cstate.FeedbackChanged });
    AdminImageRegistry_Select();
  }, []);

  const AdminImageRegistry_Select = async () => {
    try {
      let Url = cstate.KeyUrl + "FP10S3/";


      const params = {
        data: {
          "p1": null,
          "p2": null,
          "p3": null,
          "p4": null,
          "p5": null,
          "p6": null,
          "p7": null,
          "p8": null,
          "p9": null,
          "p10": null,
          "p11": null,
          "p12": null,
          "p13": null,
          "p14": cstate.TrackDetailsData.ComplaintIDPK,
          "p15": 290,
          "p16": null,
          "p17": null,
          "p18": null,
          "p19": null,
          "p20": null,
          "p21": null,
          "p22": null,
          "p23": null,
          "p24": null,
          "p25": null,
          "p26": 1,
          "p27": 10,
          "p28": "AdminImageID",
          "p29": null,
          "p30": null,
          "p31": cstate.UserGroupID,
          "p32": cstate.UserID
        },
      };

      await CommonAPISelectWT(
        Url,
        params,
        cstate.TokenID,
        cstate.TokenName
      ).then(async (response) => {

        let DataBind = response.Output.data;
        logger.log(DataBind, { response }, 'DataBind')

        const ImageBind = DataBind.filter((item) => {
          return (item.TransType == "image" && item.ImageCode != '74');
        });
      
        const AudioBind = DataBind.filter((item) => {
          return item.TransType == "audio";
        });

        const VideoBind = DataBind.filter((item) => {
          return item.TransType == "video";
        });

        const SignatureBind = DataBind.filter((item) => {
          return item.ImageCode == '74';
        });
        setTrackSignature(SignatureBind)
        setTrackImages(ImageBind);
        setTrackAudio(AudioBind);
        setTrackVideo(VideoBind);
      });
    } catch (error) {
      logger.log(error);
    }
  };


  useEffect(() => {

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    navigation.goBack()
    return true;
  }

  const PreViewImages = () => {
    setOpenImagePreview(!OpenImagePreview);
  };

  const PlayAudio = () => {
    setOpenAudioPlayer(!OpenAudioPlayer);
  };

  const PlayVideo = () => {
    setOpenVideoPlayer(!OpenVideoPlayer);
  };

  const renderImages = ({ item, index }) => (
    <View
      style={{
        width: "auto",
        height: Commonheight(400),
        justifyContent: "space-evenly",
      }}
    >
      {TrackImages.length > 1 ? (
        <Image
          style={{
            width: Commonwidth(280),
            height: Commonheight(350),
            alignSelf: "center",
            marginLeft: Commonwidth(5),
            resizeMode: "stretch"
          }}
          source={{ uri: item.ImgPath }}
        />
      ) : (
        <Image
          style={{
            width: Commonwidth(300),
            height: Commonheight(300),
            marginLeft: Commonheight(8),
          }}
          source={{ uri: item.ImgPath }}
        />
      )}
    </View>
  );

  const startPlaying = async () => {
    try {
      if (isPaused) {
        await audioRecorderPlayer.resumePlayer();
        setIsPaused(false);
      } else {
        logger.log(TrackAudio[0].ImgPath, 'TrackAudio[0].ImgPath')
        await audioRecorderPlayer.startPlayer(TrackAudio[0].ImgPath ? TrackAudio[0].ImgPath : '');

        audioRecorderPlayer.addPlayBackListener((e) => {
          setCurrentPosition(e.currentPosition);
          setDuration(e.duration);

          if (e.currentPosition === e.duration) {

            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
            setCurrentPosition(0)
            setIsPaused(false);
          }
        });
      }
    } catch (error) {
      setErrorMessage('Error playing audio: ' + error.message);
    }
  };

  const pausePlaying = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setIsPaused(true);

    } catch (error) {
      setErrorMessage('Error pausing audio: ' + error.message);
    }
  };

  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();

      setIsPaused(false);
      setCurrentPosition(0);
    } catch (error) {
      setErrorMessage('Error stopping audio playback: ' + error.message);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };



  return (
    <View
      style={[
        CommonStyles.CommonFlex,
        { backgroundColor: Commoncolor.CommonBackgroundColor },
      ]}
    >
      <View style={[CommonStyles.CommonHeaderView2, { backgroundColor: Commoncolor.CommonAppColor }]}>
        <TouchableOpacity
          onPress={() => backAction()}
          style={CommonStyles.CommonHeaderViewTouch}
        >
          <Icon1
            name={"arrowleft"}
            size={Commonsize(23)}
            style={CommonStyles.CommonHeaderViewIcon}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonStyles.CommonHeaderViewText,
            { marginLeft: Commonwidth(0) },
          ]}
        >
          Track Details
        </Text>
      </View>


      {/* container  */}
      <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: Commonheight(15) }}>

        <View style={{ width: '90%', height: '100%', flex: 1, }}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='never'>
            {/* card tile  */}
            <CommonCard style={{ paddingVertical: Commonheight(10), paddingLeft: Commonwidth(10), marginTop: Commonheight(0), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

              <View style={{ width: '20%', minHeight: Commonheight(20), alignSelf: 'flex-end', justifyContent: "center", alignItems: 'center', backgroundColor: cstate.TrackDetailsData?.WoStatus == "Open" ? Commoncolor.CommonRedColor : Commoncolor.CommonGreenColor, borderTopLeftRadius: Commonsize(5), borderBottomLeftRadius: Commonsize(5), position: 'absolute', right: 0, top: Commonheight(8), }}>
                <Text style={{ fontSize: Commonsize(11), color: Commoncolor.CommonWhiteColor, fontWeight: '500', }}>{cstate.TrackDetailsData?.WoStatus}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Request No</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.ComplaintNo}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Date & Time</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.ComplainedDateTime}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Nature of Request</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.ComplaintNatureName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Stage</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.CCMStageIName}</Text>
              </View>
            </CommonCard>

            {/* Service Type  */}
            <CommonCard style={{ marginTop: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>
              <View style={{ width: '90%', minHeight: Commonheight(60), alignSelf: 'center', paddingVertical: Commonheight(10) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: Commonheight(5) }}>
                  <View style={{ width: Commonsize(50), height: Commonsize(50), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10) }}>
                    <Image source={require('../../../Assets/Images/tools.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </View>
                  <View>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, }}>Service Type</Text>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>{cstate.TrackDetailsData?.ServiceTypeName}</Text>

                  </View>
                </View>
                <Divider style={{ marginVertical: Commonheight(5) }} />
                <View style={{ marginTop: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Request Category</Text>
                  <Text style={{
                    fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), paddingVertical: Commonheight(10), borderRadius: Commonsize(10), borderColor: Commoncolor.CommonLightGray, borderWidth: Commonsize(1)
                  }}>{cstate.TrackDetailsData?.DivisionName}</Text>

                </View>
                <View style={{ marginTop: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Nature of Request</Text>
                  <Text style={{
                    fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), paddingVertical: Commonheight(10), borderRadius: Commonsize(10), borderColor: Commoncolor.CommonLightGray, borderWidth: Commonsize(1)
                  }}>{cstate.TrackDetailsData?.ComplaintNatureName}</Text>

                </View>

                <View style={{ marginVertical: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Description</Text>
                  <Text style={{
                    fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, marginVertical: Commonheight(0), paddingVertical: Commonheight(5),
                  }}>{cstate.TrackDetailsData?.CCMDescription}</Text>
                </View>
              </View>

            </CommonCard>

            {/* Work Location Details */}
            <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

              <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: "center", alignItems: 'flex-start', marginBottom: Commonheight(8) }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Work Location Details</Text>
              </View>

              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Location</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.LocalityName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Building</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.BuildingName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Floor</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.FloorName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Spot</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.TrackDetailsData?.SpotName}</Text>
              </View>
            </CommonCard>

            {/* Signature  */}
            {TrackSignature.length > 0 &&
              <CommonCard style={{ marginBottom: Commonheight(10), paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>
                <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: Commonheight(8) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Signature</Text>
                </View>


                <TouchableOpacity disabled={true} onPress={() => PreViewImages()} style={{ width: '100%', height: Commonsize(150), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', borderWidth: 1, borderColor: Commoncolor.CommonGrayColor, borderRadius: Commonsize(5) }}>
                  <Image source={TrackSignature[0].ImgPath ? { uri: TrackSignature[0].ImgPath } : require("../../../Assets/Images/empty.jpeg")} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: Commonsize(5) }} />
                </TouchableOpacity>
              </CommonCard>}


            {/* Image,Audio,Video  */}
            {(TrackImages.length > 0 ||
              TrackAudio.length > 0 ||
              TrackVideo.length > 0) &&
              <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

                <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: "center", alignItems: 'flex-start', marginBottom: Commonheight(8) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Attachments <Text style={{ color: Commoncolor.CommonAppColor, fontSize: Commonsize(12) }}>({Number(TrackImages.length) + Number(TrackAudio.length) + Number(TrackVideo.length)})</Text></Text>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                  {TrackImages.map((val, i) => {
                    return (
                      <TouchableOpacity onPress={() => PreViewImages()} style={{ width: Commonsize(80), height: Commonsize(80), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', borderWidth: 1, borderColor: Commoncolor.CommonGrayColor, borderRadius: Commonsize(10), overflow: 'hidden' }}>
                        <Image source={val.ImgPath ? { uri: val.ImgPath } : require("../../../Assets/Images/empty.jpeg")} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover', }} />
                      </TouchableOpacity>
                    )
                  })}

                  {TrackAudio.map((val, i) => {
                    return (
                      <TouchableOpacity onPress={() => PlayAudio()} style={{
                        width: Commonsize(80), height: Commonsize(80), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', backgroundColor: Commoncolor.CommonAppColor, borderRadius: Commonsize(10)
                      }}>
                        <Icon9
                          name={"musical-notes"}
                          size={Commonsize(30)}
                          style={[CommonStyles.HomeTopIcon]}
                        />
                      </TouchableOpacity>
                    )
                  })}

                  {TrackVideo.map((val, i) => {
                    return (
                      <TouchableOpacity onPress={() => { PlayVideo() }} style={{ width: Commonsize(80), height: Commonsize(80), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', backgroundColor: Commoncolor.CommonAppColor, borderRadius: Commonsize(10) }}>
                        <Icon9
                          name={"play-circle"}
                          size={Commonsize(40)}
                          style={{
                            color: Commoncolor.CommonWhiteColor,
                            alignSelf: "center",
                          }}
                        />
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>

              </CommonCard>}
          </ScrollView>

        </View>
      </View>

      {/* </ScrollView> */}
      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={OpenImagePreview}
        onRequestClose={() => { PreViewImages() }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
        >
          <View
            style={{
              width: "95%",
              height: Commonheight(450),
              backgroundColor: Commoncolor.CommonWhiteColor,
              borderRadius: Commonheight(10),
              zIndex: 999
            }}
          >
            <TouchableOpacity onPress={() => PreViewImages()}>
              <Icon1
                name={"closecircle"}
                size={Commonsize(25)}
                style={{
                  color: Commoncolor.CommonAppColor,
                  alignSelf: "flex-end",
                  marginTop: Commonheight(10),
                  marginRight: Commonwidth(10),
                }}
              />
            </TouchableOpacity>

            <FlatList
              horizontal
              data={TrackImages}
              renderItem={renderImages}
            />
          </View>
          <TouchableOpacity onPress={() => { PreViewImages() }} style={{ flex: 1, height: '100%', width: '100%', position: "absolute", top: 0, left: 0, zIndex: -9999 }}>

          </TouchableOpacity>
        </View>
      </Modal>

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
        visible={OpenVideoPlayer}
        onRequestClose={() => { PlayVideo() }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",

          }}
        >
          <View
            style={[CommonStyles.AudioCard3, { height: Commonheight(395), zIndex: 999, overflow: 'hidden', borderRadius: Commonsize(10), zIndex: 999 }]}
          >
            <TouchableOpacity onPress={() => PlayVideo()} style={{ position: 'absolute', top: 10, right: 10, zIndex: 999999 }}>
              <Icon1
                name={"closecircle"}
                size={Commonsize(25)}
                style={{
                  color: Commoncolor.CommonAppColor,
                  alignSelf: "flex-end",
                }}
              />
            </TouchableOpacity>

         

            <VideoPlayer
              source={{
                uri: TrackVideo.length > 0 ? TrackVideo[0].ImgPath : null,
              }}
              containerStyle={{}
              }
            />
          </View>
          <TouchableOpacity onPress={() => { PlayVideo() }} style={{ flex: 1, height: '100%', width: '100%', position: "absolute", top: 0, left: 0, zIndex: -9999 }}>

          </TouchableOpacity>
        </View>
      </Modal>

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
        visible={OpenAudioPlayer}
        onRequestClose={() => { PlayAudio(); stopPlaying() }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
        >
          <View
            style={[CommonStyles.AudioCard3, { height: Commonheight(250), zIndex: 999 }]}
          >


            <TouchableOpacity onPress={() => { PlayAudio(); stopPlaying() }}>
              <Icon1
                name={"closecircle"}
                size={Commonsize(25)}
                style={{
                  color: Commoncolor.CommonAppColor,
                  alignSelf: "flex-end",
                  bottom: Commonheight(2),
                  marginRight: Commonwidth(10),
                }}
              />
            </TouchableOpacity>

            <View style={CommonStyles.AudioView4}>
              <Text
                style={{
                  color: "#000000",
                  textAlign: "center",
                  fontSize: 25,
                }}
              >
                {formatTime(currentPosition)} / {formatTime(duration)}
              </Text>
            </View>
            <View style={CommonStyles.AudioView5}>
              <TouchableOpacity
                style={[{ width: Commonheight(60), height: Commonheight(60), borderRadius: Commonheight(60), backgroundColor: Commoncolor.CommonAppColor, alignSelf: "center", justifyContent: "center", alignItems: "center" }, {
                  backgroundColor: Commoncolor.CommonAppColor
                    ? Commoncolor.CommonAppColor
                    : Commoncolor.CommonBlackColor
                }]}
                onPress={() => {
                  if (currentPosition > 0) {
                    stopPlaying();
                  } else {
                    startPlaying();
                  }
                }}
              >
                <Icon10
                  name={(currentPosition > 0) ? "stop" : "play"}
                  size={Commonsize(40)}
                  color={Commoncolor.CommonWhiteColor}
                />
              </TouchableOpacity>


              {(isPaused || currentPosition > 0) && <TouchableOpacity onPress={() => {
                isPaused ?
                  startPlaying() :
                  pausePlaying();
              }} style={[{ width: Commonheight(60), height: Commonheight(60), borderRadius: Commonheight(60), backgroundColor: Commoncolor.CommonAppColor, alignSelf: "center", justifyContent: "center", alignItems: "center" }, {
                backgroundColor: Commoncolor.CommonAppColor
                  ? Commoncolor.CommonAppColor
                  : Commoncolor.CommonBlackColor
              }]}>
                <Icon2
                  name={isPaused ? "controller-play" : "controller-paus"}
                  size={Commonsize(40)}
                  color={Commoncolor.CommonWhiteColor}
                />
              </TouchableOpacity>}
            </View>
          </View>
          <TouchableOpacity onPress={() => { PlayAudio(); stopPlaying() }} style={{ flex: 1, height: '100%', width: '100%', position: "absolute", top: 0, left: 0, zIndex: -9999 }}>

          </TouchableOpacity>
        </View>


      </Modal>



    </View>
  );
};

export default TrackDetailsPage;
