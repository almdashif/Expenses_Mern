import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import Commoncolor from '../CommonFolder/CommonColor'
import { Commonsize, Commonwidth } from '../Utils/ResponsiveWidget'

const CommonMaterialInputField = ({ style, placeholder = 'no placeholder', value, setState, onChangeText, placeholderTextColor, totalNoOfCount = 0, countStyle, countContainerStyle, editable = true, multiline = true }) => {
    return (
        <View>
            <TextInput
                numberOfLines={5}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={placeholderTextColor}
                placeholder={placeholder}
                multiline={multiline}
                editable={editable}
                maxLength={totalNoOfCount}
                style={[{
                    backgroundColor: Commoncolor.CommonWhiteColor, textAlignVertical: 'top', borderRadius: Commonsize(10), paddingLeft: Commonwidth(10), borderColor: Commoncolor.CommonGrayColor, borderWidth: Commonsize(.5), shadowColor: "#000000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 1.00,
                    elevation: 1,
                    fontSize: Commonsize(12),
                }, { ...style }]}
            />
            <View style={[{ width: '100%', justifyContent: 'center', alignItems: 'flex-end' }, { ...countContainerStyle }]}>
                <Text style={[{ fontSize: Commonsize(12), color: Commoncolor.CommonTextMildBlack, fontWeight: '500', }, { ...countStyle }]}>{value ? value.length : 0}/{totalNoOfCount}</Text>
            </View>
        </View>
    )
}

export default CommonMaterialInputField

const styles = StyleSheet.create({})