document.addEventListener('DOMContentLoaded', function() {
  var els = document.querySelectorAll('.obf-email');
  els.forEach(function(el) {
    var u = el.getAttribute('data-u');
    var d = el.getAttribute('data-d');
    var addr = u + '@' + d;
    el.innerHTML = '<a href="mailto:' + addr + '">' + addr + '</a>';
  });
});
