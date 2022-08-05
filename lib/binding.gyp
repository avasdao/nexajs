{
  "targets": [{
    "target_name": "cashlib",
    "sources": [ "./src/cpp/cashlib.cc" ],
    "include_dirs": [ "<!(node -e \"require('nan')\")" ]
  }]
}
