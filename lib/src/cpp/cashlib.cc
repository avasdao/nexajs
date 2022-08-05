#include <iostream>
#include <nan.h>
using namespace v8;

NAN_METHOD(hello) {
    // auto number = Nan::To<int>(info[0]).FromJust();

    Nan::Callback cb;
    cb.Reset(info[0].As<v8::Function>());
    // Nan::Callback cb = Nan::Callback(info[0].As<v8::Function>());

    /* Initialize count. */
    uint count = 0;

    for (uint i = 0; i < 1000000000; i++) {
        count = i;
    }

    /* Create a JS variable to hold our response. */
    // auto numberJs = Nan::New(count);
    // auto stringJs = Nan::To<string>("hello").FromJust();

    // Nan::MaybeLocal<v8::String> stringJs = Nan::To<v8::String>("hello");

    // v8::Local<v8::Value> argv[] = { Nan::Null(), stringJs };
    // cb.Call(2, argv);

    // info.GetReturnValue().Set(New<v8::Null>());

    Nan::Callback callback;
    callback.Reset();

    // info.GetReturnValue().Set(callback.IsEmpty());

    // v8::Local<v8::Value> argv[] = { Nan::Null(), callback.IsEmpty() };
    // info.GetReturnValue().Set(argv);
}

NAN_MODULE_INIT(init) {
    Nan::SetMethod(target, "hello", hello);
}

NODE_MODULE(cashlib, init)
