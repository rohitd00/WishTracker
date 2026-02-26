import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Trash2, Check, Tag, Search, Sparkles, WifiOff } from 'lucide-react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// 🔌 CONFIGURATION
// Once you host your backend on Render, paste the URL here.
const RENDER_URL = 'https://wishtracker.onrender.com';
const LOCAL_IP = '192.168.0.188'; // Change to your current local IP
const API_URL = `${RENDER_URL}/api/items`; // Defaulting to Render URL

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const [priority, setPriority] = useState('medium');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchItems();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL).catch(() => { throw new Error('Offline'); });
      if (!res.ok) throw new Error('Unreachable');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tag, priority }),
      });
      const data = await res.json();
      setItems([data, ...items]);
      setText('');
      setTag('');
      setPriority('medium');
    } catch (err) {
      setError(true);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      const data = await res.json();
      setItems(items.map(i => i._id === id ? data : i));
    } catch (err) { }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i._id !== id));
    } catch (err) { }
  };

  const filteredItems = items.filter(i =>
    i.text.toLowerCase().includes(search.toLowerCase()) ||
    (i.tag && i.tag.toLowerCase().includes(search.toLowerCase()))
  );

  const colors = {
    high: '#f87171',
    medium: '#e8c97e',
    low: '#6fcf97',
    text: '#F0EDE8',
    textMuted: 'rgba(240,237,232,0.4)',
    bg: '#0D0D0F'
  };

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <BlurView intensity={25} tint="dark" style={styles.itemCard}>
        <View style={[styles.priorityLine, { backgroundColor: colors[item.priority] }]} />

        <Pressable
          style={[styles.checkbox, item.completed && { backgroundColor: colors.low, borderColor: colors.low }]}
          onPress={() => toggleComplete(item._id, item.completed)}
        >
          {item.completed && <Check size={12} color="#000" strokeWidth={3} />}
        </Pressable>

        <View style={styles.itemBody}>
          <Text style={[styles.itemText, item.completed && styles.completedText]}>{item.text}</Text>
          {item.tag ? <Text style={styles.tagText}>#{String(item.tag).toLowerCase().replace(/\s+/g, '')}</Text> : null}
        </View>

        <TouchableOpacity onPress={() => deleteItem(item._id)} style={styles.trashBtn}>
          <Trash2 size={16} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />

      {/* Dynamic Background Glows */}
      <View style={[styles.blurCircle, { top: -100, left: -50, backgroundColor: colors.high + '15' }]} />
      <View style={[styles.blurCircle, { top: 200, right: -100, backgroundColor: colors.medium + '10' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Wish<Text style={styles.italic}>list</Text></Text>
              <View style={styles.badge}>
                <Sparkles size={10} color={colors.medium} />
                <Text style={styles.badgeText}>{items.length} items</Text>
              </View>
            </View>
            <TouchableOpacity onPress={fetchItems} style={styles.connectionIcon}>
              {error ? <WifiOff size={20} color={colors.high} /> : <Search size={20} color={colors.medium} opacity={0.5} />}
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <BlurView intensity={40} tint="dark" style={styles.glassInput}>
              <View style={styles.inputMainRow}>
                <TextInput
                  style={styles.mainInput}
                  placeholder="Capture a wish..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={text}
                  onChangeText={setText}
                  selectionColor={colors.medium}
                />
                <TouchableOpacity style={styles.fab} onPress={addItem}>
                  <Plus size={24} color="#0D0D0F" strokeWidth={3} />
                </TouchableOpacity>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.priorityGroup}>
                  {['low', 'medium', 'high'].map(p => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[styles.pBtn, priority === p && { borderColor: colors[p], backgroundColor: colors[p] + '15' }]}
                    >
                      <Text style={[styles.pBtnText, priority === p && { color: colors[p] }]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.tagInput}
                  placeholder="category"
                  placeholderTextColor="rgba(255,255,255,0.15)"
                  value={tag}
                  onChangeText={setTag}
                />
              </View>
            </BlurView>
          </View>

          <View style={styles.searchRow}>
            <Search size={14} color="rgba(255,255,255,0.2)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search collective..."
              placeholderTextColor="rgba(255,255,255,0.1)"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {loading ? (
            <ActivityIndicator color={colors.medium} style={{ marginTop: 60 }} />
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.scrollList}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>✦ List Empty ✦</Text>
                  {error && <Text style={styles.errorSub}>Backend Unreachable. Check URL in App.js.</Text>}
                </View>
              }
            />
          )}

        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070708',
  },
  blurCircle: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.8,
    filter: 'blur(100px)',
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: '#F0EDE8',
    letterSpacing: -1.5,
  },
  italic: {
    fontStyle: 'italic',
    color: '#E8C97E',
    fontWeight: '400',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  badgeText: {
    color: 'rgba(240,237,232,0.4)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  connectionIcon: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  glassInput: {
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
  },
  inputMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  mainInput: {
    flex: 1,
    height: 50,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#E8C97E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E8C97E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  priorityGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  pBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pBtnText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tagInput: {
    fontSize: 13,
    color: '#E8C97E',
    fontWeight: '600',
    textAlign: 'right',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 28,
    marginBottom: 15,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  itemCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.01)',
    overflow: 'hidden',
  },
  priorityLine: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(240,237,232,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemBody: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#F0EDE8',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'rgba(240,237,232,0.2)',
  },
  tagText: {
    fontSize: 10,
    color: '#E8C97E',
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  trashBtn: {
    padding: 10,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.1)',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  errorSub: {
    color: '#f87171',
    fontSize: 10,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 200,
    opacity: 0.8,
  }
});
