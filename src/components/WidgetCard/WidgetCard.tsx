import { useState } from 'react'
import styles from './WidgetCard.module.css'

// APD Auto-Login Server URL
const APD_LOGIN_SERVER = 'http://localhost:3001/api/apd-login'

export interface WidgetCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  status?: 'active' | 'beta' | 'coming-soon'
  link?: string
  onClick?: () => void
}

export function WidgetCard({ id, title, description, icon, color, status = 'active', link, onClick }: WidgetCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    // Special handling for APD widget - trigger auto-login via Playwright server
    if (id === 'apd') {
      setIsLoading(true)
      try {
        console.log('🚀 Triggering APD auto-login...')
        const response = await fetch(APD_LOGIN_SERVER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        const data = await response.json()
        
        if (data.success) {
          console.log('✅ APD login successful!', data.message)
        } else {
          console.error('❌ APD login failed:', data.error)
          // Fallback: open the login page manually
          if (link) {
            window.open(link, '_blank', 'noopener,noreferrer')
          }
        }
      } catch (error) {
        console.error('❌ Could not connect to auto-login server:', error)
        console.log('💡 Make sure to run: node scripts/apd-auto-login-server.js')
        // Fallback: open the login page manually
        if (link) {
          window.open(link, '_blank', 'noopener,noreferrer')
        }
      } finally {
        setIsLoading(false)
      }
      return
    }
    
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <button 
      className={`${styles.card} ${isLoading ? styles.loading : ''}`} 
      onClick={handleClick}
      disabled={isLoading}
      style={{ '--widget-color': color } as React.CSSProperties}
    >
      <div className={styles.iconContainer}>
        {isLoading ? (
          <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : icon}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {status !== 'active' && (
            <span className={`${styles.badge} ${styles[status.replace('-', '')]}`}>
              {status === 'beta' ? 'Beta' : 'Coming Soon'}
            </span>
          )}
        </div>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.arrow}>
        {link ? (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className={styles.glow}></div>
    </button>
  )
}
