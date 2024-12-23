
import Commoncolor from "../CommonFolder/CommonColor";
import { Commonwidth, Commonheight, Commonsize } from "../Utils/ResponsiveWidget";


const CommonStyles = {
  // Common Styles

  CommonFlex: { flex: 1, backgroundColor: Commoncolor.CommonBackgroundColor },
  CommonEndView: { width: "100%", height: Commonheight(50) },
  CommonHeaderView1: {
    width: "50%",
    height: Commonheight(50),
    position: "absolute",
  },
  CommonHeaderView2: {
    width: "100%",
    height: Commonheight(50),

    // borderBottomRightRadius: Commonwidth(100),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: 'center'
  },
  CommonHeaderViewTouch: {
    width: "15%",
    justifyContent: "center",
    alignSelf: "center",
  },
  CommonHeaderViewIcon: {
    alignSelf: "center",
    color: Commoncolor.CommonWhiteColor,
  },
  CommonHeaderViewText: {
    width: "85%",
    alignSelf: "center",
    fontSize: Commonsize(16),
    color: Commoncolor.CommonWhiteColor,
    fontWeight: "500",
  },
  CommonHeaderView3: {
    flex: 1,
    width: "100%",
    backgroundColor: Commoncolor.CommonBackgroundColor,
    // borderTopLeftRadius: Commonheight(50),
  },
  CommonHeaderTop: { marginTop: Commonheight(30) },
  CCMComplaintBottomSheetMainView: {
    width: "100%",
    backgroundColor: Commoncolor.CommonWhiteColor,
    borderTopLeftRadius: Commonwidth(40),
    borderTopRightRadius: Commonwidth(40),
  },
  CCMComplaintBottomSheetSubView1: {
    width: "90%",
    height: Commonheight(40),
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  CCMComplaintBottomSheetSubViewText1: {
    fontSize: Commonsize(18),
    fontWeight: "bold",
    letterSpacing: Commonwidth(0.3),
    color: Commoncolor.CommonBlackColor,
  },

  CCMComplaintBottomSheetSubView2: {
    width: "100%",
    height: Commonheight(220),
    alignSelf: "center",
    justifyContent: "center",
    // borderTopLeftRadius:Commonwidth(35),
    // borderTopRightRadius:Commonwidth(35)
  },
  CCMComplaintBottomSheetSubViewImage: {
    width: "100%",
    height: Commonheight(220),
    alignSelf: "center",
    borderTopLeftRadius: Commonwidth(30),
    borderTopRightRadius: Commonwidth(30),
  },

  CCMComplaintBottomSheetSubView3: {
    width: "90%",
    height: "auto",
    alignSelf: "center",
  },
  CCMComplaintBottomSheetDivView1: {
    width: "100%",
    height: "auto",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  CCMComplaintBottomSheetDivView2: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  CCMComplaintBottomSheetSubDivView1: {
    justifyContent: "center",
  },

  CCMComplaintBottomSheetDivViewText2: { fontSize: Commonsize(12) },

  // EntityKeyPage Styles

  KeyDownOvalView: {
    height: Commonheight(200),
    width: "100%",
    backgroundColor: Commoncolor.EntityKeyDownColor,
    borderBottomLeftRadius: Commonwidth(240),
    borderBottomRightRadius: Commonwidth(190),
    transform: [{ scaleX: 1.5 }],
  },
  KeyUpOvalView: {
    height: Commonheight(190),
    width: "100%",
    position: "absolute",
    backgroundColor: Commoncolor.EntityKeyUpColor,
    borderBottomLeftRadius: Commonwidth(190),
    borderBottomRightRadius: Commonwidth(190),
    transform: [{ scaleX: 1.5 }],
    justifyContent: "center",
    alignSelf: "center",
  },
  KeyMainView: { flex: 0.8 },
  KeySubView: {
    width: "100%",
    height: Commonheight(300),
    justifyContent: "space-evenly",
  },
  KeyImage: {
    width: "60%",
    height: Commonheight(100),
    justifyContent: "center",
    alignSelf: "center",
  },
  KeyTouchable: {
    width: Commonwidth(120),
    height: Commonheight(40),
    backgroundColor: Commoncolor.EntityKeyUpColor,
    alignSelf: "center",
    borderRadius: Commonwidth(30),
    justifyContent: "center",
  },
  KeyTouchableText: {
    color: Commoncolor.CommonWhiteColor,
    alignSelf: "center",
    fontSize: Commonsize(14),
  },

  // SplashScreen Styles

  SplashMainView: {
    flex: 1,
    backgroundColor: Commoncolor.CommonWhiteColor,
  },
  SplashSubView: { flex: 0.5, justifyContent: "center" },
  SplashImage: {
    width: "90%",
    height: Commonheight(100),
    justifyContent: "center",
    alignSelf: "center",
  },
  SplashDivView: {
    flex: 0.1,
    justifyContent: "center",
    backgroundColor: Commoncolor.CommonWhiteColor,
  },
  SplashDivText: {
    fontSize: Commonsize(14),
    color: Commoncolor.CommonBlackColor,
    alignSelf: "center",
  },

  // LoginPage Styles
  LoginSubView: { flex: 0.3, justifyContent: "center" },
  LoginSubView1: { flex: 0.4 },
  LoginSubView2: { flex: 0.3, justifyContent: "space-evenly" },
  LoginSignTextTouch: { justifyContent: "center", alignSelf: "center" },
  LoginDivView: {
    width: "100%",
    height: Commonheight(140),
    justifyContent: "space-evenly",
  },
  LoginDivView1: {
    width: "100%",
    height: Commonheight(120),
    justifyContent: "space-between",
  },
  LoginDivView2: {
    width: "80%",
    height: Commonheight(30),
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  LoginDivView3: {
    width: "100%",
    height: Commonheight(60),
    justifyContent: "center",
  },
  LoginDivView4: {
    width: "100%",
    height: Commonheight(40),
    justifyContent: "center",
  },
  LoginDivView5: {
    width: "100%",
    height: Commonheight(50),
    justifyContent: "flex-end",
  },
  LoginTouch1: { width: "40%", height: Commonheight(25) },
  LoginTouch2: { width: "30%", height: Commonheight(25) },
  LoginTouch3: {
    width: "80%",
    height: Commonheight(40),
    borderRadius: Commonwidth(20),
    justifyContent: "center",
    alignSelf: "center",
  },
  LoginTouch4: {
    width: "30%",
    height: Commonheight(30),
    alignSelf: "center",
    justifyContent: "center",
  },
  LoginTouch5: { width: "50%", alignSelf: "center" },
  LoginTouchText1: {
    fontSize: Commonsize(12),
  },
  LoginTouchText2: {
    fontSize: Commonsize(16),
    fontWeight: "500",
    textAlign: "center",
  },
  LoginTouchText3: {
    fontSize: Commonsize(15),
    alignSelf: "center",
  },
  LoginTouchText4: {
    fontSize: Commonsize(15),
    alignSelf: "center",
  },
  LoginImage: {
    width: "90%",
    height: Commonheight(90),
    justifyContent: "center",
    alignSelf: "center",
  },
  LoginIcon: {
    alignSelf: "center",
  },
  LoginInputView: {
    width: "80%",
    height: Commonheight(40),
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: Commonheight(0)
  },
  LoginInput: {
    width: "85%",
    height: Commonheight(40),
    fontSize: Commonsize(14),
    color: Commoncolor.CommonBlackColor,
  },
  LoginDividerView: {
    width: "80%",
    height: Commonheight(1),
    alignSelf: "center",
    bottom: Commonheight(15),
  },

  LoginModalView: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  LoginModalSubView: {
    height: Commonheight(180),
    width: "90%",
    borderRadius: Commonwidth(10),
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    flexDirection: "column",
    elevation: 6,
  },
  LoginModalSubView1: {
    flexDirection: "row",
    width: "100%",
    height: Commonheight(60),
    justifyContent: "flex-end",
  },
  LoginModalSubView2: {
    width: "100%",
    height: Commonheight(100),
    justifyContent: "space-around",
    alignSelf: "center",
  },

  LoginModalSubView3: {
    width: "100%",
    height: Commonheight(80),
    justifyContent: "space-around",
  },

  LoginModalText: {
    fontSize: Commonsize(16),
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: Commonwidth(15),
  },
  LoginModalText1: {
    width: "90%",
    fontSize: Commonsize(14),
    fontWeight: "400",
    alignSelf: "center",
    color: Commoncolor.CommonBlackColor,
    textAlign: "justify"
  },
  LoginModalTouch: {
    width: Commonwidth(80),
    height: Commonheight(40),
    alignSelf: "center",
    borderRadius: Commonwidth(20),
    justifyContent: "center",
  },
  LoginModalTouch1: {
    height: "80%",
    width: "35%",
    backgroundColor: "#000",
    justifyContent: "center",
    borderRadius: Commonwidth(5),
  },

  LoginModalTouchText: {
    fontSize: Commonsize(13),
    fontWeight: "bold",
    textAlign: "center",
  },
  LoginModalTouchText1: {
    color: "#fff",
    fontSize: Commonsize(13),
    fontWeight: "bold",
    textAlign: "center",
  },

  //HomePage Styles

  HomeTopView: { flex: 0.08, flexDirection: "row", justifyContent: "center" },
  HomeTopMainView: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  HomeTopMainView1: {
    width: "15%",
    justifyContent: "center",
    alignSelf: "center",
  },
  HomeTopSubView: { width: "20%", height: "auto", justifyContent: "center" },
  HomeTopSubView1: {
    width: "80%",
    height: "auto",
    justifyContent: "center",
    bottom: Commonheight(3),

  },
  HomeTopIcon: { alignSelf: "center", color: Commoncolor.CommonWhiteColor },
  HomeTopTouchView: {
    width: Commonwidth(10),
    height: Commonheight(10),
    borderRadius: Commonwidth(10),
    position: "absolute",
    marginLeft: Commonwidth(25),
    justifyContent: "center",
    backgroundColor: Commoncolor.CommonRedColor,
  },
  HomeTopTouchViewText: {
    color: Commoncolor.CommonWhiteColor,
    alignSelf: "center",
    fontSize: Commonsize(7),
  },
  HomeTopViewText: {
    color: Commoncolor.CommonWhiteColor,
    fontSize: Commonsize(8),
    alignSelf: "center",
    fontWeight: "bold",
  },
  HomeTopSubView1Text: {
    color: Commoncolor.CommonWhiteColor,
    letterSpacing: Commonwidth(0.5),
  },
  HomeTopSubView1Image: {
    width: Commonwidth(150),
    height: Commonheight(60),
    marginTop: Commonheight(5),
  },
  HomeMiddleSubView: { flex: 0.09, justifyContent: "center" },
  HomeMiddleSubViewText1: {
    width: "90%",
    alignSelf: "center",
    fontSize: Commonsize(18),
    fontWeight: "500",
    color: Commoncolor.CommonBlackColor,
    letterSpacing: Commonwidth(0.3),
  },
  HomeMiddleSubViewText2: {
    fontWeight: "400",
    letterSpacing: Commonwidth(0.1),
    fontSize: Commonsize(14),
  },
  HomeBottomMainView: { flex: 0.92 },
  HomeBottomSubView: {
    width: "100%",
    height: Commonheight(120),
    justifyContent: "center",
  },
  HomeAdvertiseImage: {
    width: Commonwidth(320),
    height: Commonheight(150),
    justifyContent: "flex-end",
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 2,
  },
  HomeAdvertiseImageText1: {
    width: "90%",
    height: Commonheight(25),
    alignSelf: "center",
    fontSize: Commonsize(14),
    color: Commoncolor.CommonWhiteColor,
  },
  HomeBottomSubView1: {
    width: "100%",
    height: Commonheight(170),
  },
  HomeBottomSubViewTouch: {
    width: "95%",
    height: Commonheight(70),
    borderRadius: Commonwidth(10),
    backgroundColor: Commoncolor.CommonWhiteColor,
    justifyContent: "space-evenly",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 2,
  },
  HomeBottomSubViewText1: {
    fontSize: Commonsize(9),
    fontWeight: "bold",
    alignSelf: "center",
  },
  HomeBottomSubView2: {
    width: "100%",
    height: Commonheight(150),
  },
  HomeBottomSubView2Div1: {
    height: Commonheight(180),
    justifyContent: "center",
  },
  HomeBottomSubView2Div2: {
    width: Commonwidth(120),
    height: Commonheight(130),
    backgroundColor: Commoncolor.CommonWhiteColor,
    flexDirection: "column",
    marginLeft: Commonwidth(10),
    borderRadius: Commonwidth(10),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 2,
  },
  HomeAdvertisementImage: {
    width: Commonwidth(120),
    height: Commonheight(90),
    alignSelf: "center",
    // borderBottomLeftRadius: Commonwidth(10),
    borderTopLeftRadius: Commonwidth(10),
    borderTopRightRadius: Commonwidth(10),
  },
  HomeAdvertisementText: {
    width: "90%",
    height: Commonheight(15),
    alignSelf: "center",

    color: Commoncolor.CommonBlackColor,
  },
  HomeAdvertisementTopView: {
    width: "90%",
    height: Commonheight(20),
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  HomeAdvertisementTopViewText1: {
    fontSize: Commonsize(15),
    fontWeight: "500",
    color: Commoncolor.CommonBlackColor,
    alignSelf: "center",
  },
  HomeAdvertisementTopViewText2: {
    fontSize: Commonsize(12),
    fontWeight: "500",
  },
  HomeLastMainView: {
    width: "95%",
    height: Commonheight(60),
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
  },
  HomeLastMainViewTouch: {
    width: "48%",
    height: Commonheight(40),
    borderRadius: Commonwidth(10),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  HomeLastSubView1: {
    width: "80%",
    height: Commonheight(40),
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  HomeLastSubView2: { height: Commonheight(40), justifyContent: "center" },
  HomeLastSubViewText: {
    color: Commoncolor.CommonWhiteColor,
    fontSize: Commonsize(14),
    alignSelf: "center",
    fontWeight: "500",
  },

  HomeMenuExitSlider: {
    height: "100%",
    width: "30%",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: Commonwidth(10),
  },
  HomeMenuSliderText: {
    color: Commoncolor.CommonBlackColor,
    fontSize: Commonwidth(12),
    fontWeight: "500",
    paddingLeft: Commonwidth(15),
  },
  HomeMenuSliderlist: {
    height: Commonheight(43),
    // borderBottomWidth: Commonwidth(0.5),
    // borderBottomColor: '#cccccc',
    marginTop: Commonheight(5),
    width: "100%",
    paddingLeft: Commonwidth(20),
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center",
    flexDirection: "row",
  },
  HomeMenuSliderMainView: {
    flex: 1,
    width: "70%",
    backgroundColor: "#ffffff",
    padding: Commonwidth(5),
    alignSelf: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    flexDirection: "column",
    elevation: 6,
  },
  HomeMenuSliderView: {
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
  },
  HomeAnnoSubView: {
    width: Commonwidth(120),
    height: Commonheight(140),
    alignSelf: "center",
    marginLeft: Commonwidth(10),
    borderRadius: Commonwidth(10),
    backgroundColor: Commoncolor.CommonWhiteColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  HomeAnnoImage: {
    width: "100%",
    height: Commonheight(90),
    borderRadius: Commonwidth(5),
  },
  HomeAnnoText: {
    width: "95%",
    alignSelf: "center",
    color: Commoncolor.CommonBlackColor,
    fontSize: Commonsize(12),
    fontWeight: "500",
  },
  HomeAnnoDivView: {
    width: "100%",
    height: Commonheight(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  HomeAnnoDivText: {
    fontSize: Commonsize(16),
    color: Commoncolor.CommonBlackColor,
    fontWeight: "500",
  },

  // MyUnit Page

  UnitRenderMainView: {
    height: Commonheight(100),
    width: "90%",
    backgroundColor: Commoncolor.CommonWhiteColor,
    borderRadius: Commonwidth(10),
    marginTop: Commonheight(20),
    justifyContent: "space-evenly",
    alignSelf: "center",
    flexDirection: "row",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  UnitRenderSubView: {
    height: "100%",
    justifyContent: "center",
    alignSelf: "center",
    borderTopLeftRadius: Commonheight(10),
    borderBottomLeftRadius: Commonheight(10),
  },
  UnitRenderSubViewText: {
    color: Commoncolor.CommonBlackColor,
    alignSelf: "center",
  },

  // Submit Page

  SubmitStepperView: {
    width: "100%",
    height: Commonheight(100),
    justifyContent: "center",
    alignSelf: "center",
  },
  SubmitFinalButton: {
    width: "100%",
    height: Commonheight(50),
    justifyContent: "space-between",
    alignSelf: "center",
    flexDirection: "row",
  },
  SubmitFinalButtonTouch: {
    width: Commonwidth(80),
    height: Commonheight(40),
    justifyContent: "space-evenly",
    alignSelf: "center",
    flexDirection: "row",
  },
  SubmitFinalButtonTouchIcon: {
    alignSelf: "center",
    marginTop: Commonheight(1),
  },
  SubmitFinalButtonTouchText: {
    fontSize: Commonsize(15),
    fontWeight: "bold",
    alignSelf: "center",
  },
  SubmitPropertyMainView: {
    width: "100%",
    height: "auto",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  SubmitPropertySubView: {
    width: "95%",
    height: Commonheight(55),
    justifyContent: "space-around",
    alignSelf: "center",
  },
  SubmitPropertySubViewText: {
    width: "95%",
    fontSize: Commonsize(14),
    fontWeight: "500",
    alignSelf: "center",
  },
  SubmitPropertySubViewTouch: {
    width: "95%",
    height: Commonheight(30),
    alignSelf: "center",
    borderBottomWidth: Commonwidth(1),
    justifyContent: "center",
  },
  SubmitPropertySubViewTouchText: {
    width: "90%",
    fontSize: Commonsize(13),
    fontWeight: "400",
    alignSelf: "center",
  },
  SubmitDetailsMainView: {
    width: "100%",
    height: "auto",
  },
  SubmitDetailsSubView1: {
    width: "100%",
    height: "auto",
    justifyContent: "space-evenly",
  },
  SubmitDetailsDivText1: {
    width: "90%",
    alignSelf: "center",
    fontSize: Commonsize(15),
    fontWeight: "500",
    color: Commoncolor.CommonBlackColor,
  },
  SubmitDetailsDivCard1: {
    width: "90%",
    height: Commonheight(50),
    backgroundColor: Commoncolor.CommonWhiteColor,
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Commonheight(10),
  },
  SubmitComplaintVoiceView: {
    width: "90%",
    height: Commonheight(170),
    backgroundColor: "#e6e6e6",
    alignSelf: "center",
    borderBottomWidth: Commonwidth(1),
    marginTop: Commonheight(5),
  },
  SubmitComplaintVoiceSubView: {
    width: "100%",
    height: Commonheight(40),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  SubmitComplaintVoiceSubText: {
    alignSelf: "center",
    fontSize: Commonsize(14),
    fontWeight: "500",
  },
  SubmitComplaintVoiceSubTouch: {
    width: "20%",
    height: Commonheight(40),
    alignSelf: "center",
    justifyContent: "center",
  },
  SubmitDetailsMediaCardView1: {
    width: "15%",
    height: Commonheight(50),
    alignSelf: "center",
    justifyContent: "center",
  },
  SubmitDetailsMediaCardView2: {
    width: "70%",
    height: Commonheight(50),
    alignSelf: "center",
    justifyContent: "center",
  },
  SubmitDetailsMediaCardView3: {
    width: "15%",
    height: Commonheight(50),
    alignSelf: "center",
    justifyContent: "center",
  },
  SubmitDetailsMediaCardView2Text: {
    fontSize: Commonsize(14),
    color: Commoncolor.CommonBlackColor,
    fontWeight: "400",
  },
  SubmitDetailsImageCard: {
    backgroundColor: Commoncolor.CommonWhiteColor,
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    justifyContent: "center",
    marginTop: Commonheight(10),
  },
  SubmitDetailsImageMainView: {
    width: "110%",
    height: Commonheight(180),
    justifyContent: "space-evenly",
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    flexDirection: "row",
  },
  SubmitDetailsImageSubView1: {
    width: "48%",
    height: Commonheight(170),
    alignSelf: "center",
    borderRadius: Commonheight(10),
  },
  SubmitDetailsImageSubView2: {
    width: "48%",
    height: Commonheight(180),
    borderRadius: Commonheight(10),
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  SubmitDetailsImageDivView1: {
    width: "95%",
    height: Commonheight(80),
    alignSelf: "center",
    borderRadius: Commonheight(10),
  },
  SubmitDetailsImage1: {
    height: Commonheight(170),
    borderRadius: Commonwidth(10),
  },
  SubmitDetailsImage2: {
    width: "100%",
    height: Commonheight(80),
    borderRadius: Commonwidth(10),
  },
  SubmitDetailsAudioCard: {
    width: "85%",
    height: Commonheight(50),
    backgroundColor: Commoncolor.CommonWhiteColor,
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: Commonheight(10),
  },
  SubmitDetailsAudioCardTouch: {
    width: "18%",
    height: Commonheight(35),
    justifyContent: "space-evenly",
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    marginRight: Commonwidth(28),
  },
  SubmitDetailsAudioCardView: {
    width: "80%",
    height: Commonheight(60),
    justifyContent: "space-between",
    alignSelf: "center",
    flexDirection: "row",
  },
  SubmitDetailsAudioCardViewText: {
    fontSize: Commonsize(14),
    color: Commoncolor.CommonBlackColor,
    fontWeight: "500",
    alignSelf: "center",
    marginLeft: Commonwidth(10),
  },
  SubmitDetailsVideoView: {
    width: "100%",
    height: Commonheight(150),
    borderRadius: Commonwidth(10),
    backgroundColor: "#cccccc",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  SubmitDetailsDateView1: {
    width: "95%",
    alignSelf: "center",
    marginTop: Commonheight(10),
    flexDirection: "row",
    justifyContent: "space-around",
  },
  SubmitDetailsDateSubView1: {
    height: Commonheight(30),
    alignSelf: "center",
    justifyContent: "center",
  },
  SubmitDetailsDateSubViewText1: {
    fontSize: Commonsize(14),
    color: Commoncolor.CommonBlackColor,
    alignSelf: "center",
    fontWeight: "400",
  },
  SubmitDetailsDateTouch: {
    height: Commonheight(40),
    justifyContent: "center",
    backgroundColor: Commoncolor.CommonWhiteColor,
    alignSelf: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  SubmitDetailsDateTouchText: {
    fontWeight: "500",
    alignSelf: "center",
  },
  SubmitDetailsDateNoteText: {
    width: "90%",
    alignSelf: "center",
    fontSize: Commonsize(13),
    fontWeight: "300",
    color: Commoncolor.CommonBlackColor,
  },
  SubmitDetailsSignView1: {
    width: "50%",
    height: Commonheight(35),
    alignSelf: "center",
  },
  SubmitDetailsSignView2: {
    width: "25%",
    height: Commonheight(35),
    flexDirection: "row",
    // justifyContent: "flex-end",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  SubmitDetailsSignTouch: {
    width: Commonwidth(70),
    height: Commonheight(30),
    justifyContent: "center",
    alignSelf: "center",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
  },
  SubmitDetailsSignTouchText: {
    fontSize: Commonsize(13),
    fontWeight: "500",
    alignSelf: "center",
  },

  CommonHeadTailText: {
    fontSize: Commonsize(14),
    fontWeight: "400",
    color: Commoncolor.Commonblack,
    letterSpacing: Commonwidth(0.3),
  },
  CommonTabText: {
    fontWeight: "500",
    fontSize: Commonsize(13),
    justifyContent: "center",
    alignSelf: "center",
  },

  // Audio Save Page

  AudioView1: {
    width: "100%",
    flex: 1,
    backgroundColor: Commoncolor.CommonBackgroundColor,
    justifyContent: "center",
    alignSelf: "center",
  },
  AudioView2: {
    width: "100%",
    height: Commonheight(400),
    alignSelf: "center",
  },
  AudioCard3: {
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: Commoncolor.CommonWhiteColor,
    borderRadius: Commonheight(10),
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  AudioView4: {
    width: "100%",
    height: Commonheight(100),
    justifyContent: "center",
    alignSelf: "center",
  },
  AudioView5: {
    width: "100%",
    height: Commonheight(100),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  AudioTouchable: {
    width: Commonheight(100),
    height: Commonheight(40),
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: Commonwidth(20),
  },
  AudioText: {
    textAlign: "center",
    color: Commoncolor.CommonWhiteColor,
    fontWeight: "400",
  },

  // Track Details Page

  TrackRenderMainView: {
    width: "90%",
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    backgroundColor: Commoncolor.CommonWhiteColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  TrackRenderSubView: {
    width: "20%",
    height: Commonheight(20),
    alignSelf: "flex-end",
    justifyContent: "center",
    marginTop: Commonheight(8),
    borderTopLeftRadius: Commonwidth(5),
    borderBottomLeftRadius: Commonwidth(5),
  },
  TrackRenderSubViewText: {
    color: Commoncolor.CommonWhiteColor,
    fontSize: Commonsize(12),
    alignSelf: "center",
    fontWeight: "500"
  },
  TrackTopTabMainView: {
    width: "100%",
    height: Commonheight(70),
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  TrackTopTabSubView: {
    width: "42%",
    height: Commonheight(45),
    backgroundColor: Commoncolor.CommonWhiteColor,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: Commonwidth(10),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  TrackTopTabSubViewText: {
    fontWeight: "500",
    fontSize: Commonsize(14),
    justifyContent: "center",
    alignSelf: "center",
  },
  HomeLastMainViewTouch1: {
    width: "65%",
    height: Commonheight(45),
    borderRadius: Commonwidth(25),
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: Commonwidth(38),
  },

  // Need Help

  NeedHelpHeading: {
    marginTop: Commonheight(20),
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: Commonsize(18),
    color: Commoncolor.CommonBlackColor,
  },
  NeedHelpAccordianView1: {
    width: "90%",
    height: Commonheight(45),
    justifyContent: "center",
    alignSelf: "center",
    marginTop: Commonheight(20),
    flexDirection: "row",
  },
  NeedHelpAccordianView1Text1: {
    width: "85%",
    textAlign: "justify",
    fontWeight: "500",
    color: "#000000",
    fontWeight: "bold",
    fontSize: Commonsize(13),
    alignSelf: "center",
  },
  NeedHelpAccordianView1Touch: {
    height: Commonheight(40),
    width: "15%",
    justifyContent: "center",
    alignSelf: "center",
  },
  NeedHelpIconCenter: {
    justifyContent: "center",
    alignSelf: "center",
    color: Commoncolor.CommonBlackColor,
  },
  NeedHelpDivider: {
    width: "90%",
    borderWidth: Commonwidth(0.3),
    borderColor: Commoncolor.CommonBlackColor,
    alignSelf: "center",
  },
  NeedHelpViewPage: { fontWeight: "500", fontSize: Commonsize(15) },
  NeedHelpViewPageExtension: {
    color: Commoncolor.CommonBlackColor,
    textAlign: "justify",
    fontSize: Commonsize(13),
  },
  NeedHelpAccordianView2: {
    width: "90%",
    height: Commonheight(120),
    alignSelf: "center",
  },
  NeedHelpAccordianView3: {
    width: "90%",
    height: Commonheight(300),
    alignSelf: "center",
  },

  //drawer styles
};

export default CommonStyles;
