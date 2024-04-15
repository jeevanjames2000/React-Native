import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";

const HomeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  const screen = Dimensions.get("window");
  const [userData, setUserData] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === "web") {
      setHasPermission(true);
    } else {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setUserData(JSON.parse(data));
    setScannedData(JSON.parse(data));
  };

  const handleEntryButtonPress = async () => {
    try {
      let requestbody = {};
      let apiUrl = "";

      if (userData.user === "student") {
        requestbody = {
          rollNumber: userData.rollNumber,
        };
        apiUrl =
          "https://student-monitoring-backend.onrender.com/api/students/entryStudent";
      } else if (userData.user === "faculty") {
        requestbody = {
          emplyoeeId: userData.emplyoeeId,
        };
        apiUrl =
          "https://student-monitoring-backend.onrender.com/api/faculty/entryFaculty";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestbody),
      });
      if (response.ok) {
        alert("Entry Time Saved");
      }
      if (!response.ok) {
        alert("Invalid Details");
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleExitButtonPress = async () => {
    try {
      let requestbody = {};
      let apiUrl = "";

      if (userData.user === "student") {
        requestbody = {
          rollNumber: userData.rollNumber,
        };
        apiUrl =
          "https://student-monitoring-backend.onrender.com/api/students/exitStudent";
      } else if (userData.user === "faculty") {
        requestbody = {
          emplyoeeId: userData.emplyoeeId,
        };
        apiUrl =
          "https://student-monitoring-backend.onrender.com/api/faculty/exitFaculty";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestbody),
      });

      if (response.ok) {
        alert("Exit Time Saved");
      }
      if (!response.ok) {
        alert("Invalid Details");
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>
          Camera permission denied. Please grant permission to scan barcodes.
        </Text>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ height: screen.height / 2, width: screen.height / 2 }}>
            <Camera
              style={{ flex: 1 }}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={handleBarCodeScanned}
              ref={(ref) => setCameraRef(ref)}
            />
          </View>
          <View style={styles.cameraOverlay}>
            {userData ? (
              <View style={styles.cardContainer}>
                <Text style={styles.cardText}>
                  Name: <Text style={styles.bold}>{userData.name}</Text>
                </Text>
                {userData.user === "student" ? (
                  <Text style={styles.cardText}>
                    Roll Number:{" "}
                    <Text style={styles.bold}>{userData.rollNumber}</Text>
                  </Text>
                ) : (
                  <Text style={styles.cardText}>
                    Employee Id:{" "}
                    <Text style={styles.bold}>{userData.emplyoeeId}</Text>
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.overlayText}>Point camera at barcode</Text>
            )}
          </View>
          <View>
            {scannedData && (
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={() => setScannedData(null)}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.button1]}
              onPress={handleEntryButtonPress}
            >
              <Text style={styles.buttonText}>Entry</Text>
            </TouchableOpacity>
            <View style={styles.buttonSpacing} />
            <TouchableOpacity
              style={[styles.button, styles.button2]}
              onPress={handleExitButtonPress}
            >
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </View>

          {/* Render user details in a card view */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  overlayText: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSpacing: {
    width: 20,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  button1: {
    backgroundColor: "green",
  },
  button2: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  scanAgainButton: {
    backgroundColor: "blue",
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  scanAgainButtonText: {
    color: "white",
    fontSize: 16,
  },
  cardContainer: {
    backgroundColor: "lightgray",
    padding: 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  cardText: {
    fontSize: 26,
    color: "black",
    marginBottom: 10,
  },
  cardData: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;
