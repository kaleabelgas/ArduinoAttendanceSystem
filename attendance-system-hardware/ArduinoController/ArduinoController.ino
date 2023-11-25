#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>
#define RST_PIN 9
#define SS_PIN 10
byte readCard[4];
String tagID = "";
MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance
Servo myservo;
int pos = 0;
bool servoMove = false;
void setup()
{
  myservo.attach(6);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  Serial.begin(9600);        // Initialize serial communications with the PC
  SPI.begin(); // SPI bus
  mfrc522.PCD_Init(); // Initialise MFRC522
  delay(4);
  mfrc522.PCD_DumpVersionToSerial();
  myservo.write(pos); 
}
void loop()
{
  //Wait until new tag is available
  if(readID()){
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15 ms for the servo to reach the position
    }
    servoMove = true;
    mfrc522.PICC_HaltA();
    delay(5000); 
  }
  if(servoMove){
    for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15 ms for the servo to reach the position
    if (pos == 0){
      servoMove = false;
    }
  } 
  }
}
  //Read new tag if available
  boolean readID()
  {
    //Check if a new tag is detected or not. If not return.
    if ( ! mfrc522.PICC_IsNewCardPresent())
    {
      return false;
    }
    //Check if a new tag is readable or not. If not return.
    if ( ! mfrc522.PICC_ReadCardSerial())
    {
      return false;
    }
    tagID = "";  
    // Read the 4 byte UID
    for ( uint8_t i = 0; i < 4; i++)
    {
      //readCard[i] = mfrc522.uid.uidByte[i];
      tagID.concat(String(mfrc522.uid.uidByte[i], HEX)); // Convert the UID to a single String
    }
    tagID.toUpperCase();
    return true;
  }