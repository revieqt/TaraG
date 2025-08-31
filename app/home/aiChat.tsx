import Button from '@/components/Button';
import Header from '@/components/Header';
import OptionsPopup from '@/components/OptionsPopup';
import TextField from '@/components/TextField';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MAX_FREE_MESSAGES_PER_DAY } from '@/constants/Config';
import { useSession } from '@/context/SessionContext';
import { useAIChat } from '@/hooks/useAIChat';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

function getTodayKey() {
  const today = new Date();
  return `aiChatCount_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
}

export default function AIChatScreen() {
  const { messages, loading, error, sendMessage, resetChat } = useAIChat();
  const [input, setInput] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { session } = useSession();

  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      const key = getTodayKey();
      const stored = await AsyncStorage.getItem(key);
      setMessageCount(stored ? parseInt(stored, 10) : 0);
    };
    loadCount();
  }, []);

  useEffect(() => {
    const saveCount = async () => {
      const key = getTodayKey();
      await AsyncStorage.setItem(key, messageCount.toString());
    };
    saveCount();
  }, [messageCount]);

  const isProUser = !!session?.user?.isProUser;
  const hasMessagesLeft = isProUser || messageCount < MAX_FREE_MESSAGES_PER_DAY;

  const handleSend = () => {
    if (!input.trim()) return;

    if (!isProUser) {
      if (messageCount >= MAX_FREE_MESSAGES_PER_DAY) {
        return;
      }
      setMessageCount((prev) => prev + 1);
    }

    sendMessage(input.trim());
    setInput('');
  };

  useEffect(() => {
    if (
      ttsEnabled &&
      messages.length > 0 &&
      messages[messages.length - 1].role === 'assistant'
    ) {
      Speech.speak(messages[messages.length - 1].content, { language: 'en' });
    }
  }, [messages, ttsEnabled]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const showIntro = messages.length === 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <Header
        label="TaraAI"
        rightButton={[
          <OptionsPopup
            key="options"
            options={[
              <TouchableOpacity
                key="tts"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 5 }}
                onPress={() => setTtsEnabled((prev) => !prev)}
              >
                <MaterialIcons
                  name="record-voice-over"
                  size={20}
                  color="#222"
                />
                <ThemedText>
                  {ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
                </ThemedText>
              </TouchableOpacity>,
              <TouchableOpacity
                key="reset"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 5 }}
                onPress={resetChat}
              >
                <MaterialIcons
                  name="refresh"
                  size={20}
                  color="#222"
                />
                <ThemedText>Reset Chat</ThemedText>
              </TouchableOpacity>,
            ]}
          >
            <ThemedIcons
              library="MaterialCommunityIcons"
              name="dots-vertical"
              size={24}
            />
          </OptionsPopup>,
        ]}
      />
      <ThemedView style={{ flex: 1, padding: 0 }}>
        {showIntro ? (
          <ThemedView
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 32,
            }}
          >
            <Image
              source={require('@/assets/images/slide1-img.png')}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 10,
              }}
            />
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
              Hello, I am Tara
            </ThemedText>
            <ThemedText style={{ textAlign: 'center', color: '#888' }}>
              Your personal travel companion. Ask me anything about travel—destinations, tips, weather, and more.
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={[styles.messagesContainer, { paddingBottom: 70 }]}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageRow,
                  item.role === 'assistant'
                    ? {justifyContent: 'flex-start'}
                    : {justifyContent: 'flex-end', alignSelf: 'flex-end'},
                ]}
              >
                {item.role === 'assistant' && (
                  <Image
                    source={require('@/assets/images/slide1-img.png')}
                    style={styles.taraProfile}
                  />
                )}
                <ThemedView
                  color={item.role === 'assistant' ? 'primary' : 'secondary'}
                  shadow
                  style={[
                    styles.messageBubble,
                    item.role === 'user'
                      ? {alignSelf: 'flex-end', borderBottomRightRadius: 5}
                      : {alignSelf: 'flex-start', borderBottomLeftRadius: 5},
                  ]}
                >
                  <ThemedText
                    style={
                      item.role === 'user'
                        ? {color: '#fff'}
                        : null
                    }
                  >
                    {item.content}
                  </ThemedText>
                  {item.showGoToRoutes && (
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        backgroundColor: '#4300FF',
                        borderRadius: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 14,
                        alignSelf: 'flex-start',
                      }}
                      onPress={() => router.push('/home/routes/routes')}
                    >
                      <ThemedText
                        style={{ color: '#fff', fontWeight: 'bold' }}
                      >
                        Go to Routes
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </ThemedView>
              </View>
            )}
          />
        )}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4300FF" />
          </View>
        )}
        {error && (
          <ThemedText
            style={{
              color: 'red',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            {error}
          </ThemedText>
        )}
      </ThemedView>
      <ThemedView color="primary" style={styles.inputRowAbsolute}>
        {hasMessagesLeft ? (
          <>
            <TextField
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              onSubmitEditing={handleSend}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              disabled={loading || !input.trim()}
            >
              <ThemedIcons
                library="MaterialIcons"
                name="send"
                size={30}
                color="#00FFDE"
              />
            </TouchableOpacity>
          </>
        ) : (
          <View style={{ height: 180 }}>
            <ThemedText style={{ textAlign: 'center', flex: 1 }}>
              You have reached the free daily credits for messages to Tara today. Upgrade to Pro for unlimited access or come back tomorrow.
            </ThemedText>
            <Button
              title="Upgrade to Pro"
              onPress={() => []}
              type="primary"
            />
            <Button
              title="Watch Ad for Additional Messages"
              onPress={() => []}
              buttonStyle={{ marginTop: 10 }}
            />
          </View>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 10,
    maxWidth: '100%',
  },
  taraProfile: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
  },
  inputRowAbsolute: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  sendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
});