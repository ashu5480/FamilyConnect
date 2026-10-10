import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Motion, MotionGroup } from '../../components/animations';

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string };
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await apiRequest<any>('/events/1/messages');
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const data = await apiRequest<any>('/events/1/messages', {
        method: 'POST',
        body: JSON.stringify({ content: newMessage, channelId: '1' }),
      });
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesList} contentContainerStyle={styles.messagesContent}>
        {messages.length === 0 ? (
          <Motion preset="zoomIn" duration={600}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
            </View>
          </Motion>
        ) : (
          <MotionGroup preset="fadeInUp" stagger={50} duration={400}>
            {messages.map(msg => (
              <View key={msg.id} style={styles.messageBubble}>
                <Text style={styles.messageSender}>{msg.user?.name}</Text>
                <Text style={styles.messageText}>{msg.content}</Text>
              </View>
            ))}
          </MotionGroup>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16, paddingTop: 60 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { color: '#9CA3AF', fontSize: 15, textAlign: 'center' },
  messageBubble: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 16, marginBottom: 12, maxWidth: '80%', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowRadius: 4, shadowOpacity: 0.06 },
  messageSender: { fontSize: 12, color: '#E91E63', fontWeight: '700', marginBottom: 4 },
  messageText: { fontSize: 15, color: '#374151', lineHeight: 20 },
  inputContainer: { flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowRadius: 8, shadowOpacity: 0.08 },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 24, padding: 14, fontSize: 16, backgroundColor: '#F9FAFB', maxHeight: 100 },
  sendButton: { backgroundColor: '#E91E63', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  sendButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});