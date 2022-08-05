#include <iostream>
#include <nan.h>

using namespace v8;

NAN_METHOD(hello) {
    // auto number = Nan::To<int>(info[0]).FromJust();

    // assume info[0]->IsFunction()
    v8::Local<v8::Function> cbFunc = v8::Local<v8::Function>::Cast(info[0]);
    Nan::Callback cb(cbFunc);
    // Nan::Callback cb;
    // cb.Reset(info[0].As<v8::Function>());

    /* Initialize count. */
    uint count = 0;

    for (uint i = 0; i < 1000000000; i++) {
        count += i;
    }

    /* Create a JS variable to hold our response. */
    auto numberJs = Nan::New(count);

    auto boolJs = Nan::New(info[0]->IsFunction());

    /* Create a JS variable to hold our response. */
    auto resp = Nan::New("hi there!").ToLocalChecked();

    // Callback
    // v8::Local<v8::Value> argv[] = { Nan::Null(), numberJs };
    v8::Local<v8::Value> argv[] = { Nan::Null(), resp };
    // v8::Local<v8::Value> argv[] = { Nan::Null() };
    cb.Call(2, argv);

    // Return value
    info.GetReturnValue().Set( Nan::Null() );
}

NAN_MODULE_INIT(init) {
    Nan::SetMethod(target, "hello", hello);
}

NODE_MODULE(cashlib, init)
