
$(document).ready(function () {

  let $elements = $(".tt-holder .tt");

  let animatetext = function () {
    $(".ttt").tickerText($elements, 16, 3, 100, 1, 0.5, 2, false, "timerpause", "timerstop");
  };
  $(animatetext);

  // massaga variables
  $("#timerstart input[name='update']").on("click", function (e) {
    e.preventDefault();
    let keep = $('#timerstart').find('input[name="keep"]').val();
    let seconds = $('#timerstart').find('input[name="seconds"]').val();
    let delay = $('#timerstart').find('input[name="delay"]').val();
    let iterations = $('#timerstart').find('input[name="iterations"]').val();
    let secondsout = $('#timerstart').find('input[name="secondsout"]').val();

    animatetext = function () {
      $(".ttt").tickerText($elements, keep, seconds, delay, iterations, 0.9, secondsout, "timerpause", "timerstop");
    };
    setTimeout(function () {

      $(animatetext);

    }, 0);

  });
});