import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef } from 'react';
import { Animated, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'complimentary1' | 'complimentary2' | 'complimentary3' | 'complimentary4';
  shadow?: boolean;
  border?: 'thin-gray' | 'thin-black' | 'thin-white';
  opacity?: number;
  roundness?: number;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  color,
  shadow,
  border,
  opacity,
  roundness,
  ...otherProps
}: ThemedViewProps) {
  let colorKey:
    | 'background'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'complimentary1'
    | 'complimentary2'
    | 'complimentary3'
    | 'complimentary4' = 'background';

  if (color === 'primary') colorKey = 'primary';
  else if (color === 'secondary') colorKey = 'secondary';
  else if (color === 'accent') colorKey = 'accent';
  else if (color === 'complimentary1') colorKey = 'complimentary1';
  else if (color === 'complimentary2') colorKey = 'complimentary2';
  else if (color === 'complimentary3') colorKey = 'complimentary3';
  else if (color === 'complimentary4') colorKey = 'complimentary4';

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorKey);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current; // Start further below for a more pronounced "peek"

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
    ]).start();
  }, [fadeAnim, translateY]);

  // Soft shadow style
  let shadowStyle = {};
  if (shadow) {
    shadowStyle = {
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 10,
    };
  }

  // Border style
  let borderStyle = {};
  if (border === 'thin-gray') {
    borderStyle = { borderWidth: 1, borderColor: '#ccc' };
  } else if (border === 'thin-black') {
    borderStyle = { borderWidth: 1, borderColor: 'black' };
  } else if (border === 'thin-white') {
    borderStyle = { borderWidth: 1, borderColor: 'white' };
  }

  // Roundness style
  const roundnessStyle = typeof roundness === 'number' ? { borderRadius: roundness } : {};

  const viewOpacity = typeof opacity === 'number' ? opacity : fadeAnim;

  return (
    <Animated.View
      style={[
        {
          backgroundColor,
          opacity: viewOpacity,
          transform: [{ translateY }],
        },
        shadowStyle,
        borderStyle,
        roundnessStyle,
        style,
      ]}
      {...otherProps}
    />
  );
}