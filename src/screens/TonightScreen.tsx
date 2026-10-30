import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { BlockButton, Entrance, GhostLink, Meta, OutlineButton, Rule } from '../components/ui';
import { PhotoSlot } from '../components/PhotoSlot';
import { fmtHM } from '../util/clock';

export function TonightScreen() {
  const { mode } = useStore();
  if (mode === 'committed') return <CommittedScreen />;
  if (mode === 'optout') return <OptOutScreen />;
  return <VerdictScreen />;
}

function VerdictScreen() {
  const st = useStore();
  const { T, dish, rolls } = st;
  const jab = T.jabs[Math.min(rolls, T.jabs.length - 1)];
  const rollLabel = rolls ? T.answerN + ' ' + (rolls + 1) : T.firstAnswer;
  const isSaved = st.saved.includes(dish.id);

  return (
    <ScrollView style={s.fill} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={s.kickerRow}>
        <Meta size={10} spacingEm={0.12} weight="800">{T.tonightLabel}</Meta>
        <Meta size={10} spacingEm={0.1} color={colors.accentDeep}>{rollLabel}</Meta>
      </View>
      <Entrance animKey={rolls} duration={460}>
        <Text style={s.yes}>{T.yesWord}</Text>
      </Entrance>
      <Text style={s.jab}>{jab}</Text>
      <Entrance animKey={rolls} duration={520} delay={70}>
        <Text style={s.dishName}>{st.dishName(dish)}</Text>
      </Entrance>
      <PhotoSlot />
      <View style={s.statGrid}>
        <View style={[s.statCell, { paddingLeft: 20, paddingRight: 14 }]}>
          <Meta size={9} style={{ marginBottom: 5 }}>{T.timeLbl}</Meta>
          <Text style={s.statVal}>{dish.time + ' ' + T.minWord}</Text>
        </View>
        <View style={[s.statCell, s.statCellSep, { paddingHorizontal: 14 }]}>
          <Meta size={9} style={{ marginBottom: 5 }}>{T.washingLbl}</Meta>
          <Text style={s.statVal}>{st.pans(dish)}</Text>
        </View>
        <View style={[s.statCell, s.statCellSep, { paddingLeft: 14, paddingRight: 20 }]}>
          <Meta size={9} style={{ marginBottom: 5 }}>{T.statusLbl}</Meta>
          <Text style={s.statVal}>{st.status(dish)}</Text>
        </View>
      </View>
      <Rule style={{ marginHorizontal: 20 }} />
      <Text style={s.note}>{st.dishNote(dish)}</Text>
      <Meta size={10} spacingEm={0.1} color={colors.accentDeep} style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        {st.dishMissing(dish)}
      </Meta>
      <View style={s.buttons}>
        <BlockButton label={T.cookThis} onPress={st.commit} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <OutlineButton label={T.askAgain} onPress={st.reroll} />
          <OutlineButton
            label={isSaved ? T.savedTick + ' ✓' : T.saveLater}
            filled={isSaved}
            onPress={st.toggleSave}
          />
        </View>
        <GhostLink label={T.orderIn + ' →'} onPress={st.orderIn} style={{ marginTop: 2, marginBottom: 22, marginLeft: -4 }} />
      </View>
      <Text style={s.footNote}>{T.footNote}</Text>
    </ScrollView>
  );
}

function CommittedScreen() {
  const st = useStore();
  const { T, cookDish } = st;
  const committedAt = useRef(fmtHM()).current;
  const cMeta = cookDish.time + ' ' + T.minWord + ' · ' + st.pans(cookDish) + ' · ' + st.dishMissing(cookDish);
  return (
    <View style={[s.fill, { backgroundColor: colors.accent }]}>
      <Meta size={10} spacingEm={0.14} weight="800" color="rgba(243,242,242,.8)" style={{ paddingHorizontal: 20, paddingTop: 26 }}>
        {T.confirmed + ' ' + committedAt}
      </Meta>
      <Text style={s.bigDisplay}>{T.youreCooking}</Text>
      <Text style={s.cName}>{st.dishName(cookDish)}</Text>
      <Text style={s.cMeta}>{cMeta}</Text>
      <View style={s.lightRule} />
      <Text style={s.commitLine}>{T.commitLine}</Text>
      <View style={{ flex: 1 }} />
      <View style={s.bottomStack}>
        <BlockButton label={T.showSteps} variant="light" onPress={st.startCooking} />
        <GhostLink label={T.lied + ' →'} onPress={st.uncommit} color={colors.light} opacity={0.85} />
      </View>
    </View>
  );
}

