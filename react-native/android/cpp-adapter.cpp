#include <jni.h>
#include "react-native.h"

extern "C"
JNIEXPORT jint JNICALL
Java_com_reactnative_ReactNativeModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return reactnative::multiply(a, b);
}
