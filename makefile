.PHONY: types-of-angles.js check setup

setup: check types-of-angles.js

check:
	node_modules/.bin/jshint js

types-of-angles.js:
	node_modules/.bin/browserify js/types-of-angles.js > $@
