(function ($) {
/*
** contents => array object
** keep => integer on items to keep
** seconds => integer of seconds it takes to iterate through slide
** speed => integer of delay denoting milliseconds default = 20
*/
  $.fn.writeText = function (contents, keep, seconds, delay = 20) {
    var current = 0,
      count = 0,
      deviance = 1,
      inTransPercent = .80,
      outTransPercent = .20,
      elem = this;

    // here we have the initial animation that starts at 0 seconds - part 1
    setTimeout(function () {
        var contentArray = contents[0].textContent.split("");

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
              //make sure we clear as does not always complete
              if (!keep && elem.text()) {
                  elem.text("");
              }
          }, Math.floor((1000 * outTransPercent * seconds) - deviance));

      }, Math.floor(1000 * inTransPercent * seconds) );

    }, 0);

    // part starts after x seconds parameter

    function timeout() {
        setTimeout(function () {
            // Do Something Here
            // Then recall the parent function to
            // create a recursive loop.
            var current = 0;

            let maxInDelay = Math.floor(((seconds * inTransPercent) * 1000) / (contents[count % contents.length].textContent.length));

            var contentArray = contents[count % contents.length].textContent.split("");


            let timeoutAddCount2 = 0;
            function timeoutAdd2() {
                setTimeout(function () {
                    //do stuff
                    if (current < contentArray.length && !keep) {
                        elem.text(elem.text() + contentArray[current++]);
                    } else if (keep + current < contentArray.length) {
                        elem.text(elem.text() + contentArray[keep + current++]);
                    }


                    if (timeoutAddCount2 >= contents[count % contents.length].textContent.length) {
                        return;
                    }
                    timeoutAddCount2++;

                    timeoutAdd2();

                }, (delay <= maxInDelay ? delay : maxInDelay));
            }

            timeoutAdd2();

            // remove or subtract
            setTimeout(function () {

                let maxOutDelay = Math.floor(1000 * (seconds * outTransPercent) / elem.text().length);
                count++;

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

                        timeoutSubract2();

                    }, (delay <= maxOutDelay ? delay : maxOutDelay));
                }

                timeoutSubract2();

                setTimeout(function () {
                    if (!keep && elem.text()) {

                        elem.text("");
                    }
                }, Math.floor((1000 * outTransPercent * seconds) - deviance));

            }, Math.floor(1000 * inTransPercent * seconds));

            timeout();
        }, seconds * 1000);
    }
    timeout();

  };

})(jQuery);

let animatetext = function(){
  let $elements = $(".tt-holder .tt");
  $(".ttt").writeText($elements, 17, 5, 30);
}

$(animatetext) ;





