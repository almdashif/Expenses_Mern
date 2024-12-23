import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get("window");

const guidelineBasewidth = width;
const guidelineBaseheight = height;

const deviceWidth = width;
const deviceHeight = height;
const responsiveHeight = (h) => height * (h / 100);
const responsiveWidth = (w) => width * (w / 100);

const Commonwidth = size => width / guidelineBasewidth * size;
const Commonheight = size => height / guidelineBaseheight * size;
const Commonsize = (size, factor = 0.5) => size + (Commonwidth(size) - size) * factor;

export { Commonwidth, Commonheight, Commonsize, responsiveHeight, responsiveWidth,deviceHeight ,deviceWidth}