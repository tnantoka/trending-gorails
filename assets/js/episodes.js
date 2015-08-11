var Episode = function(data) {
  this.sequentialId = m.prop(data.sequential_id);
  this.url = m.prop(data.url);
  this.title = m.prop(data.title);
  this.hearts = m.prop(data.hearts);
  this.isPro = m.prop(data.is_pro);
};

Episode.list = function () {
  return m.request({ method: 'GET', url: 'episodes.json', type: Episode, initialValue: [] });
};

var vm = {
  init: function() {
          if (!vm.initialized) {
            vm.list = Episode.list();
          }
          vm.sortBy = m.prop(m.route.param('sort_by') || 'hearts');
          vm.sortOrder = m.prop(m.route.param('sort_order') || 'desc');
          vm.filterWith = m.prop(m.route.param('filter_with') || 'all');

          vm.initialized = true;
        },
  sort: function(e) {
          sortBy = e.target.getAttribute('data-sort-by');
          var sortOrder = 'desc';
          if (sortBy == vm.sortBy()) {
            sortOrder = vm.sortOrder() == 'asc' ? 'desc' : 'asc';
          }
          vm.sortBy(sortBy);
          vm.sortOrder(sortOrder);
        },
  filter: function(e) {
          vm.filterWith(e.target.getAttribute('data-filter-with'));
        },
  arrangedList: function() {
                var list = vm.list();
                var prop = vm.sortBy();
                list.sort(function(a, b) {
                  if (a[prop]() > b[prop]()) {
                    return -1;
                  } else if (a[prop]() < b[prop]()) {
                    return 1;
                  } else {
                    return 0;
                  } 
                });
                if (vm.sortOrder() == 'asc') {
                  list.reverse();
                }
                return list.filter(function(episode) {
                  if (vm.filterWith() == 'pro') {
                    return episode.isPro();
                  } else if (vm.filterWith() == 'free') {
                    return !episode.isPro();
                  } else {
                    return true;
                  }
                });
              }
}

function controller() {
  vm.init();

  function route() {
    var q = {
      sort_by: vm.sortBy(),
      sort_order: vm.sortOrder(),
      filter_with: vm.filterWith()
    };
    m.route('/', q)
  }

  this.onSort = function(e) {
    vm.sort(e);
    route()
  };
  this.onFilter = function(e) {
    vm.filter(e);
    route();
  };
}

function view(ctrl) {
  var list = vm.arrangedList();

  var head = m('thead', m('tr', [
        m('th.text-center', m('a.btn.btn-sm.btn-link', { onclick: ctrl.onSort, 'data-sort-by': 'sequentialId' }, '#')),
        m('th.text-center', m('a.btn.btn-sm.btn-link', { onclick: ctrl.onSort, 'data-sort-by': 'title' }, 'Title')),
        m('th.text-center', m('a.btn.btn-sm.btn-link', { onclick: ctrl.onSort, 'data-sort-by': 'isPro' }, 'Pro')),
        m('th.text-center', m('a.btn.btn-sm.btn-link', { onclick: ctrl.onSort, 'data-sort-by': 'hearts' }, 'Hearts')),
        ])
      );

  var body = m('tbody', list.map(function (episode) {
    return m('tr', [
      m('td', episode.sequentialId()),
      m('td', [
        m('a[target=_blank]', { href: episode.url() }, [
          m('span', episode.title() + ' '),
          m('i.fa.fa-external-link'),
          ]),
        ]),
      m('td', [
        m('span.label', { class: episode.isPro() ? 'label-danger' : 'label-default' }, episode.isPro() ? 'Pro' : 'Free'),
        ]),
      m('td', [
        m('i.fa.fa-heart'),
        m('span', ' ' + episode.hearts()),
        ]),
      ]);
  }));

  return m('div', [
    m('.clearfix', [
      m('.pull-right', [
        m('.btn-group.btn-group-sm', [
          m('a.btn.btn-default', { class: (vm.filterWith() == 'all' ? 'active': ''), onclick: ctrl.onFilter, 'data-filter-with': 'all' }, 'All'),
          m('a.btn.btn-default', { class: (vm.filterWith() == 'pro' ? 'active': ''), onclick: ctrl.onFilter, 'data-filter-with': 'pro' }, 'Pro'),
          m('a.btn.btn-default', { class: (vm.filterWith() == 'free' ? 'active': ''), onclick: ctrl.onFilter, 'data-filter-with': 'free' }, 'Free'),
        ])
      ]),
      m('p.text-left', [
        m('strong', list.length),
        m('span', ' episodes'),
        m('br'),
        m('small.text-muted', 'Fetched at: ' + new Date(Meta.fetched_at)),
      ])
    ]),
    m('table.table.table-bordered', [head, body]),
  ]);
}

var EpisodeComponent = {
  controller: controller,
  view: view,
};

