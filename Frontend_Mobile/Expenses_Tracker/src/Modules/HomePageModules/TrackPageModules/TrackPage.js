import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CommonStyles from '../../../CommonFolder/CommonStyles';
import { GlobalContext } from '../../../../App';
import { Commonsize, Commonwidth, Commonheight, } from '../../../Utils/ResponsiveWidget';
import Commoncolor from '../../../CommonFolder/CommonColor';
import CommonAPISelectWOT from '../../../APIMethods/CommonAPISelectWOT';
import NoImage from '../../../Components/NoImage';
import LogoutFunction from '../../../Utils/LogoutFunction';
import SkeletonSkimmer from '../../../Components/Skimmer';
import delay from '../../../Utils/delay';
import { Icon10 } from '../../../CommonFolder/CommonIcons';
import { Card } from '../../../Components/Card';
import { useToast } from '../../../Context/ToastProvider';
import logger from '../../../Utils/logger';



const TrackPage = () => {

  const [Changepageindex, setChangepageindex] = useState(1);
  const [IsLoader, setIsLoader] = useState(false);
  const [FliterState, setFilterState] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [Search, setSearch] = useState('')
  const [SearchChanged, setSearchChanged] = useState(false)

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;
  const navigation = useNavigation()

  const { showToast } = useToast();


  useEffect(() => {
    setHasMore(true)
    setIsLoader(true);
    setChangepageindex(1);
    cdispatch({ type: 'CCMComplaintDatasOpen', payload: [] })
    LoginAuthentication();
    CCMComplaints_Select_Open(1);
  }, [FliterState]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    cdispatch({ type: 'BottomNavigationTab', payload: 0 });

    return true;
  };

  const onRefresh = React.useCallback(() => {
    setIsLoader(true);
    setHasMore(true)
    setChangepageindex(1);
    setSearch('')
    setSearchChanged(false)
    LoginAuthentication();
    CCMComplaints_Select_Open(1);
    delay(1000).then(() => setRefreshing(false));
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
        res.TokenIDPK = res.TokenIDPK ?? 0
        if (!res.TokenIDPK) {
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

          CountApiCall(mytknid, mytknname)

        }
      })
      .catch((error) => {
        logger.log(error);
      });
  };

  const CCMComplaints_Select_Open = async (page, search = '') => {
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
          p7: search ? "%" + search + "%" : '', //search by word
          p8: null,  // complaint id
          p9: FliterState ? FliterState : null,
          p10: "",
          p11: "",
          p12: "",  // start date filter
          p13: null,  // end date filter
          p14: page,
          p15: 10,
          p16: "PORTALCOMPLAINTID",
          p17: cstate.UserGroupID,
          p18: cstate.UserID,
        },
      };


      await CommonAPISelectWOT(Url, params).then(async (res) => {
        logger.log({ Url, params, res })

        var TrackData = res.Output.data;
        var Status = res.Output.status;
        // var { data: TrackData, status: Status } = res.Output

        if (Status.code == 200) {
          if (TrackData.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }


          if (SearchChanged == true) {
            cdispatch({ type: 'CCMComplaintDatasOpen', payload: [] });
          }

          if (page === 1) {
            cdispatch({ type: 'CCMComplaintDatasOpen', payload: TrackData });
          } else {
            let allData = [...cstate.CCMComplaintDatasOpen, ...TrackData]
            cdispatch({ type: 'CCMComplaintDatasOpen', payload: allData });
          }


        }
        else {
          setHasMore(false)
          cdispatch({ type: 'CCMComplaintDatasOpen', payload: [] });
          showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });
        }
        setSearchChanged(false)
        setIsLoader(false);
      });
    } catch (error) {
      logger.log(error);
      setSearchChanged(false)
      setIsLoader(false);
      cdispatch({ type: 'CCMComplaintDatasOpen', payload: [] });
      showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });
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


        var Count = res?.Output?.data;
        var Status = res.Output?.status;

        // logger.log({ Url, params, res }, "SmartHelpdeskPortalSummary Count")

        if (Status.code == 200) {
          cdispatch({ type: "Home_page_count", payload: Count[0] });
        }
        else {
          cdispatch({ type: "Home_page_count", payload: [] });
          showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });
        }
      });
    } catch (error) {
      logger.log(error);
      cdispatch({ type: "Home_page_count", payload: [] });
      showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });
    }
  };


  const Movetrackdetail = async item => {
    await cdispatch({ type: 'TrackDetailsData', payload: item });
    navigation.navigate('TrackDetailsPage');
  };

  const renderCCMComplaintDatasOpen = ({ item }) => (
    <Card disabled={false} onPress={() => Movetrackdetail(item)} style={{ marginBottom: Commonheight(10), width: '90%', alignSelf: 'center', paddingVertical: Commonheight(15) }}>

      <View style={{ height: Commonheight(20), backgroundColor: item.WoStatus == "Open" ? Commoncolor.CommonRedColor : Commoncolor.CommonGreenColor, alignSelf: 'flex-end', justifyContent: "center", alignItems: 'center', paddingHorizontal: Commonwidth(15), borderTopLeftRadius: Commonsize(5), borderBottomLeftRadius: Commonsize(5), position: 'absolute', top: Commonheight(10), right: 0 }}>
        <Text style={{ color: Commoncolor.CommonWhiteColor, fontSize: Commonsize(10) }}>{item?.WoStatus}</Text>
      </View>

      <View style={{ width: '90%', minHeight: Commonheight(10), alignSelf: "center", }}>
        <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), }}>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', width: '40%' }}>Request No</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', }}>:</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{item?.ComplaintNo}</Text>
        </View>
        <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), }}>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', width: '40%' }}>Date & Time</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', }}>:</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{item?.ComplainedDateTime}</Text>
        </View>
        <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', marginBottom: Commonheight(5), }}>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', width: '40%' }}>Nature of Request</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', }}>:</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{item?.ComplaintNatureName}</Text>
        </View>
        <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'flex-start', }}>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', width: '40%' }}>Stage</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonAppColor, fontWeight: '500', }}>:</Text>
          <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, width: '55%' }}>{item?.CCMStageIName}</Text>
        </View>
      </View>


    </Card>
  );

  const filterOptions = (val) => {
    switch (val) {
      case 1:
        setFilterState(null);
        break;
      case 2:
        setFilterState(1)
        break;
      case 3:
        setFilterState(10)
        break;
      default:
        setFilterState(null);
        break;

    }
  }

  const searchFunction = (val) => {
    setSearch(val);
    setChangepageindex(1);
    setSearchChanged(true)
  }

  return (
    <View
      style={[
        CommonStyles.CommonFlex,
        { backgroundColor: Commoncolor.CommonBackgroundColor },
      ]}>
      <View style={{ flex: 1 }}>

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
            ]}> {'Track Request'}
          </Text>
        </View>


        <View style={{ width: '90%', height: Commonheight(40), justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'center' }}>
          <Text style={{ color: Commoncolor.CommonDarkTextGray, fontSize: Commonsize(14), fontWeight: '500' }}>Dashboard</Text>
        </View>

        <View style={{
          width: '90%', height: Commonheight(120), backgroundColor: Commoncolor.CommonWhiteColor, alignSelf: 'center', borderRadius: Commonsize(10), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Commonwidth(10), shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.20,
          shadowRadius: 5.62,
          elevation: 7,

        }}>
          <TouchableOpacity onPress={() => { filterOptions(1) }} style={{ width: '30%', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ color: Commoncolor.darkblue, fontSize: Commonsize(28), fontWeight: '500', marginBottom: Commonheight(5) }}>{cstate.Home_page_count?.TotalCnt ? cstate.Home_page_count?.TotalCnt : '0'}</Text>
            <Text style={{ color: Commoncolor.darkblue, fontSize: Commonsize(10), fontWeight: '500' }}>Raised Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { filterOptions(2) }} style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Commoncolor.CommonRedColor, fontSize: Commonsize(28), fontWeight: '500', marginBottom: Commonheight(5) }}>{cstate.Home_page_count?.OpenCnt ? cstate.Home_page_count?.OpenCnt : '0'}</Text>
            <Text style={{ color: Commoncolor.darkblue, fontSize: Commonsize(10), fontWeight: '500' }}>Open Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { filterOptions(3) }} style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Commoncolor.CommonGreenColor, fontSize: Commonsize(28), fontWeight: '500', marginBottom: Commonheight(5) }}>{cstate.Home_page_count?.ClosedCnt ? cstate.Home_page_count?.ClosedCnt : '0'}</Text>
            <Text style={{ color: Commoncolor.darkblue, fontSize: Commonsize(10), fontWeight: '500' }}>Closed Requests</Text>

          </TouchableOpacity>


        </View>

        <View style={{ width: '90%', height: Commonheight(40), justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'center' }}>
          <Text style={{ color: Commoncolor.CommonDarkTextGray, fontSize: Commonsize(14), fontWeight: '500' }}>Submitted Requests</Text>
        </View>



        <View
          style={[
            CommonStyles.CommonHeaderView3,
            { backgroundColor: Commoncolor.CommonBackgroundColor },
          ]}>
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
                  alignItems: 'center',
                }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <SkeletonSkimmer height={Commonheight(40)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(20), borderRadius: Commonsize(10) }} />
                  <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
                  <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
                  <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
                </ScrollView>
              </View>
            </View>
          ) :
            cstate.CCMComplaintDatasOpen.length < 1 ?
              <>
                <View style={{ width: "90%", height: Commonheight(40), backgroundColor: Commoncolor.CommonLightGray, borderRadius: Commonsize(10), alignSelf: 'center', marginBottom: Commonheight(8) }}>
                  <TextInput
                    style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', borderRadius: Commonsize(10), paddingHorizontal: Commonwidth(10) }}
                    placeholder='Search'
                    value={Search}
                    placeholderTextColor={Commoncolor.CommonMildGrayColor}
                    onChangeText={(val) => { searchFunction(val); CCMComplaints_Select_Open(1, val); }}
                  />
                </View>
                <NoImage />
              </>
              : (
                <>
                  <View style={{ width: "90%", height: Commonheight(40), backgroundColor: Commoncolor.CommonLightGray, borderRadius: Commonsize(10), alignSelf: 'center', marginBottom: Commonheight(8) }}>
                    <TextInput
                      style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', borderRadius: Commonsize(10), paddingHorizontal: Commonwidth(10) }}
                      placeholder='Search'
                      placeholderTextColor={Commoncolor.CommonMildGrayColor}
                      value={Search}
                      onChangeText={(val) => { searchFunction(val); CCMComplaints_Select_Open(1, val); }}
                    />
                  </View>
                  <FlatList
                    data={cstate.CCMComplaintDatasOpen}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    onEndReachedThreshold={0.1}
                    onEndReached={async ({ distanceFromEnd }) => {
                      if (!hasMore) {
                        showToast({ message: 'End reached', type: 'info', position: 'bottom', duration: 3000 });
                        return
                      };

                      const nextPage = Changepageindex + 1;
                      setChangepageindex(nextPage);
                      logger.log(nextPage, 'nextPage')
                      await CCMComplaints_Select_Open(nextPage, Search);
                    }}
                    renderItem={renderCCMComplaintDatasOpen}
                    refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                      !IsLoader && (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                          <Text>No Data Available</Text>
                        </View>
                      )
                    }
                    nestedScrollEnabled
                  />
                </>
              )}
        </View>
      </View>

    </View>

  );
};

export default TrackPage;
