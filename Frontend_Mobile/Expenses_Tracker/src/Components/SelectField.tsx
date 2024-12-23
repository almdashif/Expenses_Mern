import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Ico from 'react-native-vector-icons/FontAwesome';
import { cstate } from '../Constants/useContext';
import { Commonheight, Commonsize, Commonwidth } from '../Utils/ResponsiveWidget';
import Commoncolor from '../CommonFolder/CommonColor';
import logger from '../Utils/logger';

interface ISelectFeild {
    title?: string,
    placeholder?: string,
    type?: string,
    onPress: () => void,
    onIconPress: () => void,
    state: any,
    icon?: string,
    mandatory: boolean,
    isContext: boolean,
    cdispatchName: string,
    iconDisabled: boolean,
    mainStyle: object,
    onChangeText: () => void,
    iconStyle: object,
}

const SelectField: React.FC<ISelectFeild> = ({ title = 'title', placeholder = 'placeholder', type = 'select', onPress = () => { logger.log('no onPress found') }, onIconPress = () => { logger.log('no onIconPress found') }, state = null, icon = 'caret-down', mandatory = false, isContext = false, cdispatchName, iconDisabled = false, mainStyle, onChangeText, iconStyle }) => {

    return (

        <TouchableOpacity
            disabled={false}
            onPress={() => onPress()}
            style={[{ width: '100%', alignSelf: "center", height: Commonheight(40), marginTop: Commonheight(8), backgroundColor: '#fff', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', borderRadius: Commonsize(10), borderWidth: Commonsize(1), borderColor: cstate.MainFirstColor, }, mainStyle]}>
            {
                type == 'select' ?
                    <Text style={{ maxWidth: '80%', fontSize: Commonsize(14), fontWeight: "500", color: Commoncolor.CommonDarkTextGray, alignSelf: "center", marginLeft: Commonwidth(10), textAlign: 'left' }}>{placeholder}</Text>
                    :
                    <TextInput onChangeText={onChangeText} value={state} placeholder={placeholder} placeholderTextColor={Commoncolor.CommonDarkTextGray} style={{ width: '80%', fontSize: Commonsize(14), fontWeight: '500', marginLeft: Commonwidth(5), textAlign: 'left', color: Commoncolor.CommonDarkTextGray }} />
            }

            <TouchableOpacity
                disabled={iconDisabled}
                onPress={() => { onIconPress() }}
                style={{ height: Commonheight(30), width: '15%', justifyContent: 'center', alignItems: "center", borderLeftColor: Commoncolor.CommonLightGray, borderLeftWidth: Commonsize(1), zIndex: 999 }}>
                <Ico name={icon} size={Commonsize(16)} style={[{ color: Commoncolor.CommonDarkTextGray, alignSelf: "center", fontWeight: '200' }, { ...iconStyle }]} />
            </TouchableOpacity>

            <Text style={{ fontSize: Commonsize(10), fontWeight: "500", color: Commoncolor.CommonDarkTextGray, position: 'absolute', top: Commonheight(-7), left: '5%', backgroundColor: '#fff', paddingHorizontal: Commonwidth(2), }}> {title} {mandatory && <Text style={{ fontSize: Commonsize(10), fontWeight: "500", color: Commoncolor.CommonRedColor, paddingHorizontal: Commonwidth(2), }}>*</Text>}</Text>

        </TouchableOpacity>
    )
}

export default SelectField

const styles = StyleSheet.create({})