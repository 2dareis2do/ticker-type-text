(function ($) {
    /*
    * @param (array) contents of text elments or nodes
    * @param (integer) keep denotes the number characters to keep when transitionong out
    * @param (integer) seconds it takes to iterate through slide
    * @param (integer) delay number of milliseconds delay between hiding and showing each character default = 20
    * @param (integer) iterations for the text ticker to cycle through all elements. 0 denotes infinite,
    * @param (float) ratio used for setting both when transition in and out starts
    * @param (integer) secondsout so we can set the the speed of the second part if using keep
    * @param (boolean) dev mode boolean (false by default)
    * @param (string) pausetarget element to target for trigger e.g. input button
    * @param (string) stoptarget element to target for trigger e.g. input button
    * @return null
    */
    $.fn.tickerText = function (contents, keep, seconds, delay = 20, iterations = 0, ratio, secondsout, dev = false, pausetarget, stoptarget) {
        let current = 0, //state
        count = 0, //state
        deviance = 20,
        inTransPercent = ratio,
        outTransPercent = 1 - ratio,
        exit = false,
        elem = this,
        pause = false,
        initialTime = 0,
        dx,
        dy;

        if (pausetarget) {
            $("#" + pausetarget).on("click", function (e) {
                e.preventDefault();
                console.log("pause pressed", !pause);
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

        // add function
        function timeoutAdd() {
            setTimeout(function () {

                let text = elem.text();
                if (!keep && current < textArray.length) {
                    elem.text(text + textArray[current]);
                    current++;
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
                if (!keep && current >= textArray.length) {
                    return;
                }
                if (keep && current >= textArray.length) {
                    return;
                }

                if (!exit) {
                    timeoutAdd();
                }

            }, (delay <= maxInDelay ? delay : maxInDelay));
        }

        let maxOutDelay = Math.floor(1000 * (seconds * outTransPercent) / elem.text().length);

        // subtract function
        function timeoutSubtract() {
            setTimeout(function () {
                //do stuff
                let tempText;
                if (elem.text().length > keep) {
                    tempText = elem.text().substring(0, elem.text().length - 1);
                } else {
                    tempText = elem.text();
                }

                if (keep && current > keep ) {
                    elem.text(tempText);
                    current--;
                }

                if (!keep && current > 0) {
                    elem.text(tempText);
                    current--;
                }

                if (!keep && current === 0) {
                    return;
                }

                if (keep && current <= keep) {
                    return;
                }

                if (!exit) {
                    timeoutSubtract();
                }

            }, (delay <= maxOutDelay ? delay : maxOutDelay));
        }

        // noop
        function timelineNoop() {

            if (dev) {
                dx = performance.now();
            }
            setTimeout(function () {

                if (!exit && !pause && vis()) {
                    if (dev) {
                        dx = performance.now();
                    }

                    timeline();
                }
                if (!exit && (pause || !vis())) {
                    if (dev) {
                        var dx = performance.now();
                        console.log("timelineNoop timelineNoop  for iterations dx - dy, count final", count, dy - dx, "microseconds");
                    }

                    timelineNoop();
                } else {
                    return;
                };

            }, 0 );
        }

        function timeline() {
            setTimeout(function () {

                // if (dev) { d = performance.now(); }
                if (dev) {
                    dx = performance.now();
                    console.log("count", count);
                }
                // start add immediately
                setTimeout(function () {
                    if (!exit) {
                        timeoutAdd();
                    } else { return };

                }, 0);

                // add first part tidy up (transition out)
                setTimeout(function () {

                    let text = elem.text();

                    if (text != contents[(count) % contents.length].textContent && count === 0 && !exit) {
                        elem.text(contents[(count) % contents.length].textContent);
                        current = contents[count % contents.length].textContent.length;
                    }

                    if (text != contents[(count) % contents.length].textContent && count > 1 && !exit) {
                        elem.text(contents[count % contents.length].textContent);
                        current = contents[count % contents.length].textContent.length;
                    }

                    // end cycle if iterations starting is equal to items * iterations
                    if (iterations && count >= contents.length * iterations) {
                        exit = true;
                        // denotes new iteration
                        if (dev) {
                            dy = performance.now();
                            console.log("time for last iteration, keep", dy - dx, "microseconds", "text", elem.text()); }

                        return;
                    }

                }, Math.floor((1000 * inTransPercent * seconds) - deviance));

                // remove or subtract - transition out (part 2)
                setTimeout(function () {

                    if (!exit) {
                        timeoutSubtract();
                    } else { return };

                }, Math.floor(1000 * inTransPercent * seconds));

                // last part tidy up (transition out))
                setTimeout(function () {

                    let text = elem.text();
                    // clean up if not using keep
                    if (!keep && text && !exit) {
                        elem.text("");
                    }
                    // clean if we are using keep
                    if (keep && text != contents[count % contents.length].textContent.substr(0, keep) && !exit) {
                        elem.text(contents[count % contents.length].textContent.substr(0, keep));
                    }

                    // set speed of next iteration is set do this last after previous calculations
                    if (secondsout && count === 0) {
                        seconds = secondsout;
                        initialTime = seconds;
                        // update maxInDelay
                        maxInDelay = Math.floor(((seconds * inTransPercent) * 1000) / (contents[count % contents.length].textContent.length));
                        // update maxutDelay
                        maxOutDelay = Math.floor(1000 * (seconds * outTransPercent) / text.length);
                    }

                    // count incremented to denote a cycle
                    if (!exit && (!pause || vis())) {
                        // lets make sure we increase the count to make sure we select the right text
                        count++;

                        // update text array after count increment
                        textArray = contents[count % contents.length].textContent.split("");

                        // denotes new iteration
                        if (dev) {
                            dy = performance.now();
                            console.log("time for iteration",  dy - dx, "microseconds", "text", elem.text());
                        }

                        // recurse
                        // console.log("this.text vs elem.text()", this,  elem.text());

                        timeline();

                    }
                    if (!exit && (pause || !vis())) {

                        if (dev) {
                            dx = performance.now();
                        }
                        timelineNoop();
                    }
                    else {
                        return;
                    };
                }, Math.floor((1000 * seconds) - deviance));

            }, initialTime );
        }

        //init
        timeline();
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

    let animatetext = function () {
        $(".ttt").tickerText($elements, 16, 3, 30, 1, 0.5, 2, true, "timerpause", "timerstop");
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

