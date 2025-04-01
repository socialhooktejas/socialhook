import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  // Determine the styles based on variant, size, and disabled state
  const getContainerStyle = () => {
    let variantStyle;
    switch (variant) {
      case 'primary':
        variantStyle = styles.primaryContainer;
        break;
      case 'secondary':
        variantStyle = styles.secondaryContainer;
        break;
      case 'outline':
        variantStyle = styles.outlineContainer;
        break;
      case 'text':
        variantStyle = styles.textContainer;
        break;
      default:
        variantStyle = styles.primaryContainer;
    }

    let sizeStyle;
    switch (size) {
      case 'small':
        sizeStyle = styles.smallContainer;
        break;
      case 'medium':
        sizeStyle = styles.mediumContainer;
        break;
      case 'large':
        sizeStyle = styles.largeContainer;
        break;
      default:
        sizeStyle = styles.mediumContainer;
    }

    const disabledStyle = disabled ? styles.disabledContainer : {};
    const widthStyle = fullWidth ? styles.fullWidth : {};

    return [variantStyle, sizeStyle, disabledStyle, widthStyle];
  };

  const getTextStyle = () => {
    let variantStyle;
    switch (variant) {
      case 'primary':
        variantStyle = styles.primaryText;
        break;
      case 'secondary':
        variantStyle = styles.secondaryText;
        break;
      case 'outline':
        variantStyle = styles.outlineText;
        break;
      case 'text':
        variantStyle = styles.textOnlyText;
        break;
      default:
        variantStyle = styles.primaryText;
    }

    let sizeStyle;
    switch (size) {
      case 'small':
        sizeStyle = styles.smallText;
        break;
      case 'medium':
        sizeStyle = styles.mediumText;
        break;
      case 'large':
        sizeStyle = styles.largeText;
        break;
      default:
        sizeStyle = styles.mediumText;
    }

    const disabledStyle = disabled ? styles.disabledText : {};

    return [variantStyle, sizeStyle, disabledStyle];
  };

  const getSpinnerColor = () => {
    switch (variant) {
      case 'primary':
        return colors.buttonText;
      case 'secondary':
        return colors.buttonText;
      case 'outline':
        return colors.primary;
      case 'text':
        return colors.primary;
      default:
        return colors.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getSpinnerColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variant styles
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  // Size styles
  smallContainer: {
    paddingVertical: spacing.tiny,
    paddingHorizontal: spacing.medium,
  },
  mediumContainer: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
  },
  largeContainer: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.xlarge,
  },
  // Text styles
  primaryText: {
    color: colors.buttonText,
    fontWeight: '600',
  },
  secondaryText: {
    color: colors.buttonText,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
    fontWeight: '600',
  },
  textOnlyText: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Text sizes
  smallText: {
    fontSize: typography.fontSize.small,
  },
  mediumText: {
    fontSize: typography.fontSize.medium,
  },
  largeText: {
    fontSize: typography.fontSize.large,
  },
  // Disabled styles
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  // Width style
  fullWidth: {
    width: '100%',
  },
  // Icon styles
  leftIcon: {
    marginRight: spacing.small,
  },
  rightIcon: {
    marginLeft: spacing.small,
  },
});

export default Button; 