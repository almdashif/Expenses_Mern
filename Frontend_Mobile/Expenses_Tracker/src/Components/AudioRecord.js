import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, BackHandler } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { Commonheight, Commonsize, Commonwidth } from '../Utils/ResponsiveWidget';
import Commoncolor from '../CommonFolder/CommonColor';
import Icon1 from "react-native-vector-icons/Entypo";
import Icon9 from 'react-native-vector-icons/MaterialCommunityIcons';

import { GlobalContext } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../Context/ToastProvider';
import logger from '../Utils/logger';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecord = () => {


    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    // const [isStopValid, setIsStopValid] = useState(false);
    const recordingIntervalRef = useRef(null);
    const { showToast } = useToast();


    const context = useContext(GlobalContext)
    const { cstate, cdispatch } = context

    const navigation = useNavigation()



    useEffect(() => {
        requestMicrophone()
    }, [])


    useEffect(() => {

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);


    const backAction = () => {
        navigation.goBack()
        return true;
    }

    const startRecording = async () => {
      
        if (isRecording) {
            showToast({ message: "Audio is already recording. Stop it before starting again", type: 'error', position: 'bottom', duration: 4000 });

            return;
        }

        try {
            const result = await audioRecorderPlayer.startRecorder();
            logger.log('Recording started:', result);
            setIsRecording(true);

            // Start recording timer
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime((prevTime) => {
                    if (prevTime >= 30) {
                        logger.log('first')
                        stopRecording(); // Stop recording after 30 seconds
                        return prevTime;
                    }
                    return prevTime + 1;
                });
            }, 1000);
        } catch (error) {
            showToast({ message: "Failed to start recording", type: 'error', position: 'bottom', duration: 3000 });
        }
    };

    const stopRecording = async () => {
        // if (!isStopValid) {
        //     showToast({ message: "No audio recording to stop", type: 'error', position: 'bottom', duration: 3000 });
        //     return true;
        // }

        try {
            const result = await audioRecorderPlayer.stopRecorder();
            logger.log('Recording stopped:', result);

            if (result) {
                const audioBase64 = await RNFS.readFile(result, "base64");
                saveAudio(audioBase64);

            } else {
                showToast({ message: "No valid audio data found", type: 'error', position: 'bottom', duration: 3000 });

            }

            audioRecorderPlayer.removeRecordBackListener();


            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }
        } catch (error) {
            // showToast({ message: "Failed to stop recording: " + error.message, type: 'error', position: 'bottom', duration: 3000 });
            showToast({ message: "No audio recording to stop", type: 'error', position: 'bottom', duration: 3000 });
        }
    };

    const saveAudio = async (audioBase64) => {

        if (!audioBase64) {
            showToast({ message: "No audio recorded", type: 'error', position: 'bottom', duration: 3000 });
            return true;
        }

        const audioData = {
            delete: "Audio",
            baseaudio: `data:audio/mp3;base64,${audioBase64}`,
            type: "audio",
            name: `AudioFile_${Math.random().toString(36).substring(7)}.mp3`,
        };




        cdispatch({ type: "SubmitPageAudio", payload: audioData });


        let MediaDatas = await cstate.SubmitMediaDatas.concat(audioData);

        cdispatch({ type: "SubmitMediaDatas", payload: MediaDatas });


        logger.log('saveAudio')


        showToast({ message: "Audio recorded successfully", type: 'success', position: 'bottom', duration: 3000 });
        // setRecordingTime(0);
        // setIsRecording(false);
      
        backAction();
    };
    const requestMicrophone = async () => {
        const isAndroid = Platform.OS === 'android';
        const atLeastAndroid13 = isAndroid && Platform.Version >= 33;

        try {
            const permissions = atLeastAndroid13
                ? [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO]
                : [
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ];

            const grants = await PermissionsAndroid.requestMultiple(permissions);

            logger.warn('Permission results:', grants);

            const allPermissionsGranted = atLeastAndroid13
                ? grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED
                : grants[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                grants[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;

            if (allPermissionsGranted) {
                logger.warn('Permissions granted');
            } else {
                logger.warn('All required permissions not granted');
                return;
            }
        } catch (err) {
            logger.warn('Error requesting permissions:', err);
            return;
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.recordingBox}>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                        00:{recordingTime > 9 ? recordingTime : '0' + recordingTime} / 00:30
                    </Text>
                </View>
                <View style={styles.controlButtons}>
                    <TouchableOpacity
                        onPress={() => startRecording()}
                        style={[styles.actionButton, { marginRight: Commonwidth(50) }]}
                    >
                        <Icon9
                            name="record-rec"
                            size={Commonsize(50)}
                            color={Commoncolor.CommonWhiteColor}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => stopRecording()} style={styles.actionButton}>
                        <Icon1
                            name="controller-stop"
                            size={Commonsize(40)}
                            color={Commoncolor.CommonWhiteColor}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    recordingBox: {
        width: Commonwidth(300),
        height: Commonheight(250),
        backgroundColor: '#fff',
        borderRadius: Commonsize(10),
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    timerContainer: {
        width: '100%',
        height: Commonheight(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontSize: Commonsize(30),
        color: Commoncolor.CommonAppColor,
    },
    controlButtons: {
        width: '100%',
        height: Commonheight(150),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        width: Commonheight(60),
        height: Commonheight(60),
        borderRadius: Commonheight(60),
        backgroundColor: Commoncolor.CommonAppColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AudioRecord;
