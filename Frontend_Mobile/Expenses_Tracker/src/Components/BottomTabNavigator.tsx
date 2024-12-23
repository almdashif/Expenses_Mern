import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { useState } from 'react'
import Icon4 from 'react-native-vector-icons/FontAwesome';
import Icon10 from 'react-native-vector-icons/MaterialIcons';
import Commoncolor from '../CommonFolder/CommonColor'
import { Commonheight, Commonsize, Commonwidth, deviceHeight } from '../Utils/ResponsiveWidget';
import { GlobalContext } from '../../App';


interface IBottomtabNavigator {
    state: React.ReactNode;
    tabNames?: string[]; // Assuming tab names are strings
    tabIcons: React.ReactNode[]; // Assuming there are multiple tab icons, each can be a ReactNode
    tabOnPress: (() => void)[];
    textStyle?: object; // You can define this as a more specific style if needed (e.g., ViewStyle, TextStyle, etc.)
    style?: object; // Same here, you can specify style type (e.g., ViewStyle)
    bottomTabStyle?: object; // Same as above, for bottom tab style
    activeColor?: string; // The color when the tab is active
    inActiveColor?: string; // The color when the tab is inactive
    activeBackgroundColor?: string; // The background color when the tab is active
    inActiveBackgroundColor?: string; // The background color when the tab is inactive
    children: React.ReactNode; // Children can be any valid React nodes (JSX elements)
    renderTabs: React.ReactNode[];
}



const BottomTabNavigator: React.FC<IBottomtabNavigator> = ({ renderTabs = [], state, tabNames = [], tabIcons, tabOnPress, textStyle, style, bottomTabStyle, activeColor = '#1E1E55', inActiveColor = '#e6e6e6', activeBackgroundColor = "#DEE7F0", inActiveBackgroundColor = "#fff", children }) => {

    const { cstate, cdispatch } = useContext(GlobalContext)
    return (
        <View style={{ flex: 1, width: '100%', height: deviceHeight, }}>
            <ScrollView keyboardShouldPersistTaps='never' scrollEnabled={false} nestedScrollEnabled>
                <View style={{ flex: 1, width: '100%', height: deviceHeight - Commonheight(50), }}>
                    {renderTabs[cstate.BottomNavigationTab]}
                </View>

                <View style={[{
                    width: '100%', height: Commonheight(50), backgroundColor: Commoncolor.CommonWhiteColor, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.00,

                    elevation: 24,
                    paddingHorizontal: Commonsize(20),
                    paddingVertical: Commonsize(5),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopColor: Commoncolor.CommonLightGray,
                    borderTopWidth: Commonsize(.9)
                }, { ...style }]}>
                    {
                        tabNames.map((val, i) => {
                            return (
                                <TouchableOpacity key={i?.toString()} disabled={state == i} onPress={tabOnPress[i]} style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: state == i ? activeBackgroundColor : inActiveBackgroundColor, paddingVertical: Commonheight(3), paddingHorizontal: Commonwidth(10), borderRadius: Commonsize(50) }, { ...bottomTabStyle }]}>
                                    {tabIcons[i]}
                                    {state == i && <Text style={[{ fontSize: Commonsize(12), color: activeColor, fontWeight: '500', marginLeft: Commonwidth(5) }, { ...textStyle }]}>{val}</Text>}
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            </ScrollView>
        </View>

    )
}

export default BottomTabNavigator

const styles = StyleSheet.create({})