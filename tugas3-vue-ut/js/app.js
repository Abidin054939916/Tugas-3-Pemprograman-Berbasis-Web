// ===== FILTER (formatting teks) =====
Vue.filter('rupiah', v => 'Rp ' + Number(v || 0).toLocaleString('id-ID'));
Vue.filter('buah', v => v + ' buah');
Vue.filter('tanggal', v => {
  if (!v) return '';
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const [y, m, d] = v.split('-');
  return parseInt(d, 10) + ' ' + bulan[parseInt(m, 10) - 1] + ' ' + y;
});

// ===== ROOT =====
new Vue({
  el: '#app',
  data: {
    tab: 'stok',          // 'stok' | 'tracking' | 'order'
    loaded: false,
    state: { upbjjList: [], kategoriList: [], pengirimanList: [], paket: [], stok: [], tracking: [] }
  },
  async created() {
    this.state = await api.getData();
    this.loaded = true;
  },
  methods: {
    saveStock({ data, isEdit }) {
      if (isEdit) {
        const i = this.state.stok.findIndex(s => s.kode === data.kode);
        this.$set(this.state.stok, i, data);
      } else {
        this.state.stok.push(data);
      }
    },
    confirmDelete(item) {
      this.$refs.modal.open('Konfirmasi Hapus', 'Yakin ingin menghapus "' + item.judul + '"?', () => {
        this.state.stok = this.state.stok.filter(s => s.kode !== item.kode);
      });
    },
    handleNewDO(d) {
      this.state.tracking.push(d);
      alert('DO ' + d.doNumber + ' berhasil dibuat');
      this.tab = 'tracking';
    },
    addProgress({ doNumber, keterangan }) {
      const d = this.state.tracking.find(x => x.doNumber === doNumber);
      if (d) d.perjalanan.push({ waktu: api.now(), keterangan });
    }
  }
});