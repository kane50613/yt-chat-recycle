const prefix = '[Youtube Chat Recycle]'

let m

setTimeout(init, 3000)

async function init() {
	if(!await get('yt_chat_recycle_enabled', true))
		return console.log(`${prefix} extension disabled :(`)

	if(!getFrame()) {
		console.log(`${prefix} frame not found`)
		await sleep(5000)
		return init()
	}
	if(!getChat()) {
		console.log(`${prefix} no Youtube chat found`)
		await sleep(5000)
		return init()
	}

	let inv = setInterval(async () => {
		if(!await get('yt_chat_recycle_enabled', true)) {
			clearInterval(inv)
			m = null
			return console.log(`${prefix} extension disabled :(`)
		}
		if(!getChat()) {
			console.log(`${prefix} chat not found`)
			clearInterval(inv)
			await init()
		}
	}, 1000)

	console.log(`${prefix} start recycling!`)

	await update()

	m = new MutationObserver(async e => {
		if(
			e[0]?.addedNodes?.length > 0 &&
			e[0]?.addedNodes[0]?.className === 'style-scope yt-live-chat-item-list-renderer'
		)
			await update()
	})

	m.observe(getChat(), {
		childList: true
	})

	async function update() {
		let max = await get('yt_chat_recycle_max', 20),
			count = getChat()?.children?.length
		if(count > max) {
			for(let i = 0; i < count - max; i++)
				getChat()?.children[0]?.remove()
			console.log(`${prefix} recycled ${count - max} comment(s)!`)
		}
	}
}

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

const sleep = async (ms) => await new Promise(r => setTimeout(r, ms))

const getFrame = () => document.querySelector('iframe.style-scope.ytd-live-chat-frame')

const getChat = () =>
	getFrame()?.contentDocument?.querySelector('#items.style-scope.yt-live-chat-item-list-renderer')