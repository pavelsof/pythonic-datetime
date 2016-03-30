QUnit.module('timezone');

QUnit.test('init (args)', function(assert) {
	var cet = datetime.timezone(
		datetime.timedelta({minutes: 120}), 'CET'
	);
	assert.equal(cet.tzname(), 'CET');
	assert.equal(cet.utcoffset().days, 0);
	assert.equal(cet.utcoffset().seconds, 120*60);
	assert.equal(cet.utcoffset().milliseconds, 0);
	
	cet = datetime.timezone(datetime.timedelta({minutes: 120}));
	assert.equal(cet.tzname(), 'UTC+02:00');
	assert.equal(cet.utcoffset().days, 0);
	assert.equal(cet.utcoffset().seconds, 120*60);
	assert.equal(cet.utcoffset().milliseconds, 0);
});

QUnit.test('init (object)', function(assert) {
	var cet = datetime.timezone({
		offset: datetime.timedelta({minutes: 120}),
		name: 'CET'
	});
	assert.equal(cet.tzname(), 'CET');
	assert.equal(cet.utcoffset().days, 0);
	assert.equal(cet.utcoffset().seconds, 120*60);
	assert.equal(cet.utcoffset().milliseconds, 0);
	
	cet = datetime.timezone({
		offset: datetime.timedelta({minutes: 120})
	});
	assert.equal(cet.tzname(), 'UTC+02:00');
	assert.equal(cet.utcoffset().days, 0);
	assert.equal(cet.utcoffset().seconds, 120*60);
	assert.equal(cet.utcoffset().milliseconds, 0);
});

QUnit.test('utc', function(assert) {
	var utc = datetime.timezone.utc;
	assert.equal(utc.tzname(), 'UTC');
	assert.equal(utc.utcoffset().days, 0);
	assert.equal(utc.utcoffset().seconds, 0);
	assert.equal(utc.utcoffset().milliseconds, 0);
});

QUnit.test('tzname', function(assert) {
	var delta = datetime.timedelta(0);
	var tz = datetime.timezone(delta);
	assert.equal(tz.tzname(), 'UTC');
	
	delta = datetime.timedelta(0, 3600+1800);
	tz = datetime.timezone(delta);
	assert.equal(tz.tzname(), 'UTC+01:30');
	
	delta = datetime.timedelta(0, -3*3600-1800);
	tz = datetime.timezone(delta);
	assert.equal(tz.tzname(), 'UTC-03:30');
});
