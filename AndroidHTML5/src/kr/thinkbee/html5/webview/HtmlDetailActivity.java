package kr.thinkbee.html5.webview;

import android.app.ActionBar;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.NavUtils;
import android.view.MenuItem;
import android.view.ViewConfiguration;
import android.view.Window;
import android.view.WindowManager;

/**
 * An activity representing a single Html5 detail screen. This activity is only
 * used on handset devices. On tablet-size devices, item details are presented
 * side-by-side with a list of items in a {@link HtmlListActivity}.
 * <p>
 * This activity is mostly just a 'shell' activity containing nothing more than
 * a {@link HtmlDetailFragment}.
 */
public class HtmlDetailActivity extends FragmentActivity {

    private boolean hasActionbar = false;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
//            hasActionbar = !ViewConfiguration.get(this)
//                    .hasPermanentMenuKey();
//            if (hasActionbar) {
//                getWindow().requestFeature(Window.FEATURE_ACTION_BAR);
//                getActionBar().show();
//            } else {
//                ActionBar actionBar = getActionBar();
//                actionBar.setDisplayShowTitleEnabled(false);
//                getActionBar().hide();
//            }
//        } else {
//            this.requestWindowFeature(Window.FEATURE_NO_TITLE);
//        }
//
//        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
//                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_html_detail);
        
        // Show the Up button in the action bar.
        getActionBar().setDisplayHomeAsUpEnabled(true);

        // savedInstanceState is non-null when there is fragment state
        // saved from previous configurations of this activity
        // (e.g. when rotating the screen from portrait to landscape).
        // In this case, the fragment will automatically be re-added
        // to its container so we don't need to manually add it.
        // For more information, see the Fragments API guide at:
        //
        // http://developer.android.com/guide/components/fragments.html
        //
        if (savedInstanceState == null) {
            // Create the detail fragment and add it to the activity
            // using a fragment transaction.
            Bundle arguments = new Bundle();
            arguments.putString(HtmlDetailFragment.ARG_ITEM_ID, getIntent()
                    .getStringExtra(HtmlDetailFragment.ARG_ITEM_ID));
            HtmlDetailFragment fragment = new HtmlDetailFragment();
            fragment.setArguments(arguments);
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.html_detail_container, fragment).commit();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == android.R.id.home) {
            // This ID represents the Home or Up button. In the case of this
            // activity, the Up button is shown. Use NavUtils to allow users
            // to navigate up one level in the application structure. For
            // more details, see the Navigation pattern on Android Design:
            //
            // http://developer.android.com/design/patterns/navigation.html#up-vs-back
            //
            NavUtils.navigateUpTo(this,
                    new Intent(this, HtmlListActivity.class));
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
