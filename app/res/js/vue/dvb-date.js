Vue.component('dvb-date', {
	template: `<div id="date">{{cur}}</div>`,
	data() {
		return {
			hz: 3,
			cur: '...',
		}
	},
	methods: {
		update() {
			this.cur = new Date().toLocaleDateString('de-DE', {
				weekday: 'short',
				year: 'numeric',
				month: 'numeric',
				day: 'numeric'
			})
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