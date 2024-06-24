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

# Set today's date
todays_date=$(date +'%Y.%m.%d') # ISO format is: YYYYMMDD

echo "  Building [ Address ] package..."
echo "/* NEXA.js <Address> v${todays_date} */" > ../cdn/js/address.js
browserify ../packages/Address/index.js -p esmify >> ../cdn/js/address.js
echo "    - address.js"
echo "/* NEXA.js <Address> v${todays_date} */" > ../cdn/js/address.min.js
browserify ../packages/Address/index.js -p esmify | npx uglify-js -c >> ../cdn/js/address.min.js
echo "    - address.min.js"
echo "  done."
echo

echo "  Building [ HD Node ] package..."
echo "/* NEXA.js <HD Node> v${todays_date} */" > ../cdn/js/hdnode.js
browserify ../packages/Hdnode/index.js -p esmify >> ../cdn/js/hdnode.js
echo "    - hdnode.js"
echo "/* NEXA.js <HD Node> v${todays_date} */" > ../cdn/js/hdnode.min.js
browserify ../packages/Hdnode/index.js -p esmify | npx uglify-js -c >> ../cdn/js/hdnode.min.js
echo "    - hdnode.min.js"
echo "  done."
echo

echo "  Building [ Provider ] package..."
echo "/* NEXA.js <Provider> v${todays_date} */" > ../cdn/js/provider.js
browserify ../packages/Provider/index.js -p esmify >> ../cdn/js/provider.js
echo "    - provider.js"
echo "/* NEXA.js <Provider> v${todays_date} */" > ../cdn/js/provider.min.js
browserify ../packages/Provider/index.js -p esmify | npx uglify-js -c >> ../cdn/js/provider.min.js
echo "    - provider.min.js"
echo "  done."
echo

echo "  Building [ Purse ] package..."
echo "/* NEXA.js <Purse> v${todays_date} */" > ../cdn/js/purse.js
browserify ../packages/Purse/index.js -p esmify >> ../cdn/js/purse.js
echo "    - purse.js"
echo "/* NEXA.js <Purse> v${todays_date} */" > ../cdn/js/purse.min.js
browserify ../packages/Purse/index.js -p esmify | npx uglify-js -c >> ../cdn/js/purse.min.js
echo "    - purse.min.js"
echo "  done."
echo

echo "  Building [ Rostrum ] package..."
echo "/* NEXA.js <Rostrum> v${todays_date} */" > ../cdn/js/rostrum.js
browserify ../packages/Rostrum/index.js -p esmify >> ../cdn/js/rostrum.js
echo "    - rostrum.js"
echo "/* NEXA.js <Rostrum> v${todays_date} */" > ../cdn/js/rostrum.min.js
browserify ../packages/Rostrum/index.js -p esmify | npx uglify-js -c >> ../cdn/js/rostrum.min.js
echo "    - rostrum.min.js"
echo "  done."
echo

echo "  Building [ Script ] package..."
echo "/* NEXA.js <Script> v${todays_date} */" > ../cdn/js/script.js
browserify ../packages/Script/index.js -p esmify >> ../cdn/js/script.js
echo "    - script.js"
echo "/* NEXA.js <Script> v${todays_date} */" > ../cdn/js/script.min.js
browserify ../packages/Script/index.js -p esmify | npx uglify-js -c >> ../cdn/js/script.min.js
echo "    - script.min.js"
echo "  done."
echo

echo "  Building [ Transaction ] package..."
echo "/* NEXA.js <Transaction> v${todays_date} */" > ../cdn/js/transaction.js
browserify ../packages/Transaction/index.js -p esmify >> ../cdn/js/transaction.js
echo "    - transaction.js"
echo "/* NEXA.js <Transaction> v${todays_date} */" > ../cdn/js/transaction.min.js
browserify ../packages/Transaction/index.js -p esmify | npx uglify-js -c >> ../cdn/js/transaction.min.js
echo "    - transaction.min.js"
echo "  done."
echo

echo "  Building [ Utilities ] package..."
echo "/* NEXA.js <Utilities> v${todays_date} */" > ../cdn/js/utils.js
browserify ../packages/Utils/index.js -p esmify >> ../cdn/js/utils.js
echo "    - utils.js"
echo "/* NEXA.js <Utilities> v${todays_date} */" > ../cdn/js/utils.min.js
browserify ../packages/Utils/index.js -p esmify | npx uglify-js -c >> ../cdn/js/utils.min.js
echo "    - utils.min.js"
echo "  done."
echo

echo "  Building [Core Library ] package..."
echo "/* NEXA.js Core Library v${todays_date} */" > ../cdn/js/nexa.js
browserify ./index.js -p esmify >> ../cdn/js/nexa.js
echo "    - nexa.js"
echo "/* NEXA.js Core Library v${todays_date} */" > ../cdn/js/nexa.min.js
browserify ./index.js -p esmify | npx uglify-js -c >> ../cdn/js/nexa.min.js
echo "    - nexa.min.js"
echo "  done."
echo

echo "  All packages were built successfully,"
echo "  and are now available in the [ /dist ] folder."
echo
