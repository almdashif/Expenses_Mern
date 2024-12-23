import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Commonheight, Commonsize, Commonwidth } from '../Utils/ResponsiveWidget'
import Commoncolor from '../CommonFolder/CommonColor'



interface ICommonCard {
    children?: React.ReactNode,
    style?: object,
    disabled?: boolean,
    onPress?: () => void,
}
const CommonCard: React.FC<ICommonCard> = ({ children, style, disabled = true, onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={[{
            width: '100%', minHeight: Commonheight(100), borderRadius: Commonsize(10),
        }, { ...style }]}>
            {children}
        </TouchableOpacity>
    )
}

export default CommonCard


