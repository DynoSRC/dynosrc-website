(function () {

// Bail if we've already run.
if (window.LEASH) {
  return;
}

var pet = document.querySelector('.pet');

if (!pet) {
  return;
}

pet.innerHTML += '<div class="leash"></div>';

window.LEASH = true;

})();
