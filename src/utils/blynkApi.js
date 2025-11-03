const BLYNK_BASE = "https://blynk.cloud/external/api/get";

// pinCsv example: "v0&v2&v3&v4&v5"
export async function fetchBlynkPins(token, pinCsv) {
  const url = `${BLYNK_BASE}?token=${encodeURIComponent(token)}&${pinCsv}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Blynk API error ${res.status}: ${txt}`);
  }

  return await res.json();
}
