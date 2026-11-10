Vue.component('order-form', {
  template: '#tpl-order',
  props: ['paket', 'ekspedisi', 'stok', 'existing'],
  data() {
    return {
      nim: '', nama: '', ekspedisiKode: '', kodePaket: '',
      tanggal: api.today(),
      errors: []
    };
  },
  computed: {
    selectedPaket() {
      return this.paket.find(p => p.kode === this.kodePaket);
    },
    total() {
      return this.selectedPaket ? this.selectedPaket.harga : 0;
    },
    // DO + tahun berjalan + nomor urut, contoh: DO2026-001
    nomorDO() {
      const prefix = 'DO' + new Date().getFullYear() + '-';
      const seqs = this.existing
        .filter(d => d.doNumber.startsWith(prefix))
        .map(d => parseInt(d.doNumber.replace(prefix, ''), 10));
      const next = seqs.length ? Math.max(...seqs) + 1 : 1;
      return prefix + String(next).padStart(3, '0');
    }
  },
  watch: {
    // watcher 3: NIM hanya boleh angka
    nim(val) { this.nim = val.replace(/\D/g, ''); }
  },
  methods: {
    judulOf(kode) {
      const s = this.stok.find(x => x.kode === kode);
      return s ? s.judul : '-';
    },
    submit() {
      const e = [];
      if (this.nim.length < 9) e.push('NIM minimal 9 digit angka');
      if (!this.nama.trim()) e.push('Nama wajib diisi');
      if (!this.ekspedisiKode) e.push('Ekspedisi wajib dipilih');
      if (!this.kodePaket) e.push('Paket wajib dipilih');
      if (!this.tanggal) e.push('Tanggal kirim wajib diisi');
      this.errors = e;
      if (e.length) return;

      const eks = this.ekspedisi.find(x => x.kode === this.ekspedisiKode);
      this.$emit('created', {
        doNumber: this.nomorDO,
        nim: this.nim,
        nama: this.nama.trim(),
        status: 'Diproses',
        ekspedisi: 'JNE ' + eks.nama,
        tanggalKirim: this.tanggal,
        paket: this.kodePaket,
        total: this.total,
        perjalanan: [{ waktu: api.now(), keterangan: 'Delivery Order dibuat' }]
      });
      this.reset();
    },
    reset() {
      this.nim = ''; this.nama = ''; this.ekspedisiKode = '';
      this.kodePaket = ''; this.tanggal = api.today(); this.errors = [];
    }
  }
});