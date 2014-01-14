NODEUNIT = node_modules/.bin/nodeunit
# test files must end with ".test.js"
TESTS = $(shell find test -name "*.test.js")

test: 
	$(NODEUNIT) $(TESTS)

.PHONY: test