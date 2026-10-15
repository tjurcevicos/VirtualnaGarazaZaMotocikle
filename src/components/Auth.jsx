
import { useState } from 'react'
import { loginUser, registerUser } from '../services/authService'
import './Auth.css'

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    if (isSubmitting) {
      return
    }

    setMode(nextMode)
    setError('')
    setPassword('')
    setShowPassword(false)
  }

  return (
    <main className="auth-page">
      <div className="auth-background" />

      <section className="auth-card">
        <div className="auth-brand">

          <h1 className="auth-title">
            VIRTUALNA GARAŽA
            <span>ZA MOTOCIKLE</span>
          </h1>

          <p className="auth-tagline">
            TVOJI MOTOCIKLI. TVOJA PRIČA.
          </p>
        </div>

        <div
          className="auth-tabs"
          role="group"
          aria-label="Odabir prijave ili registracije"
        >
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => changeMode('login')}
            disabled={isSubmitting}
            aria-pressed={!isRegister}
          >
            Prijava
          </button>

          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => changeMode('register')}
            disabled={isSubmitting}
            aria-pressed={isRegister}
          >
            Registracija
          </button>
        </div>

        <div className="auth-form-heading">
          <h2>
            {isRegister
              ? 'Izradi korisnički račun'
              : 'Dobrodošao natrag'}
          </h2>

          <p>
            {isRegister
              ? 'Registriraj se i stvori svoju virtualnu garažu.'
              : 'Prijavi se i nastavi upravljati svojom garažom.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-name">
                Ime
              </label>

              <input
                id="auth-name"
                name="name"
                type="text"
                placeholder="Unesi svoje ime"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                minLength={2}
                disabled={isSubmitting}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">
              E-mail adresa
            </label>

            <input
              id="auth-email"
              name="email"
              type="email"
              placeholder="Unesi e-mail adresu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">
              Lozinka
            </label>

            <div className="auth-password-wrapper">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={
                  isRegister
                    ? 'Najmanje 8 znakova'
                    : 'Unesi lozinku'
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  isRegister
                    ? 'new-password'
                    : 'current-password'
                }
                minLength={isRegister ? 8 : undefined}
                disabled={isSubmitting}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
                aria-label={
                  showPassword
                    ? 'Sakrij lozinku'
                    : 'Prikaži lozinku'
                }
                aria-pressed={showPassword}
              >
                {showPassword ? 'Sakrij' : 'Prikaži'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Pričekaj...'
              : isRegister
                ? 'Registriraj se'
                : 'Prijavi se'}
          </button>
        </form>

        <div className="auth-divider">
          <span>ili</span>
        </div>

        <div className="auth-footer">
          <p>
            {isRegister
              ? 'Već imaš korisnički račun?'
              : 'Nemaš korisnički račun?'}
          </p>

          <button
            type="button"
            className="auth-switch"
            onClick={() =>
              changeMode(isRegister ? 'login' : 'register')
            }
            disabled={isSubmitting}
          >
            {isRegister
              ? 'Prijavi se'
              : 'Registriraj se'}
          </button>
        </div>

        <p className="auth-bottom-text">
          Virtualna garaža za motocikle
        </p>
      </section>
    </main>
  )
}

export default Auth