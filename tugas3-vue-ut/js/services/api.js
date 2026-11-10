const pad = n => String(n).padStart(2, '0');

const api = {
  // ambil data JSON
  async getData() {
    const res = await fetch('data/dataBahanAjar.json');
    const json = await res.json();

    // tracking di JSON: array of { "DOxxxx": {...} } -> ratakan, buang duplikat
    const map = {};
    json.tracking.forEach(obj => {
      Object.keys(obj).forEach(k => {
        map[k] = { doNumber: k, ...obj[k] };
      });
    });
    json.tracking = Object.values(map);
    return json;
  },

  // tanggal lokal: 2026-11-08
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  },

  // waktu lokal: 2026-11-08 14:30:05
  now() {
    const d = new Date();
    return `${this.today()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
};