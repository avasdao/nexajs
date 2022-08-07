#include <cstring>
#include <iostream>
#include <openssl/rand.h>

// #define NAPI_VERSION 3 // FIXME: We need to detect NODE_GYP execution
#ifdef NAPI_VERSION
#include <napi.h>
#endif

#include "sha256.h"

#define SLAPI extern "C" __attribute__((visibility("default")))

SLAPI void sha256(const unsigned char *data, unsigned int len, unsigned char *result)
{
    CSHA256 sha;
    sha.Write(data, len);
    sha.Finalize(result);
}

SLAPI int RandomBytes(unsigned char *buf, int num)
{
    if (RAND_bytes(buf, num) != 1)
    {
        memset(buf, 0, num);
        return 0;
    }
    return num;
}

#ifdef NAPI_VERSION
Napi::String hello(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    return Napi::String::New(env, "hi there!");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
      Napi::String::New(env, "hello"),
      Napi::Function::New(env, hello)
  );

  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
#endif
