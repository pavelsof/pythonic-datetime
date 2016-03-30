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

QUnit.test('timestamp', function(assert) {
	var dt = datetime.datetime(1970, 1, 1, 0, 0, 0, 0, datetime.timezone.utc);
	assert.equal(dt.timestamp(), 0);
	
	var cet = datetime.timezone(datetime.timedelta({minutes: 120}));
	dt = datetime.datetime(1970, 1, 1, 0, 0, 0, 0, cet);
	assert.equal(dt.timestamp(), cet.utcoffset().total_seconds());
	
	var eet = datetime.timezone(datetime.timedelta({minutes: 180}));
	dt = datetime.datetime(1970, 1, 1, 0, 0, 0, 0, eet);
	assert.equal(dt.timestamp(), eet.utcoffset().total_seconds());
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
	var dt = datetime.datetime(2016, 3, 27, 12, 15, 1);
	assert.equal(dt.strftime('%Y-%m-%d %H:%M:%S'), '2016-03-27 12:15:01');
});
