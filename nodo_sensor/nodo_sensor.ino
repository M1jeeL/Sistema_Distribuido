// Lectura de datos (NODO SENSOR)
int pin=3;
int dato=0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  dato = analogRead(pin);
  Serial.println(dato);
  delay(2000);
}
