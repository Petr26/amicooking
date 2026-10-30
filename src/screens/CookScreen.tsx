import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { BlockButton, Entrance, GhostLink, Meta } from '../components/ui';
import { cancelScheduled, scheduleTimerNotification } from '../notifications';
import { fmtHM, mmss } from '../util/clock';

export function CookScreen() {
  const { mode } = useStore();
  useKeepAwake();
  if (mode === 'cookdone') return <CookDoneScreen />;
  return <CookingScreen />;
}

function CookingScreen() {
  const st = useStore();
  const { T, cookDish, cookSteps, cookStep, lang } = st;
  const insets = useSafeAreaInsets();
  const step = cookSteps[Math.min(cookStep, cookSteps.length - 1)];

  const [secsLeft, setSecsLeft] = useState(0);
  const [ticking, setTicking] = useState(false);
  const endAtRef = useRef<number | null>(null);
  const notifIdRef = useRef<string | null>(null);

  const clearNotif = useCallback(() => {
    cancelScheduled(notifIdRef.current);
    notifIdRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    endAtRef.current = null;
    clearNotif();
    setSecsLeft(0);
    setTicking(false);
  }, [clearNotif]);

  // Timer state resets whenever the step changes, and on unmount (stop/finish).
  useEffect(() => resetTimer, [cookStep, resetTimer]);

  // Derive remaining seconds from the wall-clock end time every 500ms —
  // survives re-renders and backgrounding.
  useEffect(() => {
    const id = setInterval(() => {
      if (!endAtRef.current) return;
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      if (!left) {
        endAtRef.current = null;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      setSecsLeft(left);
      setTicking(left > 0);
    }, 500);
    return () => clearInterval(id);
  }, []);

  const startTimer = () => {
    const secs = secsLeft > 0 ? secsLeft : step.m ? step.m * 60 : 0;
    if (!secs) return;
    endAtRef.current = Date.now() + secs * 1000;
    setSecsLeft(secs);
    setTicking(true);
    scheduleTimerNotification(secs, lang).then((id) => {
      notifIdRef.current = id;
    });
  };

  const pauseTimer = () => {
    endAtRef.current = null;
    clearNotif();
    setTicking(false);
  };

  return (
    <View style={[s.fill, { paddingTop: insets.top + 12 }]}>
      <View style={s.headerRow}>
        <Meta size={13} spacingEm={0.09} weight="800" color={colors.ink}>{T.cookingHdr}</Meta>
        <GhostLink
          label={T.stop + ' →'}
          onPress={st.stopCooking}
          style={{ paddingVertical: 4, paddingHorizontal: 4 }}
          textStyle={{ fontSize: 10, lineHeight: 10, letterSpacing: 10 * 0.09 }}
        />
      </View>
      <View style={s.strongRule} />
      <View style={s.posRow}>
        <Meta size={10} spacingEm={0.12} weight="800">
          {T.stepWord + ' ' + Math.min(cookStep + 1, cookSteps.length) + ' ' + T.ofWord + ' ' + cookSteps.length}
        </Meta>
        <Meta size={10} spacingEm={0.09} color={colors.accentDeep}>{st.dishName(cookDish)}</Meta>
      </View>
      <View style={s.pips}>
        {cookSteps.map((_, i) => (
          <View key={i} style={[s.pip, { backgroundColor: i <= cookStep ? colors.accent : colors.ruleHairline }]} />
        ))}
      </View>
      <Entrance animKey={cookStep} axis="x" distance={20} duration={380}>
        <Text style={s.stepText}>{lang === 'cs' ? step.tc : step.t}</Text>
      </Entrance>
      <Text style={s.stepDetail}>{lang === 'cs' ? step.dc : step.d}</Text>
      {step.m ? (
        <View style={s.timerBlock}>
          <View style={{ flex: 1, paddingVertical: 16 }}>
            <Meta size={9} style={{ marginBottom: 6 }}>{T.timerLbl + ' · ' + step.m + ' ' + T.minWord}</Meta>
            <Text style={s.timerClock}>{mmss(secsLeft)}</Text>
          </View>
          {ticking ? (
            <Pressable
              onPress={pauseTimer}
              style={({ pressed }) => [s.timerBtn, s.timerBtnPause, pressed && { backgroundColor: colors.inkWash7 }]}
            >
              <Text style={[s.timerBtnLabel, { color: colors.ink }]}>{T.pause}</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={startTimer}
              style={({ pressed }) => [s.timerBtn, { backgroundColor: pressed ? colors.accentPressed : colors.accent }]}
            >
              <Text style={[s.timerBtnLabel, { color: colors.light }]}>{T.start}</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <Text style={s.noTimerLine}>{T.noTimerLine}</Text>
      )}
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 30), gap: 8 }}>
        <BlockButton label={T.nextStep} onPress={st.cookNext} style={{ paddingVertical: 18 }} />
        <GhostLink label={'← ' + T.backStep} onPress={st.cookBack} />
      </View>
    </View>
  );
}

