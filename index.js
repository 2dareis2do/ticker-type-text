(function ($) {
/*
* contents => array object
* keep => integer on items to keep
* seconds => integer of seconds it takes to iterate through slide
* delay => integer of delay denoting milliseconds default = 20
* iterations => iterations for the array. 0 denotes infinite,
* ratio => ratio (float)
* secondsout => we can set the the speed of the second part
* pausetarget => string that is passed element to target for trigger e.g. input button
*/
    $.fn.writeText = function (contents, keep, seconds, delay = 20, iterations = 0, ratio, secondsout, pausetarget, stoptarget) {
    let current = 0,
      count = 0,
      deviance = 10,
      inTransPercent = ratio,
      outTransPercent = 1 - ratio,
      exit = false,
      elem = this,
      pause = false,
      initialTime = 0,
      d; // initialise

      if (pausetarget) {
          $("#" + pausetarget).on("click", function (e) {
              e.preventDefault();
              pause = !pause;
          });
      }

      if (stoptarget) {
          $("#" + stoptarget).on("click", function (e) {
              e.preventDefault();
              console.log("stop");
              exit = !exit;
          });
      }

    let maxInDelay = Math.floor(((seconds * inTransPercent) * 1000) / (contents[count % contents.length].textContent.length));
    let textArray = contents[count % contents.length].textContent.split("");

    let timeoutAddCount = 0;

    // recursive function
    function timeoutAdd() {
        setTimeout(function () {

            let text = elem.text();
            if (!keep && current < textArray.length) {
                elem.text(text + textArray[current]);
                current++
            }
                //first time load

            if (keep && current < textArray.length && count === 0) {
                if (textArray[current] !== undefined) {
                    elem.text(text + textArray[current]);
                }
                current++;
            }
                            //after first time

            if (keep && current < textArray.length && count > 0) {
                if (textArray[current] !== undefined) {
                    elem.text(text + textArray[current]);
                }
                current++;
            }

            // console.log("current add", current)
            if (!keep && timeoutAddCount >= contents[count % contents.length].textContent.length) {
                // we can do error checking here
                //reset add count
                timeoutAddCount = 0;
                // current = 0;
                return;
            }
            if (keep && timeoutAddCount >= contents[count % contents.length].textContent.length && count === 0) {
                // we can do error checking here
                //reset add count
                timeoutAddCount = 0;
                // current = 0;
                return;
            }

            if (keep && timeoutAddCount >= contents[count % contents.length].textContent.length - keep && count > 0) {
                //reset add count
                timeoutAddCount = 0;
                // current = 0;
                return;
            }

            timeoutAddCount++;

            if (!exit) {
                timeoutAdd();
            }

        }, (delay <= maxInDelay ? delay : maxInDelay));
    }

    let timeoutSubtractCount = 0;
    let maxOutDelay = Math.floor(1000 * (seconds * outTransPercent) / elem.text().length);

    // recursive function
    function timeoutSubtract() {
        setTimeout(function () {
            //do stuff

            let temp = elem.text().substring(0, current);

            if (keep && current > keep) {
                elem.text(temp);
                current--;
            }

            if (!keep && current > keep) {
                elem.text(temp);
                current--;
            }

            if (!keep && timeoutSubtractCount >= contents[count % contents.length].textContent.length) {
                timeoutSubtractCount = 0;
                elem.text(temp);
                return;
            }

            if (keep && timeoutSubtractCount + keep >= contents[count % contents.length].textContent.length) {
                timeoutSubtractCount = 0;
                elem.text(temp);
                return;
            }

            timeoutSubtractCount++;

            if (!exit) {
                timeoutSubtract();
            }

        }, (delay <= maxOutDelay ? delay : maxOutDelay));
    }

    function timeout() {
        setTimeout(function () {
            if (count === 0 ){
                initialTime = seconds;

            }

            d = new Date();

            // start add immediately
            setTimeout(function () {
                var start = new Date();

                console.log("start inside, count", count, start.getTime() - d.getTime(), "microseconds");
                if (!exit) {
                    timeoutAdd();
                } else { return };

            }, 0);

            // add first part tidy up (nested in second part (transition out)) nested
            setTimeout(function () {
                var tidy = new Date();

                console.log("start tidy, count", count, tidy.getTime() - d.getTime(), "microseconds");

                // end cycle if iterations statrting is equal to items * iterations
                if (iterations && count >= contents.length * iterations) {
                    exit = true;
                    console.log("exit");
                    console.log(elem.text());
                    return;
                }
                if (elem.text() != contents[(count) % contents.length].textContent && count === 0) {
                    elem.text(contents[(count) % contents.length].textContent);
                    current = contents[count % contents.length].textContent.length;
                    // var firstend = new Date();
                    // console.log("first part end, count", count, firstend.getTime() - d.getTime(), "microseconds");
                }

                if (elem.text() != contents[(count) % contents.length].textContent && count > 1) {
                    // console.log("reset text add > 0", "contents[(count) % contents.length].textContent", contents[(count) % contents.length].textContent, "elem.text()", elem.text());
                    elem.text(contents[count % contents.length].textContent);
                    current = contents[count % contents.length].textContent.length;
                    // firstend = new Date();
                    // console.log("first part end, count", count, firstend.getTime() - d.getTime(), "microseconds");
                }

            }, Math.floor((1000 * inTransPercent * seconds) - deviance));

            // remove or subtract - transition out (part 2)
            setTimeout(function () {

                var second = new Date();
                console.log("second start, count", count, second.getTime() - d.getTime(), "microseconds");

                if (!exit) {
                    timeoutSubtract();
                } else { return };


            }, Math.floor(1000 * inTransPercent * seconds));

            // last part tidy up  (transition out))
            setTimeout(function () {
                // clean up if not using keep
                if (!keep && elem.text() && !pause && vis() && !exit) {

                    elem.text("");
                }
                // clean if we are using keep
                if (keep && elem.text() != contents[count % contents.length].textContent.substr(0, keep) && !pause && vis() && !exit) {
                    elem.text(contents[count % contents.length].textContent.substr(0, keep));
                }

                // set speed of next iteration is set do this last after previous calculations
                if (secondsout && count === 0) {
                    seconds = secondsout;
                    initialTime = seconds;

                }

                var lastend = new Date();
                console.log("second part end, count", count, lastend.getTime() - d.getTime(), "microseconds");

                // count incremented to denote a cycyle
                if (!exit && !pause && vis()) {
                    count++;

                // update text array after count increment
                    textArray = contents[count % contents.length].textContent.split("");
                    maxInDelay = Math.floor(((seconds * inTransPercent) * 1000) / (contents[count % contents.length].textContent.length));
                    maxOutDelay = Math.floor(1000 * (seconds * outTransPercent) / elem.text().length);
                }
                // console.log("textArray updated end", textArray);

                if (!exit && !pause && vis()) {
                    // denotes new iteration
                    // d = new Date();
                    var dy = new Date();
                    console.log("dx -dy, count", count, dy.getTime() - dx.getTime(), "microseconds");
                    timeout();
                    dx = new Date();

                }
                if (!exit && (pause || !vis())) {
                    timeoutNoop();
                } else { return };
                // textArray = contents[count % contents.length].textContent.split("");
            }, Math.floor((1000 * seconds) - deviance));

        }, initialTime );
    }

    function timeoutNoop() {

        setTimeout(function () {

            if (!exit && !pause && vis()) {


                timeout();

            }
            if (!exit && (pause || !vis())) {
            //   console.log("noop02 inside vis", vis());
                timeoutNoop();
            } else {
                return; };

        }, seconds * 1000);
    }

  if (!exit && !pause && vis()) {
                var dx = new Date()
                timeout();

            }

    else {
        console.log("return outer");
        return; };

  };

})(jQuery);

/////////////////////////////////////////
// main visibility API function
// check if current tab is active or not
var vis = (function () {
    var stateKey,
        eventKey,
        keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

$(document).ready(function () {

    let $elements = $(".tt-holder .tt");
    let keep = $('#timerstart').find('input[name="keep"]').val();
    let seconds = $('#timerstart').find('input[name="seconds"]').val();
    let delay = $('#timerstart').find('input[name="delay"]').val();
    let iterations = $('#timerstart').find('input[name="iterations"]').val();
    // console.log(iterations);
    let secondsout = $('#timerstart').find('input[name="secondsout"]').val();

    let animatetext = function () {
        $(".ttt").writeText($elements, 0, 2, 20, 1, 0.7, 3, "timerpause", "timerstop");
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

        // console.log("keep", keep);

        animatetext = function () {
            $(".ttt").writeText($elements, keep, seconds, delay, iterations, 0.9, secondsout, "timerpause", "timerstop");
            // $(".ttt").writeText($elements, 17, 2, 50, 2, 0.7, 3, "timerpause", "timerstop");

        };
        setTimeout(function () {

        $(animatetext);

        }, 0);

        // pause = !pause;
    });
});

