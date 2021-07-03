chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({
		yt_chat_recycle_enabled: true,
		yt_chat_recycle_max: 20
	})
})