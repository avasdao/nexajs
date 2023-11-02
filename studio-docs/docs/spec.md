---
sidebar_position: 2
---

# Garden Asset Specification

```
{
  "gasVer"   : "0.1",
  "title"    : "My First NFT",
  "series"   : "Homemade Crypto",
  "author"   : "Ava Nakamoto",
  "keywords" : [
                 "noob",
                 "artist",
                 "collection"
               ],
  "appuri"   : "https://homemadecrypto.com/",
  "category" : "NFT",
  "info"     : "Learn the TOP10 secrets of successful NFT collections.",
  "bindata"  : "0x1337beef",
  "data"     : {
                 "traits": { <see-below> }
               },
  "royalty"  : [
                 {
                   "address": "nexa:nq...",
                   "pct": 2000
                 }
               ],
  "license"  : "Public domain"
}
```

## Garden Asset Document
(Mandatory) String,
currently 0.1

## Title
(Mandatory) String:
title of this work

## Series
(Optional) String:
if this work is part of a series, this is the name of the series

## Author
(Mandatory) String:
Author's name

## Keywords
`[ "(Mandatory)", "Strings", "List of keywords or keyphrases for classification and search"]`

## App Uri
(Optional) String:
if this work enables some feature of an application, place the URI here.  This will allow the NFT to be "invoked".  See the "Invocation Rules" section for details.

## Category
(Optional) String:
Recommended classification of this asset, to be used by wallets for organizational purposes.  This field is the same as in the Token Description Document (TDD).  If category fields differ, prefer any data associated with the subgroup first, then prefer the NFT over the TDD.

## Info
(Mandatory, but may be the empty string) String:
Any description or information to be presented to the user.  MAY be text or HTML format.  However, viewing applications may accept limited HTML.  An NFT MUST NOT include external resources!

## Bindata
(Optional) String:  
Binary data in hex format.  The application using this NFT may interpret this data in an application-defined manner.  Note that for large amounts of binary data, an application SHOULD just create an additional file in the NFT.  This is a convenience field for small amounts of binary data related to the display of this NFT.

## Data
> "(optional)" : "dictionary"

```
{
  "Any": "application-specific fields may go here"
}
```

### Example #1: NFT Collection
```
{
  ...,
  "royalty": 20,
  "traits": {
    "backgrounds": [
      "spring": {
        "rarity": 8.33
      },
      "summer": {
        "rarity": 8.33
      },
      "fall": {
        "rarity": 8.33
      },
      "winter": {
        "rarity": 8.33
      }
    ]
  },
  ...,
}
```

### Example #2: Composable (IPFS) Collection
```
{
  ...,
  "assets": {
    "cover": [
      "spring": {
       "rarity": 8.33,
       "royalty": 20
      },
      "front",
      "back",
      "owner": [
        "intro.ogg",
        "./secret-map.osm",
      ]
    ]
  },
  ...,
}
```

## License
(Mandatory) String:
HTML or text license covering the use and transfer of this NFT.  This text MUST NOT include external links!  A view application MUST NOT display any external links or media.  No externally linked license is legally binding since it may be changed at any time.
