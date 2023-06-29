import React, { useEffect, useState } from 'react'
import {Button,Textarea,Modal,Text,useModal,Loading,} from '@nextui-org/react'
import { useQuery, useMutation } from 'react-query'
import CustomCard from '../Card/index'
const BASE_URL = 'http://localhost:8888/'
const BASE_URL_BE = 'http://192.168.83.174/dacn2/public/'
const App = (): JSX.Element => {
  const { setVisible, bindings } = useModal()
  const [text, setText] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [desc, setDesc] = useState<string>()
  const [link, setLink] = useState<string>()
  const [rs, setRS] = useState('')
  const predict = (model: string) => {
    const formData = new FormData()
    formData.append('text', text || '')
    formData.append('model', model)
    fetch(`${BASE_URL}/api/predict`, {
      body: JSON.stringify({ text, model }),method: 'post',headers: {Accept: 'application/json','Content-Type': 'application/json',},})
      .then((response) => response.text())
      .then((data) => setRS(data))}
  useEffect(() => {chrome.tabs.executeScript({ code: 'window.getSelection().toString();' },(selectedText) => {setText(selectedText[0])},)})
  const { data: posts, isLoading } = useQuery({
    queryKey: ['recommned', text],
    queryFn: async () => {const data = await fetch(`${BASE_URL_BE}api/posts?q=${text}`, {method: 'get',headers: {Accept: 'application/json','Content-Type': 'application/json',},})
      return await data.json()},})
  const { mutate: create, isLoading: loadingCreate } = useMutation<any,any,any,any>({
    mutationFn: async ({ title, desc, link }) => {
      const data = await fetch(`${BASE_URL_BE}api/posts`, {
      body: JSON.stringify({ title, desc, link }),method: 'post',headers: {Accept: 'application/json','Content-Type': 'application/json',},})
      return data},})
  const [tab, setTab] = useState(1)
  const submit = () => {create({ title, desc, link },{onSuccess: () => {setVisible(true)},},)}
  return (
    <div style={{color: '#ffffff',padding: 20,width: 350,fontFamily: 'monospace',}}>
      <p style={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold' }}>News Detection</p>
      <div style={{display: 'flex',justifyContent: 'space-between',marginBottom: 20,}}>
        <Button color="success" ghost={tab === 2} onClick={() => setTab(1)} size={'sm'}><span style={{ fontWeight: 'bold',fontSize:20}}>Detect</span></Button>
        <Button color="primary" ghost={tab === 1} onClick={() => setTab(2)} size={'sm'}><span style={{ fontWeight: 'bold',fontSize:20}}>Community</span></Button></div><div>
    {tab === 1 && (<div><div style={{display: 'flex',alignItems: 'center',justifyContent: 'space-evenly',gap: 10,}}>
      <select style={{width: 200,height: 40,fontWeight: 'bold',fontSize: 18,color: 'white',backgroundColor: 'rgba(17, 25, 40, 0.3)',borderRadius: 5,outline: 'none',padding: 2,}}
        onChange={(e) => predict(e?.target?.value)}>
        <option value="NB">Naive Bayes</option>
        <option value="DT">Decision Tree</option>
        <option value="SVM">SVM</option>
        <option value="RNN">LSTM</option>
      </select>
      {rs && (<p style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
      {rs.split(';')[0] === '0'? 'Real': rs.split(';')[0] === '2'? 'No Text Selected': 'Unsubstantiated'}</p>)}
    </div>
    {rs && (<p style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign:'right' }}>
      Topic: {rs.split(';')[1]}</p>)}
    {text && (<div style={{overflow: 'auto',maxHeight: 100,}}>
    <p style={{fontFamily: 'monospace',color: 'ghostwhite',fontSize: 18,}}>
    Detect for: {'"'}{text}{'"'}</p></div>)}
    {isLoading ? (<Loading color="currentColor" size="sm" />) : (<div>
    {posts?.length>0 && (<div><h3>Recommend</h3><div className="flex flex-row space-y-2">{posts?.map((e) => {return <CustomCard {...e} key={e?.id} />})}</div></div>)}
    </div>)}</div>)}
        {tab === 2 && (<div>
        <h2>Community</h2>
        <div style={{display:"flex",justifyContent:"center"  }}>
        <form action="">
          <div><Textarea onChange={(e) => setTitle(e?.target?.value)} value={title} label="Title" size = 'xl' minRows={1} maxRows={1}/></div>
          <div><Textarea onChange={(e) => setDesc(e?.target?.value)}  value={desc} label="Description" minRows={2} maxRows={2} size = 'xl'/></div>
          <div><Textarea value={link} onChange={(e) => setLink(e?.target?.value)} label="Link" minRows={1} maxRows={1} size = 'xl'/></div>
          <div style={{display:"flex",justifyContent:"center"  }}> <Button onClick={submit} type="button" style={{ marginTop: 10 }} color="success">
          {loadingCreate ? (<Loading color="currentColor" size="sm" />) : ('Submit')}</Button></div>
        </form></div></div>)}
      </div>
      <Modal scroll width="600px" aria-labelledby="modal-title" aria-describedby="modal-description" {...bindings}>
        <Modal.Header><Text id="modal-title" size={18}>Tạo thành công</Text></Modal.Header>
        <Modal.Body><Text id="modal-description">Cảm ơn bạn đã đóng góp thông tin, chúng tôi sẽ sớm duyệt tin của bạn!</Text></Modal.Body>
        <Modal.Footer><Button auto flat color="error" onPress={() => setVisible(false)}>Close</Button></Modal.Footer>
      </Modal>
    </div>)}
export default App
