import React, { useEffect, useState, useContext } from "react";
import {
    View,
    StatusBar,
    StyleSheet,
    BackHandler,
    Alert,
    SafeAreaView,
    Image,
    Text,
    TextInput,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Commonheight, Commonsize, Commonwidth, deviceHeight } from "../../Utils/ResponsiveWidget";
import Commoncolor from "../../CommonFolder/CommonColor";
import CommonImage from "../../CommonFolder/CommonImage";
import CommonText from "../../CommonFolder/CommonText";
import CommonButton from "../../CommonFolder/CommonButton";
import { GlobalContext } from "../../../App";
import { Platform } from "react-native";
import logger from "../../Utils/logger";

const EntityKeyPage = ({ navigation }) => {
    const [Key, setKey] = useState("");
    const [ShowError, setShowError] = useState(false)
    const [Error, setError] = useState('')

    const { cstate, cdispatch } = useContext(GlobalContext)


    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    const backAction = () => {
        Alert.alert("Confirmation", "Are you sure you want to exit the app?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
            },
            { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };

    const KeyCheck = async () => {
        if (Key == '') {
            setShowError(true)
            setError('Entity key should not be empty')
            return false;
        } else {
            if (
                ["Adibcloud", "adibcloud", "Adibdev", "adibdev", "Adibqa", "adibqa", "Adibapp", "adibapp"].includes(Key)
            ) {
                setShowError(false)
                setError('')
                AsyncStorage.setItem("SetEntityKey", Key);
                navigation.navigate("WebViewPage", { "EntityKey": Key });
            } else {
                setKey("");
                setShowError(true)
                setError('Please enter valid entity key.')

            }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Commoncolor.CommonWhiteColor }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={Commoncolor.CommonAppColor} barStyle='light-content' />

                <ScrollView scrollEnabled={false} keyboardShouldPersistTaps='never'>
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        <View style={{ flex: 1, width: '100%', height: deviceHeight - Commonheight(200), }}>


                            <View style={{ width: '90%', height: '100%', alignSelf: 'center' }}>
                                <View style={{ width: '100%', height: Commonheight(120), justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                    <CommonText style={{ fontSize: Commonsize(22), fontWeight: '500', color: Commoncolor.CommonBlackColor, }}>Welcome to</CommonText>
                                    <CommonText style={{ fontSize: Commonsize(30), fontWeight: 'bold', color: Commoncolor.CommonBlackColor, fontStyle: 'italic' }}>{Platform.OS === "android" ? "FMS Helpdesk" : "FMS Task"}</CommonText>
                                </View>
                                <View style={{ width: '100%', height: Commonheight(80), justifyContent: 'center', alignItems: 'flex-start', }}>
                                    <CommonText style={{ fontSize: Commonsize(16), fontWeight: '400', color: Commoncolor.CommonBlackColor, }}>Please enter your entity to explore our app.</CommonText>
                                </View>


                                <View style={{ height: Commonwidth(70), width: "100%" }}>
                                    <TextInput
                                        style={{
                                            color: Commoncolor.CommonBlackColor,
                                            width: "100%",
                                            height: Commonheight(60),
                                            borderWidth: Commonwidth(2),
                                            borderColor: "#0083B0",
                                            borderRadius: Commonwidth(3),
                                            paddingLeft: Commonwidth(20),
                                        }}
                                        value={Key}
                                        onChangeText={(text) => { setKey(text.replace(/ /g, "")) }}
                                        onSubmitEditing={() => {
                                            logger.log("Please enter data");
                                        }}
                                        placeholder={"Enter your entity key"}
                                        placeholderTextColor={Commoncolor.CommonGrayColor}
                                        onFocus={() => {
                                            logger.log("Please enter");
                                        }}
                                    />
                                </View>

                                {ShowError &&
                                    <View style={{ width: '100%', height: Commonheight(30), justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <CommonText style={{ fontSize: Commonsize(13), fontWeight: '400', color: Commoncolor.CommonRedColor, }}>{Error}</CommonText>
                                    </View>
                                }

                                <View style={{ width: '100%', height: Commonheight(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                    <CommonText style={{ fontSize: Commonsize(13), fontWeight: '500', color: Commoncolor.CommonBlackColor, }}>Contact your admin if you don't have the entity key.</CommonText>
                                </View>


                                <View style={{ width: '100%', height: Commonheight(100), justifyContent: 'center', alignItems: 'flex-end', }}>

                                    <CommonButton onPress={() => { KeyCheck() }}>
                                        <CommonText style={{ fontSize: Commonsize(16), fontWeight: '400', color: Commoncolor.CommonWhiteColor, fontWeight: '500' }}>Submit</CommonText>
                                    </CommonButton>

                                </View>
                            </View>

                        </View>

                        <View style={{ width: '100%', height: Commonheight(200), }}>
                            <CommonImage imageFile={require('../../Assets/Images/entityimg.jpg')} resizeMode='cover' style={{ width: '100%', height: '100%', }} />
                        </View>

                    </View>

                </ScrollView>




            </SafeAreaView>

        </View>
    );
};

const styles = StyleSheet.create({

});

export default EntityKeyPage;
