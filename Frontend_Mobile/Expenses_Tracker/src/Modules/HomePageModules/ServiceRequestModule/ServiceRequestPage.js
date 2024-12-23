import { Alert, Image, Modal, PermissionsAndroid, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, BackHandler, FlatList, Platform } from 'react-native'
import React, { useState, useContext, createRef, useEffect, useRef } from 'react'

import SignatureCapture from 'react-native-signature-capture'
import { useNavigation } from '@react-navigation/native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import * as ImagePicker from "react-native-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage'
import NoImage from '../../../Components/NoImage'
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import CommonStyles from '../../../CommonFolder/CommonStyles'
import { Commonheight, Commonsize, Commonwidth } from '../../../Utils/ResponsiveWidget'
import Commoncolor from '../../../CommonFolder/CommonColor'
import { GlobalContext } from '../../../../App';
import CommonCard from '../../../Components/CommonCard';
import Divider from '../../../Components/Divider';
import CommonMaterialInputField from '../../../Components/CommonMaterialInputField';
import CommonAPISelectWOT from '../../../APIMethods/CommonAPISelectWOT';
import CommonAPISelectWT from '../../../APIMethods/CommonAPISelectWT';
import BottomSheet from '../../../Components/BottomSheet';
import LogoutFunction from '../../../Utils/LogoutFunction';
import { CircularLoader, } from '../../../Components/Indicators';

import VideoPlayer from '../../../Components/VideoPlayer';
import { Icon1, Icon10, Icon11, Icon2, Icon5, Icon9 } from '../../../CommonFolder/CommonIcons';
import { useToast } from '../../../Context/ToastProvider'
import logger from '../../../Utils/logger'



const audioRecorderPlayer = new AudioRecorderPlayer();

