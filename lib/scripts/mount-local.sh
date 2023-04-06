echo
echo "  Cleaning up local mounts..."

rm -rf ../node_modules/@nexajs/address
rm -rf ../node_modules/@nexajs/blockchain
rm -rf ../node_modules/@nexajs/crypto
rm -rf ../node_modules/@nexajs/graph
rm -rf ../node_modules/@nexajs/hdnode
rm -rf ../node_modules/@nexajs/id
rm -rf ../node_modules/@nexajs/ledger
rm -rf ../node_modules/@nexajs/privacy
rm -rf ../node_modules/@nexajs/purse
rm -rf ../node_modules/@nexajs/rostrum
rm -rf ../node_modules/@nexajs/rpc
rm -rf ../node_modules/@nexajs/swap
rm -rf ../node_modules/@nexajs/token
rm -rf ../node_modules/@nexajs/transaction
rm -rf ../node_modules/@nexajs/utils
rm -rf ../node_modules/@nexajs/wallet

echo
echo "  Initializing [ node_modules/@nexajs ] folder..."
mkdir -p ../node_modules/@nexajs

echo
echo "  Creating local mounts..."
ln -s ../../../packages/Address ../node_modules/@nexajs/address
ln -s ../../../packages/Blockchain ../node_modules/@nexajs/blockchain
ln -s ../../../packages/Crypto ../node_modules/@nexajs/crypto
ln -s ../../../packages/Graph ../node_modules/@nexajs/graph
ln -s ../../../packages/Hdnode ../node_modules/@nexajs/hdnode
ln -s ../../../packages/Id ../node_modules/@nexajs/id
ln -s ../../../packages/Ledger ../node_modules/@nexajs/ledger
ln -s ../../../packages/Privacy ../node_modules/@nexajs/privacy
ln -s ../../../packages/Purse ../node_modules/@nexajs/purse
ln -s ../../../packages/Rostrum ../node_modules/@nexajs/rostrum
ln -s ../../../packages/Rpc ../node_modules/@nexajs/rpc
ln -s ../../../packages/Swap ../node_modules/@nexajs/swap
ln -s ../../../packages/Token ../node_modules/@nexajs/token
ln -s ../../../packages/Transaction ../node_modules/@nexajs/transaction
ln -s ../../../packages/Utils ../node_modules/@nexajs/utils
ln -s ../../../packages/Wallet ../node_modules/@nexajs/wallet

echo
echo "  All mounts created successfully!"
echo

ls -lah ../node_modules/@nexajs

echo
