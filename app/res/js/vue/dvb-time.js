Vue.component('dvb-time', {
	template: `<div id="time">{{cur}}</div>`,
	data() {
		return {
			hz: 0.5,
			cur: '...',
		}
	},
	methods: {
		update() {
			this.cur = new Date().toLocaleDateString('de-DE', {
					formatMatcher: 'best fit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
				})
				.split(',')[1]
				.trim()
		},
		startWatcher() {
			this.update()
			this.watcherId = setInterval(this.update, this.hz * 1000)
		},
		stopWatcher() {
			clearInterval(this.watcherId)
		},
	},
	mounted() {
		this.startWatcher()
	},
})