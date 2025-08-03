import { useThemeColor } from '@/hooks/useThemeColor';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface DropDownFieldProps {
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  values?: Array<string | { label: string; value: string }>;
  style?: any;
  enabled?: boolean;
}

const DropDownField: React.FC<DropDownFieldProps> = ({
  placeholder = '',
  value,
  onValueChange,
  values = [],
  style,
  enabled = true,
}) => {
  const backgroundColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tint');
  const [isFocused, setIsFocused] = useState(false);

  // Convert values to uniform {label, value} objects
  const options = values.map((v) =>
    typeof v === 'string' ? { label: v, value: v } : v
  );

  return (
    <TouchableWithoutFeedback onPressIn={() => setIsFocused(true)} onPressOut={() => setIsFocused(false)}>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor },
          { borderColor: isFocused ? borderColor : '#cccccc', borderWidth: 1 },
          style,
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={enabled}
          style={[styles.picker, { color: textColor }]}
          dropdownIconColor={textColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {placeholder ? (
            <Picker.Item label={placeholder} value="" color="#aaa" enabled={false} />
          ) : null}
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    paddingRight: 16,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    position: 'relative',
    minHeight: 48,
    height: 48,
  },
  picker: {
    flex: 1,
    fontSize: 16,
    height: 50,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

export default DropDownField; 