# Am I Cooking? — otevřené úkoly

Stav k 2026-11-02. Backend (PocketBase) běží na `https://api.amicooking.com`, appka je napojená
(viz README → Backend). Všechno je na větvi `develop`, **zatím nepushnuté**.

## Hned / bez dalších účtů
- [ ] **Push `develop` na GitHub** (4 commity: backend, napojení appky, obnova session, Pro funkce).
- [ ] **Smazání účtu v appce.** Apple to vyžaduje u každé appky s registrací (guideline 5.1.1(v)).
      Endpoint/hook na smazání uživatele + tlačítko v záložce Vy (s potvrzením).
- [ ] **Zásady ochrany osobních údajů.** Stránka `amicooking.com/privacy` (EN + CS), odkaz z appky
      a z obchodů. Vyžaduje Apple i Google.
- [ ] **Zálohy mimo server.** Teď jen `/var/backups/amicooking` na stejném VPS. Návrh: Backblaze B2
      (nebo jiné S3) + rclone v `backend/deploy/backup.sh`. Od Petra: účet + přístupový klíč.
- [ ] **Prodloužit VPS u Forpsi. Služba vyprší 02.12.2026**, běží na ní Riskuj i API appky.
- [ ] Po prvním přihlášení do adminu (`https://api.amicooking.com/_/`) **změnit heslo**
      (výchozí je v `backend/.admin.env`).

## Účty a e-maily (potřebuje Petr)
- [ ] **SMTP pro reset hesla a ověření e-mailu.** Založit schránku např. `noreply@amicooking.com`
      u Forpsi, předat heslo. Pak: nastavení SMTP v PocketBase + „Zapomenuté heslo“ v appce.
- [ ] **Apple Developer Program** (99 USD/rok). Potřeba pro TestFlight, App Store, Sign in with Apple
      i předplatné.
- [ ] **Google Play Console** (25 USD jednorázově).
- [ ] **Google OAuth klient** (Google Cloud Console) pro přihlášení přes Google.

## Přihlášení
- [ ] **Sign in with Apple.** Na iOS v podstatě povinné, pokud je nabídnut Google.
- [ ] **Přihlášení přes Google.**
- Obojí přes OAuth2 v PocketBase. Teď je jen e-mail + heslo.

## Předplatné (Pro) — „ještě se k tomu vrátíme“
Zatím **návrh, nic není rozhodnuto**:
- Limity „mých jídel“ (uložená ∪ vlastní): bez účtu **5**, účet zdarma **12**, Pro **500**
  (už nasazeno, mění se v `backend/pb_hooks/limits.js` bez nové verze appky).
- Pro = žádný limit + **vlastní postup s časovači u vlastních jídel** + **prémiová jídla**
  (obojí hotové, appka zatím ukazuje „Pro: brzy“).
- Navržená cena: **299 Kč/rok se 7denní zkušební verzí**, 49 Kč/měsíc, 599 Kč doživotně.
  Pokrytí nákladů (~5 000 Kč/rok) ≈ 20 ročních předplatitelů.

K rozhodnutí / udělání:
- [ ] Potvrdit cenu a varianty (měsíční / roční / doživotní, zkušební doba).
- [ ] **RevenueCat**: produkty v App Store Connect a Google Play, paywall v appce, nákup jen pro
      přihlášené.
- [ ] **Webhook z RevenueCat → backend**: nastaví `plan = pro` + `plan_expires` u uživatele.
- [ ] „Obnovit nákupy“ v appce (Apple to vyžaduje).
- [ ] **Prémiová jídla: žádné zatím není.** Přidat nová nebo označit stávající jako `premium` v adminu.
- [ ] Další možné Pro funkce do budoucna: celá historie a statistiky (zdarma třeba 30 dní), fotky
      jídel, nákupní seznam z chybějících surovin.

## Vydání
- [ ] EAS build (`eas.json` existuje) → TestFlight + interní testování na Androidu.
- [ ] Ověřit appku na Android emulátoru (zatím testováno jen iOS simulátor).
- [ ] Texty, screenshoty a ikony do obchodů, kategorie, věkové hodnocení, privacy formuláře
      (App Privacy / Data safety: e-mail, data jídel).
- [ ] Web `amicooking.com` teď ukazuje jen HTML prototyp. Udělat jednoduchou landing page s odkazy
      do obchodů (+ privacy).

## Drobnosti a dluh
- [ ] Demo data: nový uživatel bez účtu má předvyplněný Log (4 ukázkové záznamy) a uložené `kimchi`;
      „logQuip“ v Logu je natvrdo („Four of the last six nights…“). Rozhodnout, jestli nechat.
- [ ] Při přihlášení se lokální jídla nad limit účtu zahodí (s hláškou). Okrajový případ, případně
      řešit jinak.
- [ ] Log ukládá jen „uvařeno“; „objednal jsem si“ se nezapisuje (backend `kind: ordered` umí).
- [ ] Ubuntu 22.04 na VPS má standardní podporu do 04/2027, časem upgrade (pozor na Riskuj).
- [ ] Testování UI: klikání do simulátoru přes AppleScript nejde (chybí oprávnění Přístupnost).
      Buď povolit, nebo dál používat `EXPO_PUBLIC_SCENARIO` + dočasný dev kód.
