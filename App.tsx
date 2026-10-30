import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import { colors, fonts } from './src/theme/tokens';
import { StoreProvider, useStore } from './src/state/store';
import { TabBar } from './src/components/TabBar';
import { TonightScreen } from './src/screens/TonightScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { LogScreen } from './src/screens/LogScreen';
import { YouScreen } from './src/screens/YouScreen';
import { CookScreen } from './src/screens/CookScreen';
import { setupAndroidChannel } from './src/notifications';
import { headerMeta } from './src/util/clock';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
  });

  useEffect(() => {
    setupAndroidChannel();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.ground }} />;
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const st = useStore();
  const insets = useSafeAreaInsets();
  const inKitchen = st.mode === 'cooking' || st.mode === 'cookdone';
  const [now, setNow] = useState(() => Date.now());

  // Header meta ("Solo · Tue 19:04") follows the real clock.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  // The 6pm nudge opens straight onto the verdict screen.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      if (resp.notification.request.identifier === 'six-pm-nudge') st.goToVerdict();
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!st.hydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.ground }} />;
  }

  if (inKitchen) {
    return (
      <View style={{ flex: 1, backgroundColor: st.mode === 'cookdone' ? colors.accent : colors.ground }}>
        <StatusBar style={st.mode === 'cookdone' ? 'light' : 'dark'} />
        <CookScreen />
      </View>
    );
  }

  return (
    <View style={[s.app, { paddingTop: insets.top + 12 }]}>
      <StatusBar style="dark" />
      <View style={s.headerRow}>
        <Text style={s.appTitle}>{st.T.appTitle}</Text>
        <Text style={s.headerMeta}>{headerMeta(st.lang, now)}</Text>
      </View>
      <View style={s.strongRule} />
      <View style={{ flex: 1 }}>
        {st.tab === 'tonight' && <TonightScreen />}
        {st.tab === 'saved' && <SavedScreen />}
        {st.tab === 'log' && <LogScreen />}
        {st.tab === 'you' && <YouScreen />}
      </View>
      <TabBar />
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.ground },
  headerRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 13,
    lineHeight: 13,
    letterSpacing: 13 * 0.09,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  headerMeta: {
    fontFamily: fonts.semibold,
    fontSize: 9.5,
    lineHeight: 9.5,
    letterSpacing: 9.5 * 0.1,
    textTransform: 'uppercase',
    color: colors.muted55,
  },
  strongRule: { height: 2, backgroundColor: colors.ruleStrong },
});
