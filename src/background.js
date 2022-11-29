console.log('bg')
browser.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(
    tab.id || 0,
    { method: 'getSelection' },
    function (response) {
      sendServiceRequest(response.data)
    },
  )
})

function sendServiceRequest(selectedText) {
  const serviceCall = 'https://www.google.com/search?q=' + selectedText
  chrome.tabs.create({ url: serviceCall })
}