function CookDoneScreen() {
  const st = useStore();
  const { T, cookDish } = st;
  const insets = useSafeAreaInsets();
  const doneAt = useRef(T.doneAt.split(' · ')[0] + ' · ' + fmtHM()).current;
  return (
    <View style={[s.fill, { backgroundColor: colors.accent, paddingTop: insets.top }]}>
      <Meta size={10} spacingEm={0.14} weight="800" color="rgba(243,242,242,.8)" style={{ paddingHorizontal: 20, paddingTop: 30 }}>
        {doneAt}
      </Meta>
      <Text style={s.eat}>{T.eat}</Text>
      <Text style={s.doneName}>{st.dishName(cookDish)}</Text>
      <View style={s.lightRule} />
      <Text style={s.doneLine}>{T.doneLine(cookDish.time, st.pans(cookDish))}</Text>
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 30), paddingTop: 24, gap: 8 }}>
        <BlockButton label={T.logIt} variant="light" onPress={st.cookLogIt} style={{ paddingVertical: 18 }} />
        <GhostLink label={T.runAgain + ' →'} onPress={st.cookRestart} color={colors.light} opacity={0.85} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ground },
  headerRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  strongRule: { height: 2, backgroundColor: colors.ruleStrong },
  posRow: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  pips: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  pip: { flex: 1, height: 4 },
  stepText: {
    paddingHorizontal: 20,
    fontFamily: fonts.extrabold,
    fontSize: 36,
    lineHeight: 36 * 1.06,
    letterSpacing: 36 * -0.025,
    color: colors.ink,
    includeFontPadding: false,
  },
  stepDetail: {
    paddingTop: 16,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.muted70,
    maxWidth: 360,
  },
  timerBlock: {
    marginTop: 26,
    marginHorizontal: 20,
    borderTopWidth: 2,
    borderTopColor: colors.ruleStrong,
    borderBottomWidth: 2,
    borderBottomColor: colors.ruleStrong,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  timerClock: {
    fontFamily: fonts.extrabold,
    fontSize: 46,
    lineHeight: 46,
    letterSpacing: 46 * -0.03,
    color: colors.ink,
    includeFontPadding: false,
  },
  timerBtn: {
    width: 104,
    justifyContent: 'center',
    paddingLeft: 14,
  },
  timerBtnPause: {
    backgroundColor: 'transparent',
    borderLeftWidth: 1,
    borderLeftColor: colors.ruleHairline,
  },
  timerBtnLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 12 * 0.06,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  noTimerLine: {
    marginTop: 26,
    marginHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.ruleHairline,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 13 * 1.45,
    color: colors.faint,
  },
  eat: {
    paddingTop: 10,
    paddingHorizontal: 20,
    fontFamily: fonts.extrabold,
    fontSize: 88,
    lineHeight: 88,
    letterSpacing: 88 * -0.035,
    color: colors.light,
    includeFontPadding: false,
  },
  doneName: {
    paddingTop: 24,
    paddingHorizontal: 20,
    fontFamily: fonts.extrabold,
    fontSize: 28,
    lineHeight: 28 * 1.03,
    letterSpacing: 28 * -0.02,
    color: colors.light,
  },
  lightRule: {
    marginTop: 26,
    marginHorizontal: 20,
    height: 2,
    backgroundColor: colors.onRedRule,
  },
  doneLine: {
    paddingTop: 16,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 14.5 * 1.5,
    color: colors.light,
    opacity: 0.9,
    maxWidth: 340,
  },
});
