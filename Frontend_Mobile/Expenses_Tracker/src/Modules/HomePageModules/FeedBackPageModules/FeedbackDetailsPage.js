import React, { useEffect, useContext, useState, useRef } from "react";
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


import CommonAPISelectWOT from "../../../APIMethods/CommonAPISelectWOT";
import CommonStyles from "../../../CommonFolder/CommonStyles";
import { GlobalContext } from "../../../../App";
import { Commonsize, Commonwidth, Commonheight, } from "../../../Utils/ResponsiveWidget";
import Commoncolor from "../../../CommonFolder/CommonColor";
import CommonAPISelectWT from "../../../APIMethods/CommonAPISelectWT";
import CommonCard from "../../../Components/CommonCard";
import CommonMaterialInputField from "../../../Components/CommonMaterialInputField";
import Divider from "../../../Components/Divider";
import { useNavigation } from "@react-navigation/native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Icon1, Icon10, Icon2, Icon9 } from "../../../CommonFolder/CommonIcons";
import VideoPlayer from "../../../Components/VideoPlayer";
import logger from "../../../Utils/logger";
import { CircularLoader } from "../../../Components/Indicators";




const audioRecorderPlayer = new AudioRecorderPlayer();
const FeedbackDetailsPage = () => {
  const [FeedBackImages, setFeedBackImages] = useState([]);
  const [FeedBackAudio, setFeedBackAudio] = useState([]);
  const [FeedBackVideo, setFeedBackVideo] = useState([]);
  const [OpenImagePreview, setOpenImagePreview] = useState(false);
  const [OpenAudioPlayer, setOpenAudioPlayer] = useState(false);
  const [OpenVideoPlayer, setOpenVideoPlayer] = useState(false);
  const [Rating, setRating] = useState(0)
  const [RatingText, setRatingText] = useState('')
  const [IsLoader, setIsLoader] = useState(false);
  const [Feedback, setFeedback] = useState('')
  const [Show, setShow] = useState(false)


  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);



  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  const videoRef = useRef(null)

  const navigation = useNavigation()

  useEffect(() => {
    setStarRatingFn(cstate.FeedBackDetailsData.CCMOccupantRating)
    AdminImageRegistry_Select();
  }, []);

  useEffect(() => {

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
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
          "p14": cstate.FeedBackDetailsData.ComplaintIDPK,
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

        const ImageBind = DataBind.filter((item) => {
          return item.TransType == "image";
        });

        const AudioBind = DataBind.filter((item) => {
          return item.TransType == "audio";
        });

        const VideoBind = DataBind.filter((item) => {
          return item.TransType == "video";
        });

        setFeedBackImages(ImageBind);
        setFeedBackAudio(AudioBind);
        setFeedBackVideo(VideoBind);
      });
    } catch (error) {
      logger.log(error);
    }
  };

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
      {FeedBackImages.length > 1 ? (
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

  const FeedbackSubmit = async () => {
    if (Rating == 0 || Rating == null || Rating == '') {
      alert("Please enter rating");
    } else {
      setIsLoader(true);

      let Url = cstate.KeyUrl + 'FPC13S3/';

      const params = {
        data: {
          p1: null,
          p2: null,
          p3: null,
          p4: null,
          p5: null,
          p6: null,
          p7: cstate.FeedBackDetailsData.CCMOccupantRemarks
            ? cstate.FeedBackDetailsData.CCMOccupantRemarks.replace(
              /[^a-zA-Z0-9 ]/g,
              ""
            )
            : Feedback.replace(/[^a-zA-Z0-9 ]/g, ""),
          p8: cstate.FeedBackDetailsData.ComplaintIDPK ? cstate.FeedBackDetailsData.ComplaintIDPK : null,
          p9: null,
          p10: null,
          p11: Rating ? Rating : "",
          p12: null,
          p13: null,
          p14: 1,
          p15: 10,
          p16: "UPDATEOCCUPANT",
          p17: cstate.UserGroupID,
          p18: cstate.UserID,
        },
      };

      await CommonAPISelectWOT(Url, params).then(async (res) => {
        logger.log({ Url, params, res }, 'FeedbackSubmit')
        setIsLoader(false);
        setShow(true)

      })
        .catch((error) => {
          logger.log(error);
          setIsLoader(false);
          alert("Something went wrong try again");
        });
    }
  };

  const setStarRatingFn = (val) => {
    setRating(val)
    if (val == 1) {
      setRatingText('Needs Improvement')
    }
    else if (val == 2) {
      setRatingText('Unsatisfactory')
    }
    else if (val == 3) {
      setRatingText('Neutral')
    }
    else if (val == 4) {
      setRatingText('Very Good')
    }
    else if (val == 5) {
      setRatingText('Excellent')
    }
    else {
      setRating(0)
      setRatingText('')
    }
  }


  const startPlaying = async () => {
    try {
      if (isPaused) {
        await audioRecorderPlayer.resumePlayer();
        setIsPaused(false);
      } else {
        await audioRecorderPlayer.startPlayer(FeedBackAudio[0].ImgPath ? FeedBackAudio[0].ImgPath : '');

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
          style={{ width: Commonsize(30), height: Commonsize(30), backgroundColor: Commoncolor.CommonWhiteColor, justifyContent: 'center', alignItems: 'center', borderRadius: Commonsize(5), marginLeft: Commonwidth(15), marginRight: Commonwidth(20) }}
        >
          <Icon10
            name={"arrow-left"}
            size={Commonsize(20)}
            style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, fontWeight: '900' }]}
          />
        </TouchableOpacity>


        <Text
          style={[
            CommonStyles.CommonHeaderViewText,
            { marginLeft: Commonwidth(0) },
          ]}
        >
          FeedBack Details
        </Text>
      </View>



      <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: Commonheight(15), backgroundColor: Commoncolor.CommonWhiteColor }}>

        <View style={{ width: '90%', height: '100%', flex: 1, }}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'never'}>

            {/* Rating  */}
            <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginBottom: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

              <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: 'space-between', alignItems: 'center', marginBottom: Commonheight(8), flexDirection: 'row', }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>How would you rate our Service ?</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: 'flex-start', alignItems: 'center', marginBottom: Commonheight(8), flexDirection: 'row', }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Ratings - </Text>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonAppColor, fontWeight: '500', }}>{RatingText}</Text>
              </View>

              {/* star rating  */}
              <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: 'flex-start', alignItems: 'center', marginBottom: Commonheight(8), flexDirection: 'row', }}>

                <TouchableOpacity
                  disabled={(cstate.FeedBackDetailsData.CCMOccupantRating != null)}
                  onPress={() => setStarRatingFn(1)} >
                  <Icon1
                    name={"star"}
                    size={Commonsize(25)}
                    style={{
                      color: Rating > 0 ? Commoncolor.CommonGoldColor : Commoncolor.CommonGrayColor,
                      marginRight: Commonwidth(15),
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={(cstate.FeedBackDetailsData.CCMOccupantRating != null)}
                  onPress={() => setStarRatingFn(2)} >
                  <Icon1
                    name={"star"}
                    size={Commonsize(25)}
                    style={{
                      color: Rating > 1 ? Commoncolor.CommonGoldColor : Commoncolor.CommonGrayColor,
                      marginRight: Commonwidth(15),
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={(cstate.FeedBackDetailsData.CCMOccupantRating != null)}
                  onPress={() => setStarRatingFn(3)} >
                  <Icon1
                    name={"star"}
                    size={Commonsize(25)}
                    style={{
                      color: Rating > 2 ? Commoncolor.CommonGoldColor : Commoncolor.CommonGrayColor,
                      marginRight: Commonwidth(15),
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={(cstate.FeedBackDetailsData.CCMOccupantRating != null)}
                  onPress={() => setStarRatingFn(4)} >
                  <Icon1
                    name={"star"}
                    size={Commonsize(25)}
                    style={{
                      color: Rating > 3 ? Commoncolor.CommonGoldColor : Commoncolor.CommonGrayColor,
                      marginRight: Commonwidth(15),
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={(cstate.FeedBackDetailsData.CCMOccupantRating != null)}
                  onPress={() => setStarRatingFn(5)} >
                  <Icon1
                    name={"star"}
                    size={Commonsize(25)}
                    style={{
                      color: Rating > 4 ? Commoncolor.CommonGoldColor : Commoncolor.CommonGrayColor,
                      marginRight: Commonwidth(15),
                    }}
                  />
                </TouchableOpacity>

              </View>

              <View style={{ marginVertical: Commonheight(5) }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Feedback</Text>
                <CommonMaterialInputField
                  value={cstate.FeedBackDetailsData.CCMOccupantRemarks ? cstate.FeedBackDetailsData.CCMOccupantRemarks : Feedback}
                  editable={(cstate.FeedBackDetailsData?.CCMOccupantRemarks || cstate.FeedBackDetailsData?.CCMOccupantRating) ? false : true}
                  onChangeText={(e) => { setFeedback(e), logger.log({ Feedback }) }}
                  style={{ marginTop: Commonheight(10), color: Commoncolor.CommonTextMildBlack }}
                  placeholder={(cstate.FeedBackDetailsData?.CCMOccupantRating || cstate.FeedBackDetailsData?.CCMOccupantRemarks) ? cstate.FeedBackDetailsData?.CCMOccupantRemarks : "Enter your feedback here..."}
                  placeholderTextColor={Commoncolor.CommonTextMildBlack}
                  totalNoOfCount={250}
                  countStyle={{ marginTop: Commonheight(5), color: Commoncolor.CommonAppColor, fontSize: Commonsize(11) }}
                />
              </View>

            </CommonCard>

            {/* WO details  */}
            <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginBottom: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

              <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: 'space-between', alignItems: 'center', marginBottom: Commonheight(8), flexDirection: 'row', }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Work order Details</Text>
              </View>

              <View style={{ backgroundColor: 'green', width: '25%', justifyContent: 'center', alignItems: 'center', paddingVertical: Commonheight(3), paddingHorizontal: Commonwidth(2), position: 'absolute', top: Commonheight(10), right: 0, borderTopLeftRadius: Commonsize(5), borderBottomLeftRadius: Commonsize(5) }}>
                <Text style={{ fontSize: Commonsize(11), color: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(4) }}>{cstate.FeedBackDetailsData?.WoStatus}</Text>
              </View>

              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Request No</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.ComplaintNo}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Date</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.ComplainedDateTime}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Stage</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.CCMStageIName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>ETA Date</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.ETADate}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Fixed By</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.SLABDMEndDateTime}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Completed On</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.BDMWOCompletedDate}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Technician Name</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.TechnicianName}</Text>
              </View>
            </CommonCard>

            {/* Work Location Details  */}
            <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginBottom: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

              <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: 'space-between', alignItems: 'center', marginBottom: Commonheight(8), flexDirection: 'row' }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Work Location Details</Text>

              </View>

              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Location</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.LocalityName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Building</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.BuildingName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Floor</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.FloorName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Spot</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{cstate.FeedBackDetailsData?.SpotName}</Text>
              </View>
            </CommonCard>

            {/* Service Type  */}
            <CommonCard style={{ marginBottom: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1, }}>
              <View style={{ width: '90%', minHeight: Commonheight(60), alignSelf: 'center', paddingVertical: Commonheight(10), }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: Commonheight(5) }}>
                  <View style={{ width: Commonsize(50), height: Commonsize(50), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10) }}>
                    <Image source={require('../../../Assets/Images/tools.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </View>
                  <View>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, }}>Service Type</Text>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>FM Maintainance</Text>

                  </View>
                </View>
                <Divider style={{ marginVertical: Commonheight(5) }} />
                <View style={{ marginTop: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Request Category</Text>
                  <Text style={{
                    fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), paddingVertical: Commonheight(10), borderRadius: Commonsize(10), borderColor: Commoncolor.CommonLightGray, borderWidth: Commonsize(1)
                  }}>{cstate.FeedBackDetailsData?.DivisionName}</Text>

                </View>
                <View style={{ marginTop: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Nature of Request</Text>
                  <Text style={{
                    fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), paddingVertical: Commonheight(10), borderRadius: Commonsize(10), borderColor: Commoncolor.CommonLightGray, borderWidth: Commonsize(1)
                  }}>{cstate.FeedBackDetailsData?.ComplaintNatureName}</Text>

                </View>

                <View style={{ marginVertical: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Description</Text>
                  <Text style={{
                    fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, marginVertical: Commonheight(0), paddingVertical: Commonheight(5),
                  }}>{cstate.FeedBackDetailsData?.CCMDescription}</Text>
                </View>
              </View>

            </CommonCard>



            {/* Image,Video,Audio  */}
            {(FeedBackImages.length > 0 ||
              FeedBackAudio.length > 0 ||
              FeedBackVideo.length > 0) &&
              <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

                <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: "center", alignItems: 'flex-start', marginBottom: Commonheight(8) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Attachments <Text style={{ color: Commoncolor.CommonAppColor, fontSize: Commonsize(12) }}>({Number(FeedBackImages.length) + Number(FeedBackAudio.length) + Number(FeedBackVideo.length)})</Text></Text>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                  {FeedBackImages.map((val, i) => {
                    return (
                      <TouchableOpacity onPress={() => PreViewImages()} style={{ width: Commonsize(80), height: Commonsize(80), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', borderWidth: 1, borderColor: Commoncolor.CommonGrayColor, borderRadius: Commonsize(5) }}>
                        <Image source={val.ImgPath ? { uri: val.ImgPath } : require("../../../Assets/Images/empty.jpeg")} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover', }} />
                      </TouchableOpacity>
                    )
                  })}

                  {FeedBackAudio.map((val, i) => {
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

                  {FeedBackVideo.map((val, i) => {
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


        {cstate.FeedBackDetailsData.CCMOccupantRating == null
          ?
          IsLoader == true ?
            <View
              style={{
                width: "100%",
                height: Commonheight(45),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularLoader
                color={
                  Commoncolor.CommonAppColor
                }
                dotSize={5}
                size={20}
              />
            </View>
            :
            <TouchableOpacity disabled={IsLoader} onPress={() => { FeedbackSubmit(); }} style={{ width: '100%', height: Commonheight(45), backgroundColor: Commoncolor.CommonAppColor, justifyContent: 'center', alignItems: "center" }}>
              <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonWhiteColor, fontWeight: '500', }}>Submit</Text>
            </TouchableOpacity>
          :
          <View style={{ width: '100%', height: Commonheight(45), backgroundColor: Commoncolor.CommonAppColor, justifyContent: 'center', alignItems: "center" }}>
            <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonWhiteColor, fontWeight: '500', }}>Already Rated!</Text>
          </View>
        }

      </View>



      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={Show}
        onRequestClose={() => { navigation.navigate('MainContainerModule'); setShow(false); }}
      >
        <View
          style={[{
            width: "100%",
            height: '100%',
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }]}
        >
          <CommonCard style={{ width: '90%', alignSelf: 'center', justifyContent: "center", alignItems: "center", paddingVertical: Commonheight(40), backgroundColor: '#fff', zIndex: 999, borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

            <View style={{ width: Commonsize(60), height: Commonsize(60), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), backgroundColor: '#fff', marginBottom: Commonheight(20) }}>
              <Image source={require('../../../Assets/Images/successAlert.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </View>
            <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonDarkTextGray, textAlign: 'center' }}>Your feedback <Text style={{ color: Commoncolor.CommonAppColor, fontWeight: '500' }}>{cstate.FeedBackDetailsData?.ComplaintNo ? cstate.FeedBackDetailsData?.ComplaintNo : ''}</Text> has been submitted successfully!</Text>

          </CommonCard>
          <TouchableOpacity onPress={() => { navigation.navigate('MainContainerModule'); setShow(false); }} style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>

          </TouchableOpacity>
        </View>
      </Modal>



      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={OpenImagePreview}
        onRequestClose={() => { setOpenImagePreview(false) }}
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
              data={FeedBackImages}
              renderItem={renderImages}
            />
          </View>

          <TouchableOpacity onPress={() => { setOpenImagePreview(false) }} style={{ width: '100%', height: '100%', flex: 1, position: "absolute", zIndex: -99, top: 0, left: 0, }}>
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
        onRequestClose={() => { setOpenVideoPlayer(false) }}
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
            style={[CommonStyles.AudioCard3, { height: Commonheight(450), zIndex: 999, position: 'relative', overflow: 'hidden' }]}
          >

            <TouchableOpacity onPress={() => setOpenVideoPlayer(false)} style={{
              position: 'absolute',
              color: Commoncolor.CommonWhiteColor,
              alignSelf: "flex-end",
              top: Commonheight(10),
              right: Commonheight(10),
              zIndex: 9999,
            }} >
              <Icon1
                name={"closecircle"}
                size={Commonsize(25)}

              />
            </TouchableOpacity>

            <VideoPlayer
              source={{ uri: FeedBackVideo.length > 0 ? FeedBackVideo[0].ImgPath : null }}
              resizeMode='stretch'
              ref={videoRef}
            />

          </View>
          <TouchableOpacity onPress={() => { setOpenVideoPlayer(false) }} style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: -99 }}>
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
        onRequestClose={() => { setOpenAudioPlayer(false); stopPlaying() }}
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


            <TouchableOpacity onPress={() => { setOpenAudioPlayer(false); stopPlaying() }}>
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
          <TouchableOpacity onPress={() => { setOpenAudioPlayer(false); stopPlaying() }} style={{ flex: 1, height: '100%', width: '100%', position: "absolute", top: 0, left: 0, zIndex: -9999 }}>

          </TouchableOpacity>
        </View>
      </Modal>


    </View>
  );
};

export default FeedbackDetailsPage;

