#include <WiFi.h>
#include <HTTPClient.h>
#include <NewPing.h>
#include "DHT.h"
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Definições dos pinos
#define DHTPIN 27
#define DHTTYPE DHT11
#define TRIGGER_PIN 12
#define ECHO_PIN 14
#define MAX_DISTANCE 200
#define LED_PIN_Verde 19
#define LED_PIN_Amarelo 18
#define LED_PIN_Vermelho 17
#define BOTAO_PIN 22
#define BUZZER_PIN 13

// Credenciais Wi-Fi e MQTT
const char* ssid = "FIESC_IOT";
const char* password = "C6qnM4ag81";
const char* mqtt_server = "mqtt.tago.io";
const char* mqtt_topic = "buzzer/command";
const char* mqtt_username = "token";
const char* mqtt_password = "9a7a33d0-f1dc-4e55-be52-37c65eed0ceb";
const char* deviceToken = "9a7a33d0-f1dc-4e55-be52-37c65eed0ceb";

// Criação de objetos para sensores e comunicação
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

bool botaoPressionado = false;

// Função para medir umidade
float medirUmidade() {
  return dht.readHumidity();
}

// Função para medir temperatura
float medirTemperatura() {
  return dht.readTemperature();
}

// Função para medir distância
float medirDistancia() {
  delay(50);
  unsigned int distancia_cm = sonar.ping_cm();
  return distancia_cm;
}

// Função para conectar ao Wi-Fi
void setup_wifi() {
    Serial.print("Conectando ao WiFi...");
    WiFi.begin(ssid, password);

    unsigned long startAttemptTime = millis();

    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 30000) {
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi conectado");
        Serial.println("Endereço IP: " + WiFi.localIP().toString());
    } else {
        Serial.println("\nFalha ao conectar ao WiFi");
    }
}

// Função callback para mensagens MQTT
void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Mensagem recebida, tópico: ");
    Serial.print(topic);
    Serial.print(". Mensagem: ");

    String message;
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.println(message);

    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error) {
        Serial.print("deserializeJson() falhou: ");
        Serial.println(error.f_str());
        return;
    }

    int frequency = doc["frequency"];

    if (frequency > 0) {
        tone(BUZZER_PIN, frequency);
        delay(1000);
        noTone(BUZZER_PIN);
    }
}

// Função para reconectar ao MQTT
void reconnect() {
    while (!client.connected()) {
        Serial.print("Conectando ao MQTT...");
        if (client.connect("ESP32Client", mqtt_username, mqtt_password)) {
            Serial.println("conectado");
            client.subscribe(mqtt_topic);
        } else {
            Serial.print("falha, rc=");
            Serial.println(client.state());
            delay(5000);
        }
    }
}

// Função para acender todos os LEDs
void acenderTodosLEDS() {
    digitalWrite(LED_PIN_Verde, HIGH);
    digitalWrite(LED_PIN_Amarelo, HIGH);
    digitalWrite(LED_PIN_Vermelho, HIGH);
}

// Setup inicial
void setup() {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);

    dht.begin();
    pinMode(LED_PIN_Verde, OUTPUT);
    pinMode(LED_PIN_Amarelo, OUTPUT);
    pinMode(LED_PIN_Vermelho, OUTPUT);
    pinMode(BOTAO_PIN, INPUT_PULLUP);
    pinMode(BUZZER_PIN, OUTPUT);

    acenderTodosLEDS();
    delay(1000);
}

// Loop principal
void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    if (digitalRead(BOTAO_PIN) == LOW) {
        botaoPressionado = true;
        acenderTodosLEDS();
    }

    if (botaoPressionado) {
        delay(2000);
        botaoPressionado = false;
    } else {
        float distancia = medirDistancia();
        float umidade = medirUmidade();
        float temperatura = medirTemperatura();

        if (!isnan(umidade)) {
            if (umidade >= 75) {
                digitalWrite(LED_PIN_Verde, HIGH);
                digitalWrite(LED_PIN_Amarelo, LOW);
                digitalWrite(LED_PIN_Vermelho, LOW);
            } else if (umidade >= 40) {
                digitalWrite(LED_PIN_Verde, LOW);
                digitalWrite(LED_PIN_Amarelo, HIGH);
                digitalWrite(LED_PIN_Vermelho, LOW);
            } else {
                digitalWrite(LED_PIN_Verde, LOW);
                digitalWrite(LED_PIN_Amarelo, LOW);
                digitalWrite(LED_PIN_Vermelho, HIGH);
            }
        } else {
            Serial.println("Erro ao ler a umidade.");
        }

        Serial.print("Distancia: ");
        Serial.print(distancia);
        Serial.println(" cm");

        Serial.print("Umidade: ");
        Serial.print(umidade);
        Serial.println("%");

        Serial.print("Temperatura: ");
        Serial.print(temperatura);
        Serial.println("°C");

        if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;
            http.begin("http://api.tago.io/data");
            http.addHeader("Content-Type", "application/json");
            http.addHeader("Device-Token", deviceToken);

            String data = "[{\"variable\":\"distancia\",\"unit\":\"cm\",\"value\":\"" + String(distancia) + "\"},";
            data += "{\"variable\":\"umidade\",\"unit\":\"%\",\"value\":\"" + String(umidade) + "\"},";
            data += "{\"variable\":\"temperatura\",\"unit\":\"C\",\"value\":\"" + String(temperatura) + "\"}]";

            int httpResponseCode = http.POST(data);

            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);

            http.end();
        } else {
            Serial.println("WiFi Desconectado");
        }
    }

    delay(1000);
}
