(function ($) {
  $.fn.writeText = function (contents, keep) {
    var current = 0,
      count = 0,
      elem = this;

    setTimeout(function () {

      var contentArray = contents[0].textContent.split("");
      var add = setInterval(function () {
        if (current < contentArray.length) {
          elem.text(elem.text() + contentArray[current++]);
        }
      }, 10);

      setTimeout(function () {
        clearInterval(add);
        var subtract = setInterval(function () {
          if (current > keep) {
            elem.text(elem.text().substring(0, elem.text().length - 1));
            current--;
          }
        }, 10);


      }, 4000);

      setTimeout(function () {
        count++;
        console.log("count", count);
      }, 4999);

    }, 0);


    setInterval(function () {

      var current = 0;
      console.log(contents.length);
      console.log("count 2", count);


      var contentArray = contents[(count + 1) % contents.length].textContent.split("");

      var add2 = setInterval(function () {

        if (current < contentArray.length) {
          elem.text(elem.text() + contentArray[current++]);
        }


      }, 10);
      setTimeout(function () {

        clearInterval(add2);
        var subtract2 = setInterval(function () {
          if (current > keep) {
            elem.text(elem.text().substring(0, elem.text().length - 1));
            current--;
          }
        }, 10);


      }, 4000);

      setTimeout(function () {
        count++;
        console.log("count22", count);
        //     clearInterval(subtract2);
      }, 4985);


    }, 5000);

  };

})(jQuery);

let animatetext = function(){
  let $elements = $(".tt-holder .tt");
  $(".ttt").writeText($elements, 0);
}

$(animatetext) ;





