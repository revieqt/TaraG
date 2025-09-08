import OptionsPopup from "@/components/OptionsPopup";
import TextField from "@/components/TextField";
import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedIcons from "@/components/ThemedIcons";
import Button from '@/components/Button';

export const renderGroupsSection = () => {
    const primaryColor = useThemeColor({}, 'primary');
    const secondaryColor = useThemeColor({}, 'secondary');
    return (
    <View style={{padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10}}>
    <View style={{flex: 1}}>
        <TextField
        placeholder="Search groups..."
        value=""
        onChangeText={() => {}}
        onFocus={() => {}}
        onBlur={() => {}}
        isFocused={false}
        autoCapitalize="none"
        />
    </View>

    <OptionsPopup
    key="joinGroup"
    style={[styles.addButton, {backgroundColor: primaryColor}]}
    options={[
        <View key="header">
        <ThemedText type='subtitle'>Join A Group</ThemedText>
        <ThemedText>Input a valid invite code</ThemedText>
        
        </View>,
        <View style={{flex: 1}}>
        <TextField
            placeholder="Enter Invite Code"
            value=""
            onChangeText={() => {}}
            onFocus={() => {}}
            onBlur={() => {}}
            isFocused={false}
            autoCapitalize="none"
        />
        <Button
            title='Join'
            type='primary'
            onPress={() => {}}
        />
        </View>
    ]}>
        <ThemedIcons library='MaterialIcons' name='group-add' size={20} />
    </OptionsPopup>

    <OptionsPopup
    key="createGroup"
    style={[styles.addButton, {backgroundColor: secondaryColor}]}
    options={[
        <View key="header">
        <ThemedText type='subtitle'>Create a Group</ThemedText>
        <ThemedText>Create a group name and invite your friends</ThemedText>
        </View>,
        <View style={{flex: 1}}>
        <TextField
        placeholder="Enter Group Name"
        value=""
        onChangeText={() => {}}
        onFocus={() => {}}
        onBlur={() => {}}
        isFocused={false}
        autoCapitalize="none"
        />
        <Button
        title='Create'
        type='primary'
        onPress={() => {}}
        />
    </View>
    ]}>
        <ThemedIcons library='MaterialIcons' name='add' size={25} color='white'/>
    </OptionsPopup>
    </View>
   ); 
}

const styles = StyleSheet.create({
    addButton: {
        marginTop: -12,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});