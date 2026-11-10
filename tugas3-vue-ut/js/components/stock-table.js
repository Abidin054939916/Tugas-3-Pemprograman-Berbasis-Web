function emptyStock() {
  return {
    kode: "",
    judul: "",
    kategori: "",
    upbjj: "",
    lokasiRak: "",
    harga: 0,
    qty: 0,
    safety: 0,
    catatanHTML: "",
  };
}

Vue.component("ba-stock-table", {
  template: "#tpl-stock",
  props: ["items", "upbjjList", "kategoriList"],
  data() {
    return {
      filterUpbjj: "",
      filterKategori: "",
      onlyReorder: false,
      sortBy: "",
      sortDesc: false,
      hover: null,
      form: emptyStock(),
      editing: false,
      errors: [],
    };
  },
  computed: {
    // pilihan kategori hanya dari UT-Daerah yang dipilih (dependent options)
    kategoriOptions() {
      const list = this.items
        .filter((i) => i.upbjj === this.filterUpbjj)
        .map((i) => i.kategori);
      return [...new Set(list)];
    },
    // computed di-cache: tidak dihitung ulang kalau datanya tidak berubah
    filteredItems() {
      let list = this.items.filter(
        (i) =>
          (!this.filterUpbjj || i.upbjj === this.filterUpbjj) &&
          (!this.filterKategori || i.kategori === this.filterKategori) &&
          (!this.onlyReorder || i.qty < i.safety || i.qty === 0),
      );
      if (this.sortBy) {
        const k = this.sortBy;
        list.sort((a, b) =>
          k === "judul" ? a.judul.localeCompare(b.judul) : a[k] - b[k],
        );
        if (this.sortDesc) list.reverse();
      }
      return list;
    },
  },
  watch: {
    // watcher 1: ganti UT-Daerah -> kategori di-reset
    filterUpbjj() {
      this.filterKategori = "";
    },
  },
  methods: {
    resetFilter() {
      this.filterUpbjj = "";
      this.filterKategori = "";
      this.onlyReorder = false;
      this.sortBy = "";
      this.sortDesc = false;
    },
    validate() {
      const e = [],
        f = this.form;
      const kode = String(f.kode).trim();
      if (!kode) e.push("Kode wajib diisi");
      else if (!this.editing && this.items.some((i) => i.kode === kode))
        e.push("Kode sudah dipakai");
      if (!String(f.judul).trim()) e.push("Judul wajib diisi");
      if (!f.kategori) e.push("Kategori wajib dipilih");
      if (!f.upbjj) e.push("UT-Daerah wajib dipilih");
      if (!String(f.lokasiRak).trim()) e.push("Lokasi rak wajib diisi");
      if (!(f.harga > 0)) e.push("Harga harus lebih dari 0");
      if (!(f.qty >= 0) || f.qty === "")
        e.push("Qty tidak boleh kosong/negatif");
      if (!(f.safety >= 0) || f.safety === "")
        e.push("Safety tidak boleh kosong/negatif");
      return e;
    },
    save() {
      this.errors = this.validate();
      if (this.errors.length) return;
      this.$emit("save", {
        data: { ...this.form, kode: String(this.form.kode).trim() },
        isEdit: this.editing,
      });
      this.cancel();
    },
    edit(item) {
      this.form = { ...item }; // salin, jangan ubah prop langsung
      this.editing = true;
      this.errors = [];
      window.scrollTo(0, 0);
    },
    cancel() {
      this.form = emptyStock();
      this.editing = false;
      this.errors = [];
    },
  },
});
