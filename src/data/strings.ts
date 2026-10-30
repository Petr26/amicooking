export type Lang = 'en' | 'cs';

export type UIStrings = {
  appTitle: string; headerMeta: string; tonightLabel: string; yesWord: string;
  timeLbl: string; washingLbl: string; statusLbl: string;
  cookThis: string; askAgain: string; savedTick: string; saveLater: string;
  orderIn: string; footNote: string;
  confirmed: string; youreCooking: string; commitLine: string;
  showSteps: string; lied: string;
  noHead: string; optOutLine: string;
  savedForAnother: string; fineAsk: string; seeSaved: string;
  cookingHdr: string; stop: string; timerLbl: string; start: string; pause: string;
  noTimerLine: string; nextStep: string; backStep: string;
  doneAt: string; eat: string; logIt: string; runAgain: string;
  savedTitle: string; cookTonight: string; remove: string;
  nothingHere: string; nothingSub: string; getVerdict: string;
  logTitle: string; logQuip: string; logFooter: string; badgeCooked: string;
  youTitle: string; language: string; langNote: string;
  normalNight: string;
  sinceMarch: string; yeses: string; rerolls: string; newDishes: string;
  statsQuip: (pct: number) => string;
  pan1: string; pan2: string; stRotation: string; stNew: string; minWord: string;
  firstAnswer: string; answerN: string; stepWord: string; ofWord: string;
  timeNote: string; timeNoteNoLimit: string;
  tabs: string[];
  timeOpts: string[];
  sw1: string; sw1s: string; sw2: string; sw2s: string; sw3: string; sw3s: string;
  doneLine: (t: number, p: string) => string;
  dishCount: (n: number) => string;
  cookedOf: (a: number, b: number) => string;
  loggedNote: string; tonightWhen: string;
  addDish: string; formTitle: string; formSub: string;
  nameLbl: string; namePh: string; minutesLbl: string;
  noteLbl: string; notePh: string;
  addIt: string; neverMind: string;
  defaultNote: string;
  customStepT: string; customStepD: string;
  badgeOrdered: string; nothingWord: string;
  jabs: string[];
  // Account
  account: string; signIn: string; signOut: string; notNow: string; okWord: string;
  nudgeTitle: string; nudgeBody: (n: number, max: number, next: number) => string;
  authTitleIn: string; authTitleUp: string; authSub: string;
  emailLbl: string; emailPh: string; passwordLbl: string; passwordPh: string;
  authSubmitIn: string; authSubmitUp: string; authToUp: string; authToIn: string;
  authErr: Record<'bad' | 'net' | 'taken' | 'short' | 'email', string>;
  planFree: string; planPro: string; dishUsage: (n: number, max: number) => string;
  limitTitle: string; limitAnon: (max: number, next: number) => string;
  limitFree: (max: number) => string; limitPro: (max: number) => string;
  overflowTitle: string; overflowBody: (n: number) => string;
  accountNote: string;
  // Pro
  proTitle: string; proBody: (premium: number) => string; proSoon: string;
  stepsLbl: string; stepPh: string; addStep: string; proLocked: string;
  edit: string; saveChanges: string; formTitleEdit: string;
};

