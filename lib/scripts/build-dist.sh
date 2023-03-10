echo

echo "  Building browser-friendly packages for CDN..."
echo "  ---------------------------------------------"
echo

echo "  Moving to Core library root folder..."
cd ..
echo

echo "  Restore pre-built packages..."
echo
rm -f yarn.lock
yarn
echo

echo "  Building [ Address ] package..."
browserify ../packages/Address/index.js -p esmify > ./dist/address.js
echo "    - address.js"
browserify ../packages/Address/index.js -p esmify | uglifyjs -c > ./dist/address.min.js
echo "    - address.min.js"
echo "  done."
echo

echo "  Building [ Rostrum ] package..."
browserify ../packages/Rostrum/index.js -p esmify > ./dist/rostrum.js
echo "    - rostrum.js"
browserify ../packages/Rostrum/index.js -p esmify | uglifyjs -c > ./dist/rostrum.min.js
echo "    - rostrum.min.js"
echo "  done."
echo

echo "  Building [ Utilities ] package..."
browserify ../packages/Utils/index.js -p esmify > ./dist/utils.js
echo "    - utils.js"
browserify ../packages/Utils/index.js -p esmify | uglifyjs -c > ./dist/utils.min.js
echo "    - utils.min.js"
echo "  done."
echo

echo "  Building [ Nexa (Core) ] package..."
browserify ./index.js -p esmify > ./dist/nexa.js
echo "    - nexa.js"
browserify ./index.js -p esmify | uglifyjs -c > ./dist/nexa.min.js
echo "    - nexa.min.js"
echo "  done."
echo

echo "  All packages were built successfully,"
echo "  and are now available in the [ /dist ] folder."
echo
