package com.uofttimetable.acorn;

import android.util.Log;

import androidx.annotation.GuardedBy;
import androidx.annotation.Nullable;

import com.android.volley.AuthFailureError;
import com.android.volley.Header;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HttpHeaderParser;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

/** A canned request for retrieving the response body at a given URL as a String. */
public class StringRequest extends Request<WritableMap> {

  /** Lock to guard mListener as it is cleared on cancel() and read on delivery. */
  private final Object mLock = new Object();
  public Map<String, String> responseHeaders;
  public String url;

  @Nullable
  @GuardedBy("mLock")
  private Response.Listener<WritableMap> mListener;

  /**
   * Creates a new request with the given method.
   *
   * @param method the request {@link Method} to use
   * @param url URL to fetch the string at
   * @param listener Listener to receive the String response
   * @param errorListener Error listener, or null to ignore errors
   */
  public StringRequest(
      int method,
      String url,
      Response.Listener<WritableMap> listener,
      @Nullable Response.ErrorListener errorListener) {
    super(method, url, errorListener);
    mListener = listener;
  }

  /**
   * Creates a new GET request.
   *
   * @param url URL to fetch the string at
   * @param listener Listener to receive the String response
   * @param errorListener Error listener, or null to ignore errors
   */
  public StringRequest(
      String url, Response.Listener<WritableMap> listener, @Nullable Response.ErrorListener errorListener) {
    this(Method.GET, url, listener, errorListener);
  }

  @Override
  public void cancel() {
    super.cancel();
    synchronized (mLock) {
      mListener = null;
    }
  }

  @Override
  protected void deliverResponse(WritableMap response) {
    Response.Listener<WritableMap> listener;
    synchronized (mLock) {
      listener = mListener;
    }
    if (listener != null) {
      listener.onResponse(response);
    }
  }

  @Override
  @SuppressWarnings("DefaultCharset")
  protected Response<WritableMap> parseNetworkResponse(NetworkResponse response) {
    WritableMap responseObject = Arguments.createMap();
    String parsed;
    try {
      parsed = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
    } catch (UnsupportedEncodingException e) {
      // Since minSdkVersion = 8, we can't call
      // new String(response.data, Charset.defaultCharset())
      // So suppress the warning instead.
      parsed = new String(response.data);
    }
    responseObject.putString("body", parsed);

    WritableMap responseHeaders = Arguments.createMap();
    WritableArray cookies = Arguments.createArray();
    for (Header header: response.allHeaders) {
      if (header.getName().equals("Set-Cookie"))
        cookies.pushString(header.getValue());
      else
        responseHeaders.putString(header.getName(), header.getValue());
    }

    responseObject.putMap("headers", responseHeaders);
    responseObject.putArray("cookies", cookies);

    return Response.success(responseObject, HttpHeaderParser.parseCacheHeaders(response));
  }
}
