import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import Commoncolor from '../../../CommonFolder/CommonColor';
import Icon4 from 'react-native-vector-icons/FontAwesome';
import Icon10 from 'react-native-vector-icons/MaterialIcons';
import BottomTabNavigator from '../../../Components/BottomTabNavigator';
import { GlobalContext } from '../../../../App';
import { Commonsize } from '../../../Utils/ResponsiveWidget';
import HomePage from '../HomePage';
import TrackPage from '../TrackPageModules/TrackPage';
import FeedBackPage from '../FeedBackPageModules/FeedBackPage';
import AboutUsPage from '../AboutUsPage';
const MainContainerModule = () => {
    const { cstate, cdispatch } = useContext(GlobalContext);
    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>



            <BottomTabNavigator
                state={cstate.BottomNavigationTab}
                renderTabs={[<HomePage />, <TrackPage />, <FeedBackPage />, <AboutUsPage />]}
                tabNames={['Home', 'Track', 'Feedback', 'About']} tabIcons={[
                    <Icon4 name={"home"} size={Commonsize(20)} style={{ color: cstate.BottomNavigationTab == 0 ? Commoncolor.darkblue : Commoncolor.CommonMildGrayColor }} />,
                    <Icon4 name={"book"} size={Commonsize(20)} style={{ color: cstate.BottomNavigationTab == 1 ? Commoncolor.darkblue : Commoncolor.CommonMildGrayColor }} />,
                    <Icon10 name={"verified"} size={Commonsize(20)} style={{ color: cstate.BottomNavigationTab == 2 ? Commoncolor.darkblue : Commoncolor.CommonMildGrayColor }} />,
                    <Icon10 name={"info"} size={Commonsize(20)} style={{ color: cstate.BottomNavigationTab == 3 ? Commoncolor.darkblue : Commoncolor.CommonMildGrayColor }} />
                ]}
                tabOnPress={[
                    (() => { cdispatch({ type: 'BottomNavigationTab', payload: 0 }); }),
                    (() => { cdispatch({ type: "FeedbackChanged", payload: !cstate.FeedbackChanged }); cdispatch({ type: 'BottomNavigationTab', payload: 1 }); }),
                    (() => { cdispatch({ type: 'BottomNavigationTab', payload: 2 }); }),
                    (() => { cdispatch({ type: 'BottomNavigationTab', payload: 3 }); }),

                ]}
            />
        </View>
    )
}

export default MainContainerModule

const styles = StyleSheet.create({})