export const ui: Record<Lang, UIStrings> = {
  en: {
    appTitle: 'Am I cooking?', headerMeta: 'Solo · Tue 19:04', tonightLabel: 'Tonight', yesWord: 'Yes.',
    timeLbl: 'Time', washingLbl: 'Washing up', statusLbl: 'Status',
    cookThis: "I'm cooking this", askAgain: 'Ask again', savedTick: 'Saved', saveLater: 'Save for later',
    orderIn: "No. I'm ordering in", footNote: 'Answers are final for about nine seconds.',
    confirmed: 'Confirmed', youreCooking: "You're cooking.", commitLine: 'Timer set. The app will now stop talking to you, which is the whole feature.',
    showSteps: 'Show me the steps', lied: 'I lied. Ask me again',
    noHead: 'No. Not cooking.', optOutLine: 'Noted. Nothing in the fridge gets any older by tomorrow — except the eggs, which do.',
    savedForAnother: 'Saved for another night', fineAsk: 'Fine. Ask me again', seeSaved: "See what I've saved",
    cookingHdr: 'Cooking', stop: 'Stop', timerLbl: 'Timer', start: 'Start', pause: 'Pause',
    noTimerLine: 'No timer on this one. Use your eyes.', nextStep: 'Done — next step', backStep: 'Back a step',
    doneAt: 'Done · 19:41', eat: 'Eat.', logIt: 'Log it', runAgain: 'Run the steps again',
    savedTitle: 'Saved', cookTonight: 'Cook tonight', remove: 'Remove',
    nothingHere: 'Nothing here.', nothingSub: 'You have said yes to nothing so far. Ambitious.', getVerdict: 'Get a verdict',
    logTitle: 'Log', logQuip: 'Four of the last six nights. The two gaps were both Saturdays, which tracks.',
    logFooter: 'Kept for you, not for anyone else. No streak badges, no confetti.', badgeCooked: 'Cooked',
    youTitle: 'You', language: 'Language', langNote: 'The sarcasm survives translation. We checked.',
    normalNight: 'On a normal night I have',
    sinceMarch: 'So far', yeses: 'Yeses', rerolls: 'Rerolls', newDishes: 'New dishes',
    statsQuip: (pct) => pct ? 'You accept ' + pct + '% of verdicts. That is a rate, not a personality. Probably.' : 'No verdicts accepted yet. The statistics are withholding judgement.',
    pan1: '1 pan', pan2: '2 pans', stRotation: 'In rotation', stNew: 'New to you', minWord: 'min',
    firstAnswer: 'First answer', answerN: 'Answer', stepWord: 'Step', ofWord: 'of',
    timeNote: 'Nothing longer than this gets suggested on a weeknight.', timeNoteNoLimit: 'Noted. We will hold you to it.',
    tabs: ['Tonight', 'Saved', 'Log', 'You'],
    timeOpts: ['15 min', '30 min', 'An hour', 'No limit'],
    sw1: 'Break my rotation', sw1s: 'Prefer things you have never made',
    sw2: 'Never suggest fish', sw2s: 'It will stop. It will sulk.',
    sw3: 'Ask before 6pm', sw3s: 'A nudge while a shop is still open',
    doneLine: (t, p) => t + ' minutes, ' + p + ', no delivery fee. We will remind you of this next Tuesday.',
    dishCount: (n) => n + ' dish' + (n === 1 ? '' : 'es'),
    cookedOf: (a, b) => 'Cooked ' + a + ' of ' + b,
    loggedNote: 'Logged from cook mode. No notes.', tonightWhen: 'Tonight',
    addDish: 'Add', formTitle: 'Your dish.', formSub: 'Name it, be honest about the time, done.',
    nameLbl: 'Name', namePh: 'e.g. That Tuesday curry', minutesLbl: 'Minutes',
    noteLbl: 'One honest line', notePh: 'Optional. The app will supply sarcasm if not.',
    addIt: 'Add it', neverMind: 'Never mind',
    defaultNote: 'Added by you. The app withholds judgment.',
    customStepT: 'You added this one. You know the steps.', customStepD: 'Cook it the way you meant to when you added it.',
    badgeOrdered: 'Ordered in', nothingWord: 'Nothing',
    jabs: ['', 'Fine. Second opinion:', 'Third answer. You are getting picky.', 'Four rerolls. Cooking would have been faster.', 'This is a decision app, not a slot machine. Mostly.', 'Six. We are going in circles and the shops are closing.', 'Seven answers in. The problem may not be the answers.', 'Keep going. The eggs are following this closely.', 'At this point I am simply naming food at you.'],
    account: 'Account', signIn: 'Sign in', signOut: 'Sign out', notNow: 'Not now', okWord: 'Fine',
    nudgeTitle: 'Only on this phone.',
    nudgeBody: (n, max, next) => n + ' of ' + max + ' dishes, kept on this phone and nowhere else. Sign in and they survive a new phone. You also get room for ' + next + '.',
    authTitleIn: 'Sign in.', authTitleUp: 'New account.',
    authSub: 'Your dishes, log and settings, kept somewhere sturdier than one phone.',
    emailLbl: 'E-mail', emailPh: 'you@example.com', passwordLbl: 'Password', passwordPh: 'At least 8 characters',
    authSubmitIn: 'Sign in', authSubmitUp: 'Create account',
    authToUp: 'No account yet? Create one', authToIn: 'Already have one? Sign in',
    authErr: {
      bad: 'That e-mail and password do not match. One of them is wrong.',
      net: 'Could not reach the server. Try again in a moment.',
      taken: 'That e-mail already has an account. Sign in instead.',
      short: 'The password needs at least 8 characters.',
      email: 'That is not an e-mail address.',
    },
    planFree: 'Free', planPro: 'Subscriber',
    dishUsage: (n, max) => n + ' of ' + max + ' dishes',
    limitTitle: 'Full.',
    limitAnon: (max, next) => max + ' dishes is the limit on this phone. Sign in and it becomes ' + next + '.',
    limitFree: (max) => max + ' dishes is the free limit. A subscription for more is on its way. Until then, remove one you never cook.',
    limitPro: (max) => max + ' dishes. That is the ceiling. Some of these you have never cooked.',
    overflowTitle: 'Some did not fit.',
    overflowBody: (n) => n + (n === 1 ? ' dish' : ' dishes') + ' from this phone did not fit into the account limit and were left off.',
    accountNote: 'Saved dishes, your own dishes, the log and these settings follow the account.',
    proTitle: 'Pro.',
    proBody: (n) => 'No dish limit, your own steps with timers' + (n ? ', and ' + n + (n === 1 ? ' dish' : ' dishes') + ' only Pro gets' : '') + '. Not on sale yet. Soon.',
    proSoon: 'Coming soon',
    stepsLbl: 'Steps', stepPh: 'e.g. Fry the onion until it gives up', addStep: '+ Step',
    proLocked: 'Your own steps with timers come with Pro.',
    edit: 'Edit', saveChanges: 'Save it', formTitleEdit: 'Your dish, revised.',
  },
  cs: {
    appTitle: 'Vařím dneska?', headerMeta: 'Sólo · út 19:04', tonightLabel: 'Dnes večer', yesWord: 'Jo.',
    timeLbl: 'Čas', washingLbl: 'Nádobí', statusLbl: 'Stav',
    cookThis: 'Tohle uvařím', askAgain: 'Zeptat se znovu', savedTick: 'Uloženo', saveLater: 'Uložit na jindy',
    orderIn: 'Ne. Objednám si', footNote: 'Odpovědi jsou konečné asi tak devět vteřin.',
    confirmed: 'Potvrzeno', youreCooking: 'Vaříte.', commitLine: 'Odpočet běží. Aplikace s vámi teď přestane mluvit, což je celá pointa.',
    showSteps: 'Ukažte mi postup', lied: 'Lhal jsem. Zeptejte se znovu',
    noHead: 'Ne. Nevaří se.', optOutLine: 'Zaznamenáno. Nic v lednici do zítřka nezestárne — kromě vajec, ta ano.',
    savedForAnother: 'Uloženo na jiný večer', fineAsk: 'Dobře. Zeptejte se znovu', seeSaved: 'Co mám uloženo',
    cookingHdr: 'Vaří se', stop: 'Stop', timerLbl: 'Odpočet', start: 'Start', pause: 'Pauza',
    noTimerLine: 'Tenhle krok odpočet nemá. Použijte oči.', nextStep: 'Hotovo — další krok', backStep: 'Krok zpět',
    doneAt: 'Hotovo · 19:41', eat: 'Jezte.', logIt: 'Zapsat', runAgain: 'Projet kroky znovu',
    savedTitle: 'Uloženo', cookTonight: 'Uvařit dnes', remove: 'Odebrat',
    nothingHere: 'Nic tu není.', nothingSub: 'Zatím jste neřekli ano ničemu. Ambiciózní.', getVerdict: 'Chci verdikt',
    logTitle: 'Záznam', logQuip: 'Čtyři z posledních šesti večerů. Obě mezery byly soboty, což sedí.',
    logFooter: 'Vedeno pro vás, ne pro nikoho jiného. Žádné odznaky, žádné konfety.', badgeCooked: 'Uvařeno',
    youTitle: 'Vy', language: 'Jazyk', langNote: 'Sarkasmus překlad přežil. Ověřovali jsme to.',
    normalNight: 'Běžný večer mám',
    sinceMarch: 'Zatím', yeses: 'Ano', rerolls: 'Opakování', newDishes: 'Nová jídla',
    statsQuip: (pct) => pct ? 'Přijímáte ' + pct + ' % verdiktů. To je statistika, ne povaha. Nejspíš.' : 'Zatím žádný přijatý verdikt. Statistika se zdržuje komentáře.',
    pan1: '1 pánev', pan2: '2 pánve', stRotation: 'V rotaci', stNew: 'Nové pro vás', minWord: 'min',
    firstAnswer: 'První odpověď', answerN: 'Odpověď', stepWord: 'Krok', ofWord: 'z',
    timeNote: 'Nic delšího vám ve všední den nenavrhneme.', timeNoteNoLimit: 'Zaznamenáno. Vezmeme vás za slovo.',
    tabs: ['Dnes', 'Uloženo', 'Záznam', 'Vy'],
    timeOpts: ['15 min', '30 min', 'Hodinu', 'Bez limitu'],
    sw1: 'Narušit mou rotaci', sw1s: 'Přednost věcem, které jste nikdy nevařili',
    sw2: 'Nikdy nenavrhovat ryby', sw2s: 'Přestane to. Bude to trucovat.',
    sw3: 'Zeptat se před 18:00', sw3s: 'Pošťouchnutí, dokud má obchod otevřeno',
    doneLine: (t, p) => t + ' minut, ' + p + ', žádné poplatky za dovoz. Příští úterý vám to připomeneme.',
    dishCount: (n) => n + ' ' + (n === 1 ? 'jídlo' : (n >= 2 && n <= 4 ? 'jídla' : 'jídel')),
    cookedOf: (a, b) => 'Uvařeno ' + a + ' z ' + b,
    loggedNote: 'Zapsáno z režimu vaření. Bez poznámek.', tonightWhen: 'Dnes',
    addDish: 'Přidat', formTitle: 'Vaše jídlo.', formSub: 'Pojmenujte ho, buďte upřímní ohledně času, hotovo.',
    nameLbl: 'Název', namePh: 'např. To úterní kari', minutesLbl: 'Minut',
    noteLbl: 'Jedna upřímná věta', notePh: 'Nepovinné. Sarkasmus jinak dodá aplikace.',
    addIt: 'Přidat', neverMind: 'Nechte být',
    defaultNote: 'Přidáno vámi. Aplikace se zdrží komentáře.',
    customStepT: 'Tohle jste přidali vy. Postup znáte.', customStepD: 'Uvařte to tak, jak jste to při přidávání mysleli.',
    badgeOrdered: 'Objednáno', nothingWord: 'Nic',
    jabs: ['', 'Dobře. Druhý názor:', 'Třetí odpověď. Začínáte být vybíraví.', 'Čtyři přehození. Vařit by bylo rychlejší.', 'Tohle je rozhodovací aplikace, ne hrací automat. Většinou.', 'Šest. Točíme se v kruhu a obchody zavírají.', 'Sedmá odpověď. Problém možná nebude v odpovědích.', 'Pokračujte. Vejce to sledují se zájmem.', 'V tuhle chvíli už na vás prostě jen vykřikuji jídla.'],
    account: 'Účet', signIn: 'Přihlásit se', signOut: 'Odhlásit se', notNow: 'Teď ne', okWord: 'Dobře',
    nudgeTitle: 'Jen v tomhle telefonu.',
    nudgeBody: (n, max, next) => n + ' z ' + max + ' jídel, uložených v tomhle telefonu a nikde jinde. Přihlaste se a přežijí i nový telefon. A vejde se vám jich ' + next + '.',
    authTitleIn: 'Přihlášení.', authTitleUp: 'Nový účet.',
    authSub: 'Vaše jídla, záznam a nastavení, uložené někde pevněji než v jednom telefonu.',
    emailLbl: 'E-mail', emailPh: 'vy@example.com', passwordLbl: 'Heslo', passwordPh: 'Aspoň 8 znaků',
    authSubmitIn: 'Přihlásit se', authSubmitUp: 'Vytvořit účet',
    authToUp: 'Ještě nemáte účet? Založte si ho', authToIn: 'Účet už máte? Přihlaste se',
    authErr: {
      bad: 'E-mail a heslo k sobě nesedí. Jedno z nich je špatně.',
      net: 'Server se nepodařilo zastihnout. Zkuste to za chvíli.',
      taken: 'Tenhle e-mail už účet má. Přihlaste se.',
      short: 'Heslo musí mít aspoň 8 znaků.',
      email: 'Tohle není e-mailová adresa.',
    },
    planFree: 'Zdarma', planPro: 'Předplatné',
    dishUsage: (n, max) => n + ' z ' + max + ' jídel',
    limitTitle: 'Plno.',
    limitAnon: (max, next) => 'V tomhle telefonu je limit ' + max + ' jídel. Po přihlášení ' + next + '.',
    limitFree: (max) => max + ' jídel je limit zdarma. Předplatné na víc se chystá. Do té doby odeberte něco, co nikdy nevaříte.',
    limitPro: (max) => max + ' jídel. Víc už ne. Některá z nich jste nikdy nevařili.',
    overflowTitle: 'Něco se nevešlo.',
    overflowBody: (n) => n + ' ' + (n === 1 ? 'jídlo' : n <= 4 ? 'jídla' : 'jídel') + ' z tohohle telefonu se nevešlo do limitu účtu a zůstalo stranou.',
    accountNote: 'Uložená jídla, vaše vlastní jídla, záznam i tohle nastavení jdou s účtem.',
    proTitle: 'Pro.',
    proBody: (n) => 'Žádný limit jídel, vlastní postup s odpočty' + (n ? ' a ' + n + (n === 1 ? ' jídlo' : n <= 4 ? ' jídla' : ' jídel') + ' jen pro Pro' : '') + '. Zatím se neprodává. Brzy.',
    proSoon: 'Brzy',
    stepsLbl: 'Postup', stepPh: 'např. Osmahněte cibuli, dokud se nevzdá', addStep: '+ Krok',
    proLocked: 'Vlastní postup s odpočty je součást Pro.',
    edit: 'Upravit', saveChanges: 'Uložit', formTitleEdit: 'Vaše jídlo, opravené.',
  },
};

