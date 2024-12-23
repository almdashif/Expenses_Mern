
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Commonheight, Commonsize, Commonwidth } from '../Utils/ResponsiveWidget'
import Commoncolor from './CommonColor'

const CommonButton = ({ ...props }) => {
    return (
        <TouchableOpacity style={[{ width: Commonwidth(150), height: Commonheight(50), backgroundColor: Commoncolor.EntityKeyDownColor, justifyContent: 'center', alignItems: 'center', borderRadius: Commonsize(100), }, props.styles]} {...props}>
            {props?.children}
        </TouchableOpacity>
    )
}

export default CommonButton