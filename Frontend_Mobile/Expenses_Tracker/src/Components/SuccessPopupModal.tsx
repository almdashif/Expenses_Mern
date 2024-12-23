import { Image, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CommonCard from './CommonCard'
import { Commonheight, Commonsize, Commonwidth } from '../Utils/ResponsiveWidget'
import Commoncolor from '../CommonFolder/CommonColor'


interface ISuccessPopupModalProps {
    state: any,
    onPress: () => void,
    content: string,
    containerStyle: object,
    cardStyle: object,
    textStyle: object,
}
const SuccessPopupModal: React.FC<ISuccessPopupModalProps> = ({ state, onPress, content, containerStyle, cardStyle, textStyle }) => {
    const [Show, setShow] = useState(true)
    return (
        <Modal
            animationType="none"
            presentationStyle="overFullScreen"
            transparent={true}
            visible={Show}
        >
            <View
                style={[{
                    width: "100%",
                    height: '100%',
                    flex: 1,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }]}
            >
                <CommonCard style={[{ width: '90%', alignSelf: 'center', justifyContent: "center", alignItems: "center", paddingVertical: Commonheight(50), backgroundColor: '#fff', zIndex: 999 }]}>

                    <View style={{ width: Commonsize(60), height: Commonsize(60), justifyContent: "center", alignItems: 'center', marginRight: Commonwidth(10), backgroundColor: '#fff', marginBottom: Commonheight(10) }}>
                        <Image source={require('../Images/successAlert.png')} resizeMode='cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </View>
                    <Text style={[{ fontSize: Commonsize(14), color: Commoncolor.CommonDarkTextGray, textAlign: 'center' }]}>Your service request #12345 has been raised successfully!</Text>

                </CommonCard>
                {/* <TouchableOpacity onPress={() => { setShow(false) }} style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'red', position: 'absolute', top: 0, left: 0,zIndex:-1 }}>

                </TouchableOpacity> */}
            </View>
        </Modal>
    )
}

export default SuccessPopupModal

const styles = StyleSheet.create({})