import mqtt from "mqtt";

const brokerUrl =
  import.meta.env.VITE_MQTT_BROKER_URL || "wss://broker.hivemq.com:8884/mqtt";

console.log("[MQTT] Connecting to:", brokerUrl);

const client = mqtt.connect(brokerUrl, {
  reconnectPeriod: 3000,
  connectTimeout: 10 * 1000,
  clean: true,
  clientId: `refrost_${Math.random().toString(16).slice(2, 10)}`,
  keepalive: 30,
  protocolVersion: 4,
  rejectUnauthorized: false,
});

const subscriptions = new Map();
let connectionAttempts = 0;

client.on("connect", () => {
  connectionAttempts = 0;
  console.log("[MQTT] ✓ Connected to", brokerUrl);

  // Re-subscribe to all topics on reconnect
  subscriptions.forEach((callbacks, topic) => {
    client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        console.error(`[MQTT] Re-subscribe error on ${topic}:`, err);
      } else {
        console.log(`[MQTT] ✓ Re-subscribed to ${topic}`);
      }
    });
  });
});

client.on("error", (err) => {
  console.error("[MQTT] ✗ Error:", err.message || err);
  console.error("[MQTT] Error code:", err.code || "unknown");
});

client.on("offline", () => {
  console.warn("[MQTT] ✗ Went offline - will attempt to reconnect");
});

client.on("reconnect", () => {
  connectionAttempts++;
  console.log(`[MQTT] → Reconnecting... (attempt ${connectionAttempts})`);
});

client.on("disconnect", (packet) => {
  console.log("[MQTT] Disconnected");
});

client.on("message", (receivedTopic, message) => {
  console.log(`[MQTT] Message on ${receivedTopic}:`, message.toString());

  const callbacks = subscriptions.get(receivedTopic);
  if (!callbacks) {
    console.warn(`[MQTT] No callbacks for topic: ${receivedTopic}`);
    return;
  }

  const rawMessage = message.toString();
  let data;
  try {
    data = JSON.parse(rawMessage);
  } catch (e) {
    data = rawMessage;
  }

  console.log(`[MQTT] Parsed data:`, data);
  callbacks.forEach((callback) => callback(data));
});

export const subscribeToTopic = (topic, callback) => {
  if (!subscriptions.has(topic)) {
    subscriptions.set(topic, []);
    client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        console.error(`[MQTT] Subscribe error on ${topic}:`, err);
      } else {
        console.log(`[MQTT] ✓ Subscribed to ${topic}`);
      }
    });
  }

  subscriptions.get(topic).push(callback);
  console.log(
    `[MQTT] Added callback for ${topic}, total callbacks: ${subscriptions.get(topic).length}`,
  );

  return () => {
    const existing = subscriptions.get(topic) || [];
    const next = existing.filter((cb) => cb !== callback);
    if (next.length > 0) {
      subscriptions.set(topic, next);
    } else {
      subscriptions.delete(topic);
      client.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Unsubscribe error on ${topic}:`, err);
        } else {
          console.log(`[MQTT] ✓ Unsubscribed from ${topic}`);
        }
      });
    }
  };
};

export const publishToTopic = (topic, message) => {
  console.log(`[MQTT] Publishing to ${topic}:`, message);
  client.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
    if (err) {
      console.error(`[MQTT] Publish error on ${topic}:`, err);
    } else {
      console.log(`[MQTT] ✓ Published to ${topic}`);
    }
  });
};

export const getClientState = () => ({
  connected: client.connected,
  reconnecting: client.reconnecting,
  topics: Array.from(subscriptions.keys()),
  brokerUrl,
  connectionAttempts,
});

export default client;
