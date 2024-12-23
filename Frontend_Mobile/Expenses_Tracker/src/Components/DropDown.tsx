

import { ActivityIndicator, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Commonsize, Commonwidth, Commonheight } from '../Utils/ResponsiveWidget';
import logger from '../Utils/logger';

export enum AnimationType {
  fade = "fade",
  slide = "slide",
  none = 'none'
}
interface DropDownProps<T extends Record<string, any>> {
  Icon?: JSX.Element;
  renderText: string,
  data: T[];
  placeholder: string;
  titleNoOfLines?: number;
  rowNoOfLines?: number;
  titleStyles?: object;
  titleTextStyles?: object;
  showTitleIcon?: boolean;
  onPressed: () => void;
  renderContainerStyles?: object;
  renderContainerInnerStyles?: object;
  renderContainerInnerChildStyles?: object;
  renderContainerInnerChildTextStyles?: object;
  mainContainerStyles?: object;
  indicatorColor?: string;
  onSelected?: (items: T) => void;
  paginationFnCall?: () => void;
  paginationIndex?: number;
  paginationSetIndex?: (index: number) => void;
  visible: boolean;
  onRequestClose?: () => void;
  loader?: boolean;
  showsVerticalScrollIndicator?: boolean;
  animationType?: AnimationType;
  noDataContainer?: React.ReactNode;
  backdropStyles?: object;
}

const DropDown = <T extends Record<string, any>>({
  Icon,
  renderText,
  data = [],
  placeholder = 'select',
  titleNoOfLines = 1,
  rowNoOfLines = 1,
  titleStyles = {},
  titleTextStyles = {},
  showTitleIcon = true,
  renderContainerStyles = {},
  renderContainerInnerStyles = {},
  renderContainerInnerChildStyles = {},
  renderContainerInnerChildTextStyles = {},
  mainContainerStyles = {},
  indicatorColor = '#1E1E55',
  onSelected = () => { },
  paginationFnCall = () => { },
  paginationIndex = 1,
  paginationSetIndex = () => { },
  onPressed = () => { },
  visible = false,
  onRequestClose = () => { },
  loader = false,
  showsVerticalScrollIndicator = true,
  animationType = AnimationType.none,
  noDataContainer,
  backdropStyles = {},
}: DropDownProps<T>) => {


  const [basePosition, setBasePosition] = useState(0)
  const [topPosition, setTopPosition] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const viewRef = useRef<View | null>(null);

  const measureView = () => {
    setBasePositionFunction(data?.length)
    viewRef.current?.measure((fx, fy, width, height, px, py) => {
      setPosition({ x: px, y: py });
    });
  };

  useEffect(() => {
    measureView();
  }, []);

  const setBasePositionFunction = (data: number) => {
    logger.log(data, 'data')
    switch (data) {
      case 1:
        setBasePosition(Commonheight(575));
        setTopPosition(Commonheight(55));
        break;
      case 2:
        setBasePosition(Commonheight(525));
        setTopPosition(Commonheight(105));
        break;
      case 3:
        setBasePosition(Commonheight(470));
        setTopPosition(Commonheight(155));
        break;
      case 4:
        setBasePosition(Commonheight(420));
        setTopPosition(Commonheight(205));
        break;
      default:
        setBasePosition(Commonheight(420));
        setTopPosition(Commonheight(205));
        break;
    }
  }


  return (
    <View ref={viewRef} style={[{ width: '100%', position: 'relative', zIndex: 999999, alignSelf: 'center' }, mainContainerStyles]}>
      <TouchableOpacity
        onPress={() => {
          measureView();
          onPressed();
        }}
        style={[{ flex: 1, width: '90%', height: Commonheight(50), backgroundColor: '#fff', alignSelf: 'center', flexDirection: 'row', paddingHorizontal: Commonwidth(15),paddingVertical:Commonheight(5), justifyContent: 'space-between', alignItems: 'center', shadowColor: '#1E1E55', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.17, shadowRadius: 3.05, elevation: 4, borderRadius: Commonsize(5) }, titleStyles]}>
        <Text numberOfLines={titleNoOfLines} style={[{ flex: 1, color: '#1E1E55', fontSize: Commonsize(13), fontWeight: '500', width: '100%', textAlign: 'center' ,marginRight:Commonwidth(5)}, titleTextStyles]}>
          {placeholder}
        </Text>

        {showTitleIcon && (Icon ? Icon :
          null
        )}
      </TouchableOpacity>

      <Modal
        onRequestClose={onRequestClose}
        visible={visible}
        animationType={animationType}
        presentationStyle="overFullScreen"
        transparent={true}
        style={[{ position: 'relative', width: '100%', height: 'auto', minHeight: Commonheight(250), maxHeight: Commonheight(250), alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center', marginTop: 5 }, renderContainerStyles]}>
        {loader ? (
          <View
            style={[
              {
                width: '90%',
                position: 'absolute',
                alignSelf: 'center',
                top: position.y < basePosition ? position.y + Commonheight(55) : position.y - (topPosition + Commonheight(45)),
                backgroundColor: '#ffffff',
                maxHeight: Commonheight(200),
                minHeight: Commonheight(150),
                justifyContent: 'center',
              },
              renderContainerInnerStyles,
            ]}>
            <ActivityIndicator size="large" color={indicatorColor} />
          </View>
        ) : data.length <= 0 ? (
          <View
            style={[
              {
                width: '90%',
                position: 'absolute',
                alignSelf: 'center',
                top: position.y < basePosition ? position.y + Commonheight(55) : position.y - topPosition,
                backgroundColor: '#ffffff',
                maxHeight: Commonheight(200),
                minHeight: Commonheight(150),
                justifyContent: 'center',
              },
              renderContainerInnerStyles,
            ]}>
            {noDataContainer
              ?
              noDataContainer
              :
              <View style={styles.noImageContainer}>
                <Image style={styles.noImage} source={require('../../src/Assets/Images/emptyBox.png')} />
              </View>
            }

          </View>
        ) : (
          <FlatList
            data={data}
            initialNumToRender={10}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                onPress={async () => { await onSelected(item); }}
                style={[{ position: 'relative', width: '100%', height: Commonheight(50), backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderColor: '#e6e6e6', borderBottomWidth: 1, padding: Commonsize(5) }, renderContainerInnerChildStyles]}>
                <Text numberOfLines={rowNoOfLines} style={[{ color: '#1E1E55', fontSize: Commonsize(12), fontWeight: '500' }, renderContainerInnerChildTextStyles]}>
                  {item[renderText]}
                </Text>
              </TouchableOpacity>
            )}
            style={[
              {
                width: '90%',
                position: 'absolute',
                alignSelf: 'center',
                top: position.y < basePosition ? position.y + Commonheight(55) : position.y - topPosition,
                backgroundColor: '#ffffff',
                maxHeight: Commonheight(200),
              },
              renderContainerInnerStyles,
            ]}
            onEndReachedThreshold={0.1}
            onEndReached={async ({ distanceFromEnd }) => {
              if (data.length > 9) {
                paginationSetIndex(paginationIndex + 1);
                paginationFnCall();
              } else {
                paginationSetIndex(paginationIndex);
                logger.log('No more data reached end!');
              }
            }}
          />
        )}
        <TouchableOpacity onPress={onRequestClose} style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.0)', position: 'absolute', width: '100%', height: '100%', zIndex: -99 }, backdropStyles]}></TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  noImage: {
    height: Commonheight(80),
    width: Commonwidth(80),
  },
  noImageContainer: {
    width: '100%',
    height: Commonheight(200),
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});





