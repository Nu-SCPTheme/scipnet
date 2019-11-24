#
# Makefile
#
# scipnet - Frontend scripts for Mekhane
# Copyright (C) 2019 not_a_seagull
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

include sources.mk

default: dist/bundle.js

dist/bundle.js: $(SOURCES)
	npm run gulp

test: dist/bundle.js test/test.js
	npm run test
