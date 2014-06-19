.PHONY: types-of-angles.js check setup watch

setup: check types-of-angles.js

check:
	node_modules/.bin/jshint js

types-of-angles.js:
	node_modules/.bin/browserify js/types-of-angles.js > $@

watch:
	node_modules/.bin/watchify js/types-of-angles.js -o types-of-angles.js
