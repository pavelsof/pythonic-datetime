QUnit.module('timedelta');

QUnit.test('init (args)', function(assert) {
	var delta = datetime.timedelta(5);
	assert.equal(delta.days, 5);
	assert.equal(delta.seconds, 0);
	assert.equal(delta.milliseconds, 0);
	
	delta = datetime.timedelta(0, 5);
	assert.equal(delta.days, 0);
	assert.equal(delta.seconds, 5);
	assert.equal(delta.milliseconds, 0);
	
	delta = datetime.timedelta(0, 0, 5);
	assert.equal(delta.days, 0);
	assert.equal(delta.seconds, 0);
	assert.equal(delta.milliseconds, 5);
	
	delta = datetime.timedelta(0, 0, 5000);
	assert.equal(delta.days, 0);
	assert.equal(delta.seconds, 5);
	assert.equal(delta.milliseconds, 0);
	
	delta = datetime.timedelta(0, 0, 5005);
	assert.equal(delta.days, 0);
	assert.equal(delta.seconds, 5);
	assert.equal(delta.milliseconds, 5);
	
	delta = datetime.timedelta(5, 3600*24 + 5, 5005);
	assert.equal(delta.days, 6);
	assert.equal(delta.seconds, 10);
	assert.equal(delta.milliseconds, 5);
	
	delta = datetime.timedelta(5, 5, 500, 1, 1, 5);
	assert.equal(delta.days, 40);
	assert.equal(delta.seconds, 3665);
	assert.equal(delta.milliseconds, 500);
});

QUnit.test('init (object)', function(assert) {
	var delta = datetime.timedelta({minutes: 120});
	assert.equal(delta.days, 0);
	assert.equal(delta.seconds, 120*60);
	assert.equal(delta.milliseconds, 0);
});

QUnit.test('total_seconds', function(assert) {
	var delta = datetime.timedelta(0, 60, 0);
	assert.equal(delta.total_seconds(), 60);
	
	delta = datetime.timedelta(1, 1, 1);
	assert.equal(delta.total_seconds(), 86401.001);
	
	delta = datetime.timedelta(0, -60, 1);
	assert.equal(delta.total_seconds(), -59.999);
	
	delta = datetime.timedelta(-1, -1, -1);
	assert.equal(delta.total_seconds(), -86401.001);
});

QUnit.test('compare', function(assert) {
	assert.equal(datetime.timedelta(-1).compare(datetime.timedelta(1)), -1);
	assert.equal(datetime.timedelta(1).compare(datetime.timedelta(-1)), 1);
	assert.equal(datetime.timedelta(0).compare(datetime.timedelta(0)), 0);
	assert.raises(function() {
		datetime.timedelta(0).compare(0);
	}, TypeError);
});

QUnit.test('add', function(assert) {
	var delta = datetime.timedelta(7, 30, 500);
	
	var result = delta.add(delta);
	assert.equal(result.days, 14);
	assert.equal(result.seconds, 61);
	assert.equal(result.milliseconds, 0);
	
	result = delta.add(datetime.timedelta(-7, -30, -500));
	assert.equal(result.days, 0);
	assert.equal(result.seconds, 0);
	assert.equal(result.milliseconds, 0);
	
	assert.raises(function() { delta.add(0); }, TypeError);
});

QUnit.test('subtract', function(assert) {
	var delta = datetime.timedelta(7, 30, 500);
	
	var result = delta.subtract(delta);
	assert.equal(result.days, 0);
	assert.equal(result.seconds, 0);
	assert.equal(result.milliseconds, 0);
	
	result = delta.subtract(datetime.timedelta(-7, -30, -500));
	assert.equal(result.days, 14);
	assert.equal(result.seconds, 61);
	assert.equal(result.milliseconds, 0);
	
	assert.raises(function() { delta.subtract(0); }, TypeError);
});

QUnit.test('multiply', function(assert) {
	var delta = datetime.timedelta(7, 30, 500);
	
	var result = delta.multiply(1);
	assert.equal(result.days, 7);
	assert.equal(result.seconds, 30);
	assert.equal(result.milliseconds, 500);
	
	result = delta.multiply(0);
	assert.equal(result.days, 0);
	assert.equal(result.seconds, 0);
	assert.equal(result.milliseconds, 0);
	
	assert.raises(function() { delta.multiply('stela'); }, TypeError);
});

QUnit.test('divide', function(assert) {
	var delta = datetime.timedelta(7, 30, 500);
	
	var result = delta.divide(1);
	assert.equal(result.days, 7);
	assert.equal(result.seconds, 30);
	assert.equal(result.milliseconds, 500);
	
	result = delta.divide(datetime.timedelta(0, 1));
	assert.equal(result, delta.total_seconds());
	
	assert.raises(function() { delta.divide('stela'); }, TypeError);
});

QUnit.test('python samples', function(assert) {
	var year = datetime.timedelta(365);
	assert.equal(year.total_seconds(), 31536000.0);
	
	var tenYears = year.multiply(10);
	assert.equal(tenYears.days / 365, 10);
	
	var nineYears = tenYears.subtract(year);
	assert.equal(nineYears.days / 365, 9);
	
	var threeYears = nineYears.divide(3);
	assert.equal(threeYears.days / 365, 3);
});
