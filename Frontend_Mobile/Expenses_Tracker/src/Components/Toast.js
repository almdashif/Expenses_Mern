import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Commoncolor from '../CommonFolder/CommonColor';

const { width, height } = Dimensions.get('window');

const Toast = React.forwardRef((_, ref) => {
  const [toastConfig, setToastConfig] = useState({ message: '', type: '', position: 'top' });
  const [visible, setVisible] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  React.useImperativeHandle(ref, () => ({
    show: ({ message, type = 'info', position = 'top', duration = 3000 }) => {

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setToastConfig({ message, type, position });
      setVisible(true);


      translateY.setValue(position === 'top' ? -100 : height);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();


      timeoutRef.current = setTimeout(() => hide(position), duration);
    },
    hide: () => hide(toastConfig.position),
  }));

  const hide = (position) => {

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : height,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    });
  };


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 || Math.abs(dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        translateY.setValue(dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;
        if (Math.abs(dy) > 50) {
          hide(toastConfig.position);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={() => hide(toastConfig.position)} style={{ zIndex: 999999999999999999 }}>
      <View style={[styles.container, toastConfig.position === 'bottom' ? styles.bottom : styles.top]}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.toast,
            styles[toastConfig.type],
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.message}>{toastConfig.message}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999999999999999999
  },
  top: {
    top: 50,
  },
  bottom: {
    bottom: 50,
  },
  toast: {
    minWidth: 200,
    maxWidth: width * 0.9,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  message: {
    color: 'white',
    textAlign: 'center',
  },
  info: {
    backgroundColor: Commoncolor.CommonAppColor,
  },
  success: {
    backgroundColor: Commoncolor.CommonGreenColor,
  },
  error: {
    backgroundColor: Commoncolor.CommonRedColor,
  },
});

export default Toast;
