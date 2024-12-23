import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get("window");

const guidelineBasewidth = width;
const guidelineBaseheight = height;

const deviceWidth = width;
const deviceHeight = height;
const responsiveHeight = (h: number) => height * (h / 100);
const responsiveWidth = (w: number) => width * (w / 100);

const horizontalScale = (size: number) => width / guidelineBasewidth * size;
const verticalScale = (size: number) => height / guidelineBaseheight * size;
const moderateScale = (size: number, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

// export { horizontalScale, verticalScale, moderateScale, responsiveHeight, responsiveWidth }
export default { deviceWidth, deviceHeight, responsiveHeight, responsiveWidth, horizontalScale, verticalScale, moderateScale, };