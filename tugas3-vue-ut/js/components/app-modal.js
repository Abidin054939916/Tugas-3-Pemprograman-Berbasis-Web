Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            show: false,
            title: '',
            message: '',
            onConfirm: null};
        },
        methods: {
            open(title, message, onConfirm) {
                this.title = title;
                this.message = message;
                this.onConfirm = onConfirm;
                this.show = true;
            },
            close() { this.show = false; },
            confirm() { if (this.onConfirm) this.onConfirm(); this.close(); }
        }
    });