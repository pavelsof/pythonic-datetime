QUnit.module('datetime');

QUnit.test('init (args)', function(assert) {
	var dt = datetime.datetime(2016, 3, 25);
	assert.equal(dt.year, 2016);
	assert.equal(dt.month, 3);
	assert.equal(dt.day, 25);
	assert.equal(dt.hour, 0);
	assert.equal(dt.minute, 0);
	assert.equal(dt.second, 0);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzinfo, null);
	// assert.equal(dt.timestamp(), 1458860400);  // in CET
});

QUnit.test('init (object)', function(assert) {
	var dt = datetime.datetime({
		year: 2016, month: 3, day: 28, hour: 12, minute: 22, second: 42
	});
	assert.equal(dt.year, 2016);
	assert.equal(dt.month, 3);
	assert.equal(dt.day, 28);
	assert.equal(dt.hour, 12);
	assert.equal(dt.minute, 22);
	assert.equal(dt.second, 42);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzinfo, null);
	// assert.equal(dt.timestamp(), 1459160562);  // in CET
});

QUnit.test('init (tzinfo)', function(assert) {
	var dt = datetime.datetime(2016, 4, 1, 11, 11, 42, 0, datetime.timezone.utc);
	assert.equal(dt.year, 2016);
	assert.equal(dt.month, 4);
	assert.equal(dt.day, 1);
	assert.equal(dt.hour, 11);
	assert.equal(dt.minute, 11);
	assert.equal(dt.second, 42);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzname(), 'UTC');
	assert.equal(dt.timestamp(), 1459509102);
	
	var cet = datetime.timezone(datetime.timedelta({minutes: 120}));
	dt = datetime.datetime(2016, 4, 1, 11, 11, 42, 0, cet);
	assert.equal(dt.year, 2016);
	assert.equal(dt.month, 4);
	assert.equal(dt.day, 1);
	assert.equal(dt.hour, 11);
	assert.equal(dt.minute, 11);
	assert.equal(dt.second, 42);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzname(), cet.tzname());
	assert.equal(dt.timestamp(), 1459501902);
});

QUnit.test('today', function(assert) {
	var dt = datetime.datetime.today();
	var nativeD = new Date();
	assert.equal(dt.year, nativeD.getFullYear());
	assert.equal(dt.month, nativeD.getMonth()+1);
	assert.equal(dt.day, nativeD.getDate());
	assert.equal(dt.hour, nativeD.getHours());
	assert.equal(dt.minute, nativeD.getMinutes());
	assert.equal(dt.tzinfo, null);
});

QUnit.test('now', function(assert) {
	var dt = datetime.datetime.now();
	var nativeD = new Date();
	assert.equal(dt.year, nativeD.getFullYear());
	assert.equal(dt.month, nativeD.getMonth()+1);
	assert.equal(dt.day, nativeD.getDate());
	assert.equal(dt.hour, nativeD.getHours());
	assert.equal(dt.minute, nativeD.getMinutes());
	assert.equal(dt.tzinfo, null);
});

QUnit.test('utcnow', function(assert) {
	var dt = datetime.datetime.utcnow();
	var nativeD = new Date();
	assert.equal(dt.year, nativeD.getUTCFullYear());
	assert.equal(dt.month, nativeD.getUTCMonth()+1);
	assert.equal(dt.day, nativeD.getUTCDate());
	assert.equal(dt.hour, nativeD.getUTCHours());
	assert.equal(dt.minute, nativeD.getUTCMinutes());
	assert.equal(dt.tzinfo, null);
});

QUnit.test('fromtimestamp', function(assert) {
	var nativeD = new Date();
	var dt = datetime.datetime.fromtimestamp(nativeD.getTime() / 1000);
	assert.equal(dt.year, nativeD.getFullYear());
	assert.equal(dt.month, nativeD.getMonth()+1);
	assert.equal(dt.day, nativeD.getDate());
	assert.equal(dt.hour, nativeD.getHours());
	assert.equal(dt.minute, nativeD.getMinutes());
	assert.equal(dt.second, nativeD.getSeconds());
	assert.equal(dt.millisecond, nativeD.getMilliseconds());
	assert.equal(dt.tzinfo, null);
	assert.equal(dt.timestamp(), nativeD.getTime() / 1000);
});

QUnit.test('fromtimestamp (tzinfo)', function(assert) {
	var cet = datetime.timezone(datetime.timedelta({minutes: 120}));
	var dt = datetime.datetime.fromtimestamp(1000000000, cet);
	assert.equal(dt.year, 2001);
	assert.equal(dt.month, 9);
	assert.equal(dt.day, 9);
	assert.equal(dt.hour, 3);
	assert.equal(dt.minute, 46);
	assert.equal(dt.second, 40);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzname(), cet.tzname());
	assert.equal(dt.timestamp(), 1000000000);
	
	var eet = datetime.timezone(datetime.timedelta({minutes: 180}));
	dt = datetime.datetime.fromtimestamp(1000000000, eet);
	assert.equal(dt.year, 2001);
	assert.equal(dt.month, 9);
	assert.equal(dt.day, 9);
	assert.equal(dt.hour, 4);
	assert.equal(dt.minute, 46);
	assert.equal(dt.second, 40);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzname(), eet.tzname());
	assert.equal(dt.timestamp(), 1000000000);
	
	dt = datetime.datetime.fromtimestamp(1000000000, datetime.timezone.utc);
	assert.equal(dt.year, 2001);
	assert.equal(dt.month, 9);
	assert.equal(dt.day, 9);
	assert.equal(dt.hour, 1);
	assert.equal(dt.minute, 46);
	assert.equal(dt.second, 40);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzname(), datetime.timezone.utc.tzname());
	assert.equal(dt.timestamp(), 1000000000);
});

