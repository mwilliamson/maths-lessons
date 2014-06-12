.PHONY: types-of-angles.js

types-of-angles.js:
	node_modules/.bin/browserify js/types-of-angles.js > $@
