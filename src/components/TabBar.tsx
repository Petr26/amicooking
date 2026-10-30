import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme/tokens';
import { useStore, Tab } from '../state/store';

const TAB_KEYS: Tab[] = ['tonight', 'saved', 'log', 'you'];

export function TabBar() {
  const { T, tab, setTab } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <View>
      <View style={s.rule} />
      <View style={[s.row, { paddingBottom: Math.max(insets.bottom, 26) }]}>
        {TAB_KEYS.map((key, i) => {
          const on = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[s.tab, on && s.tabOn]}
            >
              <Text style={[s.label, { color: on ? colors.ink : colors.faint45 }]}>{T.tabs[i]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  rule: { height: 2, backgroundColor: colors.ruleStrong },
  row: { flexDirection: 'row', paddingHorizontal: 20, backgroundColor: colors.ground },
  tab: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 14,
    marginTop: 0,
  },
  tabOn: {
    borderTopWidth: 4,
    borderTopColor: colors.accent,
    marginTop: -2,
    paddingTop: 12,
  },
  label: {
    fontFamily: fonts.extrabold,
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 11 * 0.1,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
});
