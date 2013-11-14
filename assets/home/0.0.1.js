$(document).ready(function() {

  //Scroll the shit
  $('#how-it-works-btn').click(function() {
    $('html, body').animate({
        scrollTop: $('#how-it-works').offset().top
    }, 1000);
  });

  $('#benefits-btn').click(function() {
    $('html, body').animate({
        scrollTop: $('#benefits').offset().top
    }, 1000);
  });


  // benchmarkStuffz
  var benchmarkSetup = {
    'req': {
      'el': "#bench-req",
      'text': 'The average site has 17 HTTP requests for JS. With DynoSRC, you can trim this down to just 1, or even 0 if you\'re crazy.',
      'dynoOffset': 10,
      'baseOffset': 1,
      'dynoText': '1 request',
      'baseText': '17 requests'
    },
    'band': {
      'el': "#bench-band",
      'text': 'A deploy of jQuery patch release would  typically mean serving a new ~250kb file, but the diff is likely to be ~50kb.',
      'dynoOffset': 8,
      'baseOffset': 3,
      'dynoText': '54Kb',
      'baseText': '254Kb'
    },
    'cache': {
      'el': "#bench-cache",
      'text': 'You\'ll never now what state the cache is in and the data that you stored there may have been evicted by the browser to accommodate other data. That wouldn\'t happen with DynoSRC.',
      'dynoOffset': 1,
      'baseOffset': 12,
      'dynoText': 'I SEE ALL',
      'baseText': '???'
    }
  },
  $activeBench = $(),
  $dyno = $('.padding-controller'),
  $dynoBase = $('.padding-controller-base'),
  $benchDesc = $('.bench-desc');

  function animateDynoHeads(bench){
    $dyno.animate({ marginTop: bench.dynoOffset * 25 + 'px'}, 750);
    $dyno.find('.header').fadeOut(function(){
      $(this).text(bench.dynoText).fadeIn();
    });
    $dynoBase.animate({ marginTop: bench.baseOffset * 25 + 'px'}, 750);
    $dynoBase.find('.header').fadeOut(function(){
      $(this).text(bench.baseText).fadeIn();
    });
    $benchDesc.fadeOut(function(){
      $(this).text(bench.text).fadeIn();
    });
  }

  function handleBenchClick(element){
    var $element = $(element),
        clickedBench = benchmarkSetup[$element.attr('bench')];
    if($element.is($activeBench)) return;

    $element.toggleClass('active');
    $activeBench.toggleClass('active');

    animateDynoHeads(clickedBench);


    $activeBench = $element;

  }

  $.each(benchmarkSetup, function(bench){
    $('i[bench=' + bench + ']').click(function(){
      handleBenchClick(this);
    });
  });

});

