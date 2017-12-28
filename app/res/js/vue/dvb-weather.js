Vue.component('dvb-weather', {
	template: '#tmpl-dvb-weather',
	props: {
		offset: ['Number']
	},
	data() {
		return {
			hz: 30,
			cur: '...',
			zip: '01217',
			url: 'https://wundtstr.club/cache',
			mapping: {
				1: 11,
				2: 9,
				3: 10,
				4: 10,
				9: 10,
				10: 4,
				11: 1,
				13: 6,
				50: 2,
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
		async update() {
			fetch(`${this.url}/${this.zip}`, {
				mode: 'cors',
				cache: 'default'
			}).then(res => res.json()).then(res => {

				const data = res.list[this.offset]
				const image = this.mapping[parseInt(data.weather[0].icon)]
				this.$el.style.backgroundImage = `url('res/img/${image}.png')`
				this.cur = data.main.temp

			})
		},
	},
	created() {
		this.startWatcher()
	},
})