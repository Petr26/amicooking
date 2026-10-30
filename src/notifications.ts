import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Lang } from './data/strings';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let permissionAsked = false;

// `prompt: false` only checks the current status — used at launch so the
// system dialog appears on a user action, never cold on first open.
export async function ensurePermissions(prompt = true): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  if (!prompt || permissionAsked) return false;
  permissionAsked = true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

export async function setupAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Am I cooking?',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

const timerCopy: Record<Lang, { title: string; body: string }> = {
  en: { title: 'Timer done.', body: 'Back to the pan. It will not wait for you.' },
  cs: { title: 'Odpočet doběhl.', body: 'Zpátky k pánvi. Nepočká na vás.' },
};

export async function scheduleTimerNotification(seconds: number, lang: Lang): Promise<string | null> {
  if (seconds <= 0) return null;
  if (!(await ensurePermissions())) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title: timerCopy[lang].title, body: timerCopy[lang].body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: 'default',
    },
  });
}

export async function cancelScheduled(id: string | null) {
  if (id) await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}

const NUDGE_ID = 'six-pm-nudge';

const nudgeCopy: Record<Lang, { title: string; body: string }> = {
  en: { title: 'Am I cooking tonight?', body: 'Get the verdict while a shop is still open.' },
  cs: { title: 'Vařím dneska?', body: 'Verdikt teď, dokud má obchod otevřeno.' },
};

export async function scheduleDailyNudge(lang: Lang, prompt = true) {
  if (!(await ensurePermissions(prompt))) return;
  await Notifications.cancelScheduledNotificationAsync(NUDGE_ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: NUDGE_ID,
    content: { title: nudgeCopy[lang].title, body: nudgeCopy[lang].body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
      channelId: 'default',
    },
  });
}

export async function cancelDailyNudge() {
  await Notifications.cancelScheduledNotificationAsync(NUDGE_ID).catch(() => {});
}
