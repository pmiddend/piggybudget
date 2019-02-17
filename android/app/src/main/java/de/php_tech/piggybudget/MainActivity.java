package de.php_tech.piggybudget;

import java.io.File;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.BufferedReader;
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

    private void doCsvImport(final Uri csvUri) {
        Log.i("PiggyBudget", "=============== starting import");
        try (final BufferedReader reader = new BufferedReader(new InputStreamReader(getApplicationContext().getContentResolver().openInputStream(csvUri), StandardCharsets.UTF_8))) {
            final WritableArray result = Arguments.createArray();
            while (true) {
                Log.i("PiggyBudget", "=============== reading line");
                final String nextLine = reader.readLine();
                if (nextLine == null)
                    break;
                final String[] parts = nextLine.split(",");
                if (parts.length != 3) {
                    emitEvent("piggyImportFailed", "Invalid CSV file");
                    return;
                }
                final String amount = parts[0];
                final String comment = parts[1];
                final String date = parts[2];
                final Map<String, Object> transaction = new HashMap<>();
                transaction.put("amount", parts[0]);
                transaction.put("comment", parts[1]);
                transaction.put("date", parts[2]);
                result.pushMap(Arguments.makeNativeMap(transaction));
            }
            emitEvent("piggyCsvImportSuccess", result);
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
