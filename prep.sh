#!/usr/bin/env sh

pnpm install --frozen-lockfile
rm -r "themes/minecraft/assets/designsystemet-css" "themes/minecraft/assets/designsystemet-minecraft" "themes/minecraft/design-tokens"
cp -r "node_modules/@digdir/designsystemet-css/dist/src" "themes/minecraft/assets/designsystemet-css"

pnpm exec designsystemet tokens create \
	--main-colors "accent:#aadb74" \
	--neutral-color "#0d0d0d" \
	--support-colors "brand1:#bb5f61" "brand2:#68dfd5" "brand3:#6a431f" \
	--theme "minecraft" \
	--out-dir "./themes/minecraft/design-tokens"

pnpm exec designsystemet tokens build \
	--tokens "./themes/minecraft/design-tokens" \
	--out-dir "./themes/minecraft/assets/designsystemet-minecraft"