const ServiceRequestPage = ({ route }) => {
  const { data } = route.params

  const [Description, setDescription] = useState('');
  const [SignResult, setSignResult] = useState([]);
  const [Signsaved, setSignsaved] = useState(false);
  const [SignatureCaptured, setSignatureCaptured] = useState(false);
  const [Show, setShow] = useState(false)

  const [Loader, setLoader] = useState(false)
  const [IsVideoSaving, setIsVideoSaving] = useState(false);
  const [DefaultData, setDefaultData] = useState([])
  const [OpenImageMedia, setOpenImageMedia] = useState(false);
  const [OpenImagePreview, setOpenImagePreview] = useState(false);
  const [OpenAudioMedia, setOpenAudioMedia] = useState(false);
  const [OpenAudioPlayer, setOpenAudioPlayer] = useState(false);
  const [OpenVideoPlayer, setOpenVideoPlayer] = useState(false);
  const [ShowBtmSheet, setShowBtmSheet] = useState(false)
  const [DivisionandNOCDataArray, setDivisionandNocDataArray] = useState([])
  const [DivisionSelectedDataArray, setDivisionSelectedDataArray] = useState([])
  const [NOCSelectedDataArray, setNOCSelectedDataArray] = useState([])
  const [Type, setType] = useState('')
  const [IsBtmLoader, setIsBtmLoader] = useState(false)
  const [ShowLocationMissingAlert, setShowLocationMissingAlert] = useState(false)
  const [ClearState, setClearState] = useState(false)


  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);




  const sign = createRef();

  const videoRef = useRef(null)

  const navigation = useNavigation()

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;


  const { showToast } = useToast();



  useEffect(() => {
    getDefaultData()
  }, [cstate.ChangeLocation])

  useEffect(() => {
    logger.log(cstate.SubmitPageAudio, 'cstate.SubmitPageAudio ')

    if (Platform.OS == "android") {
      requestCameraPermission()
    }
  }, [])


  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const backAction = async () => {

    await Alert.alert(
      "Need confirmation ?",
      "Data not saved are you sure to want to exit?",
      [
        {
          text: "No",
          onPress: () => logger.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            onLeaving()
          },
        },
      ],
      { cancelable: false }
    )
  };

  const onLeaving = () => {
    setClearState(!ClearState)
    navigation.navigate('MainContainerModule')
    return true;
  }

  const _onDragEvent = () => {
    setSignatureCaptured(true)
  };

  const ClearSign = () => {

    if (Signsaved == true) {

      cdispatch({ type: "SubmitPageSign", payload: [] });

      setSignResult([]);
      setSignsaved(false)
      setSignatureCaptured(false)
    }
    else {
      sign.current.resetImage();

      cdispatch({ type: "SubmitPageSign", payload: [] });

      setSignResult([]);
      setSignsaved(false)
      setSignatureCaptured(false)
    }

  };

  const SaveSign = async () => {



    if (SignatureCaptured == true) {
      await sign.current.saveImage();
      showToast({ message: "Signature Captured", type: 'success', position: 'bottom', duration: 3000 });



    }


  };
  const _onSaveEvent = (result) => {

    let base64 = "data:image/png;base64," + result.encoded;

    let SignatureName = (Math.random() + 1).toString(36).substring(7);

    let obj = {
      delete: "Sign",
      baseimg: base64,
      type: "image",
      name: "Signature" + "_" + SignatureName + ".png",
    };

    setSignResult(obj);
    setSignsaved(true)

    cdispatch({ type: "SubmitPageSign", payload: [obj] });
  };
  const getDefaultData = async () => {
    let Url = cstate.KeyUrl + 'FPC13S3/';
    const params = {
      data: {
        p1: data.ServiceTypeIDPK ? data.ServiceTypeIDPK : null,
        p2: null,
        p3: null,
        p4: null,
        p5: null,
        p6: null,
        p7: null,
        p8: null,
        p9: null,
        p10: null,
        p11: null,
        p12: null,
        p13: null,
        p14: 1,
        p15: 10,
        p16: "SERVICEPORTALDEFAULT",
        p17: cstate.UserGroupID,
        p18: cstate.UserID,
      },
    };


    await CommonAPISelectWOT(Url, params).then(async (response) => {
      logger.log({ Url, params, response }, 'default data')

      const data = response?.Output?.data || [];
      const status = response?.Output?.status

      if (status.code == 200) {
        if (data.length > 0) {
          setDefaultData(data)
        } else {
          setShowLocationMissingAlert(true)
          setDefaultData([])
        }
      } else {
        setDefaultData([])
      }

    })
      .catch((error) => {
        logger.log(error);
      });
  };


  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        logger.log("Camera permission given");
      } else {
        logger.log("Camera permission denied");
      }
    } catch (err) {
      logger.warn(err);
    }
  };

  const Mediafunction = async (val) => {
    if (val == 1) {
      const options = {
        saveToPhotos: false,
        mediaType: "photo",
        includeBase64: true,
        quality: 0.1,
        selectionLimit: 1,
        storageOptions: {
          skipBackup: true,
          path: "images",
        },
      };
      setOpenImageMedia(!OpenImageMedia);
      logger.log('take photo 1')
      await ImagePicker.launchCamera(options, async (res) => {

        logger.log({ res }, 'take photo')
        let base64 = "data:image/png;base64," + res.assets[0].base64;

        let imgName = res.assets[0]?.fileName;
        var imgName1 = imgName.split(".")[0];

        var FinalName1 = imgName1.split("-")[0];

        let obj = {
          delete: "Image",
          baseimg: base64,
          type: "image",
          name: FinalName1 + ".png",
        };


        let ImageDatas = [obj, ...cstate.SubmitPageImage]

        let MediaDatas = [obj, ...cstate.SubmitMediaDatas]

        cdispatch({ type: "SubmitPageImage", payload: ImageDatas });

        cdispatch({ type: "SubmitMediaDatas", payload: MediaDatas });

        showToast({ message: "Image captured successfully", type: 'success', position: 'bottom', duration: 3000 });



      });
    } else if (val == 2) {
      const options = {
        saveToPhotos: true,
        mediaType: "photo",
        includeBase64: true,
        quality: 0.1,
        selectionLimit: 1,
        storageOptions: {
          skipBackup: true,
          path: "images",
        },
      };
      setOpenImageMedia(!OpenImageMedia);
      ImagePicker.launchImageLibrary(options, async (res) => {

        let base64 = "data:image/png;base64," + res.assets[0].base64;

        let imgName = res.assets[0].fileName;
        var imgName1 = imgName.split(".")[0];

        var FinalName1 = imgName1.split("-")[0];

        let obj = {
          delete: "Image",
          baseimg: base64,
          type: "image",
          name: FinalName1 + ".png",
        };

        let ImageDatas = [obj, ...cstate.SubmitPageImage]

        let MediaDatas = [obj, ...cstate.SubmitMediaDatas]

        cdispatch({ type: "SubmitPageImage", payload: ImageDatas });

        cdispatch({ type: "SubmitMediaDatas", payload: MediaDatas });
        showToast({ message: "Image selected successfully", type: 'success', position: 'bottom', duration: 3000 });

      });
    } else if (val == 3) {
      const options = {
        title: "Select video",
        mediaType: "video",
        quality: 1,
        videoQuality: "medium",
        durationLimit: 30,
        includeExtra: false,
        saveToPhotos: false,
        includeBase64: true,
      };
      ImagePicker.launchCamera(options, async (res) => {
        logger.log({ res })

        let uri = res.assets[0].uri;

        let filename = res.assets[0].uri.substring(
          res.assets[0].uri.lastIndexOf("-") + 1,
          res.assets[0].uri.length
        );
        let codec = Platform.OS === "android" ? "mp4" : "mov";
        let videotype = `video/${codec}`;



        await ReactNativeBlobUtil.fetch(
          "POST",
          cstate.KeyUrl + "uploadVideo/",
          {
            "Content-Type": "multipart/form-data",
          },
          [
            {
              name: "files",
              filename: filename.replace("MOV", "mov"),
              type: videotype,
              data:
                Platform.OS === "android"
                  ? ReactNativeBlobUtil.wrap(uri)
                  : ReactNativeBlobUtil.wrap(uri.replace("file://", "")),
            },
            {
              name: "info",
              data: JSON.stringify({
                videoTitle: filename.replace("MOV", "mov"),
                videoDiscription: videotype,
              }),

            },
          ]
        )
          .then((response) => response.json())
          .then(async (res) => {
            setIsVideoSaving(true);
            logger.log({ res })
            let videopath = res.path;
            let obj = {
              delete: "Video",
              basevideo: videopath,
              type: "video",
              name: filename,
            };
            cdispatch({ type: "SubmitPageVideo", payload: obj });
            let MediaDatas = cstate.SubmitMediaDatas.concat(obj);
            cdispatch({ type: "SubmitMediaDatas", payload: MediaDatas });
            showToast({ message: "Video saved successfully", type: 'success', position: 'bottom', duration: 3000 });
            setIsVideoSaving(false)
          })
          .catch((error) => {
            setIsVideoSaving(false)
          });
      });

    } else {
      logger.log(cstate.SubmitPageImage, "cstate.SubmitPageImage");
    }

  };

  const renderImages = ({ item, index }) => (
    <View
      style={{
        width: "auto",
        height: Commonheight(500),
        justifyContent: "flex-start",
      }}
    >
      <Image
        style={{
          width: Commonwidth(280),
          height: Commonheight(300),
          alignSelf: "center",
          marginLeft: Commonwidth(5),
          resizeMode: "stretch",
          marginVertical: Commonheight(15)
        }}
        source={{ uri: item.baseimg }}
      />
      <TouchableOpacity
        onPress={() => DeleteImages(index)}
        style={{
          width: Commonwidth(100),
          height: Commonheight(40),
          borderRadius: Commonwidth(25),
          backgroundColor: Commoncolor.CommonAppColor,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            fontSize: Commonsize(15),
            fontWeight: "400",
            color: Commoncolor.CommonWhiteColor,
            alignSelf: "center",
          }}
        >
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );
  const onBtmDataPress = (item) => {
    setShowBtmSheet(false)
    if (Type == 'DIVISIONIDPK') {
      setNOCSelectedDataArray([])
      setDivisionSelectedDataArray(item)
    } else {
      setNOCSelectedDataArray(item)
    }
  }
  const renderCCMComplaintDatas = ({ item }) => {
    return (

      <TouchableOpacity
        onPress={() => { onBtmDataPress(item) }}
        style={{
          width: "95%",
          alignSelf: "center",
          height: Commonheight(35),
          justifyContent: "center",
          borderBottomWidth: Commonwidth(0.3),
          borderBottomColor: Commoncolor.CommonAppColor,
        }}
      >
        <Text
          style={{
            width: "100%",
            fontSize: Commonsize(13),
            color: Commoncolor.CommonBlackColor,
            fontWeight: "400",
            alignSelf: "center",
          }}
        >
          {Type == 'DIVISIONIDPK' ? item?.DivisionName : Type == 'COMPLAINTNATUREIDPK' ? item?.ComplaintNatureName : ''}
        </Text>
      </TouchableOpacity>

    )
  };
  const DeleteImages = (index) => {

    const SelectedImages = cstate.SubmitPageImage.filter(
      (photo, photoIndex) => photoIndex !== index
    );

    const SelectedMediaImages = cstate.SubmitMediaDatas.filter(
      (photo, photoIndex) => photoIndex !== index
    );

    cdispatch({ type: "SubmitPageImage", payload: SelectedImages });

    cdispatch({ type: "SubmitMediaDatas", payload: SelectedMediaImages });

  };

  const DeleteAudio = () => {



    cdispatch({ type: "PlayAudioPath", payload: "" });

    cdispatch({ type: "SubmitPageAudio", payload: [] });

    const DeletedAudio = cstate.SubmitMediaDatas.filter((item) => {
      return item.delete !== "Audio";
    });

    cdispatch({ type: "SubmitMediaDatas", payload: DeletedAudio });

  };

  const PlaySubmitAudio = (val) => {
    // setCurrentPosition(0)
    // setDuration(0)
    // setIsPaused(false)
    setOpenAudioMedia(!OpenAudioMedia);

  };

  const AudioPlayerClose = async () => {
    setOpenAudioMedia(!OpenAudioMedia);
  };

  const DeleteVideo = () => {

    cdispatch({ type: "SubmitPageVideo", payload: [] });

    const DeletedVideo = cstate.SubmitMediaDatas.filter((item) => {
      return item.delete !== "Video";
    });

    cdispatch({ type: "SubmitMediaDatas", payload: DeletedVideo });


  };

  const LoginAuthentication = async () => {

    let Url = cstate.KeyUrl + "FPU19S3/";
    let SessionId = cstate.SessionID;
    let ProductID = await AsyncStorage.getItem("ProductID")
    let xuid = await AsyncStorage.getItem("xuid")
    let xRefreshToken = await AsyncStorage.getItem("xRefreshToken")

    let params = {
      p1: cstate.UserID,
      p2: SessionId,
      p3: ProductID,
      p4: xRefreshToken
    };

    await CommonAPISelectWOT(Url, params)
      .then(async (res) => {
        logger.log({ Url, params, res }, 'LoginAuthentication')

        res.TokenIDPK ?? 0
        if (
          res.TokenIDPK == ""
        ) {
          LogoutFunction(cstate, navigation)
          showToast({ message: res.message ? res.message : 'Invalid Session', type: 'error', position: 'bottom', duration: 3000 });
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
          let Url2 = cstate.KeyUrl + 'FPM290S1/';
          await CCMComplaints_Save(xuid, mytknid, mytknname, Url2);
        }
      })
      .catch((error) => {
        logger.log(error);
      });
  };
  const ToggleSubmittedAlertModal = async (id = '') => {

    setShow(!Show)
  }
  const CCMComplaints_Save = async (XUID, TokenID, TokenName, Url) => {

    logger.log({
      XUID, TokenID, TokenName, Url
    }, ' XUID, TokenID, TokenName, Url')

    var today = new Date();
    var currentTime =
      today.getHours() >= 12
        ? ("0" + today.getHours()).slice(-2) +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds() +
        " PM"
        : ("0" + today.getHours()).slice(-2) +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds() +
        " AM";
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var todayDate1 = year + "-" + month + "-" + date;
    var todayDate = todayDate1 + " " + currentTime;
    var TodaysDate = todayDate;

    let params = {
      data: [
        {
          "P1": ""
          , "P2": ""
          , "P3": ""
          , "P4": TodaysDate
          , "P5": null
          , "P6": null
          , "P7": null
          , "P8": Description.replace(/[^a-zA-Z0-9 ]/g, "")
          , "P9": ""
          , "P10": ""
          , "P11": "0"
          , "P12": 5
          , "P13": 0
          , "P14": "0"
          , "P15": NOCSelectedDataArray.ComplaintNatureIDPK ? null : NOCSelectedDataArray.ComplaintNatureName
          , "P16": "0"
          , "P17": "0"
          , "P18": ""
          , "P19": null
          , "P20": 0
          , "P21": "0"
          , "P22": "0"
          , "P23": ""
          , "P24": ""
          , "P25": null
          , "P26": ""
          , "P27": null
          , "P28": 0
          , "P29": cstate.UserID
          , "P30": 0
          , "P31": 0
          , "P32": 0
          , "P33": 0
          , "P34": 0
          , "P35": 0
          , "P36": 0
          , "P37": 0
          , "P38": ""
          , "P39": 0
          , "P40": "0"
          , "P41": 0
          , "P42": ""
          , "P43": ""
          , "P44": 0
          , "P45": ""
          , "P46": ""
          , "P47": ""
          , "P48": ""
          , "P49": "0"
          , "P50": null
          , "P51": DefaultData[0]?.ContractIDPK ? DefaultData[0]?.ContractIDPK : null
          , "P52": DefaultData[0]?.LocalityIDPK ? DefaultData[0]?.LocalityIDPK : null
          , "P53": DefaultData[0]?.BuildingIDPK ? DefaultData[0]?.BuildingIDPK : null
          , "P54": DefaultData[0]?.FloorIDPK ? DefaultData[0]?.FloorIDPK : null
          , "P55": DefaultData[0]?.SpotIDPK ? DefaultData[0]?.SpotIDPK : null
          , "P56": null
          , "P57": NOCSelectedDataArray?.DivisionID ? NOCSelectedDataArray?.DivisionID : null
          , "P58": null
          , "P59": ""
          , "P60": NOCSelectedDataArray?.ComplaintNatureIDPK ? NOCSelectedDataArray?.ComplaintNatureIDPK : null
          , "P61": ""
          , "P62": data.ServiceTypeIDPK ? data.ServiceTypeIDPK : null   //service type id
          , "P63": null
          , "P64": 3
          , "P65": 1
          , "P66": NOCSelectedDataArray?.CCMComplaintTypeID ? NOCSelectedDataArray?.CCMComplaintTypeID : null   //ComplaintTypeID
          , "P67": null
          , "P68": null
          , "P69": null
          , "P70": null
          , "P71": null
          , "P72": "1"
          , "P73": "0"
          , "P74": XUID
          , "P75": ""
          , "P76": cstate.UserID
          , "P77": ""
        },
      ],
    };

    await CommonAPISelectWT(Url, params, XUID, TokenID, TokenName)
      .then(async (response) => {
        logger.log({ Url, params, response }, 'CCMComplaints_Save')
        var TransId = JSON.stringify(response[0].Data.IDPK);


        var Status = response[0].status;

        let ImagesArray = cstate.SubmitMediaDatas;
        let SignatureArray = cstate.SubmitPageSign;

        if (Status.code == "200") {
          CountApiCall()
          if (ImagesArray.length > 0 && SignatureArray.length > 0) {

            MediaData_Save(TransId, TodaysDate, ImagesArray);
            Signature_Save(TransId, TodaysDate, SignatureArray);

            cdispatch({ type: 'Scanresult', payload: "" })
            ToggleSubmittedAlertModal(response[0].Data.IDPK)

            showToast({ message: "Your complaint has submitted successfully", type: 'success', position: 'bottom', duration: 4000 });
          }
          else if (ImagesArray.length > 0) {

            MediaData_Save(TransId, TodaysDate, ImagesArray);

            cdispatch({ type: 'Scanresult', payload: "" })
            ToggleSubmittedAlertModal(response[0].Data.IDPK)
            showToast({ message: "Your complaint has submitted successfully", type: 'success', position: 'bottom', duration: 4000 });
          }
          else if (SignatureArray.length > 0) {

            Signature_Save(TransId, TodaysDate, SignatureArray);

            cdispatch({ type: 'Scanresult', payload: "" })
            ToggleSubmittedAlertModal(response[0].Data.IDPK)
            showToast({ message: "Your complaint has submitted successfully", type: 'success', position: 'bottom', duration: 4000 });
          }
          else {

            cdispatch({ type: 'Scanresult', payload: "" })
            ToggleSubmittedAlertModal(response[0].Data.IDPK)

            showToast({ message: "Your complaint has submitted successfully", type: 'success', position: 'bottom', duration: 4000 });
          }
          setLoader(false);
        }
        else {
          cdispatch({ type: 'Scanresult', payload: "" })
          navigation.navigate("MainContainerModule");
          showToast({ message: Status?.message, type: 'info', position: 'bottom', duration: 3000 });
          setLoader(false);
          logger.log('error')
        }
      })
      .catch((error) => {
        setLoader(false);
        logger.log(error);
        logger.log(error, 'error')
        cdispatch({ type: 'Scanresult', payload: "" })
        navigation.navigate("MainContainerModule");
        showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
      });
  };


  const MediaData_Save = async (TransId, TodaysDate, ImagesArray) => {

    let Url = cstate.KeyUrl + 'FP10S1/';

    let paramdata = [];

    ImagesArray.map((item, i) => {
      paramdata.push({
        "p1": "0", // AdminImageIDPK_int
        "p2": "",
        "p3": item.name, //ImageName_varchar
        "p4": "",
        "p5": "",
        "p6": (item.type == "image" || item.type == "signature") ? item.baseimg : item.type == "audio" ? item.baseaudio : "", //ImageSource_image
        "p7": item.type == "video" ? item.basevideo : "", //ImgPath_varchar
        "p8": (item.type == "image" || item.type == "signature") ? "png" : item.type == "video" ? "mp4" : "mp3", //ImgType_varchar
        "p9": item.type == "image" ? "image" : item.type == "video" ? "video" : item.type == "audio" ? 'audio' : 'signature', //  TransType_varchar
        "p10": "",
        "p11": 0, //IsDefault_bit
        "p12": "",
        "p13": "",
        "p14": TransId, //TransID_int
        "p15": 290, //ModFormID_int
        "p16": "0", //TransTypeID_int
        "p17": "1", // IsActive_bit
        "p18": "",
        "p19": cstate.UserID, //CreatedUserID_int
        "p20": TodaysDate, //CreatedTtm_datetime
        "p21": cstate.UserID, //UpdatedUserID_int
        "p22": TodaysDate, //UpdatedTtm_datetime
      });
    });

    let params = {
      data: paramdata,
    };

    await CommonAPISelectWT(Url, params, cstate.TokenID, cstate.TokenName)
      .then(async (response) => {
        cdispatch({ type: "SubmitPageImage", payload: [] });
        cdispatch({ type: "SubmitPageAudio", payload: [] });
        cdispatch({ type: "SubmitPageVideo", payload: [] });
        cdispatch({ type: "SubmitMediaDatas", payload: [] });
        cdispatch({ type: "SubmitPageSign", payload: [] });
        setSignResult([]);
      })
      .catch((error) => {
        logger.log(error, "error");
        cdispatch({ type: "SubmitPageImage", payload: [] });
        cdispatch({ type: "SubmitPageAudio", payload: [] });
        cdispatch({ type: "SubmitPageVideo", payload: [] });
        cdispatch({ type: "SubmitMediaDatas", payload: [] });
        cdispatch({ type: "SubmitPageSign", payload: [] });
        setSignResult([]);
      });
  };

  const Signature_Save = async (TransId, TodaysDate, SignatureArray) => {

    let Url = cstate.KeyUrl + 'FP10S1/';


    let paramdata = [];

    SignatureArray.map((item, i) => {
      paramdata.push({
        "p1": "0", // AdminImageIDPK_int
        "p2": "74",   //74 for signature
        "p3": item.name, //ImageName_varchar
        "p4": "",
        "p5": "",
        "p6": item.baseimg, //ImageSource_image
        "p7": "", //ImgPath_varchar
        "p8": "png", //ImgType_varchar
        "p9": "image", //  TransType_varchar
        "p10": "",
        "p11": 0, //IsDefault_bit
        "p12": "",
        "p13": "",
        "p14": TransId, //TransID_int
        "p15": 290, //ModFormID_int
        "p16": "0", //TransTypeID_int
        "p17": "1", // IsActive_bit
        "p18": "",
        "p19": cstate.UserID, //CreatedUserID_int
        "p20": TodaysDate, //CreatedTtm_datetime
        "p21": cstate.UserID, //UpdatedUserID_int
        "p22": TodaysDate, //UpdatedTtm_datetime
      });
    });

    let params = {
      data: paramdata,
    };

    await CommonAPISelectWT(Url, params, cstate.TokenID, cstate.TokenName)
      .then(async (response) => {
        cdispatch({ type: "SubmitPageImage", payload: [] });
        cdispatch({ type: "SubmitPageAudio", payload: [] });
        cdispatch({ type: "SubmitPageVideo", payload: [] });
        cdispatch({ type: "SubmitMediaDatas", payload: [] });
        cdispatch({ type: "SubmitPageSign", payload: [] });
        setSignResult([]);
      })
      .catch((error) => {
        logger.log(error, "error");
        cdispatch({ type: "SubmitPageImage", payload: [] });
        cdispatch({ type: "SubmitPageAudio", payload: [] });
        cdispatch({ type: "SubmitPageVideo", payload: [] });
        cdispatch({ type: "SubmitMediaDatas", payload: [] });
        cdispatch({ type: "SubmitPageSign", payload: [] });
        setSignResult([]);
      });
  };

  const DivisionAndNOCSelect = async (type, search) => {
    try {

      let Url = cstate.KeyUrl + 'FPC13S3/';


      const params = {
        data: {
          p1: data.ServiceTypeIDPK ? data.ServiceTypeIDPK : null,
          p2: null,
          p3: null,
          p4: null,
          p5: null,
          p6: DivisionSelectedDataArray.DivisionIDPK ? DivisionSelectedDataArray.DivisionIDPK : null, //division id
          p7: search ? "%" + search + "%" : '', //search by word
          p8: null,
          p9: null,
          p10: "",
          p11: "",
          p12: "",
          p13: null,
          p14: 1,
          p15: 1000,
          p16: type,
          p17: cstate.UserGroupID,
          p18: cstate.UserID,
        },
      };



      await CommonAPISelectWOT(Url, params).then(async (res) => {


        var Data = res?.Output?.data;
        var Status = res.Output.status;

        logger.log({ Url, params, res }, type)

        if (Status.code == '200' || Status.code == 200) {
          setDivisionandNocDataArray(Data)
          setIsBtmLoader(false)
        }
        else {
          setDivisionandNocDataArray([])
          showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
          setIsBtmLoader(false)
        }
        setIsBtmLoader(false)
      });
    } catch (error) {
      setIsBtmLoader(false)
      logger.log(error);
      setDivisionandNocDataArray([])
      showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
    }
  };
  const CountApiCall = async () => {
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
          p15: 10,
          p16: "COMPLAINTCOUNT",
          p17: cstate.UserGroupID,
          p18: cstate.UserID,
        },
      };


      await CommonAPISelectWOT(Url, params).then(async (res) => {


        var Count = res?.Output?.data[0];
        var Status = res.Output.status;

        logger.log({ Url, params, res }, "SmartHelpdeskPortalSummary Count")

        if (Status.code == '200' || Status.code == 200) {
          cdispatch({ type: "Home_page_count", payload: Count });
        }
        else {
          cdispatch({ type: "Home_page_count", payload: [] });
          showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
        }
      });
    } catch (error) {
      logger.log(error);
      cdispatch({ type: "Home_page_count", payload: [] });
      showToast({ message: "Something went wrong try again", type: 'error', position: 'bottom', duration: 3000 });
    }
  };


  const finalSubmit = async () => {
    if (!DivisionSelectedDataArray.DivisionIDPK) {
      showToast({ message: "Request Category is not selected", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (!NOCSelectedDataArray.ComplaintNatureIDPK) {
      showToast({ message: "Nature of Request is not selected", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (!DefaultData[0]?.LocalityIDPK) {
      showToast({ message: "Facility details not configured. Please set your default facility details", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (!DefaultData[0]?.BuildingIDPK) {
      showToast({ message: "Facility details not configured. Please set your default facility details", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (!DefaultData[0]?.FloorIDPK) {
      showToast({ message: "Facility details not configured. Please set your default facility details", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (!DefaultData[0]?.SpotIDPK) {
      showToast({ message: "Facility details not configured. Please set your default facility details", type: 'error', position: 'bottom', duration: 3000 });
    }
    else {
      setLoader(true);
      LoginAuthentication();
    }
  }

  const onNOCandRCFeildPress = (val) => {
    if (val == 1) {
      setIsBtmLoader(true);
      setType('DIVISIONIDPK');
      DivisionAndNOCSelect("DIVISIONIDPK");
      setShowBtmSheet(true)
    } else if (val == 2) {
      setIsBtmLoader(true);
      setType('COMPLAINTNATUREIDPK');
      DivisionAndNOCSelect("COMPLAINTNATUREIDPK");
      setShowBtmSheet(true)
    } else {
      'none of the above pressed'
    }
  }


  const startPlaying = async () => {
    try {
      if (isPaused) {
        await audioRecorderPlayer.resumePlayer();
        setIsPaused(false);
      } else {
        await audioRecorderPlayer.startPlayer(cstate.SubmitPageAudio?.baseaudio ? cstate.SubmitPageAudio?.baseaudio : '');


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
        { backgroundColor: Commoncolor.CommonAppColor },
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
          Create a Service Request
        </Text>
      </View>

      <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: Commonheight(0), backgroundColor: Commoncolor.CommonWhiteColor, borderTopLeftRadius: Commonsize(20), borderTopRightRadius: Commonsize(20), marginTop: Commonheight(5) }}>

        <View style={{ width: '90%', height: '100%', flex: 1, }}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'never'} nestedScrollEnabled>

            <CommonCard style={{ marginTop: Commonheight(15), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>
              <View style={{ width: '90%', minHeight: Commonheight(60), alignSelf: 'center', paddingVertical: Commonheight(10) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: Commonheight(5) }}>
                  <View style={{ width: Commonsize(50), height: Commonsize(50), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), borderRadius: Commonsize(5), overflow: 'hidden' }}>
                    <Image source={data.FilePath ? { uri: data.FilePath } : require('../../../Assets/Images/empty.jpeg')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </View>
                  <View>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, }}>Service Type</Text>
                    <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>{data?.ServiceTypeName}</Text>

                  </View>
                </View>
                <Divider style={{ marginVertical: Commonheight(5) }} />
                <View style={{ marginTop: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Request Category *</Text>
                  <TouchableOpacity onPress={() => { onNOCandRCFeildPress(1) }} >
                    <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), paddingVertical: Commonheight(10), borderRadius: Commonsize(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: Commonsize(1) }}>{DivisionSelectedDataArray.DivisionName ? DivisionSelectedDataArray.DivisionName : 'Select Request Category'}</Text>
                  </TouchableOpacity>

                </View>
                <View style={{ marginTop: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Nature of Request *</Text>
                  <TouchableOpacity onPress={() => { onNOCandRCFeildPress(2) }} >
                    <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), paddingVertical: Commonheight(10), borderRadius: Commonsize(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: Commonsize(1), }}>{NOCSelectedDataArray.ComplaintNatureName ? NOCSelectedDataArray.ComplaintNatureName : 'Select Nature of Request'}</Text>
                  </TouchableOpacity>

                </View>

                <View style={{ marginVertical: Commonheight(5) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>Description</Text>
                  <CommonMaterialInputField
                    value={Description}
                    onChangeText={(e) => { setDescription(e), logger.log({ Description }) }}
                    style={{ marginTop: Commonheight(10), color: Commoncolor.CommonTextMildBlack }}
                    placeholder="Please Enter Description"
                    placeholderTextColor={Commoncolor.CommonTextMildBlack}
                    totalNoOfCount={250}
                    countStyle={{ marginTop: Commonheight(5), color: Commoncolor.CommonAppColor, fontSize: Commonsize(11) }}
                  />
                </View>


                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Commonheight(10) }}>

                  <TouchableOpacity
                    disabled={cstate.SubmitPageImage.length > 4}
                    onPress={() => { setOpenImageMedia(true) }} style={{
                      width: Commonwidth(80), height: Commonheight(60), backgroundColor: Commoncolor.CommonWhiteColor, borderColor: Commoncolor.CommonGrayColor, borderWidth: Commonsize(1), justifyContent: 'center', alignItems: "center", borderRadius: Commonsize(10), shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.15,
                      shadowRadius: 1.00,
                      elevation: 1
                    }}>
                    <View style={{ width: Commonwidth(40), height: Commonheight(40), justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={require('../../../Assets/Images/cameraIcon.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </View>
                  </TouchableOpacity>



                  <TouchableOpacity
                    disabled={cstate.SubmitPageAudio.length != 0}
                    onPress={() => navigation.navigate("AudioRecord")}
                    style={{
                      width: Commonwidth(80), height: Commonheight(60), backgroundColor: Commoncolor.CommonWhiteColor, borderColor: Commoncolor.CommonGrayColor, borderWidth: Commonsize(1), justifyContent: 'center', alignItems: "center", borderRadius: Commonsize(10), shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.15,
                      shadowRadius: 1.00,
                      elevation: 1
                    }}>
                    <View style={{ width: Commonwidth(40), height: Commonheight(40), justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={require('../../../Assets/Images/audioIcon.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={cstate.SubmitPageVideo.length != 0}
                    onPress={() => { cdispatch({ type: "SubmitPageVideo", payload: [] }); Mediafunction(3) }}
                    style={{
                      width: Commonwidth(80), height: Commonheight(60), backgroundColor: Commoncolor.CommonWhiteColor, borderColor: Commoncolor.CommonGrayColor, borderWidth: Commonsize(1), justifyContent: 'center', alignItems: "center", borderRadius: Commonsize(10), shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.15,
                      shadowRadius: 1.00,
                      elevation: 1
                    }}>
                    <View style={{ width: Commonwidth(40), height: Commonheight(40), justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={require('../../../Assets/Images/videoIcon.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            </CommonCard>
            {((cstate.SubmitPageImage.length != 0) || (cstate.SubmitPageAudio.length != 0) || (cstate.SubmitPageVideo.length != 0))
              &&
              <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

                <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: "center", alignItems: 'flex-start', marginBottom: Commonheight(8) }}>
                  <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Attachments</Text>
                </View>


                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                  {cstate.SubmitPageImage.map((val, i) => {
                    return (
                      <TouchableOpacity onPress={() => setOpenImagePreview(!OpenImagePreview)} style={{ width: Commonsize(90), height: Commonsize(90), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden' }}>
                        <Image source={{ uri: val.baseimg }} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: Commonsize(10) }} />
                        <TouchableOpacity onPress={() => { DeleteImages(i) }} style={{ position: 'absolute', top: 3, right: 3 }}>
                          <Icon2 name={"circle-with-cross"} size={Commonsize(20)} style={{ color: Commoncolor.CommonRedColor, alignSelf: "center", }} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )
                  })}
                  {cstate.SubmitPageAudio.length != 0 &&
                    <TouchableOpacity onPress={() => PlaySubmitAudio(1)} style={{ width: Commonsize(90), height: Commonsize(90), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', backgroundColor: Commoncolor.CommonAppColor, borderRadius: Commonsize(10) }}>
                      <Icon9
                        name={"musical-notes"}
                        size={Commonsize(30)}
                        style={[CommonStyles.HomeTopIcon]}
                      />
                      <TouchableOpacity onPress={() => { DeleteAudio() }} style={{ position: 'absolute', top: 3, right: 3 }}>
                        <Icon2 name={"circle-with-cross"} size={Commonsize(20)} style={{ color: Commoncolor.CommonRedColor, alignSelf: "center", }} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  }
                  {cstate.SubmitPageVideo.length != 0 &&
                    <TouchableOpacity onPress={() => { setOpenVideoPlayer(!OpenVideoPlayer); }} style={{ width: Commonsize(90), height: Commonsize(90), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', backgroundColor: Commoncolor.CommonAppColor, borderRadius: Commonsize(10) }}>
                      <Icon9
                        name={"play-circle"}
                        size={Commonsize(40)}
                        style={{
                          color: Commoncolor.CommonWhiteColor,
                          alignSelf: "center",
                        }}
                      />
                      <TouchableOpacity onPress={() => { DeleteVideo() }} style={{ position: 'absolute', top: 3, right: 3 }}>
                        <Icon2 name={"circle-with-cross"} size={Commonsize(20)} style={{ color: Commoncolor.CommonRedColor, alignSelf: "center", }} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  }
                  {IsVideoSaving &&
                    <TouchableOpacity disabled={true} style={{ width: Commonsize(90), height: Commonsize(90), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), overflow: 'hidden', backgroundColor: Commoncolor.CommonAppColor, borderRadius: Commonsize(10) }}>
                      <CircularLoader size={20} />
                    </TouchableOpacity>
                  }

                </ScrollView>

              </CommonCard>}

            <CommonCard style={{ paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), marginVertical: Commonheight(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>

              <View style={{ width: '100%', minHeight: Commonheight(20), justifyContent: 'space-between', alignItems: 'center', marginBottom: Commonheight(8), flexDirection: 'row' }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Work Location Details</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('ChangeLocationPage') }} style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonGreenColor, marginRight: Commonwidth(4) }}>Change Location</Text>
                  <Icon5 name={"pencil"} size={Commonsize(12)} style={{ color: Commoncolor.CommonGreenColor, }} />
                </TouchableOpacity>
              </View>

              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Location</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{DefaultData[0]?.LocalityName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Building</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{DefaultData[0]?.BuildingName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Floor</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{DefaultData[0]?.FloorName}</Text>
              </View>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', paddingRight: Commonwidth(10) }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', width: '40%' }}>Spot</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>:</Text>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{DefaultData[0]?.SpotName}</Text>
              </View>
            </CommonCard>

            <CommonCard style={{ marginBottom: Commonheight(10), paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), borderColor: Commoncolor.CommonDarkGrayColor, borderWidth: 1 }}>
              <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: Commonheight(8) }}>
                <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Signature</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => ClearSign()}
                    style={{ backgroundColor: Commoncolor.CommonMildRedColor, paddingHorizontal: Commonwidth(10), paddingVertical: Commonheight(4), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: Commonsize(5), marginRight: Commonwidth(5) }}>
                    <Icon11 name={"delete"} size={Commonsize(18)} style={{ color: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(5) }} />
                    <Text style={{ fontSize: Commonsize(10), color: Commoncolor.CommonWhiteColor, fontWeight: '500', }}>Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { SaveSign() }}
                    style={{ backgroundColor: Commoncolor.CommonAppColor, paddingHorizontal: Commonwidth(10), paddingVertical: Commonheight(4), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: Commonsize(5) }}>
                    <Icon1 name={"save"} size={Commonsize(18)} style={{ color: Commoncolor.CommonWhiteColor, marginRight: Commonwidth(5) }} />
                    <Text style={{ fontSize: Commonsize(10), color: Commoncolor.CommonWhiteColor, fontWeight: '500', }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {Signsaved == true ?
                <Image
                  style={{
                    width: "100%",
                    marginTop: Commonheight(5),
                    height: Commonheight(150),
                    alignSelf: "center",
                    borderRadius: Commonsize(5)
                  }}
                  source={{ uri: SignResult.baseimg }}
                /> :
                <View>
                  <SignatureCapture
                    style={{
                      width: "100%",
                      marginTop: Commonheight(5),
                      height: Commonheight(150),
                      alignSelf: "center",
                      borderRadius: Commonsize(5),
                      overflow: 'hidden'
                    }}
                    ref={sign}
                    onSaveEvent={_onSaveEvent}
                    onDragEvent={_onDragEvent}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={"portrait"}
                    backgroundColor={"#e6e6e6"}
                    minStrokeWidth={Commonwidth(8)}
                    maxStrokeWidth={Commonwidth(8)}
                    showBorder={true}
                  />

                </View>
              }
            </CommonCard>


          </ScrollView>

        </View>

        {Loader == true
          ?
          <View style={{ width: "100%", height: Commonheight(45), justifyContent: "center", alignItems: "center", }} >
            <CircularLoader color={Commoncolor.CommonAppColor} size={20} />
          </View>
          :

          <TouchableOpacity disabled={Loader} onPress={() => { finalSubmit() }} style={{ width: '100%', height: Commonheight(45), backgroundColor: Commoncolor.CommonAppColor, justifyContent: 'center', alignItems: "center" }}>
            <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonWhiteColor, fontWeight: '500', }}>Submit</Text>
          </TouchableOpacity>}
      </View>


      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={Show}
        onRequestClose={() => { ToggleSubmittedAlertModal(); navigation.navigate("MainContainerModule"); }}
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
          <CommonCard style={{ width: '90%', alignSelf: 'center', justifyContent: "center", alignItems: "center", paddingVertical: Commonheight(50), backgroundColor: '#fff', zIndex: 999 }}>

            <View style={{ width: Commonsize(60), height: Commonsize(60), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), backgroundColor: '#fff', marginBottom: Commonheight(10) }}>
              <Image source={require('../../../Assets/Images/successAlert.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </View>
            <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonDarkTextGray, textAlign: 'center', paddingHorizontal: Commonwidth(10) }}>Your service request has been submitted successfully!</Text>

          </CommonCard>
          <TouchableOpacity onPress={() => { ToggleSubmittedAlertModal(); navigation.navigate("MainContainerModule"); }} style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>

          </TouchableOpacity>
        </View>
      </Modal>


      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={OpenImageMedia}
        onRequestClose={() => { setOpenImageMedia(!OpenImageMedia) }}
      >
        <View style={{ width: "100%", flex: 1, alignSelf: "center", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "70%", minHeight: Commonheight(200), alignSelf: "center", backgroundColor: "#ffffff", borderRadius: Commonsize(10), paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), alignItems: 'center', justifyContent: 'center' }}>

            <Text style={{ color: Commoncolor.CommonTextMildBlack, fontSize: Commonsize(14), fontWeight: '500', marginVertical: Commonheight(15) }}>Upload Images from</Text>

            <View style={{ width: "80%", height: Commonheight(110), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <TouchableOpacity onPress={() => { Mediafunction(1) }} style={{ width: Commonsize(70), height: Commonheight(85), justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ width: Commonsize(60), height: Commonsize(60), borderRadius: Commonsize(10), overflow: 'hidden', backgroundColor: Commoncolor.CommonAppColor, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={require('../../../../src/Assets/Images/cameraIcon.png')} resizeMode='cover' style={{ width: Commonsize(30), height: Commonsize(30), tintColor: '#fff' }} />
                </View>
                <Text style={{ color: Commoncolor.CommonTextMildBlack, fontSize: Commonsize(12), fontWeight: '500' }}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { Mediafunction(2) }} style={{ width: Commonsize(70), height: Commonheight(85), justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ width: Commonsize(60), height: Commonsize(60), borderRadius: Commonsize(10), overflow: 'hidden', backgroundColor: Commoncolor.CommonAppColor, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={require('../../../../src/Assets/Images/galleryIcon.png')} resizeMode='cover' style={{ width: Commonsize(30), height: Commonsize(30), tintColor: '#fff' }} />
                </View>
                <Text style={{ color: Commoncolor.CommonTextMildBlack, fontSize: Commonsize(12), fontWeight: '500' }}>Gallery</Text>
              </TouchableOpacity>



            </View>


          </View>
          <TouchableOpacity onPress={() => { setOpenImageMedia(!OpenImageMedia) }} style={{ width: '100%', height: '100%', flex: 1, position: "absolute", zIndex: -1, top: 0, left: 0, }}>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={OpenAudioMedia}
        onRequestClose={() => { AudioPlayerClose(); stopPlaying(); }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={[
              CommonStyles.AudioCard3,
              {
                height: Commonheight(250),
                marginTop: Commonheight(10),
                shadowColor: Commoncolor.CommonAppColor,
              },
            ]}
          >
            <TouchableOpacity onPress={() => { AudioPlayerClose(); stopPlaying(); }}>
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

          <TouchableOpacity onPress={() => { AudioPlayerClose(); stopPlaying(); }} style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', zIndex: -999, top: 0, left: 0, }}>

          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={OpenImagePreview}
        onRequestClose={() => { setOpenImagePreview(!OpenImagePreview) }}
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
              zIndex: 9999
            }}
          >
            <TouchableOpacity onPress={() => setOpenImagePreview(!OpenImagePreview)}>
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
              data={cstate.SubmitPageImage}
              renderItem={renderImages}
            />
          </View>
          <TouchableOpacity onPress={() => { setOpenImagePreview(!OpenImagePreview) }} style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: -99 }}>

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
        onRequestClose={() => { setOpenAudioPlayer(false) }}
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
            style={[CommonStyles.AudioCard3, { height: Commonheight(450), zIndex: 999 }]}
          >
            <TouchableOpacity onPress={() => setOpenAudioPlayer(false)}>
              <Icon1
                name={"closecircle"}
                size={Commonsize(25)}
                style={{
                  color: Commoncolor.CommonAppColor,
                  alignSelf: "flex-end",
                  bottom: Commonheight(20),
                  marginRight: Commonwidth(10),
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                width: "95%",
                height: Commonheight(370),
                backgroundColor: Commoncolor.CommonBlackColor,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >

            </View>
          </View>

          <TouchableOpacity onPress={() => { setOpenAudioPlayer(false) }} style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: -99 }}>

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
            style={[CommonStyles.AudioCard3, { height: Commonheight(380), zIndex: 999, position: 'relative', overflow: 'hidden' }]}
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
              source={{ uri: cstate.SubmitPageVideo.basevideo }}
              resizeMode='stretch'
              ref={videoRef}
            />

          </View>
          <TouchableOpacity onPress={() => { setOpenVideoPlayer(false) }} style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: -99 }}>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* default location data missing alert */}
      <Modal
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={ShowLocationMissingAlert}
        onRequestClose={() => { setShowLocationMissingAlert(false) }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={{ width: Commonwidth(300), height: Commonheight(200), backgroundColor: Commoncolor.CommonWhiteColor, borderRadius: Commonsize(10), paddingVertical: Commonheight(10), paddingHorizontal: Commonwidth(10), justifyContent: 'space-evenly', alignItems: 'center', zIndex: 999 }}>
            <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonDarkTextGray, textAlign: 'center', }}>The selected service is not available at your location. Please change your location to get these services.</Text>

            <View style={{ width: '100%', flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => { setShowLocationMissingAlert(false) }}
                style={{
                  width: Commonwidth(110), height: Commonheight(30), backgroundColor: Commoncolor.CommonWhiteColor, justifyContent: "center", alignItems: 'center', borderRadius: Commonsize(5), borderColor: Commoncolor.CommonAppColor, borderWidth: Commonsize(.5), shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.17,
                  shadowRadius: 2.54,
                  elevation: 3
                }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, textAlign: 'center', }}>cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate('ChangeLocationPage') }} style={{
                width: Commonwidth(110), height: Commonheight(30), backgroundColor: Commoncolor.CommonAppColor, justifyContent: "center", alignItems: 'center', borderRadius: Commonsize(5), shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.17,
                shadowRadius: 2.54,
                elevation: 3
              }}>
                <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonWhiteColor, textAlign: 'center', }}>change location</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => { setShowLocationMissingAlert(false) }} style={{ width: '100%', height: '100%', flex: 1, position: 'absolute', top: 0, left: 0, zIndex: -999 }}></TouchableOpacity>
        </View>
      </Modal>

      <BottomSheet
        visible={ShowBtmSheet}
        onRequestClose={() => { setShowBtmSheet(false) }}
        keyboardShouldPersistTaps="never"
        animationType={'fade'}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.04)', justifyContent: 'flex-end', alignItems: 'center' }} >


          <View style={{ width: '100%', height: Commonheight(380), backgroundColor: '#fff', borderTopLeftRadius: Commonsize(20), borderTopRightRadius: Commonsize(20), zIndex: 999999 }}>
            <View style={{ width: "100%", height: Commonheight(25), justifyContent: "center", alignItems: "center" }}>
              <View style={{ width: "20%", height: Commonheight(3), backgroundColor: Commoncolor.CommonMildGrayColor, borderRadius: Commonsize(10) }}></View>
            </View>

            <View style={{ width: "100%", height: Commonheight(30), justifyContent: "flex-start", alignItems: "center", marginVertical: Commonheight(5), }}>
              <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>{Type == 'DIVISIONIDPK' ? 'Request Category' : Type == 'COMPLAINTNATUREIDPK' ? 'Nature of Complaint' : ''}</Text>
            </View>

            <View style={{ flex: 1, width: "90%", alignSelf: 'center' }}>
              <View style={{ width: "100%", height: Commonheight(40), backgroundColor: Commoncolor.CommonLightGray, borderRadius: Commonsize(10) }}>
                <TextInput
                  style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', borderRadius: Commonsize(10), paddingHorizontal: Commonwidth(10) }}
                  placeholder='Search'
                  placeholderTextColor={Commoncolor.CommonMildGrayColor}
                  onChangeText={(val) => { DivisionAndNOCSelect(Type, val) }}
                />
              </View>

              {
                IsBtmLoader == true
                  ?
                  <View
                    style={{
                      flex: 1,
                      width: "100%",
                      height: Commonheight(45),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularLoader color={Commoncolor.CommonAppColor} size={20} />
                  </View>
                  :
                  DivisionandNOCDataArray.length == 0
                    ?
                    <NoImage imageStyle={{ height: Commonheight(60), width: Commonheight(60), }} imageContainerStyle={{ minHeight: Commonheight(60) }} bottomTextStyle={{ fontSize: Commonsize(11), color: Commoncolor.CommonDarkTextGray }} />
                    :
                    <View style={{ flex: 1, width: "100%", height: '100%', borderRadius: Commonsize(10), paddingTop: Commonheight(10) }}>
                      <FlatList
                        data={DivisionandNOCDataArray}
                        keyExtractor={(item, index) => index.toString()}
                        enableEmptySections={true}
                        // onEndReachedThreshold={0.1}
                        // onEndReached={async ({ distanceFromEnd }) => {
                        //     if (CCMArrayDatas.length > 9) {
                        //         setChangepageindex(Changepageindex + 1);
                        //         CCMComplaints_Select(CCMDataType, Changepageindex + 1);
                        //     } else {
                        //         setChangepageindex(Changepageindex);
                        //         logger.log("No More Than 10");
                        //     }
                        // }}
                        renderItem={renderCCMComplaintDatas}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                      />
                    </View>
              }
            </View>
          </View>

          <TouchableOpacity onPress={() => { setShowBtmSheet(false) }} style={{ flex: 1, height: '100%', width: '100%', position: "absolute", top: 0, left: 0, zIndex: -9999 }}>

          </TouchableOpacity>

        </View>
      </BottomSheet>


    </View >
  )
}

export default ServiceRequestPage