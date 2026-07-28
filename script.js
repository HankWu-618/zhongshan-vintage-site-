document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.topnav-toggle');
  var menu = document.querySelector('.topnav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var winnersTableBody = document.querySelector('[data-winners-body]');
  if (winnersTableBody) {
    fetch('winners.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var monthLabel = document.querySelector('[data-winners-month]');
        if (monthLabel && data.month) monthLabel.textContent = data.month;

        winnersTableBody.innerHTML = '';
        (data.winners || []).forEach(function (w) {
          var tr = document.createElement('tr');
          tr.innerHTML =
            '<td>' + w.prize + '</td>' +
            '<td>' + w.name + '</td>' +
            '<td>' + w.contact + '</td>';
          winnersTableBody.appendChild(tr);
        });
      })
      .catch(function () {
        winnersTableBody.innerHTML =
          '<tr><td colspan="3">名單載入中，請稍後再試。</td></tr>';
      });
  }
});
