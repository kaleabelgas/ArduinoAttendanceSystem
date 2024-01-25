#include <string.h>
#include <SPI.h>
#include <MFRC522.h>

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define SS_PIN 10
#define RST_PIN 9
 
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class

LiquidCrystal_I2C lcd(0x27, 16, 2);

MFRC522::MIFARE_Key key; 

void setup() { 
  Wire.begin();
  Serial.begin(9600);
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522 



  lcd.init();
  lcd.clear();         
  lcd.backlight();      // Make sure backlight is on
  
  // // Print a message on both lines of the LCD.
  lcd.setCursor(0,0);   //Set cursor to character 2 on line 0
  lcd.print("Tap card below...");
  
}

const byte numChars = 32;
char receivedChars[numChars];
char receivedChars2[numChars];

boolean newData = false;

void loop() {
  scanRFIDCard();
  recvWithStartEndMarkers();
  showNewData();
}

bool isName = false;
void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    static byte ndx2 = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;
 
 // if (Serial.available() > 0) {

    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                if(rc == '#' && !newData){
                  isName = true;
                  continue;
                } 
                if(!isName) {
                  receivedChars[ndx] = rc;
                  ndx++;
                  if (ndx >= numChars) {
                    ndx = numChars - 1;
                  }
                }
                else {
                  receivedChars2[ndx2] = rc;
                  ndx2++;
                  if (ndx2 >= numChars) {
                    ndx2 = numChars - 1;
                  }
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                receivedChars2[ndx2] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                ndx2 = 0;
                newData = true;
                isName = false;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void showNewData() {
    if (newData == true) {
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print(receivedChars);
        lcd.setCursor(0,1);
        lcd.print(receivedChars2);

        delay(2000);
        memset(receivedChars, '\0', sizeof(receivedChars)); 
        memset(receivedChars2, '\0', sizeof(receivedChars2)); 
        lcd.clear();
        lcd.setCursor(0,0);   //Set cursor to character 2 on line 0
        lcd.print("Tap card below...");
        newData = false;
    }
}

void cardDetected(){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Card detected,");
  lcd.setCursor(0,1);
  lcd.print("Please wait...");
}

void scanRFIDCard(){
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been readed
  if ( ! rfid.PICC_ReadCardSerial())
    return;

  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&  
    piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
    piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    // TODO: REPLACE WITH ERROR CODE
    Serial.println(F("Your tag is not of type MIFARE Classic."));
    return;
  }
  printDec(rfid.uid.uidByte, rfid.uid.size);

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();
}

void printDec(byte *buffer, byte bufferSize) {
  // TODO: SERIAL HEADER FOR PARSING BY NODE SERVER & ERROR MESSAGING
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? "0" : "");
    Serial.print(buffer[i], DEC);
  }
  Serial.println();
  lcd.clear();
  lcd.setCursor(0,0);   //Set cursor to character 2 on line 0
  lcd.print("Checking,");
  lcd.setCursor(0,1);   //Set cursor to character 2 on line 0
  lcd.print("Please wait...");
}