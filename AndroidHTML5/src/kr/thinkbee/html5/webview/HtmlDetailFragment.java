package kr.thinkbee.html5.webview;

import java.io.File;
import kr.thinkbee.html5.webview.dummy.DummyContent;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * A fragment representing a single Html5 detail screen. This fragment is either
 * contained in a {@link HtmlListActivity} in two-pane mode (on tablets) or a
 * {@link HtmlDetailActivity} on handsets.
 */
public class HtmlDetailFragment extends Fragment {
    /**
     * The fragment argument representing the item ID that this fragment
     * represents.
     */
    public static final String ARG_ITEM_ID = "item_id";

    /**
     * The dummy content this fragment is presenting.
     */
    private DummyContent.DummyItem mItem;

    private ValueCallback<Uri> uploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 1;

    
    WebChromeClient chromeClient = new WebChromeClient() {
        
        @Override
        public void onGeolocationPermissionsShowPrompt(String origin,
                GeolocationPermissions.Callback callback) {
            // Always grant permission since the app itself requires location
            // permission and the user has therefore already granted it
            callback.invoke(origin, true, false);
        }
        
        @Override
        public boolean onJsAlert(WebView view, String url, String message,
                final android.webkit.JsResult result) {
            new AlertDialog.Builder(getActivity())
                    .setTitle("Javascript Popup")
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok,
                            new AlertDialog.OnClickListener() {
                                public void onClick(DialogInterface dialog,
                                        int which) {
                                    result.confirm();
                                }
                            }).setCancelable(false).create().show();

            return true;
        };
        
    };
    
    
    WebViewClient defaultClient = new WebViewClient() {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            boolean shouldOverride = false;
            
            if (url.endsWith(".mp3")) {
                shouldOverride = true;
                Uri source = Uri.parse(url);

                // Make a new request pointing to the mp3 url
                DownloadManager.Request request = new DownloadManager.Request(source);
                request.setTitle(url.toString());
                
                // Use the same file name for the destination
                File destinationFile = new File ( DIRECTORY, source.getLastPathSegment());
                request.setDestinationUri(Uri.fromFile(destinationFile));
                // Add it to the manager
                mDownloadManager.enqueue(request);
            } else {
                return super.shouldOverrideUrlLoading(view, url);
            }



            //[[ Audio --- not work ]]
            //            if (url.endsWith(".mp3") || url.endsWith(".ogg")){
//                //Log.d(TAG, "Reproducir archivo OGG");
//                Uri tempPath = Uri.parse(url);
//                MediaPlayer player = MediaPlayer.create( getActivity(), tempPath);
//                player.start();
//                return true;
//            }else{
//                return super.shouldOverrideUrlLoading(view, url);
//            }
//            
            return true;
        };
    };

    private AndroidWebInterface mWebInterface;

    private AndroidWebNotification mWebNofication;
    

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public HtmlDetailFragment() {
    }

    DownloadManager mDownloadManager = null;
    String DIRECTORY = null;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments().containsKey(ARG_ITEM_ID)) {
            // Load the dummy content specified by the fragment
            // arguments. In a real-world scenario, use a Loader
            // to load content from a content provider.
            mItem = DummyContent.ITEM_MAP.get(getArguments().getString(
                    ARG_ITEM_ID));
        }

        mDownloadManager = (DownloadManager) getActivity()
                .getSystemService(Context.DOWNLOAD_SERVICE);

        DIRECTORY = Environment.getExternalStorageDirectory()
                + File.separator + "Thinkbee";
        final File destinationDir = new File(
                DIRECTORY, getActivity()
                        .getPackageName());
        if (!destinationDir.exists()) {
            destinationDir.mkdir(); 
        }
        
    }

    @SuppressLint("NewApi")
    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_html_detail,
                container, false);

        WebView wv = (WebView) rootView.findViewById(R.id.fragment_webview);
//
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        wv.getSettings().setBuiltInZoomControls(false);
        // Below required for geolocation
        wv.getSettings().setGeolocationEnabled(true);
        
        // Allow Cross Domain Scripting
        wv.getSettings().setAllowUniversalAccessFromFileURLs(true);

        mWebInterface = new AndroidWebInterface(getActivity(), wv);
        mWebNofication = new AndroidWebNotification(getActivity());
        
        wv.addJavascriptInterface( mWebInterface, "android");
        wv.addJavascriptInterface( mWebNofication, "androidNotification");
        
        wv.setWebViewClient(defaultClient);
        wv.setWebChromeClient(chromeClient);

            
        wv.getSettings().setDomStorageEnabled(true);
         
        // API 18이후에는 자동으로 처리한다.
        // Set cache size to 8 mb by default. should be more than enough
        wv.getSettings().setAppCacheMaxSize(1024*1024*8);
         
        wv.getSettings().setAppCachePath("/data/data/"+ getActivity().getPackageName() +"/cache");
        wv.getSettings().setAllowFileAccess(true);
        wv.getSettings().setAppCacheEnabled(true);
        
        wv.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
        
        
//        wv.setDownloadListener(new DownloadListener() {
//            
//            @Override
//            public void onDownloadStart(String url, String userAgent,
//                    String contentDisposition, String mimetype,
//                    long contentLength) {
//              Intent i = new Intent(Intent.ACTION_VIEW);
//              i.setData(Uri.parse(url));
//              startActivity(i);
//            }
//        });
        
        // API 19 (키캣) 이후 
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        
        
        
        wv.loadUrl(mItem.url);
        return rootView;
    }
    
    
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (uploadMessage == null) return;
            
            Uri result = intent == null || resultCode != getActivity().RESULT_OK ? null : intent.getData();
            uploadMessage.onReceiveValue(result);
            uploadMessage = null;
        }
        
    }
    
    @Override
    public void onDestroyView() {
        super.onDestroyView();
//        if(mWebInterface.batteryInfoReceiver!=null)
//            getActivity().unregisterReceiver(mWebInterface.batteryInfoReceiver);
    }
}
