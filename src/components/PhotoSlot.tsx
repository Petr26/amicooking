import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/tokens';

// 186px photo band between 2px rules. The product ships without stock photos;
// when user photos exist they must render desaturated per the design system.
export function PhotoSlot() {
  return (
    <View style={s.slot}>
      <View style={s.tone} />
    </View>
  );
}

const s = StyleSheet.create({
  slot: {
    height: 186,
    borderTopWidth: 2,
    borderTopColor: colors.ruleStrong,
    borderBottomWidth: 2,
    borderBottomColor: colors.ruleStrong,
    backgroundColor: '#dedcda',
  },
  tone: {
    flex: 1,
    margin: 0,
    backgroundColor: 'rgba(32,30,29,.06)',
  },
});
