#ifdef __cplusplus
#import "react-native.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNReactNativeSpec.h"

@interface ReactNative : NSObject <NativeReactNativeSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ReactNative : NSObject <RCTBridgeModule>
#endif

@end
