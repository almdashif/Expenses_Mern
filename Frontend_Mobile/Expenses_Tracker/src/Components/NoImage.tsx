import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext } from 'react'
import { Commonheight, Commonsize } from '../Utils/ResponsiveWidget'
import Commoncolor from '../CommonFolder/CommonColor'


interface INoImage {
    mainContainerStyle?: object,
    imageContainerStyle?: object,
    imageStyle?: object,
    bottomTextStyle?: object,
    BottomText: string
}

const NoImage: React.FC<INoImage> = ({ mainContainerStyle, imageContainerStyle, imageStyle, bottomTextStyle, BottomText = 'No Records!' }) => {
    let image = require('../Assets/Images/emptyBoxColored.png')

    return (
        <View style={[{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }, { ...mainContainerStyle }]}>
            <View style={[{ width: '100%', minHeight: Commonheight(100), justifyContent: 'center', alignItems: 'center', alignContent: 'center' }, { ...imageContainerStyle }]} >
                <Image style={[{ height: Commonheight(90), width: Commonheight(90), }, { ...imageStyle }]} source={image} />
            </View>
            <Text style={[{ fontSize: Commonsize(14), color: Commoncolor.CommonAppColor, fontWeight: '500',marginTop:Commonheight(10) }, { ...bottomTextStyle }]}>{BottomText}</Text>

        </View>
    )
}

export default NoImage

const styles = StyleSheet.create({})