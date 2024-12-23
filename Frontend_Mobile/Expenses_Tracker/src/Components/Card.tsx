import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Commonheight, Commonsize } from '../Utils/ResponsiveWidget'
import Commoncolor from '../CommonFolder/CommonColor'



interface ICard {
    children?: React.ReactNode,
    style?: object,
    disabled?: boolean,
    onPress?: () => void,
}
const Card: React.FC<ICard> = ({ children, style, disabled = true, onPress = () => { } }) => {

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={[{
            width: '100%', minHeight: Commonheight(30), borderRadius: Commonsize(5),backgroundColor:"#fff",shadowColor: Commoncolor.CommonAppColor,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity:  0.16,
            shadowRadius: 1.51,
            elevation: 2
        }, { ...style }]}>
            {children}
        </TouchableOpacity>
    )
}

export { Card }