function OptOutScreen() {
  const st = useStore();
  const { T, dish } = st;
  return (
    <View style={[s.fill, { backgroundColor: colors.darkSurface }]}>
      <Meta size={10} spacingEm={0.14} weight="800" color="rgba(243,242,242,.7)" style={{ paddingHorizontal: 20, paddingTop: 26 }}>
        {T.tonightLabel + ' · ' + fmtHM()}
      </Meta>
      <Text style={s.bigDisplay}>{T.noHead}</Text>
      <View style={[s.lightRule, { backgroundColor: colors.onDarkRule }]} />
      <Text style={[s.commitLine, { opacity: 0.85 }]}>{T.optOutLine}</Text>
      <Meta size={9.5} spacingEm={0.11} color="rgba(243,242,242,.6)" style={{ paddingHorizontal: 20, paddingTop: 18 }}>
        {T.savedForAnother}
      </Meta>
      <Text style={s.savedName}>{st.dishName(dish)}</Text>
      <View style={{ flex: 1 }} />
      <View style={s.bottomStack}>
        <BlockButton label={T.fineAsk} variant="light" onPress={st.backToVerdict} />
        <GhostLink label={T.seeSaved + ' →'} onPress={() => st.setTab('saved')} color={colors.light} opacity={0.8} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  kickerRow: {
    paddingTop: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  yes: {
    paddingTop: 6,
    paddingHorizontal: 20,
    fontFamily: fonts.extrabold,
    fontSize: 68,
    lineHeight: 68,
    letterSpacing: 68 * -0.03,
    color: colors.accent,
    includeFontPadding: false,
  },
  jab: {
    paddingTop: 8,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    color: colors.muted60,
    minHeight: 18 + 8,
  },
  dishName: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontFamily: fonts.extrabold,
    fontSize: 31,
    lineHeight: 31 * 1.02,
    letterSpacing: 31 * -0.02,
    color: colors.ink,
    includeFontPadding: false,
  },
  statGrid: { flexDirection: 'row' },
  statCell: { flex: 1, paddingTop: 12, paddingBottom: 14 },
  statCellSep: { borderLeftWidth: 1, borderLeftColor: colors.ruleHairline },
  statVal: {
    fontFamily: fonts.extrabold,
    fontSize: 17,
    lineHeight: 17,
    color: colors.ink,
  },
  note: {
    paddingTop: 14,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 14.5 * 1.5,
    color: colors.ink,
  },
  buttons: { paddingTop: 20, paddingHorizontal: 20, gap: 8 },
  footNote: {
    paddingHorizontal: 20,
    paddingBottom: 26,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 12 * 1.45,
    color: colors.muted55,
  },
  bigDisplay: {
    paddingTop: 10,
    paddingHorizontal: 20,
    fontFamily: fonts.extrabold,
    fontSize: 74,
    lineHeight: 74 * 0.92,
    letterSpacing: 74 * -0.03,
    color: colors.light,
    includeFontPadding: false,
  },
  cName: {
    paddingTop: 20,
    paddingHorizontal: 20,
    fontFamily: fonts.extrabold,
    fontSize: 27,
    lineHeight: 27 * 1.05,
    letterSpacing: 27 * -0.02,
    color: colors.light,
  },
  cMeta: {
    paddingTop: 10,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: colors.light,
    opacity: 0.85,
  },
  lightRule: {
    marginTop: 24,
    marginHorizontal: 20,
    height: 2,
    backgroundColor: colors.onRedRule,
  },
  commitLine: {
    paddingTop: 16,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 14.5 * 1.5,
    color: colors.light,
    opacity: 0.9,
  },
  savedName: {
    paddingTop: 8,
    paddingHorizontal: 20,
    fontFamily: fonts.extrabold,
    fontSize: 20,
    lineHeight: 20 * 1.15,
    letterSpacing: 20 * -0.01,
    color: colors.light,
  },
  bottomStack: { paddingTop: 24, paddingHorizontal: 20, paddingBottom: 30, gap: 8 },
});
