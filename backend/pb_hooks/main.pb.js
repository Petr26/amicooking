/// <reference path="../pb_data/types.d.ts" />

// Veřejná konfigurace pro appku — limity se dají změnit bez nové verze appky.
routerAdd('GET', '/api/amicooking/config', (e) => {
  const { LIMITS } = require(`${__hooks}/limits.js`);
  return e.json(200, { limits: LIMITS });
});

// Limit „mých jídel“ při uložení jídla nebo přidání vlastního.
onRecordCreateRequest((e) => {
  const { LIMITS, planOf, countMine, isMine } = require(`${__hooks}/limits.js`);
  // Superuser (admin) limity neřeší.
  if (e.hasSuperuserAuth()) return e.next();

  const user = e.auth;
  if (!user) throw new UnauthorizedError('Sign in first.');
  const key = e.collection.name === 'saved' ? e.record.getString('dish') : e.record.id;
  if (!(key && isMine(e.app, user.id, key))) {
    const limit = LIMITS[planOf(user)];
    if (countMine(e.app, user.id) >= limit) {
      throw new ForbiddenError('dish_limit');
    }
  }
  return e.next();
}, 'saved', 'user_dishes');

// Uložit lze jen existující základní jídlo nebo vlastní jídlo tohoto uživatele.
onRecordCreateRequest((e) => {
  if (e.hasSuperuserAuth()) return e.next();
  const key = e.record.getString('dish');
  let ok = false;
  try {
    e.app.findFirstRecordByFilter('dishes', 'slug = {:k} && active = true', { k: key });
    ok = true;
  } catch (_) {
    try {
      const d = e.app.findRecordById('user_dishes', key);
      ok = !!e.auth && d.getString('user') === e.auth.id;
    } catch (_) {}
  }
  if (!ok) throw new BadRequestError('unknown_dish');
  return e.next();
}, 'saved');
