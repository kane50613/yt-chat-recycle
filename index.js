const prefix = '[Youtube Chat Recycle]'

document.querySelector('iframe.style-scope.ytd-live-chat-frame')
?.addEventListener('load', async () => {
	if(!await get('yt_chat_recycle_enabled', true))
		return
	if(!getChat())
		return console.log(`${prefix} no Youtube chat found`)

	console.log(`${prefix} start recycling!`)


	let m = new MutationObserver(async e => {
		let max = await get('yt_chat_recycle_max', 20),
			count = getChat()?.children?.length
		if(e[0]?.addedNodes?.length > 0 && count > max)
			for(let i = 0; i < count - max; i++)
				getChat()?.children[0]?.remove()
	})

	m.observe(getChat(), {
		childList: true
	})
})

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

const getChat = () =>
	document.querySelector('iframe.style-scope.ytd-live-chat-frame')?.contentDocument
	?.querySelector('#items.style-scope.yt-live-chat-item-list-renderer')