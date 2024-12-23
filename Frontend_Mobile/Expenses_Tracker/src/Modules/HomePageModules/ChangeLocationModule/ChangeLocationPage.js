import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, BackHandler } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'


import Icon1 from "react-native-vector-icons/Entypo";
import Icon10 from "react-native-vector-icons/MaterialIcons";
import Icon8 from "react-native-vector-icons/Ionicons";
import Icon0 from "react-native-vector-icons/AntDesign";
import Icon9 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon5 from "react-native-vector-icons/FontAwesome5";




import { Commonheight, Commonsize, Commonwidth } from '../../../Utils/ResponsiveWidget'
import { GlobalContext } from '../../../../App'
import CommonStyles from '../../../CommonFolder/CommonStyles';
import Commoncolor from '../../../CommonFolder/CommonColor';
import SelectField from '../../../Components/SelectField';
import CommonAPISelectWOT from '../../../APIMethods/CommonAPISelectWOT';
import NoImage from '../../../Components/NoImage';
import BottomSheet from '../../../Components/BottomSheet';
import { CircularLoader } from '../../../Components/Indicators';
import { useToast } from '../../../Context/ToastProvider';
import logger from '../../../Utils/logger';



const ChangeLocationPage = () => {

  const [DefaultData, setDefaultData] = useState([])
  const [Changepageindex, setChangepageindex] = useState(1);
  const [SearchChanged, setSearchChanged] = useState(false)
  const [LocationSelectedData, setLocationSelectedData] = useState([]);
  const [BuildingSelectedData, setBuildingSelectedData] = useState([]);
  const [FloorSelectedData, setFloorSelectedData] = useState([]);
  const [SpotSelectedData, setSpotSelectedData] = useState([]);
  const [IsBtmLoader, setIsBtmLoader] = useState(false)
  const [AllPremisesArray, setAllPremisesArray] = useState([]);
  const [Type, setType] = useState('')
  const [ShowLocationBtmSheet, setShowLocationBtmSheet] = useState(false)
  const [hasMore, setHasMore] = useState(true);
  const [Search, setSearch] = useState('')



  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;


  const navigation = useNavigation()

  const { showToast } = useToast();




  useEffect(() => {
    getDefaultData()
  }, [])

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const backAction = () => {
    if (cstate.NeedLocationUpdate == 1) {
      navigation.goBack();
      return true;
    }
    else {
      logger.log('no access to redirest')
    }
  };

  const getDefaultData = async () => {
    let Url = cstate.KeyUrl + 'FPC13S3/';
    const params = {
      data: {
        p1: null,
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
        p16: "PORTALDEFAULT",
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


  const AllPremisesSelect = async (page, Type, state, setState, searchVal = '') => {


    logger.log(LocationSelectedData, 'LocationSelectedData')

    let Url = cstate.KeyUrl + 'FPC13S3/';


    const params = {
      data: {
        p1: 0,
        p2: DefaultData[0]?.LocalityIDPK ? DefaultData[0]?.LocalityIDPK : LocationSelectedData.length > 0 ? LocationSelectedData[0]?.LocalityIDPK : null,     //LocalityID
        p3: DefaultData[0]?.BuildingIDPK ? DefaultData[0]?.BuildingIDPK : BuildingSelectedData.length > 0 ? BuildingSelectedData[0]?.BuildingIDPK : null,     //BuildingID
        p4: DefaultData[0]?.FloorIDPK ? DefaultData[0]?.FloorIDPK : FloorSelectedData.length > 0 ? FloorSelectedData[0]?.FloorIDPK : null,     //FloorID
        p5: DefaultData[0]?.SpotIDPK ? DefaultData[0]?.SpotIDPK : SpotSelectedData.length > 0 ? SpotSelectedData[0]?.SpotIDPK : null,     //SpotID
        p6: null,
        p7: searchVal ? "%" + searchVal + "%" : "",  //search
        p8: null,
        p9: null,
        p10: null,
        p11: null,
        p12: null,
        p13: null,
        p14: page ? page : 1,
        p15: 10,
        p16: Type,
        p17: cstate.UserGroupID,
        p18: cstate.UserID,
      },
    };

    await CommonAPISelectWOT(Url, params)
      .then(async (response) => {
        logger.log({ Url, params, response }, 'AllPremisesSelect')


        var Datas = response.Output.data;
        var Status = response.Output.status;

        logger.log(state, 'state')
        if (Status.code == "200" || Status.code == 200) {


          if (Datas.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true)
          }


          if (SearchChanged == true) {
            setState([])
          }


          if (page === 1) {
            setState(Datas);
          } else {
            let data = [...state, ...Datas];
            setState(data);
          }


          setIsBtmLoader(false)

        }
        else {
          setIsBtmLoader(false)
          setState([]);
        }
        setSearchChanged(false)
      })
      .catch((error) => {
        setSearchChanged(false)
        setIsBtmLoader(false)
        logger.log(error);
      });
  };
  const renderCCMComplaintDatas = ({ item }) => (
    <TouchableOpacity
      onPress={() => { SelectedDataUpdate(item); setShowLocationBtmSheet(false) }}
      style={{
        width: "100%",
        alignSelf: "center",
        height: Commonheight(35),
        justifyContent: "center",
        borderBottomWidth: Commonwidth(0.3),
        borderBottomColor: Commoncolor.CommonAppColor,
        marginLeft: Commonwidth(5),
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
        {Type == 'LOCALITYIDPK' ? item?.LocalityName : Type == 'BUILDINGIDPK' ? item?.BuildingName : Type == 'FLOORIDPK' ? item?.FloorName : Type == 'SPOTIDPK' ? item?.SpotName : ''}
      </Text>
    </TouchableOpacity>
  );

  const SelectedDataUpdate = (item) => {
    setHasMore(true)
    searchFunction('')
    logger.log({ Type, item }, 'SelectedDataUpdate');
    if (Type == 'LOCALITYIDPK') {
      removeSelectedFeilds(2)
      setLocationSelectedData([item])

    }
    else if (Type == "BUILDINGIDPK") {
      removeSelectedFeilds(3)
      setBuildingSelectedData([item])

    }
    else if (Type == "FLOORIDPK") {
      removeSelectedFeilds(4)
      setFloorSelectedData([item])

    }
    else if (Type == "SPOTIDPK") {
      setSpotSelectedData([item])
    }
  }

  const onFildPress = (type) => {
    setIsBtmLoader(true)
    setHasMore(true)
    setType(type);
    searchFunction('')
    setShowLocationBtmSheet(true);
    logger.log({ Type });
    AllPremisesSelect(1, type, AllPremisesArray, setAllPremisesArray)


  }

  const SubmitChangeLocation = async () => {

    let Url = cstate.KeyUrl + 'FPC13S3/';


    const params = {
      data: {
        p1: 0,
        p2: DefaultData[0]?.LocalityIDPK ? DefaultData[0]?.LocalityIDPK : LocationSelectedData.length > 0 ? LocationSelectedData[0]?.LocalityIDPK : null,    //LocalityID
        p3: DefaultData[0]?.BuildingIDPK ? DefaultData[0]?.BuildingIDPK : BuildingSelectedData.length > 0 ? BuildingSelectedData[0]?.BuildingIDPK : null,     //BuildingID
        p4: DefaultData[0]?.FloorIDPK ? DefaultData[0]?.FloorIDPK : FloorSelectedData.length > 0 ? FloorSelectedData[0]?.FloorIDPK : null,     //FloorID
        p5: DefaultData[0]?.SpotIDPK ? DefaultData[0]?.SpotIDPK : SpotSelectedData.length > 0 ? SpotSelectedData[0]?.SpotIDPK : null,     //SpotID
        p6: null,
        p7: null,  //search
        p8: null,
        p9: null,
        p10: null,
        p11: null,
        p12: null,
        p13: null,
        p14: Changepageindex ? Changepageindex : 1,
        p15: 10,
        p16: "USERCONLOCUPDATE",
        p17: cstate.UserGroupID,
        p18: cstate.UserID,
      },
    };

    await CommonAPISelectWOT(Url, params)
      .then(async (response) => {
        logger.log({ Url, params, response }, 'USERCONLOCUPDATE')


        var Datas = response.Output.data;
        var Status = response.Output.status;


        if (Status.code == "200" || Status.code == 200) {

          logger.log(cstate.NeedLocationUpdate, "cstate.NeedLocationUpdate")
          showToast({ message: "Work Location details updated successfully", type: 'success', position: 'bottom', duration: 3500 });
          cdispatch({ type: "ChangeLocation", payload: !cstate.ChangeLocation });
          if (cstate.NeedLocationUpdate == 0 || cstate.isServiceRequest == false) {
            navigation.navigate("MainContainerModule");
          } else {
            navigation.goBack();
          }

        }
        else {
        }
      })
      .catch((error) => {
        logger.log(error);
      });

  }

  const finalSubmit = () => {

    if (LocationSelectedData.length == 0 && DefaultData[0]?.LocalityIDPK.length == 0) {
      showToast({ message: "Please select Location", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (BuildingSelectedData.length == 0 && DefaultData[0]?.LocalityIDPK.length == 0) {
      showToast({ message: "Please select Building", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (FloorSelectedData.length == 0 && DefaultData[0]?.LocalityIDPK.length == 0) {
      showToast({ message: "Please select Floor", type: 'error', position: 'bottom', duration: 3000 });
    }
    else if (SpotSelectedData.length == 0 && DefaultData[0]?.LocalityIDPK.length == 0) {
      showToast({ message: "Please select Spot", type: 'error', position: 'bottom', duration: 3000 });
    }
    else {
      logger.log("cstate.NeedLocationUpdate")
      SubmitChangeLocation()
    }
  }

  const removeSelectedFeilds = (val) => {
    logger.log(DefaultData, 'DefaultData', DefaultData[0].BuildingCode)
    if (val == 1) {
      setLocationSelectedData([])
      setBuildingSelectedData([])
      setFloorSelectedData([])
      setSpotSelectedData([])


      setDefaultData((prevData) => {
        const newData = [...prevData];
        newData[0] = {
          ...newData[0],
          LocalityIDPK: null,
          LocalityName: "",
          LocalityCode: "",
          BuildingIDPK: null,
          BuildingName: "",
          BuildingCode: "",
          FloorIDPK: null,
          FloorName: "",
          SpotIDPK: null,
          SpotName: "",
          SpotCode: ""
        };
        return newData;
      });




    } else if (val == 2) {
      setBuildingSelectedData([])
      setFloorSelectedData([])
      setSpotSelectedData([])

      setDefaultData((prevData) => {
        const newData = [...prevData];
        newData[0] = {
          ...newData[0],

          BuildingIDPK: null,
          BuildingName: "",
          BuildingCode: "",
          FloorIDPK: null,
          FloorName: "",
          SpotIDPK: null,
          SpotName: "",
          SpotCode: ""
        };
        return newData;
      });
    }
    else if (val == 3) {
      setFloorSelectedData([])
      setSpotSelectedData([])
      setDefaultData((prevData) => {
        const newData = [...prevData];
        newData[0] = {
          ...newData[0],

          FloorIDPK: null,
          FloorName: "",
          SpotIDPK: null,
          SpotName: "",
          SpotCode: ""
        };
        return newData;
      });
    }
    else if (val == 4) {
      setSpotSelectedData([])

      setDefaultData((prevData) => {
        const newData = [...prevData];
        newData[0] = {
          ...newData[0],

          SpotIDPK: null,
          SpotName: "",
          SpotCode: ""
        };
        return newData;
      });
    } else {
      logger.log('none of the above ')
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
      ]}
    >
      <View style={[CommonStyles.CommonHeaderView2, { backgroundColor: Commoncolor.CommonAppColor, justifyContent: cstate.NeedLocationUpdate == 1 ? 'space-between' : 'center' }]}>
        {cstate.NeedLocationUpdate == 1
          ?
          <TouchableOpacity
            onPress={() => backAction()}
            style={{ width: Commonsize(30), height: Commonsize(30), backgroundColor: Commoncolor.CommonWhiteColor, justifyContent: 'center', alignItems: 'center', borderRadius: Commonsize(5), marginLeft: Commonwidth(15), marginRight: Commonwidth(20) }}
          >
            <Icon9
              name={"arrow-left"}
              size={Commonsize(20)}
              style={[CommonStyles.CommonHeaderViewIcon, { color: Commoncolor.CommonAppColor, fontWeight: '900' }]}
            />
          </TouchableOpacity>
          :
          null}

        <Text
          style={[
            CommonStyles.CommonHeaderViewText,
            { marginLeft: Commonwidth(0), textAlign: cstate.NeedLocationUpdate == 1 ? 'left' : 'center' },
          ]}
        >
          Change Location
        </Text>
      </View>

      <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: Commonheight(15), backgroundColor: Commoncolor.CommonWhiteColor }}>

        <View style={{ width: '90%', height: '100%', flex: 1, }}>


          <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: Commonheight(10) }}>
            <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, }}>Please update the necessary following information</Text>
          </View>
          <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: Commonheight(10) }}>
            <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>Work Location Details</Text>
          </View>
          <SelectField
            title={'Location'}
            // placeholder={LocationSelectedData.length > 0 ? LocationSelectedData[0]?.LocalityName : DefaultData[0]?.LocalityName ? DefaultData[0]?.LocalityName : 'Select Location'}
            placeholder={DefaultData[0]?.LocalityName ? DefaultData[0]?.LocalityName : LocationSelectedData.length > 0 ? LocationSelectedData[0]?.LocalityName : 'Select Location'}
            iconStyle={{ color: (LocationSelectedData.length > 0 || DefaultData[0]?.LocalityName) ? Commoncolor.CommonRedColor : Commoncolor.CommonDarkTextGray }}
            type='select'
            onPress={() => { onFildPress('LOCALITYIDPK') }}
            onIconPress={() => { removeSelectedFeilds(1) }}
            state={DefaultData[0]?.LocalityName}
            icon={(LocationSelectedData.length > 0 || DefaultData[0]?.LocalityName) ? 'remove' : 'caret-down'}
            mandatory={true}
            isContext={false}
            iconDisabled={(LocationSelectedData.length > 0 || DefaultData[0]?.LocalityName) ? false : true}
            mainStyle={{}}
          />

          <SelectField
            title={'Building'}
            // placeholder={BuildingSelectedData.length > 0 ? BuildingSelectedData[0]?.BuildingName : DefaultData[0]?.BuildingName ? DefaultData[0]?.BuildingName : 'Select Building'}
            placeholder={DefaultData[0]?.BuildingName ? DefaultData[0]?.BuildingName : BuildingSelectedData.length > 0 ? BuildingSelectedData[0]?.BuildingName : 'Select Building'}
            type='select'
            onPress={() => { onFildPress('BUILDINGIDPK') }}
            onIconPress={() => { removeSelectedFeilds(2) }}
            state={DefaultData[0]?.BuildingName}
            icon={(BuildingSelectedData.length > 0 || DefaultData[0]?.BuildingName) ? 'remove' : 'caret-down'}
            mandatory={true}
            isContext={false}
            iconDisabled={(BuildingSelectedData.length > 0 || DefaultData[0]?.BuildingName) ? false : true}
            iconStyle={{ color: (BuildingSelectedData.length > 0 || DefaultData[0]?.BuildingName) ? Commoncolor.CommonRedColor : Commoncolor.CommonDarkTextGray }}
            mainStyle={{ marginTop: Commonheight(15) }}
          />

          <SelectField
            title={'Floor'}
            // placeholder={FloorSelectedData.length > 0 ? FloorSelectedData[0]?.FloorName : DefaultData[0]?.FloorName ? DefaultData[0]?.FloorName : 'Select Floor'}
            placeholder={DefaultData[0]?.FloorName ? DefaultData[0]?.FloorName : FloorSelectedData.length > 0 ? FloorSelectedData[0]?.FloorName : 'Select Floor'}

            type='select'
            onPress={() => { onFildPress('FLOORIDPK') }}
            onIconPress={() => { removeSelectedFeilds(3) }}
            state={DefaultData[0]?.FloorName}
            icon={(FloorSelectedData.length > 0 || DefaultData[0]?.FloorName) ? 'remove' : 'caret-down'}
            mandatory={true}
            isContext={false}
            iconDisabled={(FloorSelectedData.length > 0 || DefaultData[0]?.FloorName) ? false : true}
            mainStyle={{ marginTop: Commonheight(15) }}
            iconStyle={{ color: (FloorSelectedData.length > 0 || DefaultData[0]?.FloorName) ? Commoncolor.CommonRedColor : Commoncolor.CommonDarkTextGray }}
          />

          <SelectField
            title={'Spot'}
            // placeholder={SpotSelectedData.length > 0 ? SpotSelectedData[0]?.SpotName : DefaultData[0]?.SpotName ? DefaultData[0]?.SpotName : 'Select Spot'}
            placeholder={DefaultData[0]?.SpotName ? DefaultData[0]?.SpotName : SpotSelectedData.length > 0 ? SpotSelectedData[0]?.SpotName : 'Select Spot'}

            type='select'
            onPress={() => { onFildPress('SPOTIDPK') }}
            onIconPress={() => { removeSelectedFeilds(4) }}
            state={DefaultData[0]?.SpotName}
            icon={(SpotSelectedData.length > 0 || DefaultData[0]?.SpotName) ? 'remove' : 'caret-down'}
            mandatory={true}
            isContext={false}
            iconDisabled={(SpotSelectedData.length > 0 || DefaultData[0]?.SpotName) ? false : true}
            mainStyle={{ marginTop: Commonheight(15) }}
            iconStyle={{ color: (SpotSelectedData.length > 0 || DefaultData[0]?.SpotName) ? Commoncolor.CommonRedColor : Commoncolor.CommonDarkTextGray }}
          />

          <View style={{ width: '100%', minHeight: Commonheight(20), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: Commonheight(20) }}>
            <Text style={{ fontSize: Commonsize(12), color: Commoncolor.CommonDarkTextGray, }}>These details will be saved as your default work location details.</Text>
          </View>


        </View>
        <TouchableOpacity disabled={(LocationSelectedData.length == 0 && BuildingSelectedData.length == 0 && FloorSelectedData.length == 0 && SpotSelectedData.length == 0)} onPress={() => { finalSubmit() }} style={{ width: '100%', height: Commonheight(45), backgroundColor: (LocationSelectedData.length > 0 || BuildingSelectedData.length > 0 || FloorSelectedData.length > 0 || SpotSelectedData.length > 0) ? Commoncolor.CommonAppColor : Commoncolor.CommonMildGrayColor, justifyContent: 'center', alignItems: "center" }}>
          <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonWhiteColor, fontWeight: '500', }}>Submit</Text>
        </TouchableOpacity>



        <BottomSheet
          visible={ShowLocationBtmSheet}
          onRequestClose={() => { setChangepageindex(1); setAllPremisesArray([]); setShowLocationBtmSheet(false) }}
        >
          <View style={{ width: '100%', flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end', alignItems: 'center' }} >


            <View style={{ width: '100%', height: Commonheight(380), backgroundColor: '#fff', borderTopLeftRadius: Commonsize(20), borderTopRightRadius: Commonsize(20), zIndex: 999 }}>
              <View style={{ width: "100%", height: Commonheight(25), justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: "20%", height: Commonheight(3), backgroundColor: Commoncolor.CommonMildGrayColor, borderRadius: Commonsize(10) }}></View>
              </View>

              <View style={{ width: "100%", height: Commonheight(30), justifyContent: "flex-start", alignItems: "center", marginVertical: Commonheight(5), }}>
                <Text style={{ fontSize: Commonsize(14), color: Commoncolor.CommonDarkTextGray, fontWeight: '600' }}>{Type == 'LOCALITYIDPK' ? 'Location' : Type == "BUILDINGIDPK" ? 'Building' : Type == 'FLOORIDPK' ? 'Floor' : Type == 'SPOTIDPK' ? "Spot" : ''}</Text>
              </View>

              <View style={{ flex: 1, width: "90%", alignSelf: 'center' }}>
                <View style={{ width: "100%", height: Commonheight(40), backgroundColor: Commoncolor.CommonLightGray, borderRadius: Commonsize(10) }}>
                  <TextInput
                    style={{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', borderRadius: Commonsize(10), paddingHorizontal: Commonwidth(10) }}
                    placeholder='Search'
                    placeholderTextColor={Commoncolor.CommonMildGrayColor}
                    onChangeText={(val) => { searchFunction(val); AllPremisesSelect(1, Type, AllPremisesArray, setAllPremisesArray, val) }}
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
                      <CircularLoader color={Commoncolor.CommonAppColor} size={20} dotSize={5} />
                    </View>
                    :
                    AllPremisesArray.length == 0
                      ?
                      <NoImage imageStyle={{ height: Commonheight(60), width: Commonheight(60), }} imageContainerStyle={{ minHeight: Commonheight(60) }} bottomTextStyle={{ fontSize: Commonsize(11), color: Commoncolor.CommonDarkTextGray }} />
                      :
                      <View style={{ flex: 1, width: "100%", height: '100%', borderRadius: Commonsize(10), paddingTop: Commonheight(10) }}>

                        <FlatList
                          data={AllPremisesArray}
                          keyExtractor={(item, index) => index.toString()}
                          enableEmptySections={true}
                          showsVerticalScrollIndicator={false}
                          onEndReachedThreshold={0.1}
                          onEndReached={async ({ distanceFromEnd }) => {
                            if (!hasMore) {
                              showToast({ message: 'End reached', type: 'info', position: 'bottom', duration: 3000 });
                              return
                            };
                            const nextPage = Changepageindex + 1;
                            setChangepageindex(nextPage);
                            logger.log(nextPage, 'nextPage')
                            await AllPremisesSelect(nextPage, Type, AllPremisesArray, setAllPremisesArray, Search);
                          }}
                          renderItem={renderCCMComplaintDatas}
                          ListEmptyComponent={
                            !IsBtmLoader && (
                              <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text>No Data Available</Text>
                              </View>
                            )
                          }
                        />
                      </View>
                }


              </View>
            </View>

            <TouchableOpacity onPress={() => { setChangepageindex(1); setAllPremisesArray([]); setShowLocationBtmSheet(false) }} style={{ flex: 1, height: '100%', width: '100%', position: "absolute", top: 0, left: 0, zIndex: -9999 }}>

            </TouchableOpacity>

          </View>
        </BottomSheet>




      </View>
    </View>
  )
}

export default ChangeLocationPage

const styles = StyleSheet.create({})