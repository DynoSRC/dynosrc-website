(function () {

function updateDiffisplay (diff) {
  var diffHeader = document.querySelector('.diff-header'),
      diffBody = document.querySelector('.diff-body');

  diffBody.innerHTML = diff;
  diffHeader.style.display = 'block';
  diffBody.style.display = 'block';
}

function updateVersionDisplay (module) {
  var currentRev = dynoSrc.getRevision(module),
      tr = document.querySelector('.' + module),
      versionTd = tr.querySelector('.version');

  versionTd.innerHTML = currentRev;
}

function onReload () {
  window.location.reload();
}

var modules = ['foo', 'bar', 'derp'],
    reload = document.querySelector('.btn');

modules.forEach(function (module) {
  var currentRev = dynoSrc.getRevision(module),
      select = document.querySelector('.' + module + ' select');

  if (currentRev) {
    updateVersionDisplay(module);
    dynoSrc.load(module);
  }

  select.addEventListener('change', function (e) {
    dynoSrc.fetch(module, e.target.value, function (moduleSrc, diff) {
      updateVersionDisplay(module);
      updateDiffisplay(diff);
    });
  }, false);

  select.disabled = false;
});

reload.addEventListener('click', onReload, false);

})();
