package kr.thinkbee.html5.webview;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.webkit.JavascriptInterface;

public class AndroidWebNotification {

    private Context mContext;

    public AndroidWebNotification(Context context) {
        mContext = context;
    }

    @JavascriptInterface
    public void startNotification(String message) {
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
                mContext).setSmallIcon(R.drawable.sign_34250_150)
                .setContentTitle("알려드립니다~~~").setContentText(message)
                .setAutoCancel(true);

        // Creates an explicit intent for an Activity in your app
        Intent resultIntent = new Intent(mContext, HtmlDetailActivity.class);
        resultIntent.putExtra("EXTRA_FROM_NOTIFICATION", true);

        // The stack builder object will contain an artificial back stack for
        // the
        // started Activity.
        // This ensures that navigating backward from the Activity leads out of
        // your application to the Home screen.
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(mContext);
        // Adds the back stack for the Intent (but not the Intent itself)
        stackBuilder.addParentStack(HtmlDetailActivity.class);
        // Adds the Intent that starts the Activity to the top of the stack
        stackBuilder.addNextIntent(resultIntent);
        PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0,
                PendingIntent.FLAG_UPDATE_CURRENT);
        mBuilder.setContentIntent(resultPendingIntent);
        NotificationManager mNotificationManager = (NotificationManager) mContext
                .getSystemService(Context.NOTIFICATION_SERVICE);
        // mId allows you to update the notification later on.
        mNotificationManager.notify(-1, mBuilder.build());
    }

}
