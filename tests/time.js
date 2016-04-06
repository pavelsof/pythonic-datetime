QUnit.module('time');

QUnit.test('init (args)', function(assert) {
	var t = datetime.time(14, 26, 55);
	assert.equal(t.hour, 14);
	assert.equal(t.minute, 26);
	assert.equal(t.second, 55);
	assert.equal(t.millisecond, 0);
	
	t = datetime.time(14, 26, 55, 500);
	assert.equal(t.hour, 14);
	assert.equal(t.minute, 26);
	assert.equal(t.second, 55);
	assert.equal(t.millisecond, 500);
});

QUnit.test('init (object)', function(assert) {
	var t = datetime.time({
		hour: 11, minute: 10, second: 42, millisecond: 420
	});
	assert.equal(t.hour, 11);
	assert.equal(t.minute, 10);
	assert.equal(t.second, 42);
	assert.equal(t.millisecond, 420);
	
	t = datetime.time({});
	assert.equal(t.hour, 0);
	assert.equal(t.minute, 0);
	assert.equal(t.second, 0);
	assert.equal(t.millisecond, 0);
});

QUnit.test('replace', function(assert) {
	var t = datetime.time(15, 27, 42, 500, datetime.timezone.utc);
	var res = t.replace(16);
	assert.equal(res.hour, 16);
	assert.equal(res.minute, 27);
	assert.equal(res.second, 42);
	assert.equal(res.millisecond, 500);
	assert.equal(res.tzname(), 'UTC');
	
	res = t.replace({tzinfo: datetime.timezone(datetime.timedelta({minutes: 120}))});
	assert.equal(res.hour, 15);
	assert.equal(res.minute, 27);
	assert.equal(res.second, 42);
	assert.equal(res.millisecond, 500);
	assert.equal(res.tzname(), 'UTC+02:00');
});

QUnit.test('isoformat', function(assert) {
	var t = datetime.time(14, 26, 55);
	assert.equal(t.isoformat(), '14:26:55');
	
	t = datetime.time(14, 26, 55, 500);
	assert.equal(t.isoformat(), '14:26:55.500');
	
	var tz = datetime.timezone(datetime.timedelta(0, 3600));
	t = datetime.time(17, 57, 20, 0, tz);
	assert.equal(t.isoformat(), '17:57:20+01:00');
});

QUnit.test('strftime', function(assert) {
	assert.equal(datetime.time(12, 12, 30).strftime('%H:%M:%S'), '12:12:30');
	
	assert.equal(datetime.time(0).strftime('%I %p'), '12 AM');
	assert.equal(datetime.time(1).strftime('%I %p'), '01 AM');
	assert.equal(datetime.time(12).strftime('%I %p'), '12 PM');
	assert.equal(datetime.time(23).strftime('%I %p'), '11 PM');
});

QUnit.test('compare', function(assert) {
	assert.equal(datetime.time(10, 59).compare(datetime.time(11, 42)), -1);
	assert.equal(datetime.time(10, 48).compare(datetime.time(10, 42)), 1);
	assert.equal(datetime.time(11, 2).compare(datetime.time(11, 2)), 0);
	assert.raises(function() {
		datetime.time(11, 30).compare(0);
	}, TypeError);
});
