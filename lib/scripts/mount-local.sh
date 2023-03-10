echo
echo "  Cleaning up local mounts..."

rm -rf ../node_modules/@nexajs/address
rm -rf ../node_modules/@nexajs/purse
rm -rf ../node_modules/@nexajs/rostrum
rm -rf ../node_modules/@nexajs/rpc
rm -rf ../node_modules/@nexajs/utils

echo
echo "  Initializing [ node_modules/@nexajs ] folder..."
mkdir -p ../node_modules/@nexajs

echo
echo "  Creating local mounts..."
ln -s ../../../packages/Address ../node_modules/@nexajs/address
ln -s ../../../packages/Purse ../node_modules/@nexajs/purse
ln -s ../../../packages/Rostrum ../node_modules/@nexajs/rostrum
ln -s ../../../packages/Rpc ../node_modules/@nexajs/rpc
ln -s ../../../packages/Utils ../node_modules/@nexajs/utils

echo
echo "  All mounts created successfully!"
echo

ls -lah ../node_modules/@nexajs

echo
