package kr.thinkbee.html5.webview;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Environment;
import android.provider.ContactsContract;
import android.support.v4.app.FragmentActivity;
import android.support.v4.widget.SimpleCursorAdapter;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.WebView;
import android.widget.Toast;

public class AndroidWebInterface {
    private final static String TAG = "WebAppInterface";
    Context mContext;
    WebView mWebView;

    /** Instantiate the interface and set the context */
    AndroidWebInterface(Context c, WebView wv) {
        mContext = c;
        mWebView = wv;

    }

    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public String getOS() {
        return Build.VERSION.RELEASE;
    }

    @JavascriptInterface
    public String getLocalIpAddress() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface
                    .getNetworkInterfaces(); en.hasMoreElements();) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf
                        .getInetAddresses(); enumIpAddr.hasMoreElements();) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress()) {
                        return inetAddress.getHostAddress().toString();
                    }
                }
            }
        } catch (SocketException ex) {
            Log.e("", ex.toString());
        }
        return "";
    }

    @JavascriptInterface
    public String retrieveContacts() {
        String _ID = ContactsContract.Contacts._ID;
        Uri CONTENT_URI = ContactsContract.Contacts.CONTENT_URI;
        Uri PhoneCONTENT_URI = ContactsContract.CommonDataKinds.Phone.CONTENT_URI;
        Uri EmailCONTENT_URI = ContactsContract.CommonDataKinds.Email.CONTENT_URI;

        String DISPLAY_NAME = ContactsContract.Contacts.DISPLAY_NAME;
        String HAS_PHONE_NUMBER = ContactsContract.Contacts.HAS_PHONE_NUMBER;
        String IS_USER_PROFILE = ContactsContract.Contacts.IS_USER_PROFILE;

        String Phone_CONTACT_ID = ContactsContract.CommonDataKinds.Phone.CONTACT_ID;
        String EmailCONTACT_ID = ContactsContract.CommonDataKinds.Email.CONTACT_ID;
        String NUMBER = ContactsContract.CommonDataKinds.Phone.NUMBER;
        String DATA = ContactsContract.CommonDataKinds.Email.DATA;

        JSONArray jsContacts = new JSONArray();
        ContentResolver cr = mContext.getContentResolver();
        Cursor cursor = cr.query(ContactsContract.Contacts.CONTENT_URI, null,
                null, null, null);

        if (cursor.getCount() > 0) {

            while (cursor.moveToNext()) {

                JSONObject jsContact = new JSONObject();
                String contactId = cursor.getString(cursor.getColumnIndex(_ID));

                // 이름 조회 =
                String name = cursor.getString(cursor
                        .getColumnIndex(DISPLAY_NAME));
                // 전화번호 조회
                String phoneNumber = "";
                JSONArray phones = new JSONArray(), emails = new JSONArray();
                int hasPhoneNum = Integer.parseInt(cursor.getString(cursor
                        .getColumnIndex(HAS_PHONE_NUMBER)));
                try {

                    jsContact.put("first_name", name);

                    if (hasPhoneNum > 0) { // 주소록에서 모든 전화번호를 조회
                        Cursor phoneCursor = cr.query(PhoneCONTENT_URI, null,
                                Phone_CONTACT_ID + "=?",
                                new String[] { contactId }, null);
                        while (phoneCursor.moveToNext()) {
                            phoneNumber = phoneCursor.getString(phoneCursor
                                    .getColumnIndex(NUMBER));
                            phones.put(phoneNumber);
                            Log.d(TAG, phoneNumber);
                        }
                        phoneCursor.close();
                        jsContact.put("phones", phones);

                        Cursor emailCursor = cr.query(EmailCONTENT_URI, null,
                                EmailCONTACT_ID + " = ?",
                                new String[] { contactId }, null);
                        while (emailCursor.moveToNext()) {
                            emails.put(emailCursor.getString(emailCursor
                                    .getColumnIndex(DATA)));
                        }
                        emailCursor.close();
                        jsContact.put("emails", emails);

                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                jsContacts.put(jsContact);

            }
        }
        // Log.d(TAG, jsContacts.toString());
        return jsContacts.toString();
    }

    HashMap<String, JSONObject> mObjectsFromJS = new HashMap<String, JSONObject>();

    @JavascriptInterface
    public void passObject(String name, String json) throws JSONException {
        mObjectsFromJS.put(name, new JSONObject(json));
    }

    @JavascriptInterface
    public String batteryStatus() {
        JSONObject jsStatus = new JSONObject();

        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = mContext.registerReceiver(null, ifilter);

        int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
        boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING
                || status == BatteryManager.BATTERY_STATUS_FULL;

        int chargePlug = batteryStatus.getIntExtra(
                BatteryManager.EXTRA_PLUGGED, -1);
        boolean usbCharge = chargePlug == BatteryManager.BATTERY_PLUGGED_USB;
        boolean acCharge = chargePlug == BatteryManager.BATTERY_PLUGGED_AC;

        int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

        float batteryPct = level / (float) scale;

        int temperature = batteryStatus.getIntExtra(
                BatteryManager.EXTRA_TEMPERATURE, 0);

        try {
            jsStatus.put("charging", isCharging);
            jsStatus.put("chargePlug", chargePlug);
            jsStatus.put("usbCharge", usbCharge);
            jsStatus.put("acCharge", acCharge);
            jsStatus.put("level", batteryPct);
            jsStatus.put("temparature", temperature);

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return jsStatus.toString();
    }

    @JavascriptInterface
    public void startBatteryReceiver() {
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        mContext.registerReceiver(batteryInfoReceiver, ifilter);
    }
    
    @JavascriptInterface
    public void stopBatteryReceiver() {
        mContext.unregisterReceiver(batteryInfoReceiver);
    }

    public BroadcastReceiver batteryInfoReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {

            int health = intent.getIntExtra(BatteryManager.EXTRA_HEALTH, 0);
            int icon_small = intent.getIntExtra(
                    BatteryManager.EXTRA_ICON_SMALL, 0);
            boolean present = intent.getExtras().getBoolean(
                    BatteryManager.EXTRA_PRESENT);
            String technology = intent.getExtras().getString(
                    BatteryManager.EXTRA_TECHNOLOGY);
            int temperature = intent.getIntExtra(
                    BatteryManager.EXTRA_TEMPERATURE, 0);

            int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);

            boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING
                    || status == BatteryManager.BATTERY_STATUS_FULL;

            int chargePlug = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED,
                    -1);
            boolean usbCharge = chargePlug == BatteryManager.BATTERY_PLUGGED_USB;
            boolean acCharge = chargePlug == BatteryManager.BATTERY_PLUGGED_AC;

            int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            int voltage = intent.getIntExtra(BatteryManager.EXTRA_VOLTAGE, 0);

            float batteryPct = level / (float) scale;

            JSONObject jsStatus = new JSONObject();
            try {
                jsStatus.put("charging", isCharging);
                jsStatus.put("chargePlug", chargePlug);
                jsStatus.put("usbCharge", usbCharge);
                jsStatus.put("acCharge", acCharge);
                jsStatus.put("level", batteryPct);
                jsStatus.put("temparature", temperature);

            } catch (JSONException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

            updateBatteryStatus(jsStatus.toString());
        }
    };

    @JavascriptInterface
    public void updateBatteryStatus(final String result) {

        ((Activity) mContext).runOnUiThread(new Runnable() {
            public void run() {
                String js = "javascript:updateBatteryStatus(" + result + ");";
                mWebView.loadUrl(js);
            }
        });
    }

    /**
     * Play an audio file from the webpage
     * 
     * @param aud
     */
    @JavascriptInterface
    public void audioPlay(String audioFile) {
        final MediaPlayer mp;

        try {
            AssetFileDescriptor fileDescriptor = mContext.getAssets().openFd(
                    audioFile);
            mp = new MediaPlayer();
            mp.setDataSource(fileDescriptor.getFileDescriptor(),
                    fileDescriptor.getStartOffset(), fileDescriptor.getLength());
            fileDescriptor.close();
            mp.prepare();
            mp.start();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    
    @JavascriptInterface
    public void videoPlay(String videoAddress) {
        Uri uri = Uri.fromFile(new File(Environment
                .getExternalStorageDirectory(), videoAddress));
        String extension = MimeTypeMap.getFileExtensionFromUrl(uri.getPath());
        String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(
                extension);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uri, mimeType);
        mContext.startActivity(intent);
    }

}
