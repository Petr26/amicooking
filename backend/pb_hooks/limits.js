// Limity „mých jídel“ = uložená ∪ vlastní (sdílí jeden limit).
// Anonymní limit hlídá jen appka (data jsou lokální); zbylé hlídá server.
module.exports = {
  LIMITS: { anon: 5, free: 12, pro: 500 },

  // Efektivní plán uživatele — pro jen dokud nevypršel plan_expires (prázdné = bez expirace).
  planOf(user) {
    if (user.getString('plan') !== 'pro') return 'free';
    const exp = user.getDateTime('plan_expires');
    if (exp.isZero()) return 'pro';
    return exp.unix() > Math.floor(Date.now() / 1000) ? 'pro' : 'free';
  },

  // Kolik různých jídel má uživatel (uložená + vlastní, každé jen jednou).
  countMine(app, userId) {
    const res = new DynamicModel({ n: 0 });
    app.db()
      .newQuery('SELECT COUNT(*) AS n FROM (SELECT dish AS k FROM saved WHERE user = {:u} UNION SELECT id AS k FROM user_dishes WHERE user = {:u})')
      .bind({ u: userId })
      .one(res);
    return res.n;
  },

  // Vlastní postup smí nastavit jen Pro. Po vypršení Pro jde jídlo dál upravovat,
  // pokud se postup nemění.
  guardSteps(e) {
    if (e.hasSuperuserAuth()) return e.next();
    const raw = e.record.getString('steps');
    const hasSteps = raw !== '' && raw !== 'null' && raw !== '[]';
    const unchanged = !e.record.isNew() && raw === e.record.original().getString('steps');
    if (hasSteps && !unchanged && !(e.auth && module.exports.planOf(e.auth) === 'pro')) {
      throw new ForbiddenError('pro_only');
    }
    return e.next();
  },

  // Patří klíč už mezi „moje jídla“? (pak nový záznam limit nezvyšuje)
  isMine(app, userId, key) {
    const res = new DynamicModel({ n: 0 });
    app.db()
      .newQuery('SELECT (SELECT COUNT(*) FROM saved WHERE user = {:u} AND dish = {:k}) + (SELECT COUNT(*) FROM user_dishes WHERE user = {:u} AND id = {:k}) AS n')
      .bind({ u: userId, k: key })
      .one(res);
    return res.n > 0;
  },
};
