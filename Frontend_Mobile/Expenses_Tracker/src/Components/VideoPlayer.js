import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'react-native-video';

const VideoPlayer = ({ source = '', ref = null, containerStyle = {}, videoStyle = {}, controls = true, resizeMode = 'contain', }) => {


    return (
        <View style={[styles.container, containerStyle ]}>
            <Video
                ref={ref}
                source={source}
                style={[styles.video, videoStyle ]}
                controls={controls}
                resizeMode={resizeMode}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});

export default VideoPlayer;
