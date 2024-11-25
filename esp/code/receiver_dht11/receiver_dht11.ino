#include <RF24.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "time.h"

//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Thông tin Wi-Fi
#define WIFI_SSID "Gia phát 202"
#define WIFI_PASSWORD "ngoinhatailoc"

// Cấu hình NTP
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;      // Thời gian chênh lệch (0 cho UTC)
const int daylightOffset_sec = 0;  // Không có giờ mùa hè

//Thong tin Firebase
#define RTDB_URL "https://esp32-dht11-cf6e4-default-rtdb.firebaseio.com/"  // URL của Firebase
#define API_KEY "AIzaSyCT2W4m1gviSq_RDO2DHSCIsRdBP2VLnsY"                  // Token xác thực từ Firebase
#define FIREBASE_PROJECT_ID "esp32-dht11-cf6e4"
#define USER_EMAIL "0702@that.com"
#define USER_PASSWORD "123456"

//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;


unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;
// Variable to save USER UID
String uid;

RF24 radio(4, 5);

struct SensorData {
  float temperature;
  float humidity;
  int motion;
};

//kết nối wifi
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

//khoi tao Firebase : RTDB + Firestore
void initFirebase() {
  config.api_key = API_KEY;
  config.database_url = RTDB_URL;  //ket noi voi RTDB

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
//lay timestamp tu server
String getISO8601Timestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Không thể lấy thời gian");
    return "";
  }

  char timestamp[25];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);  // Định dạng ISO 8601
  return String(timestamp);
}


//gui data len RTDB
void sendToRTDB(float temp, float humidity, float motion) {
  if (WiFi.status() == WL_CONNECTED && Firebase.ready()) {
    //gửi nhiệt độ
    //in ra
    if (Firebase.RTDB.setFloat(&fbdo, "sensor_in_room/temperature", temp)) {
      Serial.println("Temperature sent to RTDB");
    } else {
      Serial.println("Failed to send temperature");
      Serial.println("Reason: " + fbdo.errorReason());
    }

    //gửi độ ẩm
    if (Firebase.RTDB.setFloat(&fbdo, "sensor_in_room/humidity", humidity)) {
      Serial.println("Humidity sent to RTDB");
    } else {
      Serial.println("Failed to send humidity");
      Serial.println("Reason: " + fbdo.errorReason());
    }

    //gửi chuyển động
    if (Firebase.RTDB.setInt(&fbdo, "sensor_in_room/motion", motion)) {
      Serial.println("Motion status sent to RTDB");
    } else {
      Serial.println("Failed to send motion status");
      Serial.println("Reason: " + fbdo.errorReason());
    }
  }
}

//gui data len Firestore
void firestoreDataCreate(double temp, double humi, int motion, String timestamp) {
  if (WiFi.status() == WL_CONNECTED && Firebase.ready()) {
    String documentPath = "House1/"+ String(USER_EMAIL) +"/history/" + timestamp;

    FirebaseJson content;
    content.set("fields/humidity/stringValue", String(temp).c_str());
    content.set("fields/temperature/stringValue", String(humi).c_str());
    content.set("fields/motion/stringValue", String(motion).c_str());
    content.set("fields/timestamp/stringValue", String(timestamp).c_str());  // Thay bằng thời gian hiện tại


    if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw())) {
      Serial.println("Tài liệu đã được tao thành công:");
      Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
    } else {
      Serial.print("Lỗi khi tao tài liệu: ");
      Serial.println(fbdo.errorReason());
    }
  }
}

void setup() {
  delay(1000);
  Serial.begin(9600);
  Serial.println("ESP32 IS RUNNING");  //kiểm tra module có hoạt động

  //ket noi wifi
  connectWifi();

  // Cấu hình NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  //ket noi firebase
  initFirebase();

  //tao kenh truyen thong
  radio.begin();
  radio.setChannel(5);                       // Kênh giống transmitter
  radio.setDataRate(RF24_250KBPS);           // Tốc độ dữ liệu giống transmitter
  radio.setPALevel(RF24_PA_LOW);             // Công suất thấp giống transmitter
  radio.openReadingPipe(1, 0x1234567890LL);  // Đặt địa chỉ ống dẫn đọc

  radio.startListening();  // Chế độ lắng nghe (nhận dữ liệu)
}

void loop() {
  //refresh token access neu can
  if (Firebase.isTokenExpired()) {
    Firebase.refreshToken(&config);
    Serial.println("Refresh token");
  }

  // Lấy dấu thời gian hiện tại
  String timestamp = getISO8601Timestamp();
  Serial.println("Thời gian hiện tại: " + timestamp);

  if (radio.available()) {
    SensorData receivedData;                                                                                                                                      // struct cho du lieu
    radio.read(&receivedData, sizeof(receivedData));                                                                                                              // Đọc dữ liệu từ NRF24L01
    Serial.println("Nhận được dữ liệu: " + String(receivedData.temperature) + "C " + String(receivedData.humidity) + "% " + String(receivedData.motion) + "M ");  //viet ra data nhan duoc

    if (millis() - sendDataPrevMillis > 3000 || sendDataPrevMillis == 0) {
      sendDataPrevMillis = millis();


      //gửi từng giá trị đến realtime database
      sendToRTDB(receivedData.temperature, receivedData.humidity, receivedData.motion);

      //gửi từng giá trị đến firestore
      firestoreDataCreate(receivedData.temperature, receivedData.humidity,receivedData.motion, timestamp);
    }
  } else {
    Serial.println("Không có dữ liệu đến");
  }

  Serial.println("----------------------------------");
  Serial.println("----------------------------------");
  Serial.println("----------------------------------");
}