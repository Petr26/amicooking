import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { GhostLink, Meta, Rule, Segmented, Toggle } from '../components/ui';
import { SignInNudge } from '../components/account';

const TIME_VALS = [15, 30, 60, 999];

export function YouScreen() {
  const st = useStore();
  const { T } = st;

  const switches = [
    { label: T.sw1, sub: T.sw1s, on: st.breakRotation, toggle: st.toggleBreakRotation },
    { label: T.sw2, sub: T.sw2s, on: st.noFish, toggle: st.toggleNoFish },
    { label: T.sw3, sub: T.sw3s, on: st.askEarly, toggle: st.toggleAskEarly },
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={s.title}>{T.youTitle}</Text>
      <View style={s.strongRule} />
      {st.user ? (
        <View style={s.account}>
          <Meta>{T.account}</Meta>
          <Text style={s.email}>{st.user.email}</Text>
          <Meta size={9.5} spacingEm={0.1} color={colors.accentDeep}>
            {(st.plan === 'pro' ? T.planPro : T.planFree) + ' · ' + T.dishUsage(st.myDishCount, st.dishLimit)}
          </Meta>
          <Text style={[s.smallNote, { paddingHorizontal: 0 }]}>{T.accountNote}</Text>
          <GhostLink label={T.signOut + ' →'} onPress={st.signOut} style={{ paddingHorizontal: 0, marginTop: 6 }} />
        </View>
      ) : (
        <SignInNudge style={{ marginHorizontal: 20, marginTop: 18 }} />
      )}
      {!st.isPro ? (
        <View style={s.pro}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={s.proTitle}>{T.proTitle}</Text>
            <Meta size={9.5} weight="800" spacingEm={0.1} color={colors.accent}>{T.proSoon}</Meta>
          </View>
          <Text style={[s.smallNote, { paddingHorizontal: 0 }]}>{T.proBody(st.premiumCount)}</Text>
        </View>
      ) : null}
      <Meta style={{ paddingHorizontal: 20, paddingTop: 18 }}>{T.language}</Meta>
      <Segmented
        style={{ marginTop: 10, marginHorizontal: 20 }}
        options={[
          { label: 'English', on: st.lang === 'en', onPress: () => st.setLang('en') },
          { label: 'Čeština', on: st.lang === 'cs', onPress: () => st.setLang('cs') },
        ]}
      />
      <Text style={s.smallNote}>{T.langNote}</Text>
      <Meta style={{ paddingHorizontal: 20, paddingTop: 20 }}>{T.normalNight}</Meta>
      <Segmented
        style={{ marginTop: 10, marginHorizontal: 20 }}
        options={T.timeOpts.map((label, i) => ({
          label,
          on: st.maxTime === TIME_VALS[i],
          onPress: () => st.setMaxTime(TIME_VALS[i]),
        }))}
      />
      <Text style={s.smallNote}>{st.maxTime === 999 ? T.timeNoteNoLimit : T.timeNote}</Text>
      <Rule style={{ marginTop: 20, marginHorizontal: 20 }} />
      {switches.map((sw, i) => (
        <View key={i} style={s.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.switchLabel}>{sw.label}</Text>
            <Text style={s.switchSub}>{sw.sub}</Text>
          </View>
          <Toggle on={sw.on} onPress={sw.toggle} />
        </View>
      ))}
      <Meta style={{ paddingHorizontal: 20, paddingTop: 22 }}>{T.sinceMarch}</Meta>
      <View style={s.statsGrid}>
        <View style={[s.statCell, { paddingLeft: 20, paddingRight: 12 }]}>
          <Text style={s.statNum}>{st.stats.yeses}</Text>
          <Meta size={9} spacingEm={0.1} style={{ marginTop: 5, lineHeight: 9 * 1.3 }}>{T.yeses}</Meta>
        </View>
        <View style={[s.statCell, s.statSep, { paddingHorizontal: 12 }]}>
          <Text style={s.statNum}>{st.stats.rerolls}</Text>
          <Meta size={9} spacingEm={0.1} style={{ marginTop: 5, lineHeight: 9 * 1.3 }}>{T.rerolls}</Meta>
        </View>
        <View style={[s.statCell, s.statSep, { paddingLeft: 12, paddingRight: 20 }]}>
          <Text style={[s.statNum, { color: colors.accent }]}>{st.stats.newDishes}</Text>
          <Meta size={9} spacingEm={0.1} style={{ marginTop: 5, lineHeight: 9 * 1.3 }}>{T.newDishes}</Meta>
        </View>
      </View>
      <Text style={s.quip}>{T.statsQuip(st.stats.acceptPct)}</Text>
      <Meta spacingEm={0.12} color={colors.faint40} style={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 28 }}>
        amicooking.com
      </Meta>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  title: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 14,
    fontFamily: fonts.extrabold,
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: 30 * -0.02,
    color: colors.ink,
    includeFontPadding: false,
  },
  strongRule: { height: 2, backgroundColor: colors.ruleStrong },
  account: {
    marginHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.ruleHairline,
  },
  pro: {
    marginHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.ruleHairline,
  },
  proTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 22,
    lineHeight: 22,
    letterSpacing: 22 * -0.02,
    color: colors.accent,
  },
  email: {
    fontFamily: fonts.extrabold,
    fontSize: 19,
    lineHeight: 19 * 1.1,
    letterSpacing: 19 * -0.01,
    color: colors.ink,
    marginTop: 8,
    marginBottom: 6,
  },
  smallNote: {
    paddingTop: 8,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 12 * 1.45,
    color: colors.muted55,
  },
  switchRow: {
    marginHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.ruleHairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  switchLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 14,
    lineHeight: 14 * 1.2,
    color: colors.ink,
    marginBottom: 3,
  },
  switchSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: colors.muted55,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.ruleHairline,
    borderBottomWidth: 1,
    borderBottomColor: colors.ruleHairline,
  },
  statCell: { flex: 1, paddingVertical: 14 },
  statSep: { borderLeftWidth: 1, borderLeftColor: colors.ruleHairline },
  statNum: {
    fontFamily: fonts.extrabold,
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: 26 * -0.02,
    color: colors.ink,
    includeFontPadding: false,
  },
  quip: {
    paddingTop: 14,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 13.5 * 1.5,
    color: colors.muted60,
  },
});
