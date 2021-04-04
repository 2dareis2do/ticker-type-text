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
      deviance = 1000,
      inTransPercent = ratio,
      outTransPercent = 1 - ratio,
      exit = false,
      elem = this,
      pause = false;

        console.log("current", current)

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

    // part 2 starts after 'seconds' parameter

    let maxInDelay = Math.floor(((seconds * inTransPercent) * 1000) / (contents[count % contents.length].textContent.length));
    // console.log("maxInDelay", maxInDelay);
    let textArray = contents[count % contents.length].textContent.split("");

    let timeoutAddCount = 0;

     // recursive function
    function timeoutAdd() {
        setTimeout(function () {
            // var dAdd = new Date();

            //do stuff
            let text = elem.text();
            if (!keep && current < textArray.length && !keep) {
                elem.text(text + textArray[current++]);
            }
            // console.log("elem.text() pre", text, "keep", keep, "keep + current", keep + current, "textArray.length" , textArray.length);

            if (keep && current < textArray.length && count === 0) {
                // console.log("elem.text()", elem.text());
                //first time load
                if (textArray[current] !== undefined) {
                    elem.text(text + textArray[current++]);
                    // current++;
                }
            }
            if (keep && current < textArray.length && count > 0) {
                // console.log("add keep > 0", current);
                //after first time
                if (textArray[current] !== undefined) {
                    elem.text(text + textArray[current]);

                }
                current++;

            }

            console.log("current add", current)
            if (!keep && timeoutAddCount >= contents[count % contents.length].textContent.length) {
                // we can do error checking here

                // if (keep && elem.text() != contents[(count) % contents.length].textContent) {
                //     console.log("reset text add", "contents[(count) % contents.length].textContent", contents[(count) % contents.length].textContent, "elem.text()", elem.text());
                //     elem.text(contents[(count) % contents.length].textContent);
                // }
                //reset add count
                timeoutAddCount = 0;
                // current = 0;
                return;
            }
            if (keep && timeoutAddCount >= contents[count % contents.length].textContent.length && count === 0) {
                // we can do error checking here

                // if (elem.text() != contents[(count) % contents.length].textContent) {
                //     console.log("reset text add === 0", "contents[(count) % contents.length].textContent", contents[(count) % contents.length].textContent, "elem.text()", elem.text());
                //     elem.text(contents[(count) % contents.length].textContent);
                // }
                //reset add count
                timeoutAddCount = 0;
                // current = 0;
                return;
            }

            if (keep && timeoutAddCount >= contents[count % contents.length].textContent.length - keep && count > 0) {
                // we can do error checking here

                // if (elem.text() != contents[(count) % contents.length].textContent) {
                //     console.log("reset text add > 0", "contents[(count) % contents.length].textContent", contents[(count) % contents.length].textContent, "elem.text()", elem.text());
                //     elem.text(contents[count % contents.length].textContent);
                //     current = contents[count % contents.length].textContent.length;
                // }
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
            // console.log("current inside subtract", current);
            let temp = elem.text().substring(0, current);

            if (keep && current > keep) {
                // console.log("keep", elem.text(), elem.text().substring(0, elem.text().length - 1), "elem.text().length", elem.text().length - 1);
                elem.text(temp);
                // console.log("current inside subtract 2", current);

                current--;
                // console.log("current inside subtract 3", current);

            }
            // else {
                // current = elem.text().length--;
                // console.log("current inside subtract", current);

            if (!keep && current > keep) {
                elem.text(temp);
                current--;
            }
            // }

            // console.log("current subtract", current, " timeoutSubtractCount", timeoutSubtractCount, "elem", temp)


            if (!keep && timeoutSubtractCount >= contents[count % contents.length].textContent.length) {
                timeoutSubtractCount = 0;
                elem.text(temp);
                // current = 0;
                return;
            }

            if (keep && timeoutSubtractCount + keep >= contents[count % contents.length].textContent.length) {
                timeoutSubtractCount = 0;
                elem.text(temp);
                // current = 0;
                return;
            }

            timeoutSubtractCount++;

            // console.log("timeoutSubtractCount", timeoutSubtractCount);

            if (!exit) {
                timeoutSubtract();
            }

        }, (delay <= maxOutDelay ? delay : maxOutDelay));
    }

    function timeout() {
        setTimeout(function () {
            // Do Something Here

            if (!exit) {
                timeoutAdd();
            } else { return };

            // lets add another part for add clean up

            // add last part tidy up (nested in second part (transition out)) nested
            setTimeout(function () {
                // clean up if not using keep
                // if (!keep && elem.text() && !pause && vis()) {

                //     elem.text("");
                // }

                if (elem.text() != contents[(count) % contents.length].textContent && count === 0) {
                    // console.log("reset text add === 0", "contents[(count) % contents.length].textContent", contents[(count) % contents.length].textContent, "elem.text()", elem.text());
                    elem.text(contents[(count) % contents.length].textContent);
                    current = contents[count % contents.length].textContent.length;

                }

                if (elem.text() != contents[(count) % contents.length].textContent && count > 1) {
                    // console.log("reset text add > 0", "contents[(count) % contents.length].textContent", contents[(count) % contents.length].textContent, "elem.text()", elem.text());
                    elem.text(contents[count % contents.length].textContent);
                    current = contents[count % contents.length].textContent.length;
                }
                // clean if we are using keep
                // if (keep && elem.text() != contents[count % contents.length].textContent.substr(0, keep) && !pause && vis()) {
                //     elem.text(contents[count % contents.length].textContent.substr(0, keep));
                // }

                // var d2b = new Date();
                // console.log("d2 - d2b subtract completed in ", d2b.getTime() - d.getTime(), "microseconds");
                // set speed of next iteration is set do this last after previous calculations
                // if (secondsout && count === 0) {
                //     console.log("check secondsout")
                //     seconds = secondsout;
                // }

                // reset current
                // current = 0;
                // count incremented to denote a cycyle
                // count++;
                // console.log("count timeout ++", count)
            }, Math.floor((1000 * inTransPercent * seconds) - deviance));

            // remove or subtract - transition out part 2
            setTimeout(function () {


                // this is incremented in part 2 after we add (before of subtract)
                // count++;
                // console.log("count timeout ++", count)
                // exit before
                if (iterations && count > contents.length * iterations) {
                    exit = true;
                    return;
                }

                if (!exit) {
                    // current = 0;

                    timeoutSubtract();
                } else { return };

                // last part tidy up (nested in second part (transition out)) nested
                setTimeout(function () {
                    // clean up if not using keep
                    if (!keep && elem.text() && !pause && vis()) {

                        elem.text("");
                    }
                    // clean if we are using keep
                    if (keep && elem.text() != contents[count % contents.length].textContent.substr(0, keep) && !pause && vis()) {
                        elem.text(contents[count % contents.length].textContent.substr(0, keep));
                    }

                    var d2b = new Date();
                    // console.log("d2 - d2b subtract completed in ", d2b.getTime() - d.getTime(), "microseconds");
                    // set speed of next iteration is set do this last after previous calculations
                    if (secondsout && count === 0) {
                        console.log("check secondsout")
                        seconds = secondsout;
                    }

                    // reset current
                    // current = 0;
                    // count incremented to denote a cycyle
                    count++;
                    console.log("count timeout ++", count);
                    textArray = contents[count % contents.length].textContent.split("");
                    // textArray = contents[count % contents.length].textContent.split("");
                }, Math.floor((1000 * outTransPercent * seconds) - deviance));

                if (!exit && !pause && vis()) {

                    var d1 = new Date();
                    console.log("d1 - d - first part add", d1.getTime() - d.getTime(), "microseconds");
                    d = new Date();
                    timeout();
                                        // var d = new Date();

                }
                if (!exit && (pause || !vis()) ) {
                    // console.log("noop02 vis", vis());
                    timeoutNoop();
                } else { return };

            }, Math.floor(1000 * inTransPercent * seconds));


        }, (count === 0 ? 0 : (seconds * 1000)) );
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

    if (!exit && !pause) {
        // var d = new Date();
        // console.log("date d");
        var d = new Date();
        console.log("timer d - 0");
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
        $(".ttt").writeText($elements, 17, 10, 200, 0, 0.5, 10, "timerpause", "timerstop");
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
            // $(".ttt").writeText($elements, keep, seconds, delay, iterations, 0.7, secondsout, "timerpause", "timerstop");
            $(".ttt").writeText($elements, 17, 2, 50, 2, 0.7, 3, "timerpause", "timerstop");

        };
        setTimeout(function () {

        $(animatetext);

        }, 0);

        // pause = !pause;
    });
});

