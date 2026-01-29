async function readText(path){
  const r = await fetch(path, {cache:"no-store"});
  if(!r.ok) throw new Error("HTTP " + r.status);
  return (await r.text()).trim();
}

async function readJson(path){
  const r = await fetch(path, {cache:"no-store"});
  if(!r.ok) throw new Error("HTTP " + r.status);
  return await r.json();
}

// Normaliza JSON (orden de claves) para hashing reproducible.
function canonicalize(obj){
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  const keys = Object.keys(obj).sort();
  const out = {};
  for (const k of keys) out[k] = canonicalize(obj[k]);
  return out;
}

async function sha256Hex(str){
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2,"0")).join("");
}

function setText(id, txt){
  const el = document.getElementById(id);
  if(el) el.textContent = txt;
}

function buildGallery(){
  // Incluimos miniaturas para que la galería cargue más rápido; el enlace sigue apuntando al archivo original
  const items = [
    {
      src: "./1769698745394.jpg",
      thumb: "./thumbs/1769698745394_thumb.jpg",
      cap: "Evidencia · Billete en mano + pantalla"
    },
    {
      src: "./1769698745407.jpg",
      thumb: "./thumbs/1769698745407_thumb.jpg",
      cap: "Reverso del billete en mano + pantalla"
    },
    {
      src: "./19xLVxMCyZhGVTFUpB9LdnZYMpzDti867Y.png",
      thumb: "./thumbs/19xLVxMCyZhGVTFUpB9LdnZYMpzDti867Y_thumb.jpg",
      cap: "Bitcoin Address del hash Génesis el día 0"
    }
  ];

  const g = document.getElementById("gallery");
  if(!g) return;

  for(const it of items){
    const a = document.createElement("a");
    a.className = "thumb";
    a.href = it.src;
    a.target = "_blank";
    a.rel = "noopener";

    const img = document.createElement("img");
    img.loading = "lazy";
    // utiliza la miniatura si está disponible
    img.src = it.thumb || it.src;
    img.alt = it.cap;

    const cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = it.cap;

    a.appendChild(img);
    a.appendChild(cap);
    g.appendChild(a);
  }
}

(async () => {
  buildGallery();

})();

