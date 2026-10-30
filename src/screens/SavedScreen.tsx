import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { BlockButton, GhostLink, Meta, Segmented } from '../components/ui';
import { SignInNudge } from '../components/account';

export function SavedScreen() {
  const st = useStore();
  const { T } = st;
  const [adding, setAdding] = useState(false);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={s.titleRow}>
        <Text style={s.title}>{T.savedTitle}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 14 }}>
          <Meta size={10} spacingEm={0.1}>{T.dishCount(st.saved.length)}</Meta>
          <Pressable
            onPress={() => st.checkRoom() && setAdding(true)}
            style={({ pressed }) => [s.addBtn, pressed && { backgroundColor: colors.accentPressed }]}
          >
            <Text style={s.addBtnLabel}>+ {T.addDish}</Text>
          </Pressable>
        </View>
      </View>
      <View style={s.strongRule} />
      {adding ? <AddDishForm onDone={() => setAdding(false)} /> : <SavedList />}
    </ScrollView>
  );
}

function SavedList() {
  const st = useStore();
  const { T } = st;
  const rows = st.saved.map((id) => st.allDishes.find((d) => d.id === id)).filter(Boolean);

  if (rows.length === 0) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 34 }}>
        <Text style={s.emptyTitle}>{T.nothingHere}</Text>
        <Text style={s.emptySub}>{T.nothingSub}</Text>
        <BlockButton label={T.getVerdict} onPress={st.goToVerdict} />
        <SignInNudge style={{ marginTop: 28 }} />
      </View>
    );
  }

  return (
    <View>
      {rows.map((d) => (
        <View key={d!.id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowName}>{st.dishName(d!)}</Text>
            <Meta size={9.5} spacingEm={0.1}>{st.meta(d!)}</Meta>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Pressable
              onPress={() => st.cookFromSaved(d!.id)}
              style={({ pressed }) => [s.cookBtn, pressed && { backgroundColor: colors.accentPressed }]}
            >
              <Text style={s.cookBtnLabel}>{T.cookTonight}</Text>
            </Pressable>
            <GhostLink label={T.remove} onPress={() => st.removeSaved(d!.id)} style={{ paddingVertical: 5, paddingHorizontal: 6 }} textStyle={{ fontSize: 10, lineHeight: 10, letterSpacing: 10 * 0.08 }} />
          </View>
        </View>
      ))}
      <SignInNudge style={{ margin: 20 }} />
    </View>
  );
}

function AddDishForm({ onDone }: { onDone: () => void }) {
  const st = useStore();
  const { T } = st;
  const [name, setName] = useState('');
  const [mins, setMins] = useState(20);
  const [pans2, setPans2] = useState(false);
  const [note, setNote] = useState('');

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (st.addCustomDish(trimmed, mins, pans2, note.trim())) onDone();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={s.formTitle}>{T.formTitle}</Text>
      <Text style={s.formSub}>{T.formSub}</Text>
      <Meta style={{ marginBottom: 8 }}>{T.nameLbl}</Meta>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={T.namePh}
        placeholderTextColor={colors.faint}
        style={[s.input, { fontFamily: fonts.semibold, fontSize: 16 }]}
      />
      <Meta style={{ marginBottom: 8 }}>{T.minutesLbl}</Meta>
      <Segmented
        style={{ marginBottom: 18 }}
        options={[15, 20, 30, 45].map((v) => ({
          label: v + ' ' + T.minWord,
          on: mins === v,
          onPress: () => setMins(v),
        }))}
      />
      <Meta style={{ marginBottom: 8 }}>{T.washingLbl}</Meta>
      <Segmented
        style={{ marginBottom: 18 }}
        options={[
          { label: T.pan1, on: !pans2, onPress: () => setPans2(false) },
          { label: T.pan2, on: pans2, onPress: () => setPans2(true) },
        ]}
      />
      <Meta style={{ marginBottom: 8 }}>{T.noteLbl}</Meta>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder={T.notePh}
        placeholderTextColor={colors.faint}
        style={[s.input, { fontFamily: fonts.regular, fontSize: 15, marginBottom: 22 }]}
      />
      <View style={{ gap: 8 }}>
        <BlockButton label={T.addIt} onPress={save} disabledLook={!name.trim()} />
        <GhostLink label={T.neverMind} onPress={onDone} />
      </View>
    </View>
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
  addBtn: { paddingVertical: 6, paddingHorizontal: 8, backgroundColor: colors.accent },
  addBtnLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 10 * 0.08,
    textTransform: 'uppercase',
    color: colors.light,
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
  rowName: {
    fontFamily: fonts.extrabold,
    fontSize: 19,
    lineHeight: 19 * 1.1,
    letterSpacing: 19 * -0.01,
    color: colors.ink,
    marginBottom: 5,
  },
  cookBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: colors.accent },
  cookBtnLabel: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 10 * 0.08,
    textTransform: 'uppercase',
    color: colors.light,
  },
  emptyTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 28,
    lineHeight: 28 * 1.05,
    letterSpacing: 28 * -0.02,
    color: colors.ink,
    marginBottom: 10,
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 14.5 * 1.5,
    color: colors.muted60,
    marginBottom: 20,
    maxWidth: 280,
  },
  formTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 28,
    lineHeight: 28 * 1.02,
    letterSpacing: 28 * -0.02,
    color: colors.ink,
    marginBottom: 6,
  },
  formSub: {
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
});
