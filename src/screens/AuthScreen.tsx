import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { AuthError } from '../api/pb';
import { BlockButton, GhostLink, Meta } from '../components/ui';

// Replaces the tab UI (like cook mode) while signing in or creating an account.
export function AuthScreen() {
  const st = useStore();
  const { T } = st;
  const insets = useSafeAreaInsets();
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<AuthError | null>(null);

  const ready = /\S+@\S+\.\S+/.test(email.trim()) && password.length >= 8;

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setErr(null);
    const e = await (creating ? st.signUp : st.signIn)(email.trim().toLowerCase(), password);
    setBusy(false);
    if (e) setErr(e);
  };

  return (
    <KeyboardAvoidingView style={[s.fill, { paddingTop: insets.top + 12 }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.headerRow}>
        <Meta size={13} spacingEm={0.09} weight="800" color={colors.ink}>{T.account}</Meta>
        <GhostLink
          label={T.notNow + ' →'}
          onPress={st.closeAuth}
          style={{ paddingVertical: 4, paddingHorizontal: 4 }}
          textStyle={{ fontSize: 10, lineHeight: 10, letterSpacing: 10 * 0.09 }}
        />
      </View>
      <View style={s.strongRule} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>{creating ? T.authTitleUp : T.authTitleIn}</Text>
        <Text style={s.sub}>{T.authSub}</Text>
        <Meta style={{ marginBottom: 8 }}>{T.emailLbl}</Meta>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={T.emailPh}
          placeholderTextColor={colors.faint}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          style={[s.input, { fontFamily: fonts.semibold, fontSize: 16 }]}
        />
        <Meta style={{ marginBottom: 8 }}>{T.passwordLbl}</Meta>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={T.passwordPh}
          placeholderTextColor={colors.faint}
          secureTextEntry
          textContentType={creating ? 'newPassword' : 'password'}
          autoComplete={creating ? 'new-password' : 'current-password'}
          onSubmitEditing={submit}
          style={[s.input, { fontFamily: fonts.semibold, fontSize: 16 }]}
        />
        {err ? <Text style={s.err}>{T.authErr[err]}</Text> : null}
        <View style={{ gap: 8, marginTop: 4 }}>
          {busy ? (
            <View style={s.busy}>
              <ActivityIndicator color={colors.light} />
            </View>
          ) : (
            <BlockButton label={creating ? T.authSubmitUp : T.authSubmitIn} onPress={submit} disabledLook={!ready} />
          )}
          <GhostLink
            label={creating ? T.authToIn : T.authToUp}
            onPress={() => {
              setCreating((c) => !c);
              setErr(null);
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 28,
    lineHeight: 28 * 1.02,
    letterSpacing: 28 * -0.02,
    color: colors.ink,
    marginBottom: 6,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 13 * 1.45,
    color: colors.muted55,
    marginBottom: 18,
  },
  input: {
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.ruleStrong,
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: colors.ink,
    marginBottom: 18,
  },
  err: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 13 * 1.45,
    color: colors.accentDeep,
    marginBottom: 14,
  },
  busy: { padding: 14, backgroundColor: colors.accent, alignItems: 'flex-start' },
});