export type SeedLogEntry = {
  when: Record<Lang, string>;
  dishId: string | null;
  outcome: 'cooked' | 'ordered' | 'ordered_no';
  note: Record<Lang, string>;
  cookedAnyway?: boolean;
};

export const seedLog: SeedLogEntry[] = [
  { when: { en: 'Mon 24', cs: 'Po 24' }, dishId: 'kimchi', outcome: 'cooked', note: { en: 'Second time this month. It knows.', cs: 'Podruhé tento měsíc. Ví to.' } },
  { when: { en: 'Sun 23', cs: 'Ne 23' }, dishId: 'steak', outcome: 'ordered_no', note: { en: 'You said you would not. You did.', cs: 'Říkali jste, že ne. A stejně jo.' }, cookedAnyway: true },
  { when: { en: 'Sat 22', cs: 'So 22' }, dishId: null, outcome: 'ordered', note: { en: 'Two rerolls, then a pizza. Recorded without comment.', cs: 'Dvě přehození, pak pizza. Zaznamenáno bez komentáře.' } },
  { when: { en: 'Thu 20', cs: 'Čt 20' }, dishId: 'cabbage', outcome: 'cooked', note: { en: 'New dish. Survived it.', cs: 'Nové jídlo. Přežili jste to.' } },
];
