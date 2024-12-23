import React from 'react';
import { TextInput} from 'react-native';;

const CommonTextInput = props => {
  return (
    <>
      <TextInput
        maxLength={props.maxLength}
        keyboardType={props.keyboardType}
        value={props.value}
        onChangeText={props.onChangeText}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        style={[
          styles.TextInputStyles,
          {
            width: props.width,
            height: props.height,
            fontSize: props.fontSize,
            color: props.color,
            borderBottomColor: props.borderBottomColor,
          },
        ]}
      />
    </>
  );
};

const styles = {
  TextInputStyles: {
    alignSelf: 'center',
    borderBottomWidth: 1,
  },
};

export default CommonTextInput;
