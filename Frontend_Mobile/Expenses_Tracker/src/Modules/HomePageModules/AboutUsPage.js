import React, { useEffect, useContext } from "react";
import { Text, View, BackHandler, TouchableOpacity, ScrollView, Image, } from "react-native";
import Commoncolor from "../../CommonFolder/CommonColor";
import { Commonheight, Commonsize, Commonwidth } from "../../Utils/ResponsiveWidget";
import { GlobalContext } from "../../../App";
import { Icon10 } from "../../CommonFolder/CommonIcons";

const AboutUsPage = ({ navigation }) => {
  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);


  const backAction = () => {

    cdispatch({ type: 'BottomNavigationTab', payload: 0 });
    return true;
  };

  return (

    <View style={{ flex: 1, backgroundColor: Commoncolor.CommonWhiteColor }}>
      <View style={{ flex: 1, backgroundColor: Commoncolor.CommonWhiteColor }}>
        <View style={{ width: '100%', height: Commonheight(150), }}>
          <Image
            style={{ width: "100%", height: '100%', marginTop: Commonheight(-5) }}
            source={require('../../Assets/Images/Advertisement.png')}
            resizeMode='cover'
          />
          <TouchableOpacity
            onPress={() => backAction()}
            style={{ position: 'absolute', width: Commonsize(30), height: Commonsize(30), top: Commonheight(10), left: Commonwidth(10), backgroundColor: Commoncolor.CommonWhiteColor, justifyContent: 'center', alignItems: 'center', borderRadius: Commonsize(5) }}
          >
            <Icon10
              name={"arrow-left"}
              size={Commonsize(20)}
              style={{
                color: Commoncolor.CommonAppColor, fontWeight: '900', alignSelf: "center",
              }}
            />
          </TouchableOpacity>

        </View>

        <View style={{ flex: 1, width: '100%', alignSelf: 'flex-end', backgroundColor: Commoncolor.CommonWhiteColor, borderTopRightRadius: Commonsize(30), marginTop: Commonheight(-25), position: 'relative' }}>
          <View style={{ width: '95%', alignSelf: 'flex-end', height: Commonheight(40), justifyContent: "flex-end", alignItems: 'flex-start', position: "relative", marginBottom: Commonheight(8) }}>
            <Text style={{ fontSize: Commonsize(16), color: Commoncolor.CommonDarkTextGray, fontWeight: '500', }}>About Us</Text>
          </View>

          <View style={{ width: '95%', alignSelf: 'flex-end', minHeight: Commonheight(60), justifyContent: "center", alignItems: 'flex-start', position: "relative", paddingRight: Commonwidth(8), paddingBottom: Commonheight(50) }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: Commonsize(13), color: Commoncolor.CommonDarkTextGray, paddingBottom: Commonheight(10) }}>{cstate.CommonContent ? cstate.CommonContent : "IFMS is a complete web-based Computer Aided Facility Management which helps the customer to computerize organize and enhance their maintenance activities.This helps the customer to streamline, automate, speed-up tasks, record keeping, manage product fault history and various other built in features. We deliver customized product to suite your business process, with its unique capabilities and programming skills enables to manage Assets, Planned Preventive Maintenance schedules, Breakdown Reporting, Employee details, Scheduling, Inventory, Vendor Management, Procurement & MIS reports in an effective methodology."}</Text>
            </ScrollView>
          </View>
        </View>
      </View>




    </View>

  );
};

export default AboutUsPage;
