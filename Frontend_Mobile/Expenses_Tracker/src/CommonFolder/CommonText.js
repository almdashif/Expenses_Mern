import { Text } from 'react-native'
import React from 'react'
import Commoncolor from './CommonColor'
import { Commonsize } from '../Utils/ResponsiveWidget'

const CommonText = ({ ...props }) => {
    return (
        <Text style={{ color:'#000', fontSize: Commonsize(14), fontWeight: '400' }} {...props}>{props?.children}</Text>
    )
}

export default CommonText