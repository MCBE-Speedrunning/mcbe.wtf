#!/usr/bin/env sh
set -x

MMV="$(which mmv 2> /dev/null || which mmv-rs 2> /dev/null)"

rules_folder=content/rules

find "${rules_folder}" -name '*.md' -type f -print -exec sed -i 's#/README.md#/#g; s#\.md##g' \{} \+

for folder in il catext fullgame
do
	find "${rules_folder}/$folder" -name '*.md' -type f -print -exec sed -i 's#(../#(../../#g; s#(./#(../#g' \{} \+
done

find "${rules_folder}" -name 'README.md' | "${MMV}" sed 's/README.md/index.md/'

mv "${rules_folder}"/index.md "${rules_folder}"/_index.md

grep -q "layout: single" "${rules_folder}"/_index.md || sed -i '1s/^/---\nlayout: single\n---\n/' "${rules_folder}"/_index.md
