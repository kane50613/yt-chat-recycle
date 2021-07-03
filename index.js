const prefix = '[Youtube Chat Recycle]'

document.querySelector('iframe.style-scope.ytd-live-chat-frame')
?.addEventListener('load', async () => {

	if(!getChat())
		return console.log(`${prefix} no Youtube chat found`)

	console.log(`${prefix} start recycling!`)

	let max = 15, count = 0

	let m = new MutationObserver(e => {
		count = getChat()?.children?.length
		if(e[0]?.addedNodes?.length > 0 && count > max)
			for(let i = 0; i < count - max; i++)
				getChat()?.children[0]?.remove()
	})

	m.observe(getChat(), {
		childList: true
	})
})

const getChat = () =>
	document.querySelector('iframe.style-scope.ytd-live-chat-frame')?.contentDocument
	?.querySelector('#items.style-scope.yt-live-chat-item-list-renderer')