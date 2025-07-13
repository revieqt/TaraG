import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';

// Import icon libraries
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { default as MaterialCommunityIcons, default as MaterialDesignIcons } from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type IconLibrary =
  | 'AntDesign'
  | 'MaterialIcons'
  | 'Ionicons'
  | 'FontAwesome'
  | 'Feather'
  | 'Entypo'
  | 'MaterialCommunityIcons'
  | 'MaterialDesignIcons';

type ThemedIconsProps = {
  library: IconLibrary;
  name: any;
  color?: string;
  size: number;
};

const iconLibraries = {
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  MaterialDesignIcons,
};

export const ThemedIcons: React.FC<ThemedIconsProps> = ({
  library,
  name,
  color,
  size,
}) => {
  const iconColor = useThemeColor(
    { light: undefined, dark: undefined },
    'icon'
  );

  const IconComponent = iconLibraries[library];

  return (
    <IconComponent
      name={name}
      size={size}
      color={color ?? iconColor}
    />
  );
};

export default ThemedIcons;