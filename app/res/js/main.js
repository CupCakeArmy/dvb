'use strict'

const S = {
    stations: [33000312, 33000311],
    url: 'https://webapi.vvo-online.de/dm'
}

function parseTime(str) {
    if (str === undefined)
        return
    if (str instanceof Date)
        return str
    return new Date(parseInt(str.slice(6, -2).split('+')[0]))
}

new Vue({
    el: '#app'
})