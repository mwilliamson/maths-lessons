.PHONY: types-of-angles.js check setup watch

setup: check types-of-angles.js style.css

check:
	node_modules/.bin/jshint js

types-of-angles.js:
	node_modules/.bin/browserify js/types-of-angles.js -o $@

style.css: style.less
	node_modules/.bin/lessc style.less style.css

watch:
	node_modules/.bin/watchify js/types-of-angles.js -o types-of-angles.js
