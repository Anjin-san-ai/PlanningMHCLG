import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, UserPersona, LocalCouncil } from '../context/AuthContext'
import styles from './LoginPage.module.css'

const USER_PERSONAS: UserPersona[] = ['LPA Officer', 'Planning Officer']
const LOCAL_COUNCILS: LocalCouncil[] = ['Barnet', 'Doncaster', 'West Berkshire', 'Newcastle', 'Manchester City']

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userPersona, setUserPersona] = useState<UserPersona>('LPA Officer')
  const [localCouncil, setLocalCouncil] = useState<LocalCouncil>('Barnet')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = login(username, password, userPersona, localCouncil)
    
    if (success) {
      navigate('/')
    } else {
      setError('Invalid username or password')
    }
    
    setIsLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img src="/crown-logo.svg" alt="Crown Logo" className={styles.logo} />
          </div>
          <h1 className={styles.title}>MHCLG Planning Hub</h1>
          <p className={styles.subtitle}>Ministry of Housing, Communities & Local Government</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Enter your username"
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="userPersona" className={styles.label}>
              User Persona
            </label>
            <select
              id="userPersona"
              value={userPersona}
              onChange={(e) => setUserPersona(e.target.value as UserPersona)}
              className={styles.select}
              disabled={isLoading}
            >
              {USER_PERSONAS.map((persona) => (
                <option key={persona} value={persona}>
                  {persona}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="localCouncil" className={styles.label}>
              Local Council
            </label>
            <select
              id="localCouncil"
              value={localCouncil}
              onChange={(e) => setLocalCouncil(e.target.value as LocalCouncil)}
              className={styles.select}
              disabled={isLoading}
            >
              {LOCAL_COUNCILS.map((council) => (
                <option key={council} value={council}>
                  {council}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className={styles.error}>
              <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Use credentials: <code>planning_officer</code> / <code>planning_officer</code></p>
        </div>
      </div>

      <div className={styles.backgroundPattern}></div>
    </div>
  )
}

