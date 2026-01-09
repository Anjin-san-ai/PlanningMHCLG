import styles from './Sidebar.module.css'

interface AgentButton {
  id: string
  name: string
  description: string
  icon: 'planning'
  isPrimary?: boolean
  agentType: 'planning'
}

const agents: AgentButton[] = [
  {
    id: 'planning-agent',
    name: 'Planning Agent',
    description: 'AI-powered planning assistance',
    icon: 'planning',
    isPrimary: true,
    agentType: 'planning'
  }
]

interface SidebarProps {
  onAgentSelect: (agentType: 'planning') => void
  activeAgent: 'planning' | null
}

export function Sidebar({ onAgentSelect, activeAgent }: SidebarProps) {
  const handleAgentClick = (agent: AgentButton) => {
    onAgentSelect(agent.agentType)
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoContainer}>
          <img src="/crown-logo.svg" alt="Crown Logo" className={styles.logo} />
        </div>
        <div className={styles.brandText}>
          <h1 className={styles.brandTitle}>MHCLG Planning</h1>
          <span className={styles.brandSubtitle}>Planning Hub</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>AI Agents</h2>
          <div className={styles.agentList}>
            {agents.map((agent) => (
              <button
                key={agent.id}
                className={`${styles.agentButton} ${agent.isPrimary ? styles.primary : ''} ${activeAgent === agent.agentType ? styles.active : ''}`}
                onClick={() => handleAgentClick(agent)}
              >
                <div className={styles.agentIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>{agent.name}</span>
                  <span className={styles.agentDescription}>{agent.description}</span>
                </div>
                <svg className={styles.agentChevron} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Links</h2>
          <div className={styles.quickLinks}>
            <a href="#" className={styles.quickLink}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </a>
            <a href="#" className={styles.quickLink}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Documentation
            </a>
            <a href="#" className={styles.quickLink}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Help & Support
            </a>
          </div>
        </div>
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerBrand}>
          <span className={styles.footerText}>Powered by</span>
          <a 
            href="https://github.com/cognizant-ai-lab/neuro-san-studio" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.footerCompany}
          >
            Neuro SAN
          </a>
        </div>
      </div>
    </aside>
  )
}
