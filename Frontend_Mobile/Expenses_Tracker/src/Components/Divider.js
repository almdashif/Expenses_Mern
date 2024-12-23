import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Commoncolor from '../CommonFolder/CommonColor'
import { Commonheight } from '../Utils/ResponsiveWidget'
const Divider = ({style}) => {
  return (
    <View style={[{width:'100%',height:Commonheight(1),backgroundColor:Commoncolor.CommonGrayColor},{...style}]}></View>
  )
}

export default Divider

const styles = StyleSheet.create({})