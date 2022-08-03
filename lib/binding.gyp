{
  "targets": [{
    "target_name": "cashlib",
    "sources": [ "cashlib.cc" ],
    "include_dirs": [ "<!(node -e \"require('nan')\")" ]
  }]
}
