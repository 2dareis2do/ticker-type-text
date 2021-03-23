(function ($) {
/*
** contents => array object
** keep => integer on items to keep
** seconds => integer of seconds it takes to iterate through slide
** speed => integer of delay denoting milliseconds default = 20
*/
  $.fn.writeText = function (contents, keep, seconds, delay = 10) {
    var current = 0,
      count = 0,
      deviance = .90,
      inT = .85,
      ouT = .15,
      elem = this;

    // here we have the initial animation - on load
    setTimeout(function () {
        var contentArray = contents[0].textContent.split("");

        let maxInDelay = Math.floor((seconds -1) * 1000 * deviance / contents[0].textContent.length);
        let timeoutAddCount = 0;
        function timeoutAdd() {
            setTimeout(function () {
                     //do stuff
                if (current < contentArray.length) {
                    elem.text(elem.text() + contentArray[current++]);
                }
                // console.log("timeoutCount", timeoutCount);
                // console.log("contents[0].textContent.length", contents[0].textContent.length);


                if (timeoutAddCount >= contents[0].textContent.length) {
                    return;
                }
                timeoutAddCount++;

                    timeoutAdd();

            }, (delay <= maxInDelay ? delay : maxInDelay));
        }

        timeoutAdd();

        // var add = setInterval(function () {
        //     if (current < contentArray.length) {
        //         elem.text(elem.text() + contentArray[current++]);
        //     }
        // }, (delay <= maxInDelay ? delay : maxInDelay));

      // remove or subtract
      setTimeout(function () {

        let maxOutDelay = Math.floor(1000 * deviance / elem.text().length);

        // clearInterval(add);
        count++;

        // var subtract = setInterval(function () {
        //   if (current > keep) {
        //     elem.text(elem.text().substring(0, elem.text().length - 1));
        //     current--;
        //   }
        // }, (delay <= maxOutDelay ? delay : maxOutDelay));

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
              //make sure we clear as does not always complete
              if (!keep && elem.text()) {
                  elem.text("");
              }
            //   clearInterval(subtract);
          }, Math.floor(1000 * ouT * seconds * deviance));

      }, Math.floor(1000 * inT * seconds) );

    }, 0);

    function timeout() {
        setTimeout(function () {
            // Do Something Here
            // Then recall the parent function to
            // create a recursive loop.
            var current = 0;

            let maxInDelay = Math.floor(((seconds - 1) * 1000 * deviance) / (contents[(count) % contents.length].textContent.length));

            var contentArray = contents[(count) % contents.length].textContent.split("");

            // var add = setInterval(function () {

            //     if (current < contentArray.length && !keep) {

            //         elem.text(elem.text() + contentArray[current++]);
            //     } else {
            //         if (keep + current < contentArray.length) {
            //             elem.text(elem.text() + contentArray[keep + current++]);
            //         }
            //     }

            // }, (delay <= maxInDelay ? delay : maxInDelay));

            let timeoutAddCount2 = 0;
            function timeoutAdd2() {
                setTimeout(function () {
                    //do stuff
                    if (current < contentArray.length && !keep) {

                        elem.text(elem.text() + contentArray[current++]);
                    } else {
                        if (keep + current < contentArray.length) {
                            elem.text(elem.text() + contentArray[keep + current++]);
                        }
                    }
                    // console.log("timeoutCount", timeoutCount);
                    // console.log("contents[0].textContent.length", contents[0].textContent.length);


                    if (timeoutAddCount2 >= contents[0].textContent.length) {
                        return;
                    }
                    timeoutAddCount2++;

                    timeoutAdd2();

                }, (delay <= maxInDelay ? delay : maxInDelay));
            }

            timeoutAdd2();


            // remove or subtract


            setTimeout(function () {

                let maxOutDelay = Math.floor(1000 * deviance / elem.text().length);
                // clearInterval(add);
                count++;

                // var subtract = setInterval(function () {
                //     if (current > keep) {

                //         elem.text(elem.text().substring(0, elem.text().length - 1));
                //         current--;
                //     } else {
                //         current = elem.text().length--;
                //         if (current > keep) {

                //             elem.text(elem.text().substring(0, elem.text().length - 1));
                //             current--;
                //         }
                //     }

                // }, (delay <= maxOutDelay ? delay : maxOutDelay));

                let timeoutSubtractCount2 = 0;
                function timeoutSubract2() {
                    setTimeout(function () {
                        //do stuff
                        // if (current > keep) {
                        //     elem.text(elem.text().substring(0, elem.text().length - 1));
                        //     current--;
                        // }
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

                        if (timeoutSubtractCount2 >= contents[0].textContent.length) {
                            return;
                        }
                        timeoutSubtractCount2++;

                        timeoutSubract2();

                    }, (delay <= maxOutDelay ? delay : maxOutDelay));
                }

                timeoutSubract2();

                setTimeout(function () {
                    if (!keep && elem.text()) {

                        elem.text("");
                    }
                    // clearInterval(subtract);
                }, Math.floor(1000 * ouT * seconds * deviance));

            }, Math.floor(1000 * inT * seconds));

            timeout();
        }, seconds * 1000);
    }

    timeout();

  };

})(jQuery);

let animatetext = function(){
  let $elements = $(".tt-holder .tt");
  $(".ttt").writeText($elements, 16, 4, 20);
}

$(animatetext) ;





