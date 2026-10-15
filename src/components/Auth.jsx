
import { useState } from 'react'
import { loginUser, registerUser } from '../services/authService'

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isRegister = mode === 'register'

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const user = isRegister
        ? await registerUser(name, email, password)
        : await loginUser(email, password)

      onAuthenticated(user)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Dogodila se pogreška. Pokušaj ponovno.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setError('')
    setPassword('')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#111315',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px',
          backgroundColor: '#191c1f',
          border: '1px solid #303438',
          borderRadius: '12px',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px',
            fontSize: '28px',
            textAlign: 'center',
          }}
        >
          VIRTUALNA GARAŽA
        </h1>

        <p
          style={{
            marginBottom: '28px',
            color: '#aeb4ba',
            textAlign: 'center',
          }}
        >
          {isRegister
            ? 'Izradi svoj korisnički račun'
            : 'Prijavi se u svoju garažu'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="auth-name">
                Ime
              </label>

              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                minLength={2}
                required
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="auth-email">
              E-mail adresa
            </label>

            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="auth-password">
              Lozinka
            </label>

            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                isRegister
                  ? 'new-password'
                  : 'current-password'
              }
              minLength={isRegister ? 8 : undefined}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <p
              role="alert"
              style={{
                color: '#ff727b',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '13px',
              backgroundColor: '#e63946',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isSubmitting ? 'wait' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting
              ? 'Pričekaj...'
              : isRegister
                ? 'Registriraj se'
                : 'Prijavi se'}
          </button>
        </form>

        <p
          style={{
            marginTop: '24px',
            textAlign: 'center',
            color: '#aeb4ba',
            fontSize: '14px',
          }}
        >
          {isRegister
            ? 'Već imaš korisnički račun?'
            : 'Nemaš korisnički račun?'}
        </p>

        <button
          type="button"
          onClick={() =>
            changeMode(isRegister ? 'login' : 'register')
          }
          style={{
            display: 'block',
            margin: '10px auto 0',
            background: 'transparent',
            border: 'none',
            color: '#e63946',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {isRegister ? 'Prijavi se' : 'Registriraj se'}
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: '8px',
  padding: '12px',
  border: '1px solid #41464b',
  borderRadius: '6px',
  backgroundColor: '#111315',
  color: '#ffffff',
  fontSize: '14px',
}

export default Auth