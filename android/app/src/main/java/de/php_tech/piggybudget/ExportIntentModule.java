package de.php_tech.piggybudget;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import android.support.v4.content.FileProvider;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;
import java.nio.file.Files;
import java.io.File;
import java.io.FileWriter;
import java.io.BufferedWriter;
import java.io.IOException;

@ReactModule(name="ExportIntent")
public class ExportIntentModule extends ReactContextBaseJavaModule {
  public ExportIntentModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "ExportIntent";
  }

  @ReactMethod
  public void exportCsv(
    final String csv,
    final Callback onSuccess,
    final Callback onError) {
      final ReactApplicationContext context = getReactApplicationContext();
      final Intent sharingIntent = new Intent(android.content.Intent.ACTION_SEND);
      sharingIntent.setType("text/csv");
      BufferedWriter w = null;
      try {
        final File tempFile = File.createTempFile(
            "piggybudget",
            ".csv",
            context.getFilesDir());
        w = new BufferedWriter(new FileWriter(tempFile));
        w.write(csv);
        sharingIntent.putExtra(
          Intent.EXTRA_STREAM,
          FileProvider.getUriForFile(
            context,
            "de.php_tech.fileprovider",
            tempFile));
        sharingIntent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        Intent i = Intent.createChooser(sharingIntent, "Send to");
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(i);
        onSuccess.invoke();
      } catch (IOException e) {
        onError.invoke("File system error, permissions?", e.getMessage());
      } finally {
          try {
              if (w != null)
                w.close();
          } catch (IOException e) {
              // ...
          }
      }
   
  }
}
