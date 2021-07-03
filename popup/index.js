(async () => {
	let max = await get('yt_chat_recycle_max', 20)
	document.getElementById('enabled').checked = await get('yt_chat_recycle_enabled', true)
	document.getElementById('max').value = max
	document.getElementById('max_count').innerText = max.toString()
})()

async function get(v, d) {
	return new Promise(res => {
		chrome.storage.sync.get(v, r => {
			r = r?.[v]
			if(r === undefined || r === null)
				chrome.storage.sync.set(makeObj(v, d))
			res(r ?? d)
		})
	})
}

function makeObj(k, v) {
	let o = {}
	o[k] = v
	return o
}