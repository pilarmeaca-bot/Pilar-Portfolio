(function () {
  const workItems = document.querySelectorAll('.work-item, .work-pair');
  const workGrid = document.querySelector('.work-grid');
  const comingSoon = document.getElementById('work-coming-soon');

  const workTitle = workGrid?.querySelector('.work-grid__title');
  const pixarFest = workGrid?.querySelector('.work-item--pixar-fest');
  const capnCrunch = workGrid?.querySelector('.work-item--capn-crunch');
  const streamFantaPair = workGrid?.querySelector('.work-pair--stream-fanta');

  function reorderWorkGrid(isAll) {
    if (!workTitle || !capnCrunch || !streamFantaPair) return;

    if (isAll) {
      if (pixarFest) pixarFest.insertAdjacentElement('afterend', streamFantaPair);
      streamFantaPair.insertAdjacentElement('afterend', capnCrunch);
      return;
    }

    workTitle.insertAdjacentElement('afterend', capnCrunch);
  }

  function applyFilter(filter) {
    const isAll = filter === 'all';

    document.body.classList.toggle('work-filter-all', isAll);

    if (workGrid) workGrid.hidden = false;
    if (comingSoon) comingSoon.hidden = true;

    workItems.forEach((item) => {
      item.hidden = isAll ? false : item.dataset.featured !== 'true';
    });

    if (workTitle) {
      workTitle.textContent = isAll ? 'All projects' : 'Featured projects';
    }

    document.title = isAll ? 'Pilar Meaca | Work All' : 'Pilar Meaca | Work Featured';

    reorderWorkGrid(isAll);

    document.querySelectorAll('[data-work-filter]').forEach((button) => {
      const isActive = button.dataset.workFilter === filter;
      button.classList.toggle('nav__link--active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    const url = new URL(window.location.href);
    if (isAll) url.searchParams.set('filter', 'all');
    else url.searchParams.delete('filter');
    window.history.replaceState({}, '', url);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-work-filter]');
    if (!button || !document.querySelector('.work-item')) return;
    applyFilter(button.dataset.workFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  applyFilter(new URLSearchParams(window.location.search).get('filter') === 'all' ? 'all' : 'featured');

  document.addEventListener('mobile-nav-ready', () => {
    applyFilter(new URLSearchParams(window.location.search).get('filter') === 'all' ? 'all' : 'featured');
  });
})();
