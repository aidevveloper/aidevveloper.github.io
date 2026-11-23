// one converted model kept in this browser (IndexedDB) so the Detect page can test it: {onnx: ArrayBuffer, names, imgsz, label}
"use strict";
const ModelStore = {
  open() {
    return new Promise((ok, bad) => {
      const r = indexedDB.open("webyolov26", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("models");
      r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error);
    });
  },
  async put(value) {
    const db = await this.open();
    return new Promise((ok, bad) => { const t = db.transaction("models", "readwrite"); t.objectStore("models").put(value, "custom"); t.oncomplete = ok; t.onerror = () => bad(t.error); });
  },
  async get() {
    const db = await this.open();
    return new Promise((ok, bad) => { const r = db.transaction("models").objectStore("models").get("custom"); r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error); });
  },
};
