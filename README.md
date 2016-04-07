# datetime

Pythonic dates, times, and deltas in JavaScript. Advantages:

* The same API as Python's datetime module (see below for differences).
* Clear distinction between naive and aware datetimes.
* All functions/methods return immutable (ok, frozen) objects.
* Timedelta arithmetics.
* Unix timestamps (i.e. seconds instead of milliseconds).
* Lightweight (~3KB gzipped).

This is not a re-write of Python's datetime module in JavaScript; instead, it
leverages the native Date functions wherever possible. In fact, you can think
about `pythonic-datetime` as a wrapper.

Whetting your appetite:

```js
var birthday = datetime.date(1989, 12, 5);  // ja, months start from 1
console.warn(birthday.year);  // 1989
birthday.year = 1431;  // raises TypeError in strict, simply fails otherwise

var partyDay = datetime.date(2016, 12, 5);  // presents are welcome
var yearsAlive = partyDay.subtract(birthday)  // returns timedelta object
                         .divide(datetime.timedelta({days: 365}));

var partyTime = datetime.time(21, 30);
datetime.datetime.combine(partyDay, partyTime).isoformat();  // 2016-12-05T21:30:00
```


## Installation

`bower install pythonic-datetime`. Or you can git clone this repo as a
submodule; the master branch will always contain the latest stable.


## Differences with the original

* The smallest time unit is milliseconds instead of microseconds. Wherever you
  see microseconds in Python's datetime API, replace it with milliseconds.
* As there is no operator overloading in JavaScript, the following methods are
  used for datetime arithmetics:
	* `delta.compare(another)`: returns one of -1, 0, 1
	* `delta.add(addend)`
	* `delta.subtract(subtrahend)`
	* `delta.multiply(factor)`
	* `delta.divide(divisor)`
* If wrong arguments are provided, TypeError is raised. However, comprehensive
  argument validation is yet to be implemented.
* No tzinfo, only timezone. This is more of a status-quo.
* Other functions/methods which are not (yet?) implemented: `ctime`,
  `fromordinal`, `timetuple`, `toordinal`.
* The following printf directives are currently not implemented: `%j`, `%U`, and
  `%W`. However, `%a`, `%A`, `%b`, `%B`, and `%p` are not localised.
* Of the scanf directives, only `%d`, `%m`, `%Y`, `%H`, `%M`, `%S`, and `%f` are
  implemented.


## TODO/Roadmap

* To implement the proleptic Gregorian ordinals: `toordinal`, `fromordinal`.
* To validate the constructor arguments.
* To test, document, and improve datetime's interoperability with at least one
  of the JavaScript libraries that are synced with the Olson database. In other
  words, find the JavaScript pytz counter-part(s).


## Licence

MIT. Do as you please and praise the snake gods.


