(function ($) {
//
// contents => array object
// keep => integer on items to keep
// seconds => integer of seconds it takes to iterate through slide
// speed => integer of delay denoting milliseconds default = 20
  $.fn.writeText = function (contents, keep, seconds, delay = 10) {
    var current = 0,
      count = 0,
      deviance = .90;
      elem = this;

    // here we have the initial animation - on load
    setTimeout(function () {
        var contentArray = contents[0].textContent.split("");

        let maxInDelay = Math.floor((seconds -1) * 1000 * deviance / contents[0].textContent.length);
        var add = setInterval(function () {
            if (current < contentArray.length) {
                elem.text(elem.text() + contentArray[current++]);
            }
        }, (delay <= maxInDelay ? delay : maxInDelay));

      // remove or subtract
      setTimeout(function () {

        let maxOutDelay = Math.floor(1000 * deviance / elem.text().length);

        clearInterval(add);
        count++;

        var subtract = setInterval(function () {
          if (current > keep) {
            elem.text(elem.text().substring(0, elem.text().length - 1));
            current--;
          }
        }, (delay <= maxOutDelay ? delay : maxOutDelay));

          setTimeout(function () {
              //make sure we clear as does not always complete
              if (!keep && elem.text()) {
                  console.log("keep 1", keep);
                  elem.text("");
              }
              clearInterval(subtract);
          }, (1000 * deviance));

      }, 4000);

    }, 0);

    // here we have the recurring animation
    setInterval(function () {
        var current = 0;

        let maxInDelay = Math.floor(((seconds - 1) * 1000 * deviance ) / (contents[(count) % contents.length].textContent.length));

        var contentArray = contents[(count) % contents.length].textContent.split("");

        var add = setInterval(function () {

        if (current < contentArray.length && !keep) {

          elem.text(elem.text() + contentArray[current++]);
        } else {
            if (keep + current < contentArray.length  ) {
                elem.text(elem.text() + contentArray[keep + current++]);
            }
        }

        }, (delay <= maxInDelay ? delay : maxInDelay));

     // remove or subtract


      setTimeout(function () {

        let maxOutDelay = Math.floor(1000 * deviance / elem.text().length);
        clearInterval(add);
        count++;

        var subtract = setInterval(function () {
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

        }, (delay <= maxOutDelay ? delay : maxOutDelay ));

          setTimeout(function () {
              if (!keep && elem.text()) {
                  comsole.log("keep", keep);

                  elem.text("");
              }
              clearInterval(subtract);
          }, (1000 * deviance));

      }, 4000);

    }, seconds * 1000);

  };

})(jQuery);

let animatetext = function(){
  let $elements = $(".tt-holder .tt");
  $(".ttt").writeText($elements, 16, 5, 40);
}

$(animatetext) ;