QUnit.test('utcfromtimestamp', function(assert) {
	var offset = new Date().getTimezoneOffset() * 60;
	
	var dt = datetime.datetime.utcfromtimestamp(0);
	assert.equal(dt.tzinfo, null);
	assert.equal(dt.timestamp(), offset);
	
	dt = datetime.datetime.utcfromtimestamp(1000000000);
	assert.equal(dt.tzinfo, null);
	assert.equal(dt.timestamp(), 1000000000 + offset);
});

QUnit.test('combine', function(assert) {
	var d = datetime.date(2016, 4, 1);
	var t = datetime.time(13, 7, 42, 500, datetime.timezone.utc);
	var dt = datetime.datetime.combine(d, t);
	assert.equal(dt.year, d.year);
	assert.equal(dt.month, d.month);
	assert.equal(dt.day, d.day);
	assert.equal(dt.hour, t.hour);
	assert.equal(dt.minute, t.minute);
	assert.equal(dt.second, t.second);
	assert.equal(dt.millisecond, t.millisecond);
	assert.equal(dt.tzname(), t.tzname());
});

QUnit.test('strptime', function(assert) {
	var dt = datetime.datetime.strptime('2016-04-05T16:24:42', '%Y-%m-%dT%H:%M:%S');
	assert.equal(dt.year, 2016);
	assert.equal(dt.month, 4);
	assert.equal(dt.day, 5);
	assert.equal(dt.hour, 16);
	assert.equal(dt.minute, 24);
	assert.equal(dt.second, 42);
	assert.equal(dt.millisecond, 0);
	assert.equal(dt.tzinfo, null);
	
	var isoString = datetime.datetime.now().isoformat();
	assert.equal(isoString,
		datetime.datetime.strptime(isoString, '%Y-%m-%dT%H:%M:%S.%f').isoformat());
});

QUnit.test('replace', function(assert) {
	var dt = datetime.datetime(2016, 4, 1, 14, 45, 42);
	var res = dt.replace({second: 0});
	assert.equal(res.year, 2016);
	assert.equal(res.month, 4);
	assert.equal(res.day, 1);
	assert.equal(res.hour, 14);
	assert.equal(res.minute, 45);
	assert.equal(res.second, 0);
	assert.equal(res.tzinfo, null);
	
	res = dt.replace(2015);
	assert.equal(res.year, 2015);
	assert.equal(res.month, 4);
	assert.equal(res.day, 1);
	assert.equal(res.hour, 14);
	assert.equal(res.minute, 45);
	assert.equal(res.second, 42);
	assert.equal(res.tzinfo, null);
});

QUnit.test('timestamp', function(assert) {
	var dt = datetime.datetime(1970, 1, 1, 0, 0, 42, 0, datetime.timezone.utc);
	assert.equal(dt.timestamp(), 42);
	
	var cet = datetime.timezone(datetime.timedelta({minutes: 60}));
	dt = datetime.datetime(1970, 1, 1, 0, 0, 0, 0, cet);
	assert.equal(dt.timestamp(), -cet.utcoffset().total_seconds());
	
	var eet = datetime.timezone(datetime.timedelta({minutes: 120}));
	dt = datetime.datetime(1970, 1, 1, 0, 0, 0, 0, eet);
	assert.equal(dt.timestamp(), -eet.utcoffset().total_seconds());
	
	/*var offset = new Date().getTimezoneOffset() * -60;
	dt = datetime.datetime(1970, 1, 1, 0, 0, 0, 0);
	assert.equal(dt.timestamp(), -offset);*/
});

QUnit.test('weekday', function(assert) {
	var dt = datetime.datetime(2016, 3, 27, 13, 15);
	assert.equal(dt.weekday(), 6);
});

QUnit.test('isoweekday', function(assert) {
	var dt = datetime.datetime(2016, 3, 27, 13, 15);
	assert.equal(dt.isoweekday(), 7);
});

QUnit.test('isoformat', function(assert) {
	var dt = datetime.datetime(2016, 3, 27, 13, 15);
	assert.equal(dt.isoformat(' '), '2016-03-27 13:15:00');
});

