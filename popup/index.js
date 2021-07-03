(async () => {
	let max = await get('yt_chat_recycle_max', 20)
	document.getElementById('enabled').checked = await get('yt_chat_recycle_enabled', true)
	document.getElementById('max').value = max
	document.getElementById('max_count').innerText = max.toString()

	document.getElementById('enabled').addEventListener("change", () => {
		chrome.storage.sync.set({
			yt_chat_recycle_enabled: document.getElementById('enabled').value ?? true
		})
	})

	document.getElementById('max').addEventListener('input', () => {
		max = document.getElementById('max').value
		document.getElementById('max_count').innerText = max
	})

	document.getElementById('max').addEventListener('change', () => {
		max = document.getElementById('max').value
		console.log(max)
		chrome.storage.sync.set({
			yt_chat_recycle_max: max ?? 20
		})
	})
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