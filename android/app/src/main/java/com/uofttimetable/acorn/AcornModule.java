package com.uofttimetable.acorn;

import android.os.Build;

import com.android.volley.AuthFailureError;
import com.android.volley.Response;
import com.android.volley.VolleyError;

import com.android.volley.toolbox.HttpResponse;
import com.android.volley.toolbox.HurlStack;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.PromiseImpl;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.android.volley.RequestQueue;
import com.android.volley.Request;
import com.android.volley.toolbox.Volley;

import java.io.IOException;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import com.uofttimetable.acorn.StringRequest;

public class AcornModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private RequestQueue queue;
  CookieManager manager;
  WritableMap data = Arguments.createMap();

  public AcornModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
    queue = Volley.newRequestQueue(reactContext, new HurlStack() {

      @Override
      public HttpResponse executeRequest(Request<?> request, Map<String, String> additionalHeaders) throws IOException, AuthFailureError {
        return super.executeRequest(request, additionalHeaders);
      }

    });
    manager = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
    CookieHandler.setDefault(manager);
  }

  @NonNull
  @Override
  public String getName() {
    return "AcornModule";
  }

  @ReactMethod
  public void request(String url, int method, ReadableMap body, Promise promise) {
    StringRequest stringRequest = new StringRequest(method, url,
        new Response.Listener<WritableMap>() {
          @Override
          public void onResponse(WritableMap response) {
            System.out.println(manager.getCookieStore().getCookies().toString());
            promise.resolve(response);
          }
        },
        new Response.ErrorListener() {
          @Override
          public void onErrorResponse(VolleyError error) {
            System.out.println(error);
            promise.reject(error);
          }
        }){
      @Override
      protected Map<String, String> getParams() throws AuthFailureError {
        Map<String, String> map = new HashMap<>();
        for (Map.Entry<String, Object> entry: body.toHashMap().entrySet()) {
          map.put(entry.getKey(), entry.getValue().toString());
        }
        return map;
      }
    };
    queue.add(stringRequest);
  }

  @ReactMethod
  public void clearCookies(Promise promise) {
    manager.getCookieStore().removeAll();
    promise.resolve(true);
  }
}
