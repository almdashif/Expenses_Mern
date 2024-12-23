import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  BackHandler,
} from 'react-native';


import CommonStyles from '../CommonFolder/CommonStyles';
import { Commonwidth, Commonheight, Commonsize } from '../Utils/ResponsiveWidget';
import Commoncolor from '../CommonFolder/CommonColor';
import { GlobalContext } from '../../App';

export default function CommonGridView(props) {
  const context = useContext(GlobalContext);
  const {cstate, cdispatch} = context;

  return (
    <View
      style={[
        CommonStyles.CCMComplaintBottomSheetDivView2,
        {height: 'auto', marginTop: Commonheight(8)},
      ]}>
      <View
        style={[
          CommonStyles.CCMComplaintBottomSheetSubDivView1,
          {width: '40%', height: 'auto'},
        ]}>
        <Text
          style={[
            CommonStyles.CCMComplaintBottomSheetDivViewText2,
            {
              color: Commoncolor.CommonAppColor,
              fontWeight: '500',
              height: 'auto',
            },
          ]}>
          {props.title}
        </Text>
      </View>
      <View
        style={[
          CommonStyles.CCMComplaintBottomSheetSubDivView1,
          {width: '5%', height: 'auto'},
        ]}>
        <Text
          style={[
            CommonStyles.CCMComplaintBottomSheetDivViewText2,
            {
              color: Commoncolor.CommonLightBlack,
              fontWeight: '600',
              alignSelf: 'center',
              height: 'auto',
            },
          ]}>
          :
        </Text>
      </View>
      <View
        style={[
          CommonStyles.CCMComplaintBottomSheetSubDivView1,
          {width: '60%', height: 'auto'},
        ]}>
        <Text
          style={[
            CommonStyles.CCMComplaintBottomSheetDivViewText2,
            {
              color: Commoncolor.CommonLightBlack,
              fontWeight: '400',
              marginLeft: Commonwidth(10),
              height: 'auto',
              fontSize: Commonsize(11)
            },
          ]}>
          {props.specvalue}
        </Text>
      </View>
    </View>
  );
}
