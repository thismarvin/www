NPM := npm

$(VERBOSE).SILENT:

.PHONY: @all
@all: @clean @build

node_modules:
	$(NPM) ci

.PHONY: @vendor
@vendor: node_modules

.PHONY: @check
@check: @vendor
	$(NPM) run check

.PHONY: @format
@format: @vendor
	$(NPM) run format

.PHONY: @lint
@lint: @vendor
	$(NPM) run lint

.PHONY: @build
@build: @vendor
	$(NPM) run build

.PHONY: @dev
@dev: @vendor
	$(NPM) run dev -- --host

.PHONY: @clean
@clean:
	if [ -d "build" ]; then rm -r build; fi
