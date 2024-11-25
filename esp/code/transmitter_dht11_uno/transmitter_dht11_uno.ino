#include "DHT.h"
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

#define DHTPIN 3       // Chân digital nối với DHT11
#define DHTTYPE DHT11  // Loại cảm biến DHT11
#define SR505_PIN A3   // Pin đầu ra của SR505
#define LEDPIN 5       // Pin kết nối LED

RF24 radio(9, 10);  // CE pin 7, CSN pin 8


DHT dht(DHTPIN, DHTTYPE);  // Khởi tạo cảm biến

struct SensorData{
  float temperature;
  float humidity;
  int motion;
};

void setup() {
  Serial.begin(9600);
  pinMode(SR505_PIN, INPUT);  // Cài đặt Pin 3 (SR505) là Input
  pinMode(LEDPIN, OUTPUT);    // Cài đặt LED làm đầu ra

  dht.begin();  // Khởi động DHT11
  radio.begin();
  radio.openWritingPipe(0x1234567890LL);  // Mở ống dẫn viết
  // radio.setPALevel(RF24_PA_MAX);    // Đặt mức công suất tối đa
  // radio.setDataRate(RF24_250KBPS);  // Đặt tốc độ dữ liệu

  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_LOW);
  radio.setChannel(5);

  radio.stopListening();  // Ngừng lắng nghe
}

void loop() {
  // Đợi cho cảm biến đo
  delay(1000);

  //Lấy data từ sensor
  SensorData data;
  data.temperature = dht.readTemperature(); //Đọc nhiệt độ
  data.humidity = dht.readHumidity(); //Đọc độ ẩm
  data.motion = digitalRead(SR505_PIN); // Đọc chuyển động

  // // Đọc độ ẩm
  // float humidity = dht.readHumidity();
  // // Đọc nhiệt độ theo Celsius
  // float temperature = dht.readTemperature();

  // Kiểm tra nếu việc đọc dữ liệu từ cảm biến thất bại
  if (isnan(data.temperature) || isnan(data.humidity)) {
    Serial.println("Lỗi đọc từ cảm biến DHT11!");
    return;
  }

  int motion = 0;
  // Đọc dữ liệu từ cảm biến SR505
  // motion = digitalRead(SR505_PIN);
  // if (motion == HIGH) {
  //   digitalWrite(LEDPIN, HIGH);
  // } else {
  //   digitalWrite(LEDPIN, LOW);
  // }

  //Gửi dữ liệu dạng chuỗi
  // String data = String("H: ") + humidity + "%" + " T: " + temperature + "C" + " M: " + motion;
  // radio.write(data.c_str(), data.length() + 1);

  //Gửi dữ liệu
  radio.write(&data, sizeof(data));  
  //In ra du lieu
  Serial.println("Sent !!");
  Serial.println("T: "+ String(data.temperature) + ", H:" + String(data.humidity) +", M: "+ String(data.motion));
}
