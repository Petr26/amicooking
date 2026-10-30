import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors, fonts } from '../theme/tokens';

export const easeLand = Easing.bezier(0.16, 0.84, 0.24, 1);

export function Rule({ strong, style }: { strong?: boolean; style?: ViewStyle }) {
  return <View style={[{ height: strong ? 2 : 1, backgroundColor: strong ? colors.ruleStrong : colors.ruleHairline }, style]} />;
}

// Retriggerable entrance: fade + translate, re-runs whenever animKey changes.
export function Entrance({
  animKey,
  axis = 'y',
  distance = 16,
  duration = 460,
  delay = 0,
  style,
  children,
}: {
  animKey: string | number;
  axis?: 'x' | 'y';
  distance?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration, delay, easing: easeLand, useNativeDriver: true }).start();
  }, [animKey, v, duration, delay]);
  const translate = v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] });
  return (
    <Animated.View
      style={[style, { opacity: v, transform: axis === 'y' ? [{ translateY: translate }] : [{ translateX: translate }] }]}
    >
      {children}
    </Animated.View>
  );
}

// Full-width block button: label flush-left, arrow flush-right.
export function BlockButton({
  label,
  onPress,
  variant = 'accent',
  arrow = '→',
  disabledLook,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'accent' | 'light';
  arrow?: string | null;
  disabledLook?: boolean;
  style?: ViewStyle;
}) {
  const bg = variant === 'accent' ? colors.accent : colors.light;
  const bgPressed = variant === 'accent' ? colors.accentPressed : colors.lightPressed;
  const fg = variant === 'accent' ? colors.light : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.block,
        { backgroundColor: pressed ? bgPressed : bg, opacity: disabledLook ? 0.45 : 1 },
        style,
      ]}
    >
      <Text style={[s.blockLabel, { color: fg }]}>{label}</Text>
      {arrow ? <Text style={[s.blockLabel, { color: fg }]}>{arrow}</Text> : null}
    </Pressable>
  );
}

// Outlined flex button ("Ask again" / "Save for later").
export function OutlineButton({
  label,
  onPress,
  filled,
  style,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.outline,
        filled && { backgroundColor: colors.inkWash14 },
        !filled && pressed && { backgroundColor: colors.inkWash7 },
        style,
      ]}
    >
      <Text style={s.outlineLabel}>{label}</Text>
    </Pressable>
  );
}

// Ghost text link, flush-left.
export function GhostLink({
  label,
  onPress,
  color = colors.accent,
  opacity = 1,
  style,
  textStyle,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  opacity?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.ghost, { opacity: pressed ? opacity * 0.6 : opacity }, style]}>
      <Text style={[s.ghostLabel, { color }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

// Segmented control: 1px outer border, dividers, accent fill on active.
export function Segmented({
  options,
  style,
}: {
  options: { label: string; on: boolean; onPress: () => void }[];
  style?: ViewStyle;
}) {
  return (
    <View style={[s.segRow, style]}>
      {options.map((o, i) => (
        <Pressable
          key={i}
          onPress={o.onPress}
          style={({ pressed }) => [
            s.segBtn,
            i > 0 && !o.on && { borderLeftWidth: 1, borderLeftColor: colors.ruleHairline },
            o.on && { backgroundColor: colors.accent },
            !o.on && pressed && { backgroundColor: colors.inkWash7 },
          ]}
        >
          <Text style={[s.segLabel, { color: o.on ? colors.light : colors.ink }]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Square 56×28 switch, accent when on, 24×22 block thumb.
export function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.toggle,
        on
          ? { backgroundColor: colors.accent, borderColor: colors.accent, justifyContent: 'flex-end' }
          : { backgroundColor: 'transparent', borderColor: colors.ruleStrong, justifyContent: 'flex-start' },
      ]}
    >
      <View style={[s.thumb, { backgroundColor: on ? colors.light : colors.ruleStrong }]} />
    </Pressable>
  );
}

// Uppercase meta label helper.
export function Meta({ children, size = 9.5, color = colors.muted55, weight = '600' as const, spacingEm = 0.11, style }: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: '600' | '800';
  spacingEm?: number;
  style?: TextStyle;
}) {
  return (
    <Text
      style={[
        {
          fontFamily: weight === '800' ? fonts.extrabold : fonts.semibold,
          fontSize: size,
          lineHeight: size * 1.1,
          letterSpacing: size * spacingEm,
          textTransform: 'uppercase',
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const s = StyleSheet.create({
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
  },
  blockLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 13,
    lineHeight: 13,
    letterSpacing: 13 * 0.06,
    textTransform: 'uppercase',
  },
  outline: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ruleStrong,
  },
  outlineLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 12 * 0.06,
    textTransform: 'uppercase',
    color: colors.ink,
    textAlign: 'left',
  },
  ghost: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  ghostLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 11 * 0.08,
    textTransform: 'uppercase',
  },
  segRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.ruleStrong,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  segLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 11 * 0.05,
    textTransform: 'uppercase',
  },
  toggle: {
    width: 56,
    height: 28,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    width: 24,
    height: 22,
    marginHorizontal: 2,
  },
});
