/// <reference path="../pb_data/types.d.ts" />

// Pro: prémiová základní jídla (postup vidí jen Pro) a vlastní postup u vlastních jídel.
migrate((app) => {
  const dishes = app.findCollectionByNameOrId('dishes');
  dishes.fields.add(new BoolField({ name: 'premium' }));
  app.save(dishes);

  const userDishes = app.findCollectionByNameOrId('user_dishes');
  // [{ t, d, tc, dc, m? }] — stejný tvar jako u základních jídel
  userDishes.fields.add(new JSONField({ name: 'steps', maxSize: 20000 }));
  app.save(userDishes);
}, (app) => {
  const dishes = app.findCollectionByNameOrId('dishes');
  dishes.fields.removeByName('premium');
  app.save(dishes);
  const userDishes = app.findCollectionByNameOrId('user_dishes');
  userDishes.fields.removeByName('steps');
  app.save(userDishes);
});
