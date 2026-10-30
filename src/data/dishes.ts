export type Dish = {
  id: string;
  name: string;
  time: number;
  pans2: boolean;
  statusNew: boolean;
  missKey: string | null;
  fish: boolean;
  custom?: boolean;
  premium?: boolean; // Pro only (steps come from the API only for Pro)
  steps?: Step[]; // own steps of a custom dish (Pro)
  dry: string;
  plain: string;
  cs: { name: string; dry: string; plain: string; miss: string };
  missEn: string;
};

export type Step = {
  t: string;
  d: string;
  tc: string;
  dc: string;
  m?: number;
};

export const dishes: Dish[] = [
  { id: 'cacio', name: 'Cacio e pepe', time: 15, pans2: false, statusNew: false, missKey: 'pecorino', fish: false,
    dry: 'Three ingredients. You have all three. Suspicious.', plain: 'Pasta with pecorino and a lot of black pepper.',
    cs: { name: 'Cacio e pepe', dry: 'Tři suroviny. Máte všechny tři. Podezřelé.', plain: 'Těstoviny s pecorinem a spoustou černého pepře.', miss: 'Chybí: pecorino' }, missEn: 'Missing: pecorino' },
  { id: 'kimchi', name: 'Kimchi fried rice, jammy egg', time: 14, pans2: false, statusNew: false, missKey: null, fish: false,
    dry: 'The fridge has been asking for this. Loudly.', plain: 'Uses up yesterday’s rice and the open kimchi.',
    cs: { name: 'Smažená rýže s kimchi a vejcem', dry: 'Lednice si o tohle říká. Nahlas.', plain: 'Spotřebuje včerejší rýži a načaté kimchi.', miss: 'Nic nechybí' }, missEn: 'Nothing missing' },
  { id: 'cabbage', name: 'Charred cabbage, brown butter', time: 25, pans2: false, statusNew: true, missKey: null, fish: false,
    dry: 'It is a cabbage. It will be better than that sounds.', plain: 'Roasted hard, finished in brown butter and lemon.',
    cs: { name: 'Ožehlé zelí, hnědé máslo', dry: 'Je to zelí. Bude to lepší, než to zní.', plain: 'Prudce pečené, dotažené hnědým máslem a citronem.', miss: 'Nic nechybí' }, missEn: 'Nothing missing' },
  { id: 'shakshuka', name: 'Shakshuka for one', time: 20, pans2: false, statusNew: true, missKey: 'feta', fish: false,
    dry: 'Your eggs expire Thursday. It is Tuesday.', plain: 'Eggs poached in spiced tomato, straight from the pan.',
    cs: { name: 'Šakšuka pro jednoho', dry: 'Vejce expirují ve čtvrtek. Je úterý.', plain: 'Vejce zastřená v kořeněných rajčatech, rovnou z pánve.', miss: 'Chybí: feta' }, missEn: 'Missing: feta' },
  { id: 'salmon', name: 'Miso-butter salmon, rice', time: 22, pans2: true, statusNew: true, missKey: null, fish: true,
    dry: 'Fifteen of those minutes are the rice cooking itself.', plain: 'Glazed salmon over rice with quick cucumber.',
    cs: { name: 'Losos s miso máslem, rýže', dry: 'Patnáct z těch minut se rýže vaří sama.', plain: 'Glazovaný losos na rýži s rychlou okurkou.', miss: 'Nic nechybí' }, missEn: 'Nothing missing' },
  { id: 'tofu', name: 'Black pepper tofu', time: 30, pans2: true, statusNew: true, missKey: 'shallots', fish: false,
    dry: 'You have never made this. That is rather the point.', plain: 'Crisp tofu, heavy pepper, more butter than expected.',
    cs: { name: 'Tofu s černým pepřem', dry: 'Nikdy jste to nedělali. O to přesně jde.', plain: 'Křupavé tofu, hodně pepře, víc másla, než čekáte.', miss: 'Chybí: šalotky' }, missEn: 'Missing: shallots' },
  { id: 'broccoli', name: 'Anchovy broccoli pasta', time: 18, pans2: true, statusNew: false, missKey: null, fish: true,
    dry: 'You will object to the anchovies. Use them anyway.', plain: 'Broccoli cooked down with anchovy, garlic and chilli.',
    cs: { name: 'Těstoviny s brokolicí a ančovičkami', dry: 'Budete protestovat proti ančovičkám. Stejně je použijte.', plain: 'Brokolice rozvařená s ančovičkami, česnekem a chilli.', miss: 'Nic nechybí' }, missEn: 'Nothing missing' },
  { id: 'steak', name: 'Steak sandwich, honestly', time: 20, pans2: false, statusNew: true, missKey: 'bread', fish: false,
    dry: 'You have had a day. This is the answer to a day.', plain: 'Seared steak, mustard, soft bread, no sides.',
    cs: { name: 'Steakový sendvič, upřímně', dry: 'Máte za sebou den. Tohle je odpověď na den.', plain: 'Opečený steak, hořčice, měkký chléb, žádné přílohy.', miss: 'Chybí: pořádný chléb' }, missEn: 'Missing: good bread' },
];

