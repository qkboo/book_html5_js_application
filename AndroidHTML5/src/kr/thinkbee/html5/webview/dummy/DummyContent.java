package kr.thinkbee.html5.webview.dummy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Helper class for providing sample content for user interfaces created by
 * Android template wizards.
 * <p>
 * TODO: Replace all uses of this class before publishing your app.
 */
public class DummyContent {

    /**
     * An array of sample (dummy) items.
     */
    public static List<DummyItem> ITEMS = new ArrayList<DummyItem>();

    /**
     * A map of sample (dummy) items, by ID.
     */
    public static Map<String, DummyItem> ITEM_MAP = new HashMap<String, DummyItem>();

    static {
        // Add 3 sample items.
        addItem(new DummyItem("1", "Hello WebView", "file:///android_asset/hello-project/index.html"));
        addItem(new DummyItem("2", "PIM Demo", "file:///android_asset/hello-pim/index.html"));
        addItem(new DummyItem("3", "Part2-CSS Layout", "file:///android_asset/hello-part2/index.html"));
        addItem(new DummyItem("4", "Part2-CSS Animation", "file:///android_asset/hello-css/index.html"));
        addItem(new DummyItem("5", "Part2-jQery-Mobile", "file:///android_asset/hello-jqm/index.html"));
        
        addItem(new DummyItem("6", "Podcastbox UI", "file:///android_asset/podcastbox-jqm/index.html"));
        
        addItem(new DummyItem("7", "Orientation", "file:///android_asset/hello-orientation/index.html"));
        addItem(new DummyItem("8", "Battery", "file:///android_asset/hello-battery/battery-test.html"));
        addItem(new DummyItem("9", "Notification", "file:///android_asset/hello-notification/notification.html"));
        addItem(new DummyItem("10", "Geolocation", "file:///android_asset/hello-geolocation/index.html"));

        addItem(new DummyItem("11", "Audio&Video", "file:///android_asset/hello-media/index.html"));
        // File
        addItem(new DummyItem("12", "File", "file:///android_asset/hello-file/index.html"));
        addItem(new DummyItem("13", "Graphics", "file:///android_asset/hello-graphics/index.html"));
        addItem(new DummyItem("14", "Cocos-2d-x", "file:///android_asset/cocos2d-html5/index.html"));
        // App chache
        addItem(new DummyItem("15", "App Cache", "file:///android_asset/hello-appcache/index.html"));
        
    }

    private static void addItem(DummyItem item) {
        ITEMS.add(item);
        ITEM_MAP.put(item.id, item);
    }

    /**
     * A dummy item representing a piece of content.
     */
    public static class DummyItem {
        public String id;
        public String content;
        public String url;

        public DummyItem(String id, String content) {
            this.id = id;
            this.content = content;
        }
        public DummyItem(String id, String content, String url) {
            this.id = id;
            this.content = content;
            this.url = url;
        }

        @Override
        public String toString() {
            return content;
        }
    }
}
