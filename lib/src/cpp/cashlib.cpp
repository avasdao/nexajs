#include <cstring>
#include <iostream>
#include <napi.h>
#include <openssl/rand.h>

#define SLAPI extern "C" __attribute__((visibility("default")))

SLAPI void sha256(const unsigned char *data, unsigned int len, unsigned char *result)
{
    std::cout << "\nSHA in the house!";
    // if (RAND_bytes(buf, num) != 1)
    // {
    //     memset(buf, 0, num);
    //     return 0;
    // }
    // return 112;
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

NODE_API_MODULE(cashlib, Init)
