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
        da,
        daDif,
        dat,
        ds,
        dx,
        dxx,
        dyy,
        dy,
        timelineTimerAdd,
        timelineTimerSubract,
        timelineTimerNoop,
        masterTimelineTimerAdd,
        masterTimelineTimerAddTidy,
        masterTimelineTimerSubtract,
        masterTimelineTimerSubtractTidy;


        //test to

        // 1. clone content object so as not to mutate
        // create a an new array/object e.g 0 - parent , 0 child 1, 0 child 2 , 1, top
        // 2. find and extract child elements save as part od array object
        // 3. extract child elements form main array and replace with tokens, save


        cc = contents.clone();

        /*
        / Function for serialising HTML Object
        */
        function serialise (obj) {
            cc2 = [];

            obj.each(function (index, any) {

                let $children = $(any).children();

                //set up
                cc2[index] = [];


                $children.each(function (indexi, item) {
                    //add child
                    cc2[index][indexi + 1] = item;

                    //substitute token
                    $(item).replaceWith("/" + (1 + indexi));
                })

                cc2[index][0] = any.innerHTML;

            })

            return {"content": cc2};

        }

        let scontent = serialise(cc);

        console.log("serialised object: \n", scontent);

        if (pausetarget) {
            $("#" + pausetarget).on("click", function (e) {
                e.preventDefault();
                console.log("pause:", !pause);
                pause = !pause;
            });
        }

        if (stoptarget) {
            $("#" + stoptarget).on("click", function (e) {
                e.preventDefault();
                console.log("stop:", exit);
                exit = !exit;
            });
        }

        let maxInDelay = Math.floor(((seconds * inTransPercent) * 1000) / (contents[count % contents.length].textContent.length));
        let textArray = contents[count % contents.length].textContent.split("");

        // get length
        let textArrayNewLength = scontent.content[[count % scontent.content.length]].length;
        // console.log("textArrayNewLength length", textArrayNewLength);

        let textArrayNew = scontent.content[[count % scontent.content.length]];
        // console.log("textArrayNew ", textArrayNew);
        // console.log("scontent ", scontent);


        // needs to be able to start everythng again immediately
        function reset() {
            clearTimeout(masterTimelineTimerAdd);
            clearTimeout(masterTimelineTimerAddTidy);
            clearTimeout(masterTimelineTimerSubtract);
            clearTimeout(masterTimelineTimerSubtractTidy);
            //
            clearTimeout(timelineTimerAdd);
            clearTimeout(timelineTimerSubract);
        }

        // add function
        function timeoutAdd() {
            timelineTimerAdd = setTimeout(function () {

                let text = elem.text();

                if (!keep && current < textArray.length ) {
                    elem.text(text + textArray[current]);
                    current++;
                }
                if (keep && current < textArray.length && count >= 0) {
                    if (textArray[current] !== undefined) {
                        elem.append(textArray[current]);
                    }

                    // console.log("current",current);
                    // console.log("count", count);

                    // console.log("scontent.content.length", scontent.content.length);

                    // console.log("count modulus scontent.content", (count % scontent.content.length));
                    // console.log("escaped character", textArrayNew[count % scontent.content.length][current] + textArrayNew[count % scontent.content.length][current + 1]);
                    // console.log(textArrayNew[count % scontent.content.length]);
                    // console.log(textArrayNew[count % scontent.content.length][current]);
                    // console.log(scontent.content[count % scontent.content.length][current]);



                    if ((count % scontent.content.length) <= textArrayNew[0].length &&  textArrayNew[0][current] === "/" ) {
                        // console.log("escaped character concat", textArrayNew[0][current] + textArrayNew[0][current + 1]);
                        // console.log("escaped character 2", textArrayNew[0][current + 1]);
                        // let text;
                        if (textArrayNew[0][current + 1] === "1") {

                            // console.log( textArrayNew);
                            // text = $(textArrayNew[1]).text();
                            // console.log("escaped character add wrapper 1", $(textArrayNew[1]).text(""));
                            // console.log("elem", elem);
                            // let $temp = $(textArrayNew[1]).text("");
                            // console.log("$temp", $temp);
                            // console.log("$temp 0", $temp[0]);
                            // elem.text(text + textArray[current]);
                            elem.append($(textArrayNew[1]).text(""));
                            // $(elem).append($temp);
                            // console.log(elem);
                        }

                        if (textArrayNew[0][current + 1] === "2") {
                            // text = $(textArrayNew[2]).text()
                            // console.log("escaped character add wrapper 2", $(textArrayNew[2]).text(""));

                            elem.append($(textArrayNew[1]).text(""));
                            // console.log(elem);

                            // console.log(text);

                        }
                        //put empty
                        // elem.append("<b>Appended text</b>");

                        // console.log(textArrayNew[count % scontent.content.length][current]);

                    }
                    current++;
                }
                if (current >= textArray.length) {
                    da = performance.now();
                    daDif = da - dx;
                    if (daDif >= (1000 * inTransPercent * seconds) - deviance ) {
                        daDif = 0;
                    }
                    if (dev) {
                        da = performance.now();
                        console.log("completed pt1 ", da - dx, "microseconds", "text", elem.text());
                    }

                    // elem.append(" <i>test</i>");
                    // console.log("elem 1", elem);
                    // console.log("elem.text()", elem.text());
                    // elem.append(" te");

                    // elem.text(elem.text() + " re");
                    // console.log("elem 2", elem);

                    clearInterval(timelineTimerAdd);
                    part2();
                    return;
                }

                if (!exit) {
                    clearInterval(timelineTimerAdd);
                    timeoutAdd();
                }

            }, (delay <= maxInDelay ? delay : maxInDelay));
        }

        let maxOutDelay = Math.floor(1000 * (seconds * outTransPercent) / elem.text().length);

        // subtract function
        function timeoutSubtract() {
            timelineTimerSubract = setTimeout(function () {

                //do stuff
                let tempText;
                if (elem.text().length > keep) {
                    tempText = elem.text().substring(0, elem.text().length - 1);
                }
                else {
                    tempText = elem.text();
                }

                if (current > 0 ) {
                    elem.text(tempText);
                    current--;
                }

                if (current <= keep) {
                    ds = performance.now();
                    dsDiff = ds - dat;
                    if (dsDiff >= (1000 * outTransPercent * seconds) - deviance) {
                        dsDiff = 0;
                    }
                    if (dev) {
                        console.log("completed pt3 ", ds - dx, "microseconds", "text", elem.text());
                    }
                    clearTimeout(timelineTimerSubract);
                    part4();
                    return;
                }

                if (!exit) {
                    clearInterval(timelineTimerSubract);
                    timeoutSubtract();
                }

            }, (delay <= maxOutDelay ? delay : maxOutDelay));
        }

        // noop
        function timelineNoop() {

            if (dev) {
                dxx = performance.now();
            }
            timelineTimerNoop = setTimeout(function () {

                if (!exit && !pause && vis()) {

                    if (dev) {
                        dyy = performance.now();
                        console.log("timeline Noop end for iterations dxx - dyy, count final", count, dyy - dxx, "microseconds");
                    }
                    // timeline();
                    clearTimeout(timelineTimerNoop);
                    //restart
                    timeline();
                    return;
                }
                if (!exit && (pause || !vis())) {
                    if (dev) {
                        dyy = performance.now();
                        console.log("timeline Noop for iterations dxx - dyy, count final", count, dyy - dxx, "microseconds");
                    }
                    timelineNoop();
                } if (exit) {
                    clearInterval(timelineTimerNoop);
                    return;
                };

            }, maxInDelay );
        }

        function part1() {

            // add clear on first run
            if (count < 1) {
                elem.text("");
            }

            masterTimelineTimerAdd = setTimeout(function () {
                if (!exit) {
                    // console.log(count);

                    timeoutAdd();
                } else {
                    clearTimeout(masterTimelineTimerAdd);
                   // part2();

                    // elem.text(text + "rest string");
                    return;
                };

            }, 0);
        }

        function part2() {
            masterTimelineTimerAddTidy = setTimeout(function () {

                let text = elem.text();

                if (text != contents[(count) % contents.length].textContent && count >= 1 && !exit && (vis() && !pause)) {
                    elem.text(contents[count % contents.length].textContent);
                    current = contents[count % contents.length].textContent.length;
                }

                dat = performance.now();
                if (dev) {
                    console.log("completed pt2", dat - dx, "microseconds", "text", elem.text());
                }

                part3();

                // end cycle if iterations starting is equal to items * iterations
                if (iterations && count >= contents.length * iterations) {
                    exit = true;
                    // denotes new iteration
                    clearTimeout(masterTimelineTimerAddTidy);
                    return;

                }

            }, Math.floor((1000 * inTransPercent * seconds) - deviance - daDif));
        }

        function part3() {
            masterTimelineTimerSubtract = setTimeout(function () {
                if (!exit) {
                    timeoutSubtract();
                } else {
                    clearTimeout(masterTimelineTimerSubtract);
                    return;
                };

            }, 0);

        }

        function part4() {

            masterTimelineTimerSubtractTidy = setTimeout(function () {

                let text = elem.text();
                // clean up if not using keep
                if (!keep && text && !exit && (vis() && !pause)) {
                    elem.text("");
                }
                // clean if we are using keep
                if (keep && text != contents[count % contents.length].textContent.substr(0, keep) && !exit && (vis() && !pause)) {
                    elem.text(contents[count % contents.length].textContent.substr(0, keep));
                }

                // set speed of next iteration if using 2nd speed parameter
                if (secondsout && count === 0) {
                    seconds = secondsout;
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
                    // console.log("scontent.content modulus", scontent.content[[count % scontent.content.length ]] );
                    // console.log("scontent.content", scontent.content);

                    textArrayNew = scontent.content[[count % scontent.content.length]];
                    // console.log("textArrayNew ", textArrayNew);

                    // denotes new iteration
                    if (dev) {
                        dy = performance.now();
                        console.log("completed pt4", dy - dx, "microseconds", "text", elem.text());
                    }
                    reset();
                    timeline();

                }
                if (!exit && (pause || !vis())) {

                    reset();
                    timelineNoop();
                }
                if (exit) {
                    return;
                };
            }, Math.floor((1000 * outTransPercent * seconds) - deviance - dsDiff));

        }

        function timeline() {

            // runs immediately
            dx = performance.now();

            if (dev) {
                dx = performance.now();
                console.log("count", count);
            }

            // add immediately - pt1
            // initial time set to seconds (which also depends on the value of secondOut) after first iteration
            part1();


        }
        //initial
        timeline();
    };

})(jQuery);