export const steps: Record<string, Step[]> = {
  cacio: [
    { t: 'Salt the water heavily.', d: 'It should taste of the sea. This is the only seasoning the dish gets.', tc: 'Pořádně osolte vodu.', dc: 'Má chutnat jako moře. Jiné koření tohle jídlo nedostane.' },
    { t: 'Pasta in. Nine minutes.', d: 'Keep a mug of the cooking water back before you drain. You will forget. Do not.', m: 9, tc: 'Těstoviny do vody. Devět minut.', dc: 'Než scedíte, odlijte si hrnek vody z vaření. Zapomenete. Nezapomeňte.' },
    { t: 'Grate the pecorino fine. All of it.', d: 'Coarse cheese seizes. Fine cheese behaves.', tc: 'Nastrouhejte pecorino najemno. Všechno.', dc: 'Hrubý sýr se srazí. Jemný sýr se chová slušně.' },
    { t: 'Toast the pepper, emulsify off the heat.', d: 'Cheese, water, pasta, wrist. Off the heat or it splits.', m: 2, tc: 'Opražte pepř, emulgujte mimo plotnu.', dc: 'Sýr, voda, těstoviny, zápěstí. Mimo plotnu, jinak se to srazí.' },
  ],
  kimchi: [
    { t: 'Fry the kimchi in too much oil.', d: 'Four minutes, until the edges catch and it smells sharp.', m: 4, tc: 'Osmahněte kimchi na příliš velkém množství oleje.', dc: 'Čtyři minuty, dokud okraje nechytnou a nezavoní ostře.' },
    { t: 'Rice in, broken up with the spoon back.', d: 'Cold rice only. Fresh rice turns to paste.', m: 3, tc: 'Přidejte rýži, rozbijte ji hřbetem lžíce.', dc: 'Jen studená rýže. Čerstvá se změní v kaši.' },
    { t: 'Push it flat and leave it alone.', d: 'Two untouched minutes gets you the crust. Fidgeting gets you rice.', m: 2, tc: 'Umáčkněte doplocha a nechte být.', dc: 'Dvě minuty bez šťourání znamenají kůrku. Šťourání znamená rýži.' },
    { t: 'Egg on top, yolk soft.', d: 'Lid on, ninety seconds. Sesame if you own it.', m: 2, tc: 'Vejce navrch, žloutek naměkko.', dc: 'Poklice, devadesát vteřin. Sezam, pokud ho vlastníte.' },
  ],
  cabbage: [
    { t: 'Quarter the cabbage. Keep the core.', d: 'The core holds it together and turns sweet.', tc: 'Rozčtvrťte zelí. Košťál nechte.', dc: 'Košťál to drží pohromadě a zesládne.' },
    { t: 'Cut side down, dry hot pan, six minutes.', d: 'You want black, not brown. Trust it.', m: 6, tc: 'Řezem dolů, suchá rozpálená pánev, šest minut.', dc: 'Chcete černou, ne hnědou. Věřte tomu.' },
    { t: 'Butter in. Let it foam and go nutty.', d: 'Three minutes, swirling. Smell for hazelnut.', m: 3, tc: 'Přidejte máslo. Nechte zpěnit a zhnědnout.', dc: 'Tři minuty, krouživě. Čekejte vůni lískových oříšků.' },
    { t: 'Lemon, salt, spoon the butter over.', d: 'Eat it out of the pan. Nobody is watching.', tc: 'Citron, sůl, přelévejte máslem.', dc: 'Snězte to rovnou z pánve. Nikdo se nedívá.' },
  ],
  shakshuka: [
    { t: 'Onion and pepper, slow, eight minutes.', d: 'Soft, not coloured.', m: 8, tc: 'Cibule a paprika, pomalu, osm minut.', dc: 'Do měkka, ne do barvy.' },
    { t: 'Cumin and paprika, thirty seconds.', d: 'Until it smells like a different kitchen.', m: 1, tc: 'Kmín a mletá paprika, třicet vteřin.', dc: 'Dokud to nezavoní jako cizí kuchyně.' },
    { t: 'Tomatoes in. Reduce to a spoon trail.', d: 'Ten minutes. Season harder than you think you should.', m: 10, tc: 'Rajčata. Redukujte, až lžíce nechává stopu.', dc: 'Deset minut. Solte víc, než si myslíte, že máte.' },
    { t: 'Two wells. Two eggs. Lid on.', d: 'Five minutes for set whites and a soft yolk.', m: 5, tc: 'Dva důlky. Dvě vejce. Poklici.', dc: 'Pět minut na tuhý bílek a měkký žloutek.' },
  ],
  salmon: [
    { t: 'Rice on first. It is the long pole.', d: 'Fifteen minutes, then leave it covered and forget it.', m: 15, tc: 'Nejdřív rýži. Trvá nejdéle.', dc: 'Patnáct minut, pak nechte přikrytou a zapomeňte na ni.' },
    { t: 'Whisk miso, butter, mirin.', d: 'A paste, not a sauce.', tc: 'Prošlehejte miso, máslo, mirin.', dc: 'Pasta, ne omáčka.' },
    { t: 'Salmon skin-down, six minutes, no moving.', d: 'The skin releases when it is ready. Not before.', m: 6, tc: 'Losos kůží dolů, šest minut, nehýbat.', dc: 'Kůže se pustí sama, až bude připravená. Ne dřív.' },
    { t: 'Flip, glaze, thirty seconds of heat.', d: 'The miso burns fast. Stand there for it.', m: 1, tc: 'Otočit, glazovat, třicet vteřin.', dc: 'Miso se rychle pálí. Stůjte u toho.' },
  ],
  tofu: [
    { t: 'Press the tofu while you do everything else.', d: 'Ten minutes under something heavy.', m: 10, tc: 'Tofu zatižte, zatímco děláte všechno ostatní.', dc: 'Deset minut pod něčím těžkým.' },
    { t: 'Cornflour, then fry hard in two batches.', d: 'Crowding the pan steams it. Two batches.', m: 8, tc: 'Kukuřičný škrob, pak prudce osmažit ve dvou dávkách.', dc: 'Plná pánev znamená dušení. Dvě dávky.' },
    { t: 'Shallots slow in butter until sweet.', d: 'Six minutes, low, stirring when you remember.', m: 6, tc: 'Šalotky pomalu na másle do sladka.', dc: 'Šest minut, mírně, míchejte, když si vzpomenete.' },
    { t: 'A tablespoon of pepper. Yes, a tablespoon.', d: 'Toss the tofu through off the heat.', tc: 'Lžíce pepře. Ano, celá lžíce.', dc: 'Tofu protáhněte mimo plotnu.' },
  ],
  broccoli: [
    { t: 'Pasta water on. Broccoli into small florets.', d: 'Small florets collapse into sauce. Large ones stay broccoli.', tc: 'Vodu na těstoviny. Brokolici na malé růžičky.', dc: 'Malé růžičky se rozpadnou do omáčky. Velké zůstanou brokolicí.' },
    { t: 'Anchovies into hot oil until they vanish.', d: 'Two minutes. They stop being anchovies.', m: 2, tc: 'Ančovičky do horkého oleje, dokud nezmizí.', dc: 'Dvě minuty. Přestanou být ančovičkami.' },
    { t: 'Broccoli in with a ladle of pasta water.', d: 'Eight minutes, lid on, mash it down halfway.', m: 8, tc: 'Brokolice a naběračka vody z těstovin.', dc: 'Osm minut, poklice, v půlce rozmačkat.' },
    { t: 'Pasta through, chilli, no cheese.', d: 'Argue about the cheese another night.', tc: 'Vmíchejte těstoviny, chilli, žádný sýr.', dc: 'O sýru se hádejte jindy.' },
  ],
  steak: [
    { t: 'Steak out and salted; pan gets furious.', d: 'Dry surface or no crust. Pat it.', tc: 'Steak ven a osolit; pánev rozpálit do běla.', dc: 'Suchý povrch, nebo žádná kůrka. Osušte ho.' },
    { t: 'Two minutes a side. Do not poke it.', d: 'Butter and thyme in the last thirty seconds.', m: 4, tc: 'Dvě minuty z každé strany. Nešťouchat.', dc: 'Máslo a tymián posledních třicet vteřin.' },
    { t: 'Rest it. Five minutes. Non-negotiable.', d: 'Mustard the bread while you wait.', m: 5, tc: 'Nechte odpočinout. Pět minut. Nesmlouvavé.', dc: 'Mezitím namažte chléb hořčicí.' },
    { t: 'Slice against the grain, pile it in.', d: 'Pan juices over the top. Eat standing up.', tc: 'Krájejte přes vlákno, navršte do chleba.', dc: 'Šťávu z pánve navrch. Jezte vestoje.' },
  ],
};
