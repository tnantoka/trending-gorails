m.route.mode = 'hash';
m.route($('#episodes').get(0), '/', {
  '/': EpisodeComponent
});
