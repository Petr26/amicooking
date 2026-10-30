/// <reference path="../pb_data/types.d.ts" />

// Výchozí sada základních jídel (převzatá z původního src/data/dishes.ts).
// Další jídla se přidávají a upravují v adminu (https://api.amicooking.com/_/).
const seed =
[
  {
    "slug": "cacio",
    "sort": 0,
    "time": 15,
    "pans2": false,
    "status_new": false,
    "fish": false,
    "name_en": "Cacio e pepe",
    "name_cs": "Cacio e pepe",
    "dry_en": "Three ingredients. You have all three. Suspicious.",
    "dry_cs": "Tři suroviny. Máte všechny tři. Podezřelé.",
    "plain_en": "Pasta with pecorino and a lot of black pepper.",
    "plain_cs": "Těstoviny s pecorinem a spoustou černého pepře.",
    "miss_en": "Missing: pecorino",
    "miss_cs": "Chybí: pecorino",
    "steps": [
      {
        "t": "Salt the water heavily.",
        "d": "It should taste of the sea. This is the only seasoning the dish gets.",
        "tc": "Pořádně osolte vodu.",
        "dc": "Má chutnat jako moře. Jiné koření tohle jídlo nedostane."
      },
      {
        "t": "Pasta in. Nine minutes.",
        "d": "Keep a mug of the cooking water back before you drain. You will forget. Do not.",
        "tc": "Těstoviny do vody. Devět minut.",
        "dc": "Než scedíte, odlijte si hrnek vody z vaření. Zapomenete. Nezapomeňte.",
        "m": 9
      },
      {
        "t": "Grate the pecorino fine. All of it.",
        "d": "Coarse cheese seizes. Fine cheese behaves.",
        "tc": "Nastrouhejte pecorino najemno. Všechno.",
        "dc": "Hrubý sýr se srazí. Jemný sýr se chová slušně."
      },
      {
        "t": "Toast the pepper, emulsify off the heat.",
        "d": "Cheese, water, pasta, wrist. Off the heat or it splits.",
        "tc": "Opražte pepř, emulgujte mimo plotnu.",
        "dc": "Sýr, voda, těstoviny, zápěstí. Mimo plotnu, jinak se to srazí.",
        "m": 2
      }
    ]
  },
  {
    "slug": "kimchi",
    "sort": 1,
    "time": 14,
    "pans2": false,
    "status_new": false,
    "fish": false,
    "name_en": "Kimchi fried rice, jammy egg",
    "name_cs": "Smažená rýže s kimchi a vejcem",
    "dry_en": "The fridge has been asking for this. Loudly.",
    "dry_cs": "Lednice si o tohle říká. Nahlas.",
    "plain_en": "Uses up yesterday’s rice and the open kimchi.",
    "plain_cs": "Spotřebuje včerejší rýži a načaté kimchi.",
    "miss_en": "Nothing missing",
    "miss_cs": "Nic nechybí",
    "steps": [
      {
        "t": "Fry the kimchi in too much oil.",
        "d": "Four minutes, until the edges catch and it smells sharp.",
        "tc": "Osmahněte kimchi na příliš velkém množství oleje.",
        "dc": "Čtyři minuty, dokud okraje nechytnou a nezavoní ostře.",
        "m": 4
      },
      {
        "t": "Rice in, broken up with the spoon back.",
        "d": "Cold rice only. Fresh rice turns to paste.",
        "tc": "Přidejte rýži, rozbijte ji hřbetem lžíce.",
        "dc": "Jen studená rýže. Čerstvá se změní v kaši.",
        "m": 3
      },
      {
        "t": "Push it flat and leave it alone.",
        "d": "Two untouched minutes gets you the crust. Fidgeting gets you rice.",
        "tc": "Umáčkněte doplocha a nechte být.",
        "dc": "Dvě minuty bez šťourání znamenají kůrku. Šťourání znamená rýži.",
        "m": 2
      },
      {
        "t": "Egg on top, yolk soft.",
        "d": "Lid on, ninety seconds. Sesame if you own it.",
        "tc": "Vejce navrch, žloutek naměkko.",
        "dc": "Poklice, devadesát vteřin. Sezam, pokud ho vlastníte.",
        "m": 2
      }
    ]
  },
  {
    "slug": "cabbage",
    "sort": 2,
    "time": 25,
    "pans2": false,
    "status_new": true,
    "fish": false,
    "name_en": "Charred cabbage, brown butter",
    "name_cs": "Ožehlé zelí, hnědé máslo",
    "dry_en": "It is a cabbage. It will be better than that sounds.",
    "dry_cs": "Je to zelí. Bude to lepší, než to zní.",
    "plain_en": "Roasted hard, finished in brown butter and lemon.",
    "plain_cs": "Prudce pečené, dotažené hnědým máslem a citronem.",
    "miss_en": "Nothing missing",
    "miss_cs": "Nic nechybí",
    "steps": [
      {
        "t": "Quarter the cabbage. Keep the core.",
        "d": "The core holds it together and turns sweet.",
        "tc": "Rozčtvrťte zelí. Košťál nechte.",
        "dc": "Košťál to drží pohromadě a zesládne."
      },
      {
        "t": "Cut side down, dry hot pan, six minutes.",
        "d": "You want black, not brown. Trust it.",
        "tc": "Řezem dolů, suchá rozpálená pánev, šest minut.",
        "dc": "Chcete černou, ne hnědou. Věřte tomu.",
        "m": 6
      },
      {
        "t": "Butter in. Let it foam and go nutty.",
        "d": "Three minutes, swirling. Smell for hazelnut.",
        "tc": "Přidejte máslo. Nechte zpěnit a zhnědnout.",
        "dc": "Tři minuty, krouživě. Čekejte vůni lískových oříšků.",
        "m": 3
      },
      {
        "t": "Lemon, salt, spoon the butter over.",
        "d": "Eat it out of the pan. Nobody is watching.",
        "tc": "Citron, sůl, přelévejte máslem.",
        "dc": "Snězte to rovnou z pánve. Nikdo se nedívá."
      }
    ]
  },
  {
    "slug": "shakshuka",
    "sort": 3,
    "time": 20,
    "pans2": false,
    "status_new": true,
    "fish": false,
    "name_en": "Shakshuka for one",
    "name_cs": "Šakšuka pro jednoho",
    "dry_en": "Your eggs expire Thursday. It is Tuesday.",
    "dry_cs": "Vejce expirují ve čtvrtek. Je úterý.",
    "plain_en": "Eggs poached in spiced tomato, straight from the pan.",
    "plain_cs": "Vejce zastřená v kořeněných rajčatech, rovnou z pánve.",
    "miss_en": "Missing: feta",
    "miss_cs": "Chybí: feta",
    "steps": [
      {
        "t": "Onion and pepper, slow, eight minutes.",
        "d": "Soft, not coloured.",
        "tc": "Cibule a paprika, pomalu, osm minut.",
        "dc": "Do měkka, ne do barvy.",
        "m": 8
      },
      {
        "t": "Cumin and paprika, thirty seconds.",
        "d": "Until it smells like a different kitchen.",
        "tc": "Kmín a mletá paprika, třicet vteřin.",
        "dc": "Dokud to nezavoní jako cizí kuchyně.",
        "m": 1
      },
      {
        "t": "Tomatoes in. Reduce to a spoon trail.",
        "d": "Ten minutes. Season harder than you think you should.",
        "tc": "Rajčata. Redukujte, až lžíce nechává stopu.",
        "dc": "Deset minut. Solte víc, než si myslíte, že máte.",
        "m": 10
      },
      {
        "t": "Two wells. Two eggs. Lid on.",
        "d": "Five minutes for set whites and a soft yolk.",
        "tc": "Dva důlky. Dvě vejce. Poklici.",
        "dc": "Pět minut na tuhý bílek a měkký žloutek.",
        "m": 5
      }
    ]
  },
  {
    "slug": "salmon",
    "sort": 4,
    "time": 22,
    "pans2": true,
    "status_new": true,
    "fish": true,
    "name_en": "Miso-butter salmon, rice",
    "name_cs": "Losos s miso máslem, rýže",
    "dry_en": "Fifteen of those minutes are the rice cooking itself.",
    "dry_cs": "Patnáct z těch minut se rýže vaří sama.",
    "plain_en": "Glazed salmon over rice with quick cucumber.",
    "plain_cs": "Glazovaný losos na rýži s rychlou okurkou.",
    "miss_en": "Nothing missing",
    "miss_cs": "Nic nechybí",
    "steps": [
      {
        "t": "Rice on first. It is the long pole.",
        "d": "Fifteen minutes, then leave it covered and forget it.",
        "tc": "Nejdřív rýži. Trvá nejdéle.",
        "dc": "Patnáct minut, pak nechte přikrytou a zapomeňte na ni.",
        "m": 15
      },
      {
        "t": "Whisk miso, butter, mirin.",
        "d": "A paste, not a sauce.",
        "tc": "Prošlehejte miso, máslo, mirin.",
        "dc": "Pasta, ne omáčka."
      },
      {
        "t": "Salmon skin-down, six minutes, no moving.",
        "d": "The skin releases when it is ready. Not before.",
        "tc": "Losos kůží dolů, šest minut, nehýbat.",
        "dc": "Kůže se pustí sama, až bude připravená. Ne dřív.",
        "m": 6
      },
      {
        "t": "Flip, glaze, thirty seconds of heat.",
        "d": "The miso burns fast. Stand there for it.",
        "tc": "Otočit, glazovat, třicet vteřin.",
        "dc": "Miso se rychle pálí. Stůjte u toho.",
        "m": 1
      }
    ]
  },
  {
    "slug": "tofu",
    "sort": 5,
    "time": 30,
    "pans2": true,
    "status_new": true,
    "fish": false,
    "name_en": "Black pepper tofu",
    "name_cs": "Tofu s černým pepřem",
    "dry_en": "You have never made this. That is rather the point.",
    "dry_cs": "Nikdy jste to nedělali. O to přesně jde.",
    "plain_en": "Crisp tofu, heavy pepper, more butter than expected.",
    "plain_cs": "Křupavé tofu, hodně pepře, víc másla, než čekáte.",
    "miss_en": "Missing: shallots",
    "miss_cs": "Chybí: šalotky",
    "steps": [
      {
        "t": "Press the tofu while you do everything else.",
        "d": "Ten minutes under something heavy.",
        "tc": "Tofu zatižte, zatímco děláte všechno ostatní.",
        "dc": "Deset minut pod něčím těžkým.",
        "m": 10
      },
      {
        "t": "Cornflour, then fry hard in two batches.",
        "d": "Crowding the pan steams it. Two batches.",
        "tc": "Kukuřičný škrob, pak prudce osmažit ve dvou dávkách.",
        "dc": "Plná pánev znamená dušení. Dvě dávky.",
        "m": 8
      },
      {
        "t": "Shallots slow in butter until sweet.",
        "d": "Six minutes, low, stirring when you remember.",
        "tc": "Šalotky pomalu na másle do sladka.",
        "dc": "Šest minut, mírně, míchejte, když si vzpomenete.",
        "m": 6
      },
      {
        "t": "A tablespoon of pepper. Yes, a tablespoon.",
        "d": "Toss the tofu through off the heat.",
        "tc": "Lžíce pepře. Ano, celá lžíce.",
        "dc": "Tofu protáhněte mimo plotnu."
      }
    ]
  },
  {
    "slug": "broccoli",
    "sort": 6,
    "time": 18,
    "pans2": true,
    "status_new": false,
    "fish": true,
    "name_en": "Anchovy broccoli pasta",
    "name_cs": "Těstoviny s brokolicí a ančovičkami",
    "dry_en": "You will object to the anchovies. Use them anyway.",
    "dry_cs": "Budete protestovat proti ančovičkám. Stejně je použijte.",
    "plain_en": "Broccoli cooked down with anchovy, garlic and chilli.",
    "plain_cs": "Brokolice rozvařená s ančovičkami, česnekem a chilli.",
    "miss_en": "Nothing missing",
    "miss_cs": "Nic nechybí",
    "steps": [
      {
        "t": "Pasta water on. Broccoli into small florets.",
        "d": "Small florets collapse into sauce. Large ones stay broccoli.",
        "tc": "Vodu na těstoviny. Brokolici na malé růžičky.",
        "dc": "Malé růžičky se rozpadnou do omáčky. Velké zůstanou brokolicí."
      },
      {
        "t": "Anchovies into hot oil until they vanish.",
        "d": "Two minutes. They stop being anchovies.",
        "tc": "Ančovičky do horkého oleje, dokud nezmizí.",
        "dc": "Dvě minuty. Přestanou být ančovičkami.",
        "m": 2
      },
      {
        "t": "Broccoli in with a ladle of pasta water.",
        "d": "Eight minutes, lid on, mash it down halfway.",
        "tc": "Brokolice a naběračka vody z těstovin.",
        "dc": "Osm minut, poklice, v půlce rozmačkat.",
        "m": 8
      },
      {
        "t": "Pasta through, chilli, no cheese.",
        "d": "Argue about the cheese another night.",
        "tc": "Vmíchejte těstoviny, chilli, žádný sýr.",
        "dc": "O sýru se hádejte jindy."
      }
    ]
  },
  {
    "slug": "steak",
    "sort": 7,
    "time": 20,
    "pans2": false,
    "status_new": true,
    "fish": false,
    "name_en": "Steak sandwich, honestly",
    "name_cs": "Steakový sendvič, upřímně",
    "dry_en": "You have had a day. This is the answer to a day.",
    "dry_cs": "Máte za sebou den. Tohle je odpověď na den.",
    "plain_en": "Seared steak, mustard, soft bread, no sides.",
    "plain_cs": "Opečený steak, hořčice, měkký chléb, žádné přílohy.",
    "miss_en": "Missing: good bread",
    "miss_cs": "Chybí: pořádný chléb",
    "steps": [
      {
        "t": "Steak out and salted; pan gets furious.",
        "d": "Dry surface or no crust. Pat it.",
        "tc": "Steak ven a osolit; pánev rozpálit do běla.",
        "dc": "Suchý povrch, nebo žádná kůrka. Osušte ho."
      },
      {
        "t": "Two minutes a side. Do not poke it.",
        "d": "Butter and thyme in the last thirty seconds.",
        "tc": "Dvě minuty z každé strany. Nešťouchat.",
        "dc": "Máslo a tymián posledních třicet vteřin.",
        "m": 4
      },
      {
        "t": "Rest it. Five minutes. Non-negotiable.",
        "d": "Mustard the bread while you wait.",
        "tc": "Nechte odpočinout. Pět minut. Nesmlouvavé.",
        "dc": "Mezitím namažte chléb hořčicí.",
        "m": 5
      },
      {
        "t": "Slice against the grain, pile it in.",
        "d": "Pan juices over the top. Eat standing up.",
        "tc": "Krájejte přes vlákno, navršte do chleba.",
        "dc": "Šťávu z pánve navrch. Jezte vestoje."
      }
    ]
  }
]
;

migrate((app) => {
  const col = app.findCollectionByNameOrId('dishes');
  for (const d of seed) {
    const r = new Record(col);
    r.load(Object.assign({ active: true }, d));
    app.save(r);
  }
}, (app) => {
  for (const d of seed) {
    try {
      app.delete(app.findFirstRecordByData('dishes', 'slug', d.slug));
    } catch (_) {}
  }
});
