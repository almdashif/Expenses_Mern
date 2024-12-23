import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Text } from 'react-native';

const CircularLoader = ({ size = 30, color = 'white', dotCount = 8, dotSize = 6, }) => {
    const dotScales = useRef([...Array(dotCount)].map(() => new Animated.Value(1))).current;

    useEffect(() => {
        const animations = dotScales.map((scale, index) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.5,
                        duration: 250,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            );
        });

        const staggerDelay = 100 + (8 - dotCount) * 25;
        Animated.stagger(staggerDelay, animations).start();

        return () => {
            dotScales.forEach(scale => scale.stopAnimation());
        };
    }, [dotScales, dotCount]);

    return (
        <View style={[{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            borderRadius: 50,
            width: size,
            height: size,
        }]}>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
                {dotScales.map((scale, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            {
                                position: 'absolute',
                                width: dotSize,
                                height: dotSize,
                                borderRadius: dotSize,
                                backgroundColor: color,
                                transform: [
                                    { rotate: `${(360 / dotCount) * index}deg` },
                                    { translateY: -size / 2 },
                                    { translateX: size / 2 },
                                    { scale },
                                ],
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};


const TextLoader = ({ dotSize = 4, color = 'white', dotCount = 3, content = '', contentStyle = {},style={} }) => {
    // Create an array of Animated values for each dot
    const dotScales = useRef([...Array(dotCount)].map(() => new Animated.Value(1))).current;

    useEffect(() => {
        // Sequential animation for each dot to create a wave-like effect
        const animations = dotScales.map((scale, index) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.5, // Scale up
                        duration: 300,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1, // Scale back down
                        duration: 300,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            );
        });

        // Stagger the animations to create the wave effect
        Animated.stagger(200, animations).start();

        return () => {
            dotScales.forEach(scale => scale.stopAnimation()); // Clean up on unmount
        };
    }, [dotScales, dotCount,]);

    return (
        <View style={[{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            flexDirection: 'row',

        },style]}>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row', // Arrange dots horizontally
                    position: 'relative',

                }}
            >
                {content && <Text style={[{ color: color, paddingRight: 5, }, contentStyle]}>{content}</Text>}
                {dotScales.map((scale, index) => (
                    <Animated.View
                        key={index}
                        style={[

                            {
                                width: dotSize,
                                height: dotSize,
                                borderRadius: dotSize,
                                backgroundColor: color,
                                transform: [
                                    { scale }, // Apply scaling animation
                                ],
                                marginHorizontal: 5, // Space between dots
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};


const EqualizerBarLoader = ({ barCount = 8, size = 60, color = 'white', barStyle = {} }) => {

    const barHeights = useRef([...Array(barCount)].map(() => new Animated.Value(1))).current;

    useEffect(() => {

        const animations = barHeights.map((height, index) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(height, {
                        toValue: 1.5,
                        duration: 600,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                    Animated.timing(height, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                ])
            );
        });

        Animated.stagger(150, animations).start();

        return () => {
            barHeights.forEach(height => height.stopAnimation());
        };
    }, [barHeights, size]);




    return (

        <View
            style={{
                justifyContent: 'flex-end',
                height: size * 2,
                overflow: 'hidden',

            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'center',


                }}
            >
                {barHeights.map((height, index) => (
                    <Animated.View
                        key={index}
                        style={[{
                            width: size / 12,
                            backgroundColor: color,
                            height: height.interpolate({
                                inputRange: [1, 1.5],
                                outputRange: [size * 2, size],
                            }),
                            marginHorizontal: 5,
                        }, barStyle]}
                    />
                ))}
            </View>
        </View>
    );
};





export { CircularLoader, TextLoader, EqualizerBarLoader }


