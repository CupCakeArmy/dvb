Vue.component('dvb-weather', {
	template: '#tmpl-dvb-weather',
	props: {
		offset: ['Number']
	},
	data() {
		return {
			hz: 10,
			cur: '...',
			images: {
				'sunny': 11,
				'rain': 4,
				'snow': 6,
				'clouds': 10,
				'storm': 1,
				'': 9,
			},
			states: {
				'fog': 2,
				'wind': 3,
				'frosty': 8,
				'wet': 12,
				'cold': 7,
			},
			static: {
				'0': {
					image: 11,
					temp: '23'
				},
				'14400': {
					image: 4,
					temp: '11'
				},
				'28800': {
					image: 6,
					temp: '-1'
				},
				'43200': {
					image: 1,
					temp: '7'
				},
			}
		}
	},
	methods: {
		startWatcher() {
			this.update()
			this.watcherId = setInterval(this.update, this.hz * 1000)
		},
		stopWatcher() {
			clearInterval(this.watcherId)
		},
		update() {},
	},
	created() {
		this.startWatcher()
	},
	mounted() {
		const data = this.static[this.offset]
		this.$el.style.backgroundImage = `url('res/img/${data.image}.png')`
		this.cur = data.temp
	},
})