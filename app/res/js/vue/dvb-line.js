Vue.component('dvb-line', {
	template: '#tmpl-dvb-line',
	data() {
		return {
			hz: 30,
			departures: null,
			directions: {},
			stopName: '',
			lineNumber: ''
		}
	},
	props: {
		stopId: Number,
		line: Number
	},
	filters: {
		formatTime(d) {
			if (d === undefined) return
			d = this.parseTime(d)
			let
				h = d.getHours(),
				m = d.getMinutes()
			h = h < 10 ? `0${h}` : h
			m = m < 10 ? `0${m}` : m
			return `${h}:${m}`
		},
		timeInterval(a, b) {
			a = this.parseTime(a)
			b = this.parseTime(b)
			return ((b - a) / 1000 / 60) | 0
		}
	},
	methods: {
		startWatcher() {
			this.update()
			this.watcherId = setInterval(this.update, 1000 * this.hz)
		},
		stopWatcher() {
			clearInterval(this.watcherId)
		},
		update() {
			fetch('https://webapi.vvo-online.de/dm', {
					mode: 'cors',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: "POST",
					body: JSON.stringify({
						'stopid': this.stopId
					})
				})
				.then(res => res.json())
				.then(res => {
					this.stopName = res.Name
					this.departures = res.Departures.filter(departure => departure.LineName === this.line)
					this.formatDirections()
				})
		},
		formatDirections() {
			// Reset names & data
			this.directions = {}

			for (var i of this.departures) {
				// Initial directions if null
				if (!(i.Direction in this.directions))
					this.directions[i.Direction] = []

				// Inset departure into array
				if (this.directions[i.Direction].length < 3)
					this.directions[i.Direction].push(i)
			}

			this.directions = Object.keys(this.directions)
				.sort().reduce((a, v) => {
					a[v] = this.directions[v];
					return a;
				}, {});
		},
	},
	created() {
		this.lineNumber = this.line
		this.stopId = this.stopId
		this.startWatcher()
	},
})