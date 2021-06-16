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

        let currentChild = 0;
        let childLength = 0;
        let childCharCounted = 0;
        let childCounted = 0;


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
        // console.log("textArray", textArray);

        // get length
        // let textArrayNewLength = scontent.content[[count % scontent.content.length]].length;

        let textArrayNew = scontent.content[count % scontent.content.length];
        // console.log("textArrayNew", textArrayNew);
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

                // let text = elem.text();
                console.log(" - current", current);


                if (!keep && current < textArray.length ) {
                    // elem.text(text + textArray[current]);
                    elem.append(textArray[current]);
                    current++;
                }
                if (keep && current < textArray.length && count >= 0 ) {

                    // console.log(" - current", current);
                    // console.log("currentChild", currentChild);
                    // console.log("childCharCounted", childCharCounted);

                    // console.log("textArray[current]", textArray[current]);
                    // console.log("currentChild", currentChild);
                    // console.log("current, textArray[current], currentChild, textArrayNew[0][current - childCharCounted, childCounted, (textArrayNew[0][current - childCharCounted - childCounted - 1] ", current, textArray[current], currentChild, textArrayNew[0][current - childCharCounted], childCounted, textArrayNew[0][current - childCharCounted - childCounted - 1] )
                    console.log("textArray[current], textArrayNew[0][current - childCharCounted - childCounted - 1]", textArray[current],
                    textArrayNew[0],
                    textArrayNew[0][current - childCharCounted + childCounted],
                        textArrayNew[0][current - childCharCounted + (2* childCounted)],

                    // textArrayNew[0][current - childCharCounted + (childCounted * 2)],
                    current - childCharCounted + childCounted ,
                    elem.html()
                    )
                    // need to figure out how to handle n in /1 /2
                    // in a way the number has no significance ans we can determine

                    console.log("textArrayNew[0][current - childCharCounted + childCounted]", textArrayNew[0][current - childCharCounted + childCounted]);
                    console.log("textArrayNew[0][current - childCharCounted + childCounted]", textArrayNew[0][current - childCharCounted + (2* childCounted)]);

                    if (textArray[current] !== undefined && (textArrayNew[0][current - childCharCounted + (2* childCounted)] !== "/") && currentChild === 0) {
                        elem.append(textArray[current]);
                        console.log("ele.html()", elem.html());

                    }

                    if (textArrayNew[0][current - childCharCounted + (2 * childCounted) ] === "/" )  {
                        // 1
                        if (textArrayNew[0][current + 1 - childCharCounted] === "1") {

                            if (currentChild === 0){
                                currentChild = 1;
                                childLength = $(textArrayNew[1]).text().length;
                                $(textArrayNew[1]).text("");
                                elem.append(textArrayNew[1]);
                                console.log("ele.html()", elem.html());

                            }

                            elem.children()[0].append(textArray[current]);
                            console.log("ele.html()", elem.html());

                            childLength = childLength - 1;

                            childCharCounted = childCharCounted + 1;
                            console.log("childCharCounted", childCharCounted);

                            if (childLength === 0) {
                                currentChild = 0;
                                childCounted = childCounted + 1;
                            }

                        }
                        // 2
                        if (textArrayNew[0][current + 1 - childCharCounted + (2 * childCounted)] === "2" ) {
                            // console.log("textArrayNew[0][current + 1 - childCharCounted]", textArrayNew[0][current + 1 - childCharCounted])
                            if (currentChild === 0) {
                                currentChild = 2;
                                childLength = $(textArrayNew[2]).text().length;
                                $(textArrayNew[2]).text("");
                                elem.append(textArrayNew[2]);
                                console.log("ele.html()", elem.html());

                            }
                            elem.children()[1].append(textArray[current]);
                            console.log("ele.html()", elem.html());

                            childLength = childLength - 1;

                            childCharCounted = childCharCounted + 1;
                            console.log("childCharCounted", childCharCounted);
                            // if (childLength > 0) {
                            //     // console.log("pt 2 choldLength", childLength);
                            //     // childCharCounted = childCharCounted + 1;
                            //     // console.log("childCharCounted", childCharCounted);

                            // }
                            if (childLength === 0) {
                                currentChild = 0;
                                childCounted = childCounted + 1;
                            }
                        }
                        //put empty

                    }
                    // console.log(" - childCharCounted", childCharCounted);

                    // console.log("current - childCharCounted", current - childCharCounted);

                    console.log("currentChild", currentChild);
                    console.log("childCharCounted", childCharCounted);

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
                    // console.log("childCharCounted", childCharCounted);
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
            console.log(" - current", current);
            console.log("currentChild", currentChild);
            console.log("childCharCounted", childCharCounted);

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
                    // elem.text(tempText);
                    console.log("current", current, );
                    // console.log("last but one", textArrayNew[0][current - childCharCounted + childCounted - 2 ]);
                    // console.log("last char", textArrayNew[0][current - childCharCounted + childCounted - 1]);
                    // console.log("elm", elem);
                    // iterate through textArrayNew in reverse order using current as index

                    console.log("subtract before beginning textArrayNew[0], textArray[current], extArrayNew[0][current - childCharCounted + childCounted - 2",
                        textArrayNew[0],
                        textArray[current],
                        // textArray[current - childCounted], current - childCharCounted + childCounted - 2,
                        textArrayNew[0][current - childCharCounted + childCounted - 1],
                        textArrayNew[0][current - childCharCounted + (2 *childCounted) - 2],

                        textArrayNew[0][current - childCharCounted + childCounted - 2],
                        textArrayNew[0][current - childCharCounted + childCounted - 3],
                        // textArrayNew[0][current - childCharCounted + childCounted - 4],
                        elem.html()
                    );
                    //child
                    if (textArrayNew[0][current - childCharCounted + (2* childCounted) - 2] === "/") {

                        console.log("subtract beginning textArrayNew[0], textArray[current], extArrayNew[0][current - childCharCounted + childCounted - 2",
                        textArrayNew[0],
                        textArray[current],
                            // textArray[current - childCounted], current - childCharCounted + childCounted - 2,
                            textArrayNew[0][current - childCharCounted + childCounted - 1],
                            textArrayNew[0][current - childCharCounted + (2 * childCounted) - 2],

                            textArrayNew[0][current - childCharCounted + childCounted - 2],
                            textArrayNew[0][current - childCharCounted + childCounted - 3],
                            // textArrayNew[0][current - childCharCounted + childCounted - 4],
                              elem.html()
                             );
                        // console.log("elem.children ", elem.children());
                        // console.log("elem.children length ", elem.children().length);

                        // 1
                        if (textArrayNew[0][current - childCharCounted + (2 * childCounted) - 1] === "1") {
                            // console.log("elem.children [0]", elem.children()[0]);
                            let string = $(elem.children()[0]).text();
                            let shorterString = string.substring(0, string.length - 1)
                            $(elem.children()[0]).text(shorterString);
                            // console.log("ele.html()", elem.html());

                            // console.log("childCharCounted", childCharCounted);

                            childCharCounted = childCharCounted - 1;
                            // console.log("childCharCounted", childCharCounted);

                            childLength = childLength - 1;

                            if (childLength === 0) {
                                console.log("pt 2 end choldLength", childLength);

                                elem.children()[1].remove();
                                console.log("ele.html()", elem.html());

                                childCounted = childCounted - 1;
                            }

                        }

                        if (textArrayNew[0][current - childCharCounted + (2 * childCounted) - 1] === "2") {

                            if (currentChild === 0) {
                                currentChild = 2;
                                childLength = $(textArrayNew[2]).text().length;
                            }

                            let string = $(elem.children()[1]).text();
                            let shorterString = string.substring(0, string.length - 1)

                            $(elem.children()[1]).text(shorterString);

                            childCharCounted = childCharCounted - 1;

                            childLength = childLength - 1;

                            // move target back to parent and remove child element
                            if (childLength === 0 ){
                                console.log("pt 2 end choldLength", childLength);

                                elem.children()[1].remove();

                                childCounted = childCounted - 1;
                                currentChild = 0;

                            }

                        }
                    }

                    // parent
                    if (textArrayNew[0][current - childCharCounted + (2 * childCounted) - 2] !== "/") {
                         console.log("textArrayNew[0], textArray[current], extArrayNew[0][current - childCharCounted + childCounted - 2",
                         textArrayNew[0],
                         textArray[current],
                            textArray[current - childCounted],
                            current - childCharCounted + childCounted - 2,
                            textArrayNew[0][current - childCharCounted + childCounted - 1],
                             textArrayNew[0][current - childCharCounted + (2 * childCounted) - 2],

                            textArrayNew[0][current - childCharCounted + childCounted - 2],
                            textArrayNew[0][current - childCharCounted + childCounted - 3],
                            // textArrayNew[0][current - childCharCounted + childCounted - 4],
                             elem.html()
                             );

                        // console.log("elem", elem);
                        // console.log("elem.html", elem.html());
                        // console.log("elem html -1", elem.html().substring(0, elem.html().length - 1))
                    }

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
                    // elem.text(contents[count % contents.length].textContent);
                    // let temp = contents[count % contents.length].innerHTML;
                    // console.log("temp", temp);
                    // console.log("elem", elem);
                    // elem.innerHTML = contents[count % contents.length].innerHTML;
                    // current = contents[count % contents.length].textContent.length;
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
                console.log("elem pt4 1", elem.html());
                console.log("currentChild", currentChild);
                console.log("childLength", childLength);
                console.log("childCharCounted", childCharCounted);
                console.log("childCounted", childCounted);

                // childCharCounted = 0;
                console.log("childCharCounted", childCharCounted);
                // childCounted = 0;
                if (keep && text != contents[count % contents.length].textContent.substr(0, keep) && !exit && (vis() && !pause)) {
                    // let innerHTML = contents[count % contents.length].innerHTML;
                    // console.log(innerHTML);
                    // $html = $.parseHTML(innerHTML);
                    // console.log($html.text());

                    // console.log($($html).text());
                    // $($html).text().substr(0, keep);
                    // console.log($html);
                    // console.log("elem pt4", elem.html());
                    // current = contents[count % contents.length].textContent.length;
                    // elem.text(contents[count % contents.length].textContent.substr(0, keep));
                    // elem.html($html);
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
                    textArrayNew = scontent.content[[count % scontent.content.length]];
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
