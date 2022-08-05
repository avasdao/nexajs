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

    auto hasCallback = Nan::New(info[0]->IsFunction());

    /* Create a JS variable to hold our response. */
    auto resp = Nan::New("hi there!").ToLocalChecked();

    /* Set callback. */
    v8::Local<v8::Value> argv[] = { Nan::Null(), resp };
    cb.Call(2, argv);

    /* Set return value. */
    info.GetReturnValue().Set( Nan::Undefined() );
}

NAN_MODULE_INIT(init) {
    Nan::SetMethod(target, "hello", hello);
}

NODE_MODULE(cashlib, init)
