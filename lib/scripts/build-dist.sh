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
echo "/* NexaJS <Address> v${todays_date} */" > ../cdn/address.js
browserify ../packages/Address/index.js -p esmify >> ../cdn/address.js
echo "    - address.js"
echo "/* NexaJS <Address> v${todays_date} */" > ../cdn/address.min.js
browserify ../packages/Address/index.js -p esmify | npx uglifyjs -c >> ../cdn/address.min.js
echo "    - address.min.js"
echo "  done."
echo

echo "  Building [ HD Node ] package..."
echo "/* NexaJS <HD Node> v${todays_date} */" > ../cdn/hdnode.js
browserify ../packages/Hdnode/index.js -p esmify >> ../cdn/hdnode.js
echo "    - hdnode.js"
echo "/* NexaJS <HD Node> v${todays_date} */" > ../cdn/hdnode.min.js
browserify ../packages/Hdnode/index.js -p esmify | npx uglifyjs -c >> ../cdn/hdnode.min.js
echo "    - hdnode.min.js"
echo "  done."
echo

echo "  Building [ Provider ] package..."
echo "/* NexaJS <Provider> v${todays_date} */" > ../cdn/provider.js
browserify ../packages/Provider/index.js -p esmify >> ../cdn/provider.js
echo "    - provider.js"
echo "/* NexaJS <Provider> v${todays_date} */" > ../cdn/provider.min.js
browserify ../packages/Provider/index.js -p esmify | npx uglifyjs -c >> ../cdn/provider.min.js
echo "    - provider.min.js"
echo "  done."
echo

echo "  Building [ Purse ] package..."
echo "/* NexaJS <Purse> v${todays_date} */" > ../cdn/purse.js
browserify ../packages/Purse/index.js -p esmify >> ../cdn/purse.js
echo "    - purse.js"
echo "/* NexaJS <Purse> v${todays_date} */" > ../cdn/purse.min.js
browserify ../packages/Purse/index.js -p esmify | npx uglifyjs -c >> ../cdn/purse.min.js
echo "    - purse.min.js"
echo "  done."
echo

echo "  Building [ Rostrum ] package..."
echo "/* NexaJS <Rostrum> v${todays_date} */" > ../cdn/rostrum.js
browserify ../packages/Rostrum/index.js -p esmify >> ../cdn/rostrum.js
echo "    - rostrum.js"
echo "/* NexaJS <Rostrum> v${todays_date} */" > ../cdn/rostrum.min.js
browserify ../packages/Rostrum/index.js -p esmify | npx uglifyjs -c >> ../cdn/rostrum.min.js
echo "    - rostrum.min.js"
echo "  done."
echo

echo "  Building [ Script ] package..."
echo "/* NexaJS <Script> v${todays_date} */" > ../cdn/script.js
browserify ../packages/Script/index.js -p esmify >> ../cdn/script.js
echo "    - script.js"
echo "/* NexaJS <Script> v${todays_date} */" > ../cdn/script.min.js
browserify ../packages/Script/index.js -p esmify | npx uglifyjs -c >> ../cdn/script.min.js
echo "    - script.min.js"
echo "  done."
echo

echo "  Building [ Transaction ] package..."
echo "/* NexaJS <Transaction> v${todays_date} */" > ../cdn/transaction.js
browserify ../packages/Transaction/index.js -p esmify >> ../cdn/transaction.js
echo "    - transaction.js"
echo "/* NexaJS <Transaction> v${todays_date} */" > ../cdn/transaction.min.js
browserify ../packages/Transaction/index.js -p esmify | npx uglifyjs -c >> ../cdn/transaction.min.js
echo "    - transaction.min.js"
echo "  done."
echo

echo "  Building [ Utilities ] package..."
echo "/* NexaJS <Utilities> v${todays_date} */" > ../cdn/utils.js
browserify ../packages/Utils/index.js -p esmify >> ../cdn/utils.js
echo "    - utils.js"
echo "/* NexaJS <Utilities> v${todays_date} */" > ../cdn/utils.min.js
browserify ../packages/Utils/index.js -p esmify | npx uglifyjs -c >> ../cdn/utils.min.js
echo "    - utils.min.js"
echo "  done."
echo

echo "  Building [Core Library ] package..."
echo "/* NexaJS Core Library v${todays_date} */" > ../cdn/nexa.js
browserify ./index.js -p esmify >> ../cdn/nexa.js
echo "    - nexa.js"
echo "/* NexaJS Core Library v${todays_date} */" > ../cdn/nexa.min.js
browserify ./index.js -p esmify | npx uglifyjs -c >> ../cdn/nexa.min.js
echo "    - nexa.min.js"
echo "  done."
echo

echo "  All packages were built successfully,"
echo "  and are now available in the [ /dist ] folder."
echo
