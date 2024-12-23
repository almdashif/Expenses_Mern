import { Modal, StyleSheet, View, Pressable, Animated, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { deviceHeight } from '../Utils/ResponsiveWidget';

interface IBottomSheetProps {
    children?: React.ReactNode;
    visible?: boolean;
    onRequestClose?: () => void;
    style?: object;
    height: number;
}
const BottomSheet: React.FC<IBottomSheetProps> = ({ children, visible = false, height = 330, onRequestClose = () => { }, style = {} }, ...props) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(height));


    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start();

            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, fadeAnim, slideAnim, height]);



    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onRequestClose}
            animationType={'none'}
            presentationStyle="overFullScreen"
            style={[{ flex: 1, width: '100%', height: '100%' }]}
            {...props}
        >

            <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end' }}>

                <TouchableWithoutFeedback onPress={onRequestClose}>
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                opacity: fadeAnim,
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>


                <Animated.View
                    style={[
                        {
                            width: '100%',
                            minHeight: height,
                            maxHeight:deviceHeight - 20,
                            transform: [{ translateY: slideAnim }],
                            position: 'absolute',
                            backgroundColor:'transparent',
                            bottom: 0,

                        }, style
                    ]}
                >
                    {children}
                </Animated.View>
            </View>



        </Modal>
    )
}

export default BottomSheet

const styles = StyleSheet.create({})

