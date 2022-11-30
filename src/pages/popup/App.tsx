import React, { useEffect, useState } from 'react'
const BASE_URL = 'http://localhost:8888/'
const App = (): JSX.Element => {
const [text, setText] = useState()
const [rs, setRS] = useState('')
const predict = (model:string) => {
  const formData = new FormData()
  formData.append('text', text || '')
  formData.append('model', model)
    fetch(`${BASE_URL}/api/predict`, {
      body: JSON.stringify({ text, model }),
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',},})
    .then((response) => response.text())
    .then((data) => setRS(data))}
  useEffect(() => {
    chrome.tabs.executeScript(
      { code: 'window.getSelection().toString();' },
      (selectedText) => {setText(selectedText[0])},)})
  return (
    <div style={{color: '#ffffff',padding: 10,width:350,fontFamily: 'monospace'}}>
      <p style={{textAlign: "center",fontSize: 32, fontWeight: 'bold'}}>
        Fake News Detection</p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly',gap:10}}>
        <select style={{width: 200,height: 40,fontFamily:"monospace",fontWeight:'bold',fontSize: 18,color:"white",
          backgroundColor: 'rgba(17, 25, 40, 0.3)',borderRadius: 5,outline:'none',padding: 2,}}
          onChange={(e)=> predict(e?.target?.value)}>
            <option value="NB">Naive Bayes</option>
            <option value="DT">Decision Tree</option>
            <option value="SVM">Support Vector Machine</option>
            <option value="RNN">Recurrent Neural Network</option>
        </select>
        {rs && <p style={{fontSize: 32, fontWeight:'bold',color:'white'}}>
        {rs ===  '0' ? 'Real' : rs==='2'  ? 'No Text Selected' : 'Fake'}</p>}
      </div>
        {text && (
          <><p style={{fontFamily:"monospace",color:'ghostwhite',fontSize: 18}}>
            Detect for: {'"'}{text}{'"'}</p></>)}
    </div>
  )
}
export default App
