import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { BlockButton, GhostLink, Meta } from './ui';

// Reminder for signed-out users: their dishes live only on this phone.
export function SignInNudge({ style }: { style?: object }) {
  const st = useStore();
  const { T } = st;
  if (st.user) return null;
  return (
    <View style={[s.nudge, style]}>
      <Meta size={10} weight="800" spacingEm={0.1} color={colors.accentDeep}>{T.nudgeTitle}</Meta>
      <Text style={s.nudgeBody}>{T.nudgeBody(st.myDishCount, st.dishLimit, st.limits.free)}</Text>
      <GhostLink label={T.signIn + ' →'} onPress={st.openAuth} style={{ paddingHorizontal: 0, marginTop: 4 }} />
    </View>
  );
}

// Dark sheet for "limit reached" and "some dishes did not fit the account".
export function NoticeSheet() {
  const st = useStore();
  const { T, notice } = st;
  const insets = useSafeAreaInsets();
  if (!notice) return null;

  let title = T.limitTitle;
  let body = '';
  let cta: { label: string; onPress: () => void } | null = null;
  if (notice.kind === 'overflow') {
    title = T.overflowTitle;
    body = T.overflowBody(notice.n);
  } else if (notice.kind === 'pro') {
    title = T.proTitle;
    body = T.proBody(st.premiumCount);
    if (!st.user) cta = { label: T.signIn, onPress: st.openAuth };
  } else if (!st.user) {
    body = T.limitAnon(st.dishLimit, st.limits.free);
    cta = { label: T.signIn, onPress: st.openAuth };
  } else {
    body = st.plan === 'pro' ? T.limitPro(st.dishLimit) : T.limitFree(st.dishLimit);
  }

  return (
    <Modal transparent animationType="fade" onRequestClose={st.dismissNotice}>
      <Pressable style={s.backdrop} onPress={st.dismissNotice}>
        <Pressable style={[s.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <Text style={s.title}>{title}</Text>
          <View style={s.rule} />
          <Text style={s.body}>{body}</Text>
          <View style={{ gap: 8 }}>
            {cta ? <BlockButton label={cta.label} onPress={cta.onPress} variant="light" /> : null}
            <GhostLink label={(cta ? T.notNow : T.okWord) + ' →'} onPress={st.dismissNotice} color={colors.light} opacity={0.75} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  nudge: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.ruleStrong,
  },
  nudgeBody: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 13.5 * 1.45,
    color: colors.muted70,
  },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(32,30,29,.35)' },
  sheet: { backgroundColor: colors.darkSurface, padding: 20, paddingTop: 24 },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 44,
    lineHeight: 44 * 0.95,
    letterSpacing: 44 * -0.03,
    color: colors.light,
  },
  rule: { height: 2, backgroundColor: colors.onDarkRule, marginVertical: 16 },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 15 * 1.5,
    color: colors.light,
    opacity: 0.85,
    marginBottom: 20,
  },
});
