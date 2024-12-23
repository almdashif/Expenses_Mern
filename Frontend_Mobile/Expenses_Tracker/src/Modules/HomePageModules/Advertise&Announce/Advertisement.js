
import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  BackHandler,
  ImageBackground,
  StyleSheet,
} from 'react-native';




import Video from 'react-native-video';


import AsyncStorage from '@react-native-async-storage/async-storage';

import { Commonheight, Commonsize, Commonwidth, } from '../../../Utils/ResponsiveWidget';
import CommonStyles from '../../../CommonFolder/CommonStyles';
import BottomSheet from '../../../Components/BottomSheet';
import { EqualizerBarLoader } from '../../../Components/Indicators';
import CommonAPISelectWT from '../../../APIMethods/CommonAPISelectWT';
import { Icon10, Icon1, Icon2, Icon5 } from '../../../CommonFolder/CommonIcons';
import { GlobalContext } from '../../../../App';
import Commoncolor from '../../../CommonFolder/CommonColor';
import logger from '../../../Utils/logger';



const Advertisement = ({ navigation }) => {

  const [CommonBottomSheetEnable, setCommonBottomSheetEnable] = useState(false);
  const [playingMedia, setPlayingMedia] = useState({ type: null, index: null });
  const [playingMedia1, setPlayingMedia1] = useState({ type: null, index: null });

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  const videoRef = useRef(null);
  const videoRef1 = useRef(null);
  const audioRef = useRef(null);
  const audioRef1 = useRef(null);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    ShowTotalCountDatas();
    navigation.goBack();
    return true;
  };

  const ShowTotalCountDatas = async () => {

    const ADVCount = cstate.ShowAdvertisementCount.filter(item => item.View === "1").length;
    const ANNOCount = cstate.ShowAnnouncementCount.filter(item => item.View === "1").length;

    logger.log(ADVCount, "ADVCount")
    logger.log(ANNOCount, "ANNOCount")

    await AsyncStorage.setItem('ShowAdvertisementCount', JSON.stringify(cstate.ShowAdvertisementCount));
    await AsyncStorage.setItem('ShowAnnouncementCount', JSON.stringify(cstate.ShowAnnouncementCount));

    await cdispatch({ type: "ShowTotalCount", payload: ADVCount + ANNOCount });
  }

  const toggleVideoPlay = (index, val) => {

    logger.log(index, val, "index, val")
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

    logger.log(index, val, "index, val")
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

    logger.log(index, val, "index, val")
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

    logger.log(index, val, "index, val")
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

  const OpenBottomSheet = async (item) => {

    logger.log(item, "item")

    const updatedData = cstate.ShowAdvertisementCount.map(data => {
      if (data.AdminAdvertisementIDPK === item.AdminAdvertisementIDPK) {
        if (data.View === "1") {
          return { ...data, View: "0" };
        }
        else {
          logger.log(data, 'object not matched')
        }
      }
      return data;
    });

    logger.log(updatedData, "updatedData");

    await cdispatch({ type: "ShowAdvertisementCount", payload: updatedData });

    AdminImageRegistry_Select(item.AdminAdvertisementIDPK)
    setPlayingMedia({ type: null, index: null })
    setPlayingMedia1({ type: null, index: null })
    cdispatch({ type: 'CCMComplaintDetailDatas', payload: item });
  };

  const Closebottomsheet = async () => {
    setPlayingMedia({ type: null, index: null })
    setPlayingMedia1({ type: null, index: null })
    cdispatch({ type: 'CCMComplaintDetailDatas', payload: [] });
    setCommonBottomSheetEnable(!CommonBottomSheetEnable);
  }

  const AdminImageRegistry_Select = async (ID) => {
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
          "p14": ID, // IDPK
          "p15": 802,
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
        logger.log(DataBind, 'DataBind')

        const ImageBind = DataBind.filter((item) => {
          return item.TransType == "image";
        });

        const AudioBind = DataBind.filter((item) => {
          return item.TransType == "audio";
        });

        const VideoBind = DataBind.filter((item) => {
          return item.TransType == "video";
        });

        setCommonBottomSheetEnable(!CommonBottomSheetEnable);

        cdispatch({ type: 'CCMComplaintAdvertisementDetailImageDatas', payload: ImageBind });
        cdispatch({ type: 'CCMComplaintAdvertisementDetailAudioDatas', payload: AudioBind });
        cdispatch({ type: 'CCMComplaintAdvertisementDetailVideoDatas', payload: VideoBind });
      });
    } catch (error) {
      logger.log(error);
    }
  };

  let images = [
    require('../../../Assets/Images/Advertisement.png'),
    require('../../../Assets/Images/Advertisement.png'),
    require('../../../Assets/Images/Advertisement.png'),
    require('../../../Assets/Images/Advertisement.png'),
  ]

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
        <Text style={CommonStyles.CommonHeaderViewText}>Advertisement</Text>
      </View>

      <View style={CommonStyles.CommonHeaderView3}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {cstate.Advertisement_images.map((item, index) => (
            <TouchableOpacity
              onPress={() => OpenBottomSheet(item)}
              key={index}
              style={{
                width: "95%",
                height: Commonheight(180),
                justifyContent: "space-between",
                alignSelf: "center",
                borderRadius: Commonwidth(10),
                backgroundColor: '#fff',
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.17,
                shadowRadius: 2.54,
                elevation: 3,
                marginBottom: Commonwidth(5),
                marginTop: Commonwidth(10),
              }}
            >
              <Image
                source={item.FilePath ? { uri: item.FilePath } : require("../../../Assets/Images/empty.jpeg")}
                resizeMode='cover'
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  width: '100%',
                  height: Commonheight(120),
                  borderTopLeftRadius: Commonsize(10),
                  borderTopRightRadius: Commonsize(10)
                }}
              />
              <View
                style={{
                  width: Commonwidth(50),
                  height: Commonheight(40),
                  position: 'absolute',
                  top: '0%',
                  right: '0%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopRightRadius: Commonwidth(10),
                  // borderColor: Commoncolor.CommonAppColor,
                  // borderWidth: Commonwidth(1),
                  // backgroundColor: Commoncolor.CommonAppColor,
                }}
              >
                <Icon5
                  name={'image'}
                  size={Commonsize(20)}
                  style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, }]}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{
                  minHeight: Commonheight(5),
                  alignItems: 'flex-start',
                  justifyContent: 'space-evenly',
                  borderBottomLeftRadius: Commonsize(10),
                  borderBottomRightRadius: Commonsize(10),
                  paddingHorizontal: Commonwidth(8),
                  paddingVertical: Commonheight(5),
                }}>
                  <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText1, { fontSize: Commonsize(13), color: Commoncolor.CommonLightBlack }]}>{item.AdvTitle}</Text>
                  <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText2, { fontSize: Commonsize(11), color: Commoncolor.CommonTextMildBlack }]}>{item.AdvCategoryName}</Text>
                </View>
                <TouchableOpacity onPress={() => OpenBottomSheet(item)}
                  style={{
                    minHeight: Commonheight(5),
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    borderBottomLeftRadius: Commonsize(10),
                    borderBottomRightRadius: Commonsize(10),
                    paddingHorizontal: Commonwidth(8),
                    paddingVertical: Commonheight(5),
                  }}>
                  <View style={{
                    backgroundColor: Commoncolor.CommonAppColor,
                    paddingHorizontal: Commonwidth(10),
                    paddingVertical: Commonheight(3),
                    borderRadius: Commonwidth(5)
                  }}>
                    <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText1, { fontSize: Commonsize(10), color: Commoncolor.CommonWhiteColor }]}>View</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </TouchableOpacity>
          ))}

          {cstate.Advertisement_video.map((item, index) => (
            <TouchableOpacity
              onPress={() => toggleVideoPlay(index, item.FilePath)}
              key={index}
              style={{
                width: "95%",
                height: Commonheight(180),
                justifyContent: "space-between",
                alignSelf: "center",
                borderRadius: Commonwidth(10),
                marginTop: Commonheight(10),
                marginLeft: Commonwidth(10),
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
                  width: Commonsize(45),
                  height: Commonsize(45),
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
                <Icon2 name={"controller-play"} size={Commonsize(30)} style={[CommonStyles.HomeTopIcon, { color: Commoncolor.CommonAppColor, marginLeft: Commonwidth(5), }]} />
              </TouchableOpacity>
              <View
                style={{
                  width: Commonwidth(50),
                  height: Commonheight(40),
                  position: 'absolute',
                  top: '0%',
                  right: '0%',
                  zIndex: (!(playingMedia.type === 'video' && playingMedia.index === index)) ? 1 : -2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopRightRadius: Commonwidth(10),
                  // borderColor: Commoncolor.CommonAppColor,
                  // borderWidth: Commonwidth(1),
                  // backgroundColor: Commoncolor.CommonAppColor,
                }}
              >
                <Icon5
                  name={'video-camera'}
                  size={Commonsize(20)}
                  style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, }]}
                />
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{
                  minHeight: Commonheight(5),
                  alignItems: 'flex-start',
                  justifyContent: 'space-evenly',
                  borderBottomLeftRadius: Commonsize(10),
                  borderBottomRightRadius: Commonsize(10),
                  paddingHorizontal: Commonwidth(8),
                  paddingVertical: Commonheight(5),
                }}>
                  <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText1, { fontSize: Commonsize(12), color: Commoncolor.CommonLightBlack }]}>{item.AdvTitle}</Text>
                  <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText2, { color: Commoncolor.CommonTextMildBlack }]}>{item.AdvCategoryName}</Text>

                </View>
                <TouchableOpacity onPress={() => OpenBottomSheet(item)}
                  style={{
                    minHeight: Commonheight(5),
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    borderBottomLeftRadius: Commonsize(10),
                    borderBottomRightRadius: Commonsize(10),
                    paddingHorizontal: Commonwidth(8),
                    paddingVertical: Commonheight(5),
                  }}>
                  <View style={{
                    backgroundColor: Commoncolor.CommonAppColor,
                    paddingHorizontal: Commonwidth(10),
                    paddingVertical: Commonheight(3),
                    borderRadius: Commonwidth(5)
                  }}>
                    <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText1, { fontSize: Commonsize(10), color: Commoncolor.CommonWhiteColor }]}>View</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          ))}

          {cstate.Advertisement_audio.map((item, index) => (
            <TouchableOpacity
              onPress={() => toggleAudioPlay(index, item.FilePath)}
              key={index}
              style={{
                width: "95%",
                height: Commonheight(180),
                justifyContent: "space-between",
                alignSelf: "center",
                borderRadius: Commonwidth(10),
                marginTop: Commonheight(10),
                marginLeft: Commonwidth(10),
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
                  width: Commonsize(45),
                  height: Commonsize(45),
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
                  size={Commonsize(30)}
                  style={[
                    CommonStyles.HomeTopIcon,
                    { color: (playingMedia.type !== 'audio' || playingMedia.index !== index) ? Commoncolor.CommonAppColor : "#fff", marginLeft: Commonwidth(0) }
                  ]}
                />
              </TouchableOpacity>

              <View
                style={{
                  width: Commonwidth(50),
                  height: Commonheight(40),
                  position: 'absolute',
                  top: '0%',
                  right: '0%',
                  zIndex: (!(playingMedia.type === 'video' && playingMedia.index === index)) ? 1 : -2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopRightRadius: Commonwidth(10),
                  // borderColor: Commoncolor.CommonAppColor,
                  // borderWidth: Commonwidth(1),
                  // backgroundColor: Commoncolor.CommonAppColor,
                }}
              >
                <Icon5
                  name={'music'}
                  size={Commonsize(20)}
                  style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, }]}
                />
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
                  <EqualizerBarLoader
                    color={Commoncolor.CommonAppColor}
                    barCount={12}
                    barStyle={{ marginHorizontal: Commonwidth(10) }}
                  />
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{
                  minHeight: Commonheight(5),
                  alignItems: 'flex-start',
                  justifyContent: 'space-evenly',
                  borderBottomLeftRadius: Commonsize(10),
                  borderBottomRightRadius: Commonsize(10),
                  paddingHorizontal: Commonwidth(8),
                  paddingVertical: Commonheight(5),
                }}>
                  <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText1, { fontSize: Commonsize(12), color: Commoncolor.CommonLightBlack }]}>{item.AdvTitle}</Text>
                  <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText2, { color: Commoncolor.CommonTextMildBlack }]}>{item.AdvCategoryName}</Text>

                </View>
                <TouchableOpacity onPress={() => OpenBottomSheet(item)}
                  style={{
                    minHeight: Commonheight(5),
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    borderBottomLeftRadius: Commonsize(10),
                    borderBottomRightRadius: Commonsize(10),
                    paddingHorizontal: Commonwidth(8),
                    paddingVertical: Commonheight(5),
                  }}>
                  <View style={{
                    backgroundColor: Commoncolor.CommonAppColor,
                    paddingHorizontal: Commonwidth(10),
                    paddingVertical: Commonheight(3),
                    borderRadius: Commonwidth(5),

                  }}>
                    <Text numberOfLines={1} style={[styles.FirstContainerMain1Sub2ChildDivText1, { fontSize: Commonsize(10), color: Commoncolor.CommonWhiteColor }]}>View</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}


          <View style={[CommonStyles.CommonEndView, { height: Commonheight(15) }]} />
        </ScrollView>

        {cstate.CCMComplaintDetailDatas && cstate.CCMComplaintDetailDatas?.length != 0 ? <>
          <BottomSheet
            visible={CommonBottomSheetEnable}
            onBackButtonPress={Closebottomsheet}
            onBackdropPress={Closebottomsheet}
            height={Commonheight(340)}
            >
            <View style={[CommonStyles.CCMComplaintBottomSheetMainView, {
              height: '50%', borderTopLeftRadius: Commonsize(30),
              borderTopRightRadius: Commonsize(30),
              overflow: 'hidden'
            }]}>


              <View style={{ width: '100%', height: Commonheight(180), backgroundColor: Commoncolor.CommonWhiteColor, justifyContent: 'center', alignItems: "center" }}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ width: Commonwidth(360), height: Commonheight(180), borderBottomColor: Commoncolor.CommonGrayColor, borderBottomWidth: .25 }}>
                  {cstate.CCMComplaintAdvertisementDetailImageDatas.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        width: Commonwidth(360),
                        height: Commonheight(180),
                        justifyContent: "space-between",
                        alignSelf: "center",
                        borderRadius: Commonsize(10),
                        borderColor: "lightgrey",
                        marginRight: 5
                      }}
                    >
                      <Image
                        source={item?.ImgPath ? { uri: item.ImgPath } : require("../../../Assets/Images/empty.jpeg")}

                        style={{
                          flex: 1,
                          alignSelf: 'center',
                          width: '100%',
                          height: Commonheight(120),
                          resizeMode: "stretch",
                          overflow: 'hidden'
                        }}
                      />
                      <View
                        style={{
                          width: Commonwidth(50),
                          height: Commonheight(40),
                          position: 'absolute',
                          top: '0%',
                          right: '0%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: Commonwidth(10),
                        }}
                      >
                        {item?.ImgPath && <Icon5
                          name={'image'}
                          size={Commonsize(20)}
                          style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, }]}
                        />}
                      </View>
                    </View>
                  ))}

                  {cstate.CCMComplaintAdvertisementDetailVideoDatas.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => toggleVideoPlay1(index, item.ImgPath)}
                      key={index}
                      style={{
                        width: Commonwidth(360),
                        height: Commonheight(180),
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: Commonheight(40),
                          height: Commonheight(40),
                          zIndex: (!(playingMedia1.type === 'video' && playingMedia1.index === index)) == true ? 1 : -2,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          position: "absolute",
                          borderRadius: Commonheight(50),
                          borderColor: Commoncolor.CommonAppColor,
                          borderWidth: Commonwidth(2),
                        }}
                        onPress={() => toggleVideoPlay1(index, item.ImgPath)}
                      >
                        <Icon2 name={"controller-play"} size={Commonsize(30)} style={[CommonStyles.HomeTopIcon, { color: Commoncolor.CommonAppColor, marginLeft: Commonwidth(5) }]} />
                      </TouchableOpacity>
                      <View
                        style={{
                          width: Commonwidth(50),
                          height: Commonheight(40),
                          position: 'absolute',
                          top: '2%',
                          right: '2%',
                          zIndex: (!(playingMedia1.type === 'video' && playingMedia1.index === index)) ? 1 : -2,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: Commonwidth(10),
                        }}
                      >
                        <Icon5
                          name={'video-camera'}
                          size={Commonsize(20)}
                          style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, }]}
                        />
                      </View>
                      <Video
                        ref={videoRef1}
                        source={{ uri: item.ImgPath }}
                        repeat={false}
                        ignoreSilentSwitch={"ignore"}
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                          width: '100%',
                          height: Commonheight(120),
                          borderRadius: Commonsize(10)
                        }}
                        resizeMode="cover"
                        paused={!(playingMedia1.type === 'video' && playingMedia1.index === index)}
                        onEnd={() => setPlayingMedia1({ type: null, index: null })}
                      />
                    </TouchableOpacity>
                  ))}

                  {cstate.CCMComplaintAdvertisementDetailAudioDatas.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => toggleAudioPlay1(index, item.ImgPath)}
                      key={index}
                      style={{
                        width: Commonwidth(360),
                        height: Commonheight(180),
                        borderRadius: Commonwidth(10),
                        justifyContent: "center",
                        alignSelf: "center",
                        borderRadius: Commonwidth(10),
                        marginLeft: Commonwidth(3),
                        marginRight: Commonwidth(10),
                        // borderColor: "lightgrey",
                        // borderWidth: Commonwidth(0.5)
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: Commonheight(50),
                          height: Commonheight(50),
                          position: 'absolute',
                          zIndex: -2,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          borderRadius: Commonheight(50),
                          borderColor: (playingMedia1.type !== 'audio' || playingMedia1.index !== index) ? Commoncolor.CommonAppColor : "#fff",
                          borderWidth: Commonwidth(1)
                        }}
                        onPress={() => toggleAudioPlay1(index, item.ImgPath)}
                      >
                        <Icon10
                          name={"play"}
                          size={Commonsize(30)}
                          style={[
                            CommonStyles.HomeTopIcon,
                            { color: (playingMedia1.type !== 'audio' || playingMedia1.index !== index) ? Commoncolor.EntityKeyUpColor : "#fff" }
                          ]}
                        />
                      </TouchableOpacity>

                      <View
                        style={{
                          width: Commonwidth(50),
                          height: Commonheight(40),
                          position: 'absolute',
                          top: '0%',
                          right: '2%',
                          zIndex: (!(playingMedia1.type === 'video' && playingMedia1.index === index)) ? 1 : -2,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderTopRightRadius: Commonwidth(10),
                        }}
                      >
                        <Icon5
                          name={'music'}
                          size={Commonsize(20)}
                          style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, }]}
                        />
                      </View>
                      <Video
                        ref={audioRef1}
                        source={{ uri: item.ImgPath }}
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
                          top: '35%',
                          left: '45%',
                          zIndex: -2,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <EqualizerBarLoader
                            color={Commoncolor.CommonAppColor}
                            barCount={12}
                            barStyle={{ marginHorizontal: Commonwidth(10) }}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={{ flex: 1, paddingHorizontal: Commonwidth(10), paddingTop: Commonheight(20), paddingBottom: Commonheight(2) }}>
                {/* title feilds  */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ paddingBottom: Commonheight(10) }}>
                    <Text style={{ color: Commoncolor.CommonDarkTextGray, fontSize: Commonsize(14), fontWeight: '500' }}>Title</Text>
                    <Text style={{ color: Commoncolor.CommonTextMildBlack, fontSize: Commonsize(12), fontWeight: '400' }}>{cstate.CCMComplaintDetailDatas
                      ? cstate.CCMComplaintDetailDatas.AdvTitle
                      : ''}</Text>
                  </View>
                  <View style={{ paddingBottom: Commonheight(10) }}>
                    <Text style={{ color: Commoncolor.CommonDarkTextGray, fontSize: Commonsize(14), fontWeight: '500' }}>Category</Text>
                    <Text style={{ color: Commoncolor.CommonTextMildBlack, fontSize: Commonsize(12), fontWeight: '400' }}>{cstate.CCMComplaintDetailDatas
                      ? cstate.CCMComplaintDetailDatas.AdvCategoryName
                      : ''}</Text>
                  </View>
                  <View style={{ paddingBottom: Commonheight(10) }}>
                    <Text style={{ color: Commoncolor.CommonDarkTextGray, fontSize: Commonsize(14), fontWeight: '500' }}>Description</Text>
                    <Text style={{ color: Commoncolor.CommonTextMildBlack, fontSize: Commonsize(12), fontWeight: '400' }}>{cstate.CCMComplaintDetailDatas
                      ? cstate.CCMComplaintDetailDatas.AdvBody
                      : ''}</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </BottomSheet>
        </> : null}

      </View>
    </View>
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
export default Advertisement;
