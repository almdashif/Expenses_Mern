import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStyles from '../../../CommonFolder/CommonStyles';
import { GlobalContext } from '../../../../App';
import { Commonsize, Commonwidth, Commonheight, } from '../../../Utils/ResponsiveWidget';
import Commoncolor from '../../../CommonFolder/CommonColor';
import CommonAPISelectWOT from '../../../APIMethods/CommonAPISelectWOT';
import NoImage from '../../../Components/NoImage';
import LogoutFunction from '../../../Utils/LogoutFunction';
import { useNavigation } from '@react-navigation/native';
import SkeletonSkimmer from '../../../Components/Skimmer';
import { Icon10 } from '../../../CommonFolder/CommonIcons';
import delay from '../../../Utils/delay';
import { Card } from '../../../Components/Card';
import { useToast } from '../../../Context/ToastProvider';
import logger from '../../../Utils/logger';




const FeedBackPage = () => {
  const [Changepageindex, setChangepageindex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [Search, setSearch] = useState('')
  const [IsLoader, setIsLoader] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [SearchChanged, setSearchChanged] = useState(false)

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  const navigation = useNavigation()

  const { showToast } = useToast();

  useEffect(() => {
    LoginAuthentication();
    setChangepageindex(1)
    setHasMore(true)
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    cdispatch({ type: "FeedbackChanged", payload: !cstate.FeedbackChanged });
    cdispatch({ type: 'BottomNavigationTab', payload: 0 });
    return true;
  };

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
        if (res.TokenIDPK == "") {
          await LogoutFunction(cstate, navigation)
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

          FeedbackListDataCall(1);

        }
      })
      .catch((error) => {
        logger.log(error);
      });
  };
  const onRefresh = React.useCallback(() => {
    setChangepageindex(1)
    setHasMore(true)
    setRefreshing(true);
    setSearch('')
    setSearchChanged(false)
    LoginAuthentication();
    delay(1000).then(() => setRefreshing(false));
  }, []);

  const FeedbackListDataCall = async (page, search = '') => {
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
          p7: search ? "%" + search + "%" : "", //search by word
          p8: null,  // complaint id
          p9: 10,   //10 for feedback data
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

        var FeedBackData = res.Output.data;
        var Status = res.Output.status;
        // var { data: FeedBackData, status: Status } = res.Output
        logger.log({ Url, params, res }, 'feedback page list')

        if (Status.code == '200' || Status.code == 200) {

          if (FeedBackData.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          if (SearchChanged == true) {
            cdispatch({ type: 'CCMComplaintDatas', payload: [] });
          }

          if (page === 1) {
            cdispatch({ type: 'CCMComplaintDatas', payload: FeedBackData });
          } else {
            let allData = [...cstate.CCMComplaintDatas, ...FeedBackData]
            cdispatch({ type: 'CCMComplaintDatas', payload: allData });
          }

        }
        else {
          cdispatch({ type: 'CCMComplaintDatas', payload: [] });
          showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });
        }
        setSearchChanged(false)
        setIsLoader(false);
      });
    } catch (error) {
      logger.log(error);
      setSearchChanged(false)
      setIsLoader(false);
      cdispatch({ type: 'CCMComplaintDatas', payload: [] });
      showToast({ message: "Something went wrong try again later", type: 'error', position: 'bottom', duration: 3000 });
    }
  };



  const MoveFeedBackdetail = async item => {
    setChangepageindex(1)
    setHasMore(true)
    await cdispatch({ type: 'FeedBackDetailsData', payload: item });
    navigation.navigate('FeedbackDetailsPage');
  };

  const renderFeedbackListData = ({ item }) => (
    <Card disabled={false} onPress={() => { MoveFeedBackdetail(item) }} style={{ marginBottom: Commonheight(10), width: '90%', alignSelf: 'center', paddingVertical: Commonheight(15) }}>

      <View style={{ height: Commonheight(20), backgroundColor: Commoncolor.CommonGreenColor, alignSelf: 'flex-end', justifyContent: "center", alignItems: 'center', paddingHorizontal: Commonwidth(15), borderTopLeftRadius: Commonsize(5), borderBottomLeftRadius: Commonsize(5), position: 'absolute', top: Commonheight(10), right: 0 }}>
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
          ]}>
          FeedBack
        </Text>
      </View>

      <View
        style={[
          CommonStyles.CommonHeaderView3,
          { backgroundColor: Commoncolor.CommonBackgroundColor, },
        ]}>


        {IsLoader == true ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: Commoncolor.CommonBackgroundColor,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SkeletonSkimmer height={Commonheight(40)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), marginTop: Commonheight(10), borderRadius: Commonsize(10) }} />
              <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
              <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
              <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
              <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
              <SkeletonSkimmer height={Commonheight(120)} width={Commonwidth(330)} style={{ alignSelf: "center", marginBottom: Commonheight(10), borderRadius: Commonsize(10) }} />
            </ScrollView>

          </View>
        ) :
          cstate.CCMComplaintDatas.length < 1 ?
            <>
              <View style={{ width: "90%", height: Commonheight(40), backgroundColor: Commoncolor.CommonLightGray, borderRadius: Commonsize(10), alignSelf: 'center', marginVertical: Commonheight(10) }}>
                <TextInput
                  style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', borderRadius: Commonsize(10), paddingHorizontal: Commonwidth(10) }}
                  placeholder='Search'
                  value={Search}
                  placeholderTextColor={Commoncolor.CommonMildGrayColor}
                  onChangeText={(val) => { searchFunction(val); FeedbackListDataCall(1, val); }}
                />
              </View>

              <NoImage />
            </>

            :
            (
              <>
                <View style={{ width: "90%", height: Commonheight(40), backgroundColor: Commoncolor.CommonLightGray, borderRadius: Commonsize(10), alignSelf: 'center', marginVertical: Commonheight(10) }}>
                  <TextInput
                    style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', borderRadius: Commonsize(10), paddingHorizontal: Commonwidth(10) }}
                    placeholder='Search'
                    value={Search}
                    placeholderTextColor={Commoncolor.CommonMildGrayColor}
                    onChangeText={(val) => { searchFunction(val); FeedbackListDataCall(1, val); }}
                  />
                </View>
                <FlatList
                  data={cstate.CCMComplaintDatas}
                  keyExtractor={(item, index) => index.toString()}
                  enableEmptySections={true}

                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.4}

                  onEndReached={async ({ distanceFromEnd }) => {
                    if (!hasMore) {
                      showToast({ message: 'End reached', type: 'info', position: 'bottom', duration: 3000 });
                      return
                    };

                    const nextPage = Changepageindex + 1;
                    setChangepageindex(nextPage);
                    logger.log(nextPage, 'nextPage')
                    await FeedbackListDataCall(nextPage, Search);
                  }}
                  renderItem={renderFeedbackListData}
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
                />
              </>
            )}
      </View>


    </View>
  );
};

export default FeedBackPage;
