#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   BERKAH PERDANA - APK BUILDER${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

TARGET_URL="https://server-enterprise.pages.dev/index.html"
ORG_NAME="erpberkahperdana"
REPO_NAME="erpberkahperdana.github.io"
BRANCH="main"
OUTPUT_DIR="$HOME/APK_RESULT"
WORK_DIR="$HOME/temp_build"

mkdir -p "$OUTPUT_DIR" "$WORK_DIR"

echo -e "\n${YELLOW}🔑 Masukkan GitHub Token:${NC}"
read -p "Token: " MY_TOKEN
[ -z "$MY_TOKEN" ] && { echo -e "${RED}❌ Token wajib!${NC}"; exit 1; }

echo -e "\n${YELLOW}[1/4]${NC} Setup SDK..."
SDK_DIR="$HOME/android-sdk"

if [ ! -d "$SDK_DIR/cmdline-tools/latest" ]; then
    mkdir -p "$SDK_DIR" && cd "$SDK_DIR"
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
    unzip -q commandlinetools-linux-*.zip && rm -f commandlinetools-linux-*.zip
    mkdir -p cmdline-tools/latest && mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
fi

export ANDROID_HOME="$SDK_DIR"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin"
yes | sdkmanager --licenses &>/dev/null
echo -e "${GREEN}✅ SDK siap${NC}"

build_apk() {
    local ID=$1
    local NAME=$2
    local OUT=$3
    local DIR="$WORK_DIR/$ID"
    
    echo -e "\n${BLUE}▶ Building $NAME${NC}"
    rm -rf "$DIR"
    mkdir -p "$DIR/app/src/main/java/com/berkahperdana/$ID"
    cd "$DIR"
    
    cat > "app/src/main/java/com/berkahperdana/$ID/MainActivity.java" <<EOF
package com.berkahperdana.$ID;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import androidx.appcompat.app.AppCompatActivity;
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView webView = new WebView(this);
        setContentView(webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("$TARGET_URL");
    }
}
EOF
    
    cat > "app/src/main/AndroidManifest.xml" <<EOF
<manifest package="com.berkahperdana.$ID">
    <uses-permission android:name="android.permission.INTERNET"/>
    <application android:usesCleartextTraffic="true" android:label="$NAME">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF
    
    cat > "app/build.gradle" <<EOF
plugins { id 'com.android.application' }
android {
    namespace 'com.berkahperdana.$ID'
    compileSdk 34
    defaultConfig {
        applicationId "com.berkahperdana.$ID"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}
dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
}
EOF
    
    cat > "build.gradle" <<EOF
buildscript {
    repositories { google(); mavenCentral() }
    dependencies { classpath 'com.android.tools.build:gradle:8.1.4' }
}
allprojects { repositories { google(); mavenCentral() } }
EOF
    
    cat > "settings.gradle" <<EOF
pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositories { google(); mavenCentral() } }
rootProject.name = "$NAME"
include ':app'
EOF
    
    mkdir -p gradle/wrapper
    cat > "gradle/wrapper/gradle-wrapper.properties" <<EOF
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-bin.zip
EOF
    
    cat > "gradlew" <<'EOF'
#!/bin/sh
exec java -classpath "gradle/wrapper/gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain "$@"
EOF
    chmod +x gradlew
    
    cd gradle/wrapper
    wget -q https://github.com/gradle/gradle/raw/v8.0.0/gradle/wrapper/gradle-wrapper.jar
    cd ../..
    
    ./gradlew assembleDebug
    
    if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
        cp "app/build/outputs/apk/debug/app-debug.apk" "$OUTPUT_DIR/$OUT"
        echo -e "${GREEN}   ✅ $OUT selesai${NC}"
    else
        echo -e "${RED}   ❌ Gagal build $NAME${NC}"
        return 1
    fi
}

build_apk "cashier" "ERP Cashier" "ERP_Cashier.apk"
build_apk "owner" "ERP Owner" "ERP_Owner.apk"

echo -e "\n${BLUE}[4/4]${NC} Push ke GitHub..."
REPO_DIR="$HOME/${REPO_NAME}"

if [ -d "$REPO_DIR/.git" ]; then
    cd "$REPO_DIR"
    git pull origin $BRANCH 2>/dev/null
else
    rm -rf "$REPO_DIR"
    git clone "https://${MY_TOKEN}@github.com/${ORG_NAME}/${REPO_NAME}.git" "$REPO_DIR"
    cd "$REPO_DIR"
fi

cat > "index.html" <<EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ERP Berkah Perdana</title>
    <style>
        body{background:linear-gradient(135deg,#0f0c29,#302b63);font-family:monospace;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:20px}
        .card{background:rgba(0,0,0,0.7);border:2px solid #0ff;border-radius:30px;padding:40px;max-width:500px;text-align:center}
        h1{color:#0ff;font-size:28px}
        .btn{display:block;background:linear-gradient(90deg,#0ff,#0f8);color:#000;padding:14px;margin:15px 0;border-radius:50px;text-decoration:none;font-weight:bold;font-size:18px}
        .footer{margin-top:30px;font-size:10px;opacity:0.6}
    </style>
</head>
<body>
    <div class="card">
        <h1>⚡ ERP BERKAH PERDANA</h1>
        <p>Internal Distribution - Owner Only</p>
        <a href="ERP_Cashier.apk" class="btn">📱 DOWNLOAD APK CASHIER</a>
        <a href="ERP_Owner.apk" class="btn">👑 DOWNLOAD APK OWNER</a>
        <div class="footer">© 2026 Berkah Perdana Enterprise<br>Share manual oleh owner ke internal team</div>
    </div>
</body>
</html>
EOF

cp "$OUTPUT_DIR/ERP_Cashier.apk" . 2>/dev/null
cp "$OUTPUT_DIR/ERP_Owner.apk" . 2>/dev/null

git add . && git commit -m "Auto build: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null
git push origin $BRANCH

echo -e "\n${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ SEMUA SELESAI!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "\n📦 APK tersimpan di: ${OUTPUT_DIR}/"
echo -e "   - ERP_Cashier.apk"
echo -e "   - ERP_Owner.apk"
echo -e "\n🌐 Landing page: https://${ORG_NAME}.github.io/"
echo -e "\n📝 Hapus APK lama: rm -f ${OUTPUT_DIR}/ERP_*.apk"
