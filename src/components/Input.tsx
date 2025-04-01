import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(null as any);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(null as any);
    }
  };

  const getContainerStyle = () => {
    const focusedStyle = isFocused ? styles.containerFocused : {};
    const errorStyle = error ? styles.containerError : {};
    return [styles.container, focusedStyle, errorStyle, containerStyle];
  };

  const getInputStyle = () => {
    const paddingLeft = leftIcon ? styles.inputWithLeftIcon : {};
    const paddingRight = rightIcon ? styles.inputWithRightIcon : {};
    return [styles.input, paddingLeft, paddingRight, style];
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getContainerStyle()}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={getInputStyle()}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.medium,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.medium,
    height: 48,
  },
  containerFocused: {
    borderColor: colors.primary,
  },
  containerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.fontSize.medium,
    height: '100%',
    paddingVertical: spacing.small,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.medium,
  },
  inputWithRightIcon: {
    paddingRight: spacing.medium,
  },
  label: {
    fontSize: typography.fontSize.medium,
    color: colors.text,
    marginBottom: spacing.small,
    fontWeight: '500',
  },
  errorText: {
    fontSize: typography.fontSize.small,
    color: colors.error,
    marginTop: spacing.tiny,
  },
  leftIcon: {
    marginRight: spacing.small,
  },
  rightIcon: {
    marginLeft: spacing.small,
  },
});

export default Input; 