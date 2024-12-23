import React from 'react'
import { Image } from 'react-native'
import logger from '../Utils/logger';

const CommonImage = ({ imageFile = '', ...props }) => {

    if (!imageFile) {
        logger.log('CommonImage: No image source provided.');
        return null; // Return null or a placeholder image if needed
    }


    return (
        <Image  source={imageFile} {...props} />
    )
}

export default CommonImage
