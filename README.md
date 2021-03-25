# Ticker Type Text

## About

This is a jQuery Plugin designed to mimick a typewriter or news ticker.

## Requirements

This has been tested to work with jQuery 2.1.3. or later. Not sure but should work with previous versions.

## Use

This is designed to take a html collection and transform this into ticker type text output in the browser.

e.g.

### HTML

The collection of strings we want to animate can be extracted from a htmk collection.

e.g.

```
<div id="holder" class="text tt-holder">
  <p class="tt">Your partner for change </p>
  <p class="tt">Your partner for impact </p>
  <p class="tt">Your partner for life </p>
  <p class="tt">Your partner for success </p>
  <h1 class="ttt"></h1>
</div>
```
In this example I have also used `ttt` as a classname. I will use this to target the output of my ticker type text.

### CSS

I have included some base styles that can be modified. The main thing here is to hide the text we are using for a collection.

e.g.

```
.tt {
  display: none;
}
```
### JS

The ticker can be instantiated like so:

```
let animatetext = function(){
  let $elements = $(".tt-holder .tt");
  $(".ttt").writeText($elements, 17, 2, 30, 1, 0.7, 3);
}
$(animatetext) ;

```
## Parameters

### contents

contents an html collection or array object.

### keep

integer determining the number of text chars to keep between iterations e.g. 17

### seconds

integer determining the numer of seconds the animation will take. e.g 5

### speed

integer of delay between inserting text items in milliseconds defaults to 20

### iterations

integer for determing number of iterations for the entire collection. 0 denotes infinite,

### ratio

float determing the relative value between when the animation starts and when it ends. This is usually weighted to prevent a large time delay at te end while also ensuring that there is not a gap between lines. e.g. 0.8

### secondsout

When using the `keep` feature (see above), when set, this parameter allows configuration over the speed of second and subsequent frames. This can be higher or lower than that of the first frame.
