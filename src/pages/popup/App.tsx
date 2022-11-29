import React, { useEffect, useState } from 'react'
const BASE_URL = 'http://192.168.1.179:8888/'
const App = (): JSX.Element => {
  // const h = () => {
  //   chrome.tabs.executeScript(
  //     {
  //       code: `(${inContent2})(${JSON.stringify({ foo: 'bar' })})`,
  //     },
  //     ([result] = []) => {
  //       if (!chrome.runtime.lastError) {
  //         console.log(result) // shown in devtools of the popup window
  //       } else {
  //         console.log(chrome.runtime.lastError)
  //       }
  //     },
  //   )

  //   // chrome.tabs.sendMessage(0, { method: 'getSelection' }, function (response) {
  //   //   sendServiceRequest(response.data)
  //   // })
  // }
  // function inContent2(params: any) {
  //   const el = document.createElement('div')
  //   el.style.cssText = 'position:fixed; top:0; left:0; right:0; background:red'
  //   el.textContent = params.foo
  //   document.body.appendChild(el)
  //   return {
  //     success: true,
  //     html: document.body.innerHTML,
  //   }
  // }
  const rsMP = {
    0: 'Real',
    1: 'Fake',
  }
  const [model, setType] = useState('RNN')
  const [text, setText] = useState()
  const [rs, setRS] = useState('')
  console.log({ model })

  const predict = () => {
    // fetch()
    // BASE_URL
    const formData = new FormData()
    formData.append('text', text || '')
    formData.append('model', model)

    fetch(`${BASE_URL}/api/predict`, {
      body: JSON.stringify({ text, model }),
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((data) => setRS(data))
  }

  useEffect(() => {
    chrome.tabs.executeScript(
      { code: 'window.getSelection().toString();' },
      (selectedText) => {
        setText(selectedText[0])
      },
    )
  })

  console.log({ rs })

  return (
    <div style={{ width: 600 }}>
      <h1>Detect Fake News</h1>
      {/* <input id="text-input" /> */}

      <select onChange={(e) => setType(e?.target?.value)}>
        <option value="NB">Naive Bayes</option>
        <option value="DT">Decision Tree</option>
        <option value="SVM">Support Vector Machine</option>
        <option value="RNN">Recurrent Neural Network</option>
      </select>
      <button onClick={predict}>Predict</button>
      {text && (
        <>
          <h3>Detect for : {text}</h3>
          {rs && <h1>{rs == '0' ? 'Real' : 'Fake'}</h1>}
        </>
      )}
    </div>
  )
}

export default App