QUnit.test('strftime', function(assert) {
	assert.equal(datetime.datetime(2016, 3, 27, 12, 15, 1, 9)
		.strftime('%Y-%m-%d %H:%M:%S.%f'), '2016-03-27 12:15:01.009');
	assert.equal(datetime.datetime(2016, 3, 27, 12, 15, 1, 9)
		.strftime('%A (%a), %B (%b)'), 'Sunday (Sun), March (Mar)');
	assert.equal(datetime.datetime(2016, 3, 27, 12, 0, 0, 0, datetime.timezone.utc)
		.strftime('%z'), '+0000');
	assert.equal(datetime.datetime(2016, 3, 27, 12, 0, 0, 0, datetime.timezone(datetime.timedelta({minutes: 120})))
		.strftime('%z'), '+0200');
	
	assert.ok(datetime.datetime.now().strftime('%c').length);
	assert.ok(datetime.datetime.now().strftime('%x').length);
	assert.ok(datetime.datetime.now().strftime('%X').length);
});

QUnit.test('compare', function(assert) {
	assert.equal(datetime.datetime(2016, 4, 1, 12, 25).compare(
		datetime.datetime(2016, 4, 1, 12, 27)), -1);
	assert.equal(datetime.datetime(2016, 4, 1, 12, 27).compare(
		datetime.datetime(2016, 4, 1, 12, 25)), 1);
	assert.equal(datetime.datetime(2016, 4, 1, 12, 25).compare(
		datetime.datetime(2016, 4, 1, 12, 25)), 0);
	
	var cet = datetime.timezone(datetime.timedelta({minutes: 120}));
	assert.equal(datetime.datetime(2016, 4, 1, 12, 25, 0, 0, cet).compare(
		datetime.datetime(2016, 4, 1, 12, 27, 0, 0, cet)), -1);
	assert.equal(datetime.datetime(2016, 4, 1, 12, 27, 0, 0, cet).compare(
		datetime.datetime(2016, 4, 1, 12, 25, 0, 0, cet)), 1);
	assert.equal(datetime.datetime(2016, 4, 1, 12, 25, 0, 0, cet).compare(
		datetime.datetime(2016, 4, 1, 12, 25, 0, 0, cet)), 0);
	
	assert.raises(function() {
		datetime.datetime(2016, 4, 1, 12, 25, 0, 0, cet).compare(
			datetime.datetime(2016, 4, 1, 12, 25, 0, 0));
	}, TypeError);
	assert.raises(function() {
		datetime.datetime(2016, 4, 1, 12, 25, 0, 0).compare(
			datetime.datetime(2016, 4, 1, 12, 25, 0, 0, cet));
	}, TypeError);
});

QUnit.test('add', function(assert) {
	var dt = datetime.datetime(2016, 3, 30, 20, 26, 42);
	var res = dt.add(datetime.timedelta({days: 2}));
	assert.equal(res.year, 2016);
	assert.equal(res.month, 4);
	assert.equal(res.day, 1);
	assert.equal(res.hour, 20);
	assert.equal(res.minute, 26);
	assert.equal(res.second, 42);
	assert.equal(res.tzinfo, null);
	// assert.equal(res.timestamp(), 1459535202);  // in CET
	
	var cet = datetime.timezone(datetime.timedelta({minutes: 120}));
	dt = datetime.datetime(2016, 3, 30, 20, 26, 42, 0, cet);
	res = dt.add(datetime.timedelta({days: 2}));
	assert.equal(res.year, 2016);
	assert.equal(res.month, 4);
	assert.equal(res.day, 1);
	assert.equal(res.hour, 20);
	assert.equal(res.minute, 26);
	assert.equal(res.second, 42);
	assert.equal(res.tzname(), cet.tzname());
	assert.equal(res.timestamp(), 1459535202);
	
	assert.raises(function() { dt.add(0); }, TypeError);
});

QUnit.test('subtract', function(assert) {
	var dt = datetime.datetime(2016, 4, 1, 12, 5, 42, 0);
	var res = dt.subtract(datetime.timedelta({days: 2}));
	assert.equal(res.year, 2016);
	assert.equal(res.month, 3);
	assert.equal(res.day, 30);
	assert.equal(res.hour, 12);
	assert.equal(res.minute, 5);
	assert.equal(res.second, 42);
	assert.equal(res.tzinfo, null);
	// assert.equal(res.timestamp(), 1459332342);  // in CET
	
	res = dt.subtract(res);
	assert.equal(res.days, 2);
	assert.equal(res.seconds, 0);
	assert.equal(res.milliseconds, 0);
	
	var cet = datetime.timezone(datetime.timedelta({minutes: 120}));
	dt = datetime.datetime(2016, 4, 1, 12, 5, 42, 0, cet);
	res = dt.subtract(datetime.timedelta({days: 2}));
	assert.equal(res.year, 2016);
	assert.equal(res.month, 3);
	assert.equal(res.day, 30);
	assert.equal(res.hour, 12);
	assert.equal(res.minute, 5);
	assert.equal(res.second, 42);
	assert.equal(res.tzname(), cet.tzname());
	assert.equal(res.timestamp(), 1459332342);  // in CET
	
	res = dt.subtract(res);
	assert.equal(res.days, 2);
	assert.equal(res.seconds, 0);
	assert.equal(res.milliseconds, 0);
	
	assert.raises(function() { dt.subtract(0); }, TypeError);
});
