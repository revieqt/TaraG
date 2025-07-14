import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BackButton from './custom/BackButton';
import { ThemedText } from './ThemedText';

interface HeaderProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
  rightButton?: React.ReactNode;
  leftButton?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ label, style, rightButton, leftButton }) => {
  if (leftButton) {
    return (
      <View style={[styles.container, style]}>
        {leftButton}
        <View style={{ flex: 1 }} />
        {rightButton}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <BackButton />
      {label && <ThemedText type='subtitle' style={[styles.label, { flex: 1 }]}>{label}</ThemedText>}
      {rightButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ensure rightButton is at the end
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  label: {
    marginLeft: 12,
  },
});

export default Header; 