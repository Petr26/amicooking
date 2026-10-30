import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { useStore } from '../state/store';
import { Step } from '../data/dishes';
import { ui } from '../data/strings';
import { BlockButton, GhostLink, Meta, Segmented } from '../components/ui';
import { SignInNudge } from '../components/account';

export function SavedScreen() {
  const st = useStore();
  const { T } = st;
  // null = list, 'new' = add form, otherwise the id of the custom dish being edited
  const [form, setForm] = useState<string | null>(null);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={s.titleRow}>
        <Text style={s.title}>{T.savedTitle}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 14 }}>
          <Meta size={10} spacingEm={0.1}>{T.dishCount(st.saved.length)}</Meta>
          <Pressable
            onPress={() => st.checkRoom() && setForm('new')}
            style={({ pressed }) => [s.addBtn, pressed && { backgroundColor: colors.accentPressed }]}
          >
            <Text style={s.addBtnLabel}>+ {T.addDish}</Text>
          </Pressable>
        </View>
      </View>
      <View style={s.strongRule} />
      {form ? (
        <DishForm key={form} editId={form === 'new' ? null : form} onDone={() => setForm(null)} />
      ) : (
        <SavedList onEdit={setForm} />
      )}
    </ScrollView>
  );
}

function SavedList({ onEdit }: { onEdit: (id: string) => void }) {
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
            {d!.custom ? (
              <GhostLink label={T.edit} onPress={() => onEdit(d!.id)} style={{ paddingVertical: 5, paddingHorizontal: 6 }} textStyle={{ fontSize: 10, lineHeight: 10, letterSpacing: 10 * 0.08 }} />
            ) : null}
            <GhostLink label={T.remove} onPress={() => st.removeSaved(d!.id)} style={{ paddingVertical: 5, paddingHorizontal: 6 }} textStyle={{ fontSize: 10, lineHeight: 10, letterSpacing: 10 * 0.08 }} />
          </View>
        </View>
      ))}
      <SignInNudge style={{ margin: 20 }} />
    </View>
  );
}

type StepDraft = { text: string; mins: string };

function DishForm({ editId, onDone }: { editId: string | null; onDone: () => void }) {
  const st = useStore();
  const { T } = st;
  const editing = editId ? st.allDishes.find((d) => d.id === editId) : undefined;
  const [name, setName] = useState(editing?.name ?? '');
  const [mins, setMins] = useState(editing?.time ?? 20);
  const [pans2, setPans2] = useState(editing?.pans2 ?? false);
  const [note, setNote] = useState(editing && editing.dry !== ui.en.defaultNote ? editing.dry : '');
  const [steps, setSteps] = useState<StepDraft[]>(
    () => editing?.steps?.map((x) => ({ text: x.t, mins: x.m ? String(x.m) : '' })) ?? []
  );

  const setStep = (i: number, patch: Partial<StepDraft>) =>
    setSteps((list) => list.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    // Own steps are written once and shown in both languages.
    const out: Step[] = steps
      .filter((x) => x.text.trim())
      .map((x) => {
        const m = parseInt(x.mins, 10);
        const t = x.text.trim();
        return { t, d: '', tc: t, dc: '', ...(m > 0 ? { m: Math.min(m, 600) } : {}) };
      });
    if (editId) {
      st.editCustomDish(editId, trimmed, mins, pans2, note.trim(), out);
      onDone();
    } else if (st.addCustomDish(trimmed, mins, pans2, note.trim(), out)) onDone();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={s.formTitle}>{editId ? T.formTitleEdit : T.formTitle}</Text>
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
        style={[s.input, { fontFamily: fonts.regular, fontSize: 15 }]}
      />
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <Meta>{T.stepsLbl}</Meta>
        {!st.isPro ? <Meta size={9} weight="800" color={colors.accent}>Pro</Meta> : null}
      </View>
      {st.isPro ? (
        <View style={{ marginBottom: 22 }}>
          {steps.map((x, i) => (
            <View key={i} style={s.stepRow}>
              <Text style={s.stepNum}>{i + 1}</Text>
              <TextInput
                value={x.text}
                onChangeText={(text) => setStep(i, { text })}
                placeholder={T.stepPh}
                placeholderTextColor={colors.faint}
                multiline
                style={[s.input, s.stepInput]}
              />
              <TextInput
                value={x.mins}
                onChangeText={(v) => setStep(i, { mins: v.replace(/[^0-9]/g, '').slice(0, 3) })}
                placeholder={T.minWord}
                placeholderTextColor={colors.faint}
                keyboardType="number-pad"
                style={[s.input, s.stepMins]}
              />
              <GhostLink
                label="×"
                color={colors.faint}
                onPress={() => setSteps((list) => list.filter((_, j) => j !== i))}
                style={{ paddingVertical: 12 }}
                textStyle={{ fontSize: 16, lineHeight: 16 }}
              />
            </View>
          ))}
          <GhostLink label={T.addStep} onPress={() => setSteps((list) => [...list, { text: '', mins: '' }])} style={{ paddingHorizontal: 0 }} />
        </View>
      ) : (
        <Pressable onPress={st.showPro} style={({ pressed }) => [s.locked, pressed && { backgroundColor: colors.inkWash7 }]}>
          <Text style={s.lockedText}>{T.proLocked}</Text>
          <Text style={s.lockedArrow}>→</Text>
        </Pressable>
      )}
      <View style={{ gap: 8 }}>
        <BlockButton label={editId ? T.saveChanges : T.addIt} onPress={save} disabledLook={!name.trim()} />
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
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  stepNum: {
    width: 14,
    paddingTop: 14,
    fontFamily: fonts.extrabold,
    fontSize: 13,
    color: colors.accentDeep,
  },
  stepInput: { flex: 1, width: undefined, fontFamily: fonts.semibold, fontSize: 15, marginBottom: 10 },
  stepMins: { width: 56, fontFamily: fonts.semibold, fontSize: 15, marginBottom: 10, textAlign: 'center' },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.ruleStrong,
    marginBottom: 22,
  },
  lockedText: { flex: 1, fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 13.5 * 1.45, color: colors.muted60 },
  lockedArrow: { fontFamily: fonts.extrabold, fontSize: 13, color: colors.accent },
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
