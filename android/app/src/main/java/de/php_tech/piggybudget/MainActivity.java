package de.php_tech.piggybudget;

import java.io.File;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Objects;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "piggybudget";
    }

    
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    private void emitEvent(final String name, final Object content) {
        getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(name, content);
    }

    private String inputStreamToString(final InputStream s) throws IOException {
        final ByteArrayOutputStream result = new ByteArrayOutputStream();
        final byte[] buffer = new byte[1024];
        int length;
        while ((length = s.read(buffer)) != -1) {
            result.write(buffer, 0, length);
        }
        try {
            return result.toString("UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private void doCsvImport(final Uri csvUri) {
        try (final InputStream input = getApplicationContext().getContentResolver().openInputStream(csvUri)) {
            emitEvent("piggyCsvImportSuccess", inputStreamToString(input));
        } catch (IOException e) {
            emitEvent("piggyImportFailed", e.getClass().getSimpleName());
        }
    }

    @Override
    public void onCreate(final Bundle savedState) {
        final Intent intent = super.getIntent();
        final String action = intent.getAction();
        final String type = intent.getType();

        if (Objects.equals(action, Intent.ACTION_SEND) && Objects.equals(type, "text/csv")) {
            final Uri csvUri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
            
            if (csvUri != null) {
                doCsvImport(csvUri);
            } else {
                emitEvent("piggyImportFailed", "No URI received");
            }
        }

        super.onCreate(savedState);
    }
}
