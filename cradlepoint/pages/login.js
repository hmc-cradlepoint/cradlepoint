import { useState } from 'react';
import useUser from '../util/useUser';
import Form from '../components/login/Form';
import PlainScreen from '../components/baseScreen/PlainScreen';
import fetchJson from '../util/fetchJson';

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: '/testHome',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    // console.log("Read the Email:", e.currentTarget.email.value);
    const body = {
      loginEmail: e.currentTarget.email.value,
    }

    try {
      mutateUser(
        await fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMsg(error.data.message)
    }
  }

  return (
    <PlainScreen>
      <div className="login">
        <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </PlainScreen>
  )
}

export default Login;
