/// <reference path="../pb_data/types.d.ts" />

// Schéma Am I Cooking?:
//   dishes       — základní jídla (veřejně ke čtení, spravují se v adminu)
//   user_dishes  — jídla, která si uživatel přidal sám
//   saved        — uložená jídla (klíč = slug základního jídla nebo id vlastního)
//   log_entries  — historie vaření / objednávek
//   users        — + plan, plan_expires (mění jen admin/server), settings, statistiky
const owner = 'user = @request.auth.id';

migrate((app) => {
  const users = app.findCollectionByNameOrId('users');

  // Plán a jeho expiraci si uživatel nesmí nastavit sám (ani při registraci).
  const noPlan = '@request.body.plan:isset = false && @request.body.plan_expires:isset = false';
  users.createRule = noPlan;
  users.updateRule = 'id = @request.auth.id && ' + noPlan;
  users.fields.add(new SelectField({ name: 'plan', values: ['free', 'pro'], maxSelect: 1 }));
  users.fields.add(new DateField({ name: 'plan_expires' }));
  users.fields.add(new JSONField({ name: 'settings', maxSize: 2000 }));
  users.fields.add(new NumberField({ name: 'total_rerolls', min: 0, onlyInt: true }));
  users.fields.add(new NumberField({ name: 'total_yeses', min: 0, onlyInt: true }));
  app.save(users);

  const dishes = new Collection({
    type: 'base',
    name: 'dishes',
    listRule: 'active = true',
    viewRule: 'active = true',
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: 'text', name: 'slug', required: true, max: 32, pattern: '^[a-z0-9-]+$' },
      { type: 'bool', name: 'active' },
      { type: 'number', name: 'sort', onlyInt: true },
      { type: 'number', name: 'time', required: true, min: 1, max: 600, onlyInt: true },
      { type: 'bool', name: 'pans2' },
      { type: 'bool', name: 'status_new' },
      { type: 'bool', name: 'fish' },
      { type: 'text', name: 'name_en', required: true, max: 120 },
      { type: 'text', name: 'name_cs', required: true, max: 120 },
      { type: 'text', name: 'dry_en', max: 300 },
      { type: 'text', name: 'dry_cs', max: 300 },
      { type: 'text', name: 'plain_en', max: 300 },
      { type: 'text', name: 'plain_cs', max: 300 },
      { type: 'text', name: 'miss_en', max: 120 },
      { type: 'text', name: 'miss_cs', max: 120 },
      // [{ t, d, tc, dc, m? }] — stejný tvar jako Step v appce
      { type: 'json', name: 'steps', maxSize: 20000 },
      { type: 'autodate', name: 'created', onCreate: true },
      { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_dishes_slug ON dishes (slug)'],
  });
  app.save(dishes);

  const userRel = { type: 'relation', name: 'user', required: true, collectionId: users.id, cascadeDelete: true, maxSelect: 1 };

  const userDishes = new Collection({
    type: 'base',
    name: 'user_dishes',
    listRule: owner,
    viewRule: owner,
    createRule: owner,
    updateRule: owner + ' && @request.body.user:isset = false',
    deleteRule: owner,
    fields: [
      userRel,
      { type: 'text', name: 'name', required: true, max: 120 },
      { type: 'number', name: 'time', required: true, min: 1, max: 600, onlyInt: true },
      { type: 'bool', name: 'pans2' },
      { type: 'text', name: 'note', max: 300 },
      { type: 'autodate', name: 'created', onCreate: true },
      { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
    ],
    indexes: ['CREATE INDEX idx_user_dishes_user ON user_dishes (user)'],
  });
  app.save(userDishes);

  const saved = new Collection({
    type: 'base',
    name: 'saved',
    listRule: owner,
    viewRule: owner,
    createRule: owner,
    updateRule: null,
    deleteRule: owner,
    fields: [
      userRel,
      { type: 'text', name: 'dish', required: true, max: 32 },
      { type: 'autodate', name: 'created', onCreate: true },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_saved_user_dish ON saved (user, dish)'],
  });
  app.save(saved);

  const log = new Collection({
    type: 'base',
    name: 'log_entries',
    listRule: owner,
    viewRule: owner,
    createRule: owner,
    updateRule: null,
    deleteRule: owner,
    fields: [
      userRel,
      { type: 'text', name: 'dish', max: 32 },
      { type: 'select', name: 'kind', required: true, values: ['cooked', 'ordered'], maxSelect: 1 },
      { type: 'date', name: 'at', required: true },
      { type: 'autodate', name: 'created', onCreate: true },
    ],
    indexes: ['CREATE INDEX idx_log_user_at ON log_entries (user, at)'],
  });
  app.save(log);
}, (app) => {
  for (const name of ['log_entries', 'saved', 'user_dishes', 'dishes']) {
    app.delete(app.findCollectionByNameOrId(name));
  }
  const users = app.findCollectionByNameOrId('users');
  for (const name of ['plan', 'plan_expires', 'settings', 'total_rerolls', 'total_yeses']) {
    users.fields.removeByName(name);
  }
  users.createRule = '';
  users.updateRule = 'id = @request.auth.id';
  app.save(users);
});
