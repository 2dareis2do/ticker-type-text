(function ($) {
/*
* contents => array object
* keep => integer on items to keep
* seconds => integer of seconds it takes to iterate through slide
* speed => integer of delay denoting milliseconds default = 20
* iterations => iterations for the array. 0 denotes infinite,
* ratio => ratio (float)
* secondsout => we can set the the speed of the second part
*/
  $.fn.writeText = function (contents, keep, seconds, delay = 20, iterations = 0, ratio, secondsout) {
    let current = 0,
      count = 0,
      deviance = 1,
      inTransPercent = ratio,
      outTransPercent = 1 - ratio,
      exit = false,
      elem = this;

    // here we have the initial animation that starts at 0 seconds - part 1
    setTimeout(function () {
        let contentArray = contents[0].textContent.split("");

        let maxInDelay = Math.floor((seconds * inTransPercent) * 1000 / contents[0].textContent.length);
        let timeoutAddCount = 0;

        // add text chars - recursive function that runs like setInterval using setTimeuut for consitentcy and greater control
        function timeoutAdd() {
            setTimeout(function () {
            //do stuff
                if (current < contentArray.length) {
                    elem.text(elem.text() + contentArray[current++]);
                }

                if (timeoutAddCount >= contents[0].textContent.length) {
                    return;
                }
                timeoutAddCount++;

                timeoutAdd();

            }, (delay <= maxInDelay ? delay : maxInDelay));
        }

        timeoutAdd();

        // remove text chars - delayed to start at outTransPercent inTransPercent
        setTimeout(function () {

        let maxOutDelay = Math.floor((seconds * outTransPercent) * 1000 / elem.text().length);
        // this is incremented in the first part after we add
        count++;

        let timeoutSubtractCount = 0;
        function timeoutSubract() {
            setTimeout(function () {
                  //do stuff
                  if (current > keep) {
                      elem.text(elem.text().substring(0, elem.text().length - 1));
                      current--;
                  }

                  if (timeoutSubtractCount >= contents[0].textContent.length) {
                      return;
                  }
                  timeoutSubtractCount++;

                  timeoutSubract();

              }, (delay <= maxOutDelay ? delay : maxOutDelay));
          }

          timeoutSubract();

          setTimeout(function () {
              //make sure we clear as does not always complete when not using keep
              if (!keep && elem.text()) {
                  elem.text("");
              }
          }, Math.floor((1000 * outTransPercent * seconds) - deviance));

      }, Math.floor(1000 * inTransPercent * seconds) );

    }, 0);

    // part 2 starts after 'seconds' parameter
    function timeout() {
        setTimeout(function () {
            // Do Something Here
            // Then recall the parent function to
            // create a recursive loop.
            let current = 0;
            // set speed of second part after first iteration
            if (secondsout && count <= 1) {
                seconds = secondsout;
            }
            let maxInDelay = Math.floor(((seconds * inTransPercent) * 1000) / (contents[count % contents.length].textContent.length));

            let contentArray = contents[count % contents.length].textContent.split("");

            let timeoutAddCount2 = 0;
            function timeoutAdd2() {
                setTimeout(function () {
                    //do stuff
                    if (current < contentArray.length && !keep) {
                        elem.text(elem.text() + contentArray[current++]);
                    }

                    if (keep + current < contentArray.length) {
                        elem.text(elem.text() + contentArray[keep + current++]);
                    }

                    if (timeoutAddCount2 >= contents[count % contents.length].textContent.length) {
                        // we can do error checking here
                        if (keep && elem.text() != contents[(count) % contents.length].textContent) {
                            elem.text(contents[(count) % contents.length].textContent);
                        }

                        return;
                    }
                    timeoutAddCount2++;

                    if (!exit) {
                        timeoutAdd2();
                    }

                }, (delay <= maxInDelay ? delay : maxInDelay));
            }


            if (!exit) {
                timeoutAdd2();
            } else { return };
            // remove or subtract
            setTimeout(function () {

                let maxOutDelay = Math.floor(1000 * (seconds * outTransPercent) / elem.text().length);
                // this is incremented in part 2 after we add (before of subtract)
                count++;
                // exit before 
                if (iterations && count > contents.length * iterations) {
                    exit = true;
                    return;
                }

                let timeoutSubtractCount2 = 0;
                function timeoutSubract2() {
                    setTimeout(function () {
                        //do stuff

                        if (current > keep) {

                            elem.text(elem.text().substring(0, elem.text().length - 1));
                            current--;
                        } else {
                            current = elem.text().length--;
                            if (current > keep) {

                                elem.text(elem.text().substring(0, elem.text().length - 1));
                                current--;
                            }
                        }

                        if (timeoutSubtractCount2 >= contents[count % contents.length].textContent.length) {
                            return;
                        }
                        timeoutSubtractCount2++;

                        if (!exit) {
                            timeoutSubract2();
                        }

                    }, (delay <= maxOutDelay ? delay : maxOutDelay));
                }

                if (!exit) {
                    timeoutSubract2();
                } else { return };


                setTimeout(function () {
                    // clean up if not using keep
                    if (!keep && elem.text()) {
                        elem.text("");
                    }
                    // clean if we are using keep
                    if (keep && elem.text() != contents[count % contents.length].textContent.substr(0, keep)) {
                        elem.text(contents[count % contents.length].textContent.substr(0, keep));
                    }
                }, Math.floor((1000 * outTransPercent * seconds) - deviance));

            }, Math.floor(1000 * inTransPercent * seconds));

            if (!exit) {
                timeout();
            } else { return };

        }, seconds * 1000);
    }
    if (!exit) {
        timeout();
      } else { return };

  };

})(jQuery);

let animatetext = function(){
  let $elements = $(".tt-holder .tt");
  $(".ttt").writeText($elements, 17, 2, 30, 1, 0.7, 3);
}
$(animatetext) ;
