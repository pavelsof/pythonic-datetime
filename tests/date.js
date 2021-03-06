QUnit.module('date');

QUnit.test('init (args)', function(assert) {
	var d = datetime.date(2016, 3, 24);
	assert.equal(d.year, 2016);
	assert.equal(d.month, 3);
	assert.equal(d.day, 24);
});

QUnit.test('init (object)', function(assert) {
	var d = datetime.date({year: 2016, month: 3, day: 25});
	assert.equal(d.year, 2016);
	assert.equal(d.month, 3);
	assert.equal(d.day, 25);
});

QUnit.test('today', function(assert) {
	var d = datetime.date.today();
	var nativeD = new Date();
	assert.equal(d.year, nativeD.getFullYear());
	assert.equal(d.month, nativeD.getMonth()+1);
	assert.equal(d.day, nativeD.getDate());
});

QUnit.test('fromtimestamp', function(assert) {
	var t = 1458847813.9434295;
	var d = datetime.date.fromtimestamp(t);
	assert.equal(d.year, 2016);
	assert.equal(d.month, 3);
	assert.equal(d.day, 24);
});

QUnit.test('replace', function(assert) {
	var d = datetime.date(2016, 4, 1);
	var res = d.replace(2000);
	assert.equal(res.year, 2000);
	assert.equal(res.month, 4);
	assert.equal(res.day, 1);
});

QUnit.test('weekday', function(assert) {
	var d = datetime.date(2016, 3, 24);
	assert.equal(d.weekday(), 3);
});

QUnit.test('isoweekday', function(assert) {
	var d = datetime.date(2016, 3, 24);
	assert.equal(d.isoweekday(), 4);
});

QUnit.test('isoformat', function(assert) {
	var d = datetime.date(2016, 3, 24);
	assert.equal(d.isoformat(), '2016-03-24');
});

QUnit.test('strftime', function(assert) {
	var d = datetime.date(2016, 3, 27);
	assert.equal(d.strftime('%Y-%m-%d'), '2016-03-27');
});

QUnit.test('compare', function(assert) {
	assert.equal(datetime.date(2016, 3, 3).compare(datetime.date(2016, 3, 28)), -1);
	assert.equal(datetime.date(2016, 3, 29).compare(datetime.date(2016, 3, 28)), 1);
	assert.equal(datetime.date(2016, 3, 29).compare(datetime.date(2016, 3, 29)), 0);
	assert.raises(function() {
		datetime.date(2016, 3, 29).compare(0);
	}, TypeError);
});

QUnit.test('add', function(assert) {
	var d = datetime.date(2016, 3, 30);
	var res = d.add(datetime.timedelta({days: 2}));
	assert.equal(res.year, 2016);
	assert.equal(res.month, 4);
	assert.equal(res.day, 1);
	
	d = datetime.date(2016, 3, 23);
	res = d.add(datetime.timedelta({hours: 24}));
	assert.equal(res.year, 2016);
	assert.equal(res.month, 3);
	assert.equal(res.day, 24);
	
	assert.raises(function() { d.add(0); }, TypeError);
});

QUnit.test('subtract', function(assert) {
	var d = datetime.date(2016, 4, 1);
	var res = d.subtract(datetime.timedelta({days: 2, hours: 23}));
	assert.equal(res.year, 2016);
	assert.equal(res.month, 3);
	assert.equal(res.day, 30);
	
	res = d.subtract(res);
	assert.equal(res.total_seconds(), 2*24*3600);
	
	assert.raises(function() { d.subtract(0); }, TypeError);
});
