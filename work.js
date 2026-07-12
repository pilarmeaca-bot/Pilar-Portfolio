(function () {
  const filterButtons = document.querySelectorAll('[data-work-filter]');
  const workItems = document.querySelectorAll('.work-item, .work-pair');
  const workGrid = document.querySelector('.work-grid');
  const comingSoon = document.getElementById('work-coming-soon');

  function applyFilter(filter) {
    const isAll = filter === 'all';

    document.body.classList.toggle('work-filter-all', isAll);

    if (isAll) {
      if (workGrid) workGrid.hidden = true;
      if (comingSoon) comingSoon.hidden = false;
    } else {
      if (workGrid) workGrid.hidden = false;
      if (comingSoon) comingSoon.hidden = true;

      workItems.forEach((item) => {
        item.hidden = item.dataset.featured !== 'true';
      });
    }

    filterButtons.forEach((button) => {
      const isActive = button.dataset.workFilter === filter;
      button.classList.toggle('nav__link--active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    const url = new URL(window.location.href);
    if (isAll) url.searchParams.set('filter', 'all');
    else url.searchParams.delete('filter');
    window.history.replaceState({}, '', url);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.workFilter);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  applyFilter(new URLSearchParams(window.location.search).get('filter') === 'all' ? 'all' : 'featured');
})();
