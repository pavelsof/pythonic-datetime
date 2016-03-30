# datetime


## Differences

* Smallest unit is milliseconds instead of microseconds. However, timestamps
  follow the Python/UNIX format, i.e. they represent the number of seconds (as
  opposed to milliseconds).
* As there is no operator overloading in JavaScript, the following methods are
  used for datetime arithmetics:
	* dt.compare(anotherdt): returns one of -1, 0, 1
	* dt.add(anotherdt)
	* dt.subtract(anotherdt)
* No tzinfo, only timezone.
* If wrong arguments are provided, TypeError is raised.

All the datetime objects are immutable (at least as immutable as JavaScript can
make them).


