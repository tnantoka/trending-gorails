m.route.mode = 'pathname';
m.route($('#episodes').get(0), '/', {
  '/': EpisodeComponent
});
