
$(document).ready(function () {

    let $elements = $(".tt-holder .tt");

    // let animatetext = function () {
    //   $(".ttt").tickerText($elements, 16, 3, 100, 1, 0.5, 2, false, "timerpause", "timerstop");
    // };
    // $(animatetext);

    // massage variables
    $("#timerstart input[name='start']").on("click", function (e) {
        e.preventDefault();
        let keep = parseInt($('#timerstart').find('input[name="keep"]').val());
        let seconds = $('#timerstart').find('input[name="seconds"]').val();
        let delay = $('#timerstart').find('input[name="delay"]').val();
        let iterations = parseInt($('#timerstart').find('input[name="iterations"]').val());
        let secondsout = parseInt($('#timerstart').find('input[name="secondsout"]').val());
        let ratio = $('#timerstart').find('input[name="ratio"]').val()/100;
        let dev = $('#timerstart').find('input[name="dev"]').is(':checked');
        // console.log("dev", dev);
        animatetext = function () {
        $(".ttt").tickerText($elements, keep, seconds, delay, iterations, ratio, secondsout, dev, "timerpause", "timerstop");
        };
        setTimeout(function () {

        $(animatetext);

        }, 0);

    });
});