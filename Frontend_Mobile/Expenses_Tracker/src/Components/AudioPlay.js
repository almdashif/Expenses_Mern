import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Button, Text, StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon1 from "react-native-vector-icons/Entypo";
import Icon9 from 'react-native-vector-icons/MaterialCommunityIcons';
import { Commonheight, Commonsize, Commonwidth } from '../Utils/ResponsiveWidget';
import Commoncolor from '../CommonFolder/CommonColor';
const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioPlayerScreen = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const startPlaying = async () => {
        try {
            if (isPaused) {
                await audioRecorderPlayer.resumePlayer();
                setIsPaused(false);
            } else {
                await audioRecorderPlayer.startPlayer('https://adibv5.smartfm.cloud/Images/10-12-2024/Web/290/1541/290-1541-1733833431544-2534-AudioFile_5h7kl.mp3');
                setIsPlaying(true);

                audioRecorderPlayer.addPlayBackListener((e) => {
                    setCurrentPosition(e.currentPosition);
                    setDuration(e.duration);

                    if (e.currentPosition === e.duration) {
                        setIsPlaying(false);
                        audioRecorderPlayer.stopPlayer();
                        audioRecorderPlayer.removePlayBackListener();
                        setCurrentPosition(0)
                    }
                });
            }
        } catch (error) {
            setErrorMessage('Error playing audio: ' + error.message);
        }
    };

    const pausePlaying = async () => {
        try {
            await audioRecorderPlayer.pausePlayer();
            setIsPaused(true);
            setIsPlaying(false);
        } catch (error) {
            setErrorMessage('Error pausing audio: ' + error.message);
        }
    };

    const stopPlaying = async () => {
        try {
            await audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentPosition(0);
        } catch (error) {
            setErrorMessage('Error stopping audio playback: ' + error.message);
        }
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
 

        <View style={styles.container}>
            <View style={styles.recordingBox}>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                        { formatTime(currentPosition)} / {formatTime(duration)}
                    </Text>
                </View>
                <View style={styles.controlButtons}>
                    <TouchableOpacity
                        onPress={() => {
                            if (isPlaying || isPaused) {
                                stopPlaying();
                            } else {
                                startPlaying();
                            }
                        }}
                        style={[styles.actionButton, { marginRight: Commonwidth(50) }]}
                    >
                        <Icon9
                            name={(currentPosition > 0) ? "stop" : "play"}
                            size={Commonsize(50)}
                            color={Commoncolor.CommonWhiteColor}
                        />
                    </TouchableOpacity>

                  {(isPaused || currentPosition > 0) &&  <TouchableOpacity onPress={() => {
                        isPaused ?
                            startPlaying() :
                            pausePlaying();
                    }} style={styles.actionButton}>
                        <Icon1
                            name={isPaused ?"controller-play" : "controller-paus"  }
                            size={Commonsize(40)}
                            color={Commoncolor.CommonWhiteColor}
                        />
                    </TouchableOpacity>}
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

export default AudioPlayerScreen;
