import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { Meta, Rule } from '../components/ui';
import { seedLog } from '../data/strings';

export function LogScreen() {
  const st = useStore();
  const { T, lang } = st;

  const rows = st.log.map((e, i) => {
    if ('custom' in e) {
      const d = st.allDishes.find((x) => x.id === e.dishId);
      return { key: i, when: T.tonightWhen, name: d ? st.dishName(d) : '', note: T.loggedNote, cooked: true, outcome: '' };
    }
    const seed = seedLog[e.seed];
    const d = seed.dishId ? st.allDishes.find((x) => x.id === seed.dishId) : null;
    const cooked = seed.outcome === 'cooked' || !!seed.cookedAnyway;
    return {
      key: i,
      when: seed.when[lang],
      name: d ? st.dishName(d) : T.nothingWord,
      note: seed.note[lang],
      cooked,
      outcome: T.badgeOrdered,
    };
  });
  const cookedCount = rows.filter((r) => r.cooked).length;

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={s.titleRow}>
        <Text style={s.title}>{T.logTitle}</Text>
        <Meta size={10} spacingEm={0.1}>{T.cookedOf(cookedCount, rows.length)}</Meta>
      </View>
      <View style={s.strongRule} />
      <Text style={s.quip}>{T.logQuip}</Text>
      <Rule style={{ marginHorizontal: 20 }} />
      {rows.map((r) => (
        <View key={r.key} style={s.row}>
          <Meta size={9.5} spacingEm={0.1} color={colors.faint} style={{ width: 52, paddingTop: 4, lineHeight: 9.5 * 1.3 }}>
            {r.when}
          </Meta>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{r.name}</Text>
            <Text style={s.note}>{r.note}</Text>
          </View>
          {r.cooked ? (
            <View style={s.badgeCooked}>
              <Text style={s.badgeCookedLabel}>{T.badgeCooked}</Text>
            </View>
          ) : (
            <View style={s.badgeOrdered}>
              <Text style={s.badgeOrderedLabel}>{r.outcome}</Text>
            </View>
          )}
        </View>
      ))}
      <Text style={s.footer}>{T.logFooter}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  titleRow: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: 30 * -0.02,
    color: colors.ink,
    includeFontPadding: false,
  },
  strongRule: { height: 2, backgroundColor: colors.ruleStrong },
  quip: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 13.5 * 1.5,
    color: colors.muted60,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.ruleHairline,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  name: {
    fontFamily: fonts.extrabold,
    fontSize: 17,
    lineHeight: 17 * 1.15,
    letterSpacing: 17 * -0.01,
    color: colors.ink,
  },
  note: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: 12.5 * 1.4,
    color: colors.muted55,
    marginTop: 4,
  },
  badgeCooked: { paddingVertical: 4, paddingHorizontal: 7, backgroundColor: colors.accent },
  badgeCookedLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 9,
    lineHeight: 9 * 1.3,
    letterSpacing: 9 * 0.1,
    textTransform: 'uppercase',
    color: colors.light,
  },
  badgeOrdered: {
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: colors.ruleStrong,
  },
  badgeOrderedLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 9,
    lineHeight: 9 * 1.3,
    letterSpacing: 9 * 0.1,
    textTransform: 'uppercase',
    color: colors.muted60,
  },
  footer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 12 * 1.45,
    color: colors.faint,
  },
});
