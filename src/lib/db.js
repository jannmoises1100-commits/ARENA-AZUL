import { createClient } from "@supabase/supabase-js";

/*
  Capa de datos de ARENA AZUL.
  - Si están las variables de Supabase -> guarda en la nube (compartido entre
    la vista del cliente y el panel del admin, en todos los celulares).
  - Si no están -> guarda en el mismo celular (localStorage) para probar.
  Todo el estado vive en una sola tabla `app_state(key, value)`, así el deploy
  es simple y no hay que crear muchas tablas.
*/

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const cloudOn = !!supabase;

const LS_PREFIX = "arenaazul:";
const KEYS = ["bookings", "products", "clients", "prices", "sales", "expenses", "settings"];

/* ---------- Cargar todo el estado ---------- */
export async function loadAll() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("app_state").select("key,value");
      if (error) throw error;
      const out = {};
      (data || []).forEach((r) => { out[r.key] = r.value; });
      return out;
    } catch (e) {
      console.error("Supabase load error:", e.message);
      return {};
    }
  }
  // Fallback local
  const out = {};
  KEYS.forEach((k) => {
    try {
      const raw = localStorage.getItem(LS_PREFIX + k);
      if (raw) out[k] = JSON.parse(raw);
    } catch (e) { /* ignore */ }
  });
  return out;
}

/* ---------- Guardar una colección ---------- */
export async function saveState(k, value) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from("app_state")
        .upsert({ key: k, value }, { onConflict: "key" });
      if (error) throw error;
    } catch (e) {
      console.error("Supabase save error:", e.message);
    }
    return;
  }
  try { localStorage.setItem(LS_PREFIX + k, JSON.stringify(value)); } catch (e) { /* ignore */ }
}

/* ---------- Subir la captura de pago (Yape) ---------- */
const PROOF_BUCKET = "yape-comprobantes";

export async function uploadPaymentProof(file, code) {
  if (supabase) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${code}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(PROOF_BUCKET).upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(PROOF_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
  // Modo prueba (sin Supabase): guarda la captura como base64 en el mismo celular.
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}
