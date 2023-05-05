import React, { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Textarea,
  Modal,
  Text,
  useModal,
  Loading,
} from '@nextui-org/react'
import { useQuery, useMutation } from 'react-query'
import CustomCard from '../Card/index'
const BASE_URL = 'http://localhost:8888/'
const BASE_URL_BE =
  'https://b7e1-2001-ee0-4c4c-9510-9854-560c-dcaf-dab9.ngrok-free.app/'
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
  const { data: posts, isLoading } = useQuery({
    queryKey: ['recommned', title],
    queryFn: async () => {
      const data = await fetch(`${BASE_URL_BE}api/posts?q=${title}`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      return await data.json()
    },
  })

  const { mutate: create, isLoading: loadingCreate } = useMutation<
    any,
    any,
    any,
    any
  >({
    mutationFn: async ({ title, desc, link }) => {
      const data = await fetch(`${BASE_URL_BE}api/posts`, {
        body: JSON.stringify({ title, desc, link }),
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      return data
    },
  })
  const [tab, setTab] = useState(1)
  const submit = () => {
    // fetch(`${BASE_URL_BE}api/posts`, {
    //   body: JSON.stringify({ title, desc, link }),
    //   method: 'post',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // }).then((e) => {
    //   setVisible(true)
    // })
    create(
      { title, desc, link },
      {
        onSuccess: () => {
          setVisible(true)
        },
      },
    )
  }
  return (
    <div
      style={{
        color: '#ffffff',
        padding: 10,
        width: 350,
        fontFamily: 'monospace',
      }}
    >
      <p style={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold' }}>
        Fake News Detection
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <Button ghost={tab === 2} onClick={() => setTab(1)} size={'sm'}>
          Detect
        </Button>
        <Button ghost={tab === 1} onClick={() => setTab(2)} size={'sm'}>
          Community
        </Button>
      </div>
      <div>
        {tab === 1 && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                gap: 10,
              }}
            >
              <select
                style={{
                  width: 200,
                  height: 40,
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: 'white',
                  backgroundColor: 'rgba(17, 25, 40, 0.3)',
                  borderRadius: 5,
                  outline: 'none',
                  padding: 2,
                }}
                onChange={(e) => predict(e?.target?.value)}
              >
                <option value="NB">Naive Bayes</option>
                <option value="DT">Decision Tree</option>
                <option value="SVM">SVM</option>
                <option value="RNN">LSTM</option>
              </select>
              {rs && (
                <p style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
                  {rs.split(';')[0] === '0'
                    ? 'Real'
                    : rs.split(';')[0] === '2'
                    ? 'No Text Selected'
                    : 'Fake'}
                </p>
              )}
            </div>
            {rs && (
              <p style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                TOPIC: {rs.split(';')[1]}
              </p>
            )}
            {text && (
              <div
                style={{
                  overflow: 'auto',
                  maxHeight: 300,
                }}
              >
                <p
                  style={{
                    fontFamily: 'monospace',
                    color: 'ghostwhite',
                    fontSize: 18,
                  }}
                >
                  Detect for: {'"'}
                  {text}
                  {'"'}
                </p>
              </div>
            )}
            {isLoading ? (
              <Loading color="currentColor" size="sm" />
            ) : (
              <div>
                <h3>Recommend</h3>
                <div className="flex flex-row space-y-2">
                  {posts?.map((e) => {
                    return <CustomCard {...e} key={e?.id} />
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div>
            <h2>Community</h2>
            <form action="">
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e?.target?.value)}
                  bordered
                  labelPlaceholder="Title "
                />
              </div>
              <div>
                <Textarea
                  onChange={(e) => setDesc(e?.target?.value)}
                  value={desc}
                  label="Description"
                />
              </div>
              <div>
                <Textarea
                  value={link}
                  onChange={(e) => setLink(e?.target?.value)}
                  label="Link"
                />
              </div>
              <Button
                onClick={submit}
                type="button"
                style={{ marginTop: 10 }}
                color="success"
              >
                {loadingCreate ? (
                  <Loading color="currentColor" size="sm" />
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Tạo thành công
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text id="modal-description">
            Cảm ơn bạn đã đóng góp thông tin, chúng tôi sẽ sớm phản hồi và duyệt
            tin của bạn
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => setVisible(false)}>
            Đóng
          </Button>
          <Button
            auto
            onPress={() => {
              setVisible(false)
              setTab(1)
            }}
          >
            Đi đến Detect
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
export default App
