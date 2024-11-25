#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Arduino.h>
// Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Cấu hình WiFi
#define WIFI_SSID "Gia phát 202"
#define WIFI_PASSWORD "ngoinhatailoc"
// api_key & rtdb _ url
#define RTDB_URL "https://esp32-dht11-cf6e4-default-rtdb.firebaseio.com/"  // URL của Firebase
#define API_KEY "AIzaSyCT2W4m1gviSq_RDO2DHSCIsRdBP2VLnsY"                  // Token xác thực từ Firebase
#define FIREBASE_PROJECT_ID "esp32-dht11-cf6e4"
#define USER_EMAIL "thien@that.com"
#define USER_PASSWORD "123456"

const int ppgPin = 34;         // Chân GPIO kết nối với tín hiệu analog của XD-50C
int bpm = 0;                     // Biến lưu giá trị BPM
unsigned long lastBeatTime = 0;  // Thời gian lần nhịp tim cuối


//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;
// Variable to save USER UID
String uid;

void connectWifi() {
  // Bắt đầu kết nối Wi-Fi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  // Chờ kết nối Wi-Fi
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
}

void initFirebase() {
  config.api_key = API_KEY;
  config.database_url = RTDB_URL;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  fbdo.setResponseSize(4096);

  // Assign the callback function for the long running token generation task
  config.token_status_callback = tokenStatusCallback;  //see addons/TokenHelper.h

  // Assign the maximum retry of token generation
  config.max_token_generation_retry = 5;

  // Initialize the library with the Firebase authen and config
  Firebase.begin(&config, &auth);

  // Getting the user UID might take a few seconds
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  // Print user UID
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);


  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void setup() {
  Serial.begin(115200);
  

   //ket noi wifi
   connectWifi();

  //ket noi firebase
  initFirebase();

  pinMode(ppgPin, INPUT);
}

void loop() {
  if (Firebase.isTokenExpired()) {
    Firebase.refreshToken(&config);
    Serial.println("Refresh token");
  }

  int signal = analogRead(ppgPin);  // Đọc tín hiệu từ cảm biến
  unsigned long currentTime = millis();

  // Lọc tín hiệu (giả sử tín hiệu tăng vượt ngưỡng là một nhịp)
  if (signal > 600) {                        // Điều chỉnh ngưỡng tùy thuộc tín hiệu
    if (currentTime - lastBeatTime > 300) {  // Giới hạn tối thiểu giữa 2 nhịp để tránh đếm sai
      unsigned long beatInterval = currentTime - lastBeatTime;
      lastBeatTime = currentTime;

      // Tính BPM
      bpm = 60000 / beatInterval;  // 60000ms trong 1 phút
      Serial.print("Nhịp tim (BPM): ");
      Serial.println(bpm);
      if (Firebase.ready()) {

        //gửi nhip tim
        //in ra
        if (Firebase.RTDB.setFloat(&fbdo, "nhip_tim_1/bpm", bpm)) {
          Serial.println("BPM sent to Firebase");
        } else {
          Serial.println("Failed to send BPM");
          Serial.println("Reason: " + fbdo.errorReason());
        }
      }else {
        Serial.println("khong ket noi voi firebase");
      }
    }
  }

  delay(10);  // Đợi để tránh đọc nhiễu tín hiệu
}