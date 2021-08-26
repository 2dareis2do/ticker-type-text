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

        let cc = contents.clone();

        let target = document.getElementById('target');

        /*
        / Function for serialising HTML Object
        */
        function serialise(obj) {
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

            return { "content": cc2 };

        }

        let scontent = serialise(cc);

        // console.log("serialised object: \n", scontent);

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

        // serialised text array
        let textArraySerialised = scontent.content[count % scontent.content.length];
        // console.log("textArraySerialised", textArraySerialised);
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

                if (!keep && current < textArray.length) {
                    // elem.append(textArray[current]);
                    // current++;
                }
                if (current < textArray.length && count >= 0) {
                    
                    // handle n in /1 /2
                    // in a way the number has no significance as we can determine

                    // currentChild denotes if we are handling the parent or a child
                    
                    //parent
                    if ((textArraySerialised[0][current - childCharCounted + (2 * childCounted)] !== "/") && currentChild === 0) {
                       elem.append(textArray[current]);
                       //remove quotes
                       elem.html(elem.html());
                        // target.innerText += textArray[current];
                    //    console.log("elem parent, target, $(target), target.innerText", elem, target, $(target), target.innerText);
                        // let textnode = document.createTextNode(textArray[current]);
                        // elem.appendChild(textnode);
                        // elem.text(elem.text() + textArray[current]);

                        // console.log("parent textArray[current] , current html appended", textArray[current], elem.html());
                    }
                    //child
                    if (textArraySerialised[0][current - childCharCounted + (2 * childCounted)] === "/") {
                        // /1
                        let childCount = childCounted + 1;

                        if (textArraySerialised[0][current + 1 - childCharCounted + (2 * childCounted)] == childCount) {
                            if (currentChild === 0) {
                                currentChild = childCount;
                                childLength = $(textArraySerialised[childCount]).text().length;
                                // on second iteration this is an empty string!
                                // console.log("childLength initial add", childLength, childCount, JSON.stringify(textArraySerialised[childCount]), $(textArraySerialised[childCount]).text());

                                $(textArraySerialised[childCount]).text("");
                                elem.append(textArraySerialised[childCount]);
                                // console.log("elem child, target, $(target), target.innerText", elem, target, $(target), target.innerText);

                                // console.log("child cc0, current html tag appended 0", $(textArraySerialised[childCount]).text(), elem.html());
                            }
                            // console.log(typeof(childCounted));
                            elem.children()[childCounted].append(textArray[current]);
                            $(elem.children()[childCounted]).html($(elem.children()[childCounted]).html());
                            // console.log($(elem.children()[childCounted]).html());
                            // elem.children()[childCounted].html(elem.children()[childCounted].html());
                            // elem.children()[childCounted].text(elem.children()[childCounted].text() + textArray[current]);

                            // console.log("child current html tag , appended !0", textArray[current], elem.html());
                            childLength = childLength - 1;
                            // console.log("childLength after", childLength)
                            childCharCounted = childCharCounted + 1;

                            // set target child to parent if childCounted = 0
                            if (childLength === 0) {
                                childCounted = childCount;
                                // console.log("childCounted add - exit", childCounted, $(textArraySerialised[childCount]).text());

                                currentChild = 0;

                            }

                        }


                    }

                    current++;
                }
                if (current >= textArray.length) {
                    da = performance.now();
                    daDif = da - dx;
                    if (daDif >= (1000 * inTransPercent * seconds) - deviance) {
                        daDif = 0;
                    }
                    if (dev) {
                        da = performance.now();
                        console.log("completed pt1 ", da - dx, "microseconds", "text", elem.text());
                    }

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

                if (current >= 0) {

                    //child
                    if (textArraySerialised[0][current - childCharCounted + (2 * childCounted) - 2] === "/") {

                        // let childCount = elem.children().length -1;
                        // this is temporary variable useful for targeting array thats starts with 0, 1, 2 etc
                        let childCount = childCounted - 1;

                        // console.log("childcount, no. children", childCount, elem.children().length);

                        //child
                        if (textArraySerialised[0][current - childCharCounted + (2 * childCounted) - 1] == childCounted) {

                            if (currentChild === 0) {
                                currentChild = childCounted;
                                childLength = $(textArraySerialised[childCounted]).text().length;
                            }

                            let string = $(elem.children()[childCount]).text();
                            let shorterString = string.substring(0, string.length - 1);
                            $(elem.children()[childCount]).text(shorterString);
                            // console.log("child  $(elem.children()[childCount]), current html  removed", 
                            // //render
                            // elem.html());

                            childCharCounted = childCharCounted - 1;

                            childLength = childLength - 1;

                            // if we have removed all text move target back to parent and remove child element
                            // do this as if it was one step i.e. text and child element
                            if (childLength === 0) {
                                // console.log("to be removed ", elem.children()[childCount])
                                elem.children()[childCount].remove();
                                //now that we have removed the target decrease the number of counted children
                                childCounted = childCount;
                                //return to parent
                                currentChild = 0;
                                // console.log("child 0 current html removed", elem.html());

                            }

                        }
                    }

                    // parent
                    if (textArraySerialised[0][current - childCharCounted + (2 * childCounted) - 2] !== "/" && currentChild === 0) {

                        let shortenedString = elem.html().substring(0, elem.html().length - 1)
                        if (elem.text().length > keep) {
                            elem.html(shortenedString);
                            // console.log("parent 0 current html  removed", elem.html());

                        }
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

            }, maxInDelay);
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
                    // unfortunately this is currently necessary after every 
                    // iteration as we are mutating the data!
                    cc = contents.clone();
                    scontent = serialise(cc);

                    textArray = contents[count % contents.length].textContent.split("");
                    textArraySerialised = scontent.content[[count % scontent.content.length]];

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
