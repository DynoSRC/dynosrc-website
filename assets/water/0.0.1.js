(function () {

// Bail if we've already run.
if (window.WATER) {
  return;
}

var pet = document.querySelector('.pet');

if (!pet) {
  return;
}

pet.innerHTML += '<div class="water"></div>';

window.WATER = true;

})();
