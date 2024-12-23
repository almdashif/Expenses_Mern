import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AboutUsPage from '../Modules/HomePageModules/AboutUsPage';
import ForgotPasswordPage from '../Modules/LoginPageModules/ForgotPasswordPage';
import GuestUserPage from '../Modules/LoginPageModules/GuestUserPage';
import LoginPage from '../Modules/LoginPageModules/LoginPage';
import EntityKeyPage from '../Modules/EntityKeyModule/EntityKeyPage';
import SplashScreen from '../Modules/Splash/SplashScreen';
import WebViewPage from '../Modules/WebViewPageModule/WebViewPage';
import HomePage from '../Modules/HomePageModules/HomePage';
import ServiceRequestPage from '../Modules/HomePageModules/ServiceRequestModule/ServiceRequestPage';
import TrackPage from '../Modules/HomePageModules/TrackPageModules/TrackPage';
import TrackDetailsPage from '../Modules/HomePageModules/TrackPageModules/TrackDetailsPage';
import FeedBackPage from '../Modules/HomePageModules/FeedBackPageModules/FeedBackPage';
import FeedbackDetailsPage from '../Modules/HomePageModules/FeedBackPageModules/FeedbackDetailsPage';
import ChangeLocationPage from '../Modules/HomePageModules/ChangeLocationModule/ChangeLocationPage';
import Advertisement from '../Modules/HomePageModules/Advertise&Announce/Advertisement';
import Announcement from '../Modules/HomePageModules/Advertise&Announce/Announcement';
import MainContainerModule from '../Modules/HomePageModules/MainContainer/MainContainerModule';
import AudioRecord from '../Components/AudioRecord';




const Stack = createStackNavigator();
const Navigation = () => {


    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='SplashScreen'>
                <Stack.Screen name='EntityKeyPage' component={EntityKeyPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='AboutUsPage' component={AboutUsPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='ForgotPasswordPage' component={ForgotPasswordPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='GuestUserPage' component={GuestUserPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='LoginPage' component={LoginPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='WebViewPage' component={WebViewPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='HomePage' component={HomePage} options={{ headerShown: false, animationEnabled: true, }} />

                <Stack.Screen name='ServiceRequestPage' component={ServiceRequestPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='TrackPage' component={TrackPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='TrackDetailsPage' component={TrackDetailsPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='FeedBackPage' component={FeedBackPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='FeedbackDetailsPage' component={FeedbackDetailsPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='ChangeLocationPage' component={ChangeLocationPage} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='Advertisement' component={Advertisement} options={{ headerShown: false, animationEnabled: true, }} />
                <Stack.Screen name='Announcement' component={Announcement} options={{ headerShown: false, animationEnabled: true, }} />

                <Stack.Screen name='MainContainerModule' component={MainContainerModule} options={{ headerShown: false, animationEnabled: true, }} />
         
                <Stack.Screen name='AudioRecord' component={AudioRecord} options={{ headerShown: false, animationEnabled: true, }} />


            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
