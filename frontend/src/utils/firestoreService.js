import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const saveSensorLog = async (data) => {
  try {
    await addDoc(collection(db, "shipments/main/sensorLogs"), {
      ...data,
      timestamp: new Date(),
    });
    console.log("Sensor log saved");
  } catch (error) {
    console.error("Error saving sensor log:", error);
  }
};

export const saveLocationLog = async (data) => {
  try {
    await addDoc(collection(db, "shipments/main/locationLogs"), {
      ...data,
      timestamp: new Date(),
    });
    console.log("Location log saved");
  } catch (error) {
    console.error("Error saving location log:", error);
  }
};

export const saveAlert = async (data) => {
  try {
    await addDoc(collection(db, "shipments/main/alerts"), {
      ...data,
      timestamp: new Date(),
    });
    console.log("Alert saved");
  } catch (error) {
    console.error("Error saving alert:", error);
  }
};

export const getRecentSensorLogs = async (hours = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const q = query(
    collection(db, "shipments/main/sensorLogs"),
    where("timestamp", ">=", since),
    orderBy("timestamp", "desc"),
  );
  return getDocs(q);
};

export const getAlerts = async (limitCount = 50) => {
  const q = query(
    collection(db, "shipments/main/alerts"),
    orderBy("timestamp", "desc"),
    limit(limitCount),
  );
  return getDocs(q);
};

export const getLocationLogs = async (hours = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const q = query(
    collection(db, "shipments/main/locationLogs"),
    where("timestamp", ">=", since),
    orderBy("timestamp", "desc"),
  );
  return getDocs(q);
};
