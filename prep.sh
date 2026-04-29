#!/usr/bin/env sh

pnpm install --frozen-lockfile
rm -r "themes/minecraft/assets/designsystemet-css" "themes/minecraft/assets/designsystemet-minecraft" "themes/minecraft/design-tokens"
cp -r "node_modules/@digdir/designsystemet-css/dist/src" "themes/minecraft/assets/designsystemet-css"


pnpm exec designsystemet tokens create \
	--config "./themes/minecraft/designsystemet.config.json" \
	--out-dir "./themes/minecraft/design-tokens"
pnpm exec designsystemet tokens build \
	--config "./themes/minecraft/designsystemet.config.json" \
	--out-dir "./themes/minecraft/assets/designsystemet-minecraft"

