(function ($) {
//
// contents => array object
// keep => integer on items to keep
// seconds => integer of seconds it takes to iterate through slide
// speed => integer of delay denoting milliseconds default = 20
  $.fn.writeText = function (contents, keep, seconds, delay = 10) {
    var current = 0,
      count = 0,
      elem = this;

      console.log("count init", count);
      console.log("contents.length", contents.length);

    // here we have the initial animation
    setTimeout(function () {

      var contentArray = contents[0].textContent.split("");
      var add = setInterval(function () {
        if (current < contentArray.length) {
          elem.text(elem.text() + contentArray[current++]);
        }
      }, delay);

      setTimeout(function () {
        clearInterval(add);
        count++;
        console.log("count", count);

        var subtract = setInterval(function () {
          if (current > keep) {
            elem.text(elem.text().substring(0, elem.text().length - 1));
            current--;
          }
        }, 10);

        setTimeout(function () {
            clearInterval(subtract);
        }, 985);

      }, 4000);

    //   setTimeout(function () {
    //     // count++;
    //     // console.log("count", count);
    //   }, 4995);

    }, 0);

    // this fires of after the time limit (default 5000 ms)
    setInterval(function () {

        var current = 0;

        var contentArray = contents[(count) % contents.length].textContent.split("");

      var add2 = setInterval(function () {

        if (current < contentArray.length) {
          elem.text(elem.text() + contentArray[current++]);
        }


      }, delay);

      setTimeout(function () {

        clearInterval(add2);
        count++;
        console.log("count2", count);

        var subtract2 = setInterval(function () {
          if (current > keep) {
            elem.text(elem.text().substring(0, elem.text().length - 1));
            current--;
          }
        }, delay);

          setTimeout(function () {
              clearInterval(subtract2);
          }, 985);

      }, 4000);




    }, seconds * 1000);

  };

})(jQuery);

let animatetext = function(){
  let $elements = $(".tt-holder .tt");
  $(".ttt").writeText($elements, 0, 5, 20);
}

$(animatetext) ;





