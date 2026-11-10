Vue.component('do-tracking', {
  template: '#tpl-tracking',
  props: ['items'],
  data() {
    return { keyword: '', applied: '', progress: {} };
  },
  computed: {
    results() {
      if (!this.applied) return this.items;
      const k = this.applied.toLowerCase();
      return this.items.filter(d => d.doNumber.toLowerCase() === k || d.nim === this.applied);
    }
  },
  watch: {
    // watcher 2: kolom pencarian dikosongkan -> tampil semua lagi
    keyword(val) {
      if (!val.trim()) this.applied = '';
    }
  },
  methods: {
    search() { this.applied = this.keyword.trim(); },
    clear() { this.keyword = ''; this.applied = ''; },
    addProgress(d) {
      const text = (this.progress[d.doNumber] || '').trim();
      if (!text) { alert('Keterangan tidak boleh kosong'); return; }
      this.$emit('progress', { doNumber: d.doNumber, keterangan: text });
      this.$set(this.progress, d.doNumber, '');
    }
  }
});