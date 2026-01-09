import { useState, useMemo } from 'react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { WidgetCard } from '../components/WidgetCard'
import { AgentChat } from '../components/AgentChat'
import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

interface PlanningWidget {
  id: string
  title: string
  description: string
  color: string
  status?: 'active' | 'beta' | 'coming-soon'
  link?: string
  isConnected?: boolean // Part of the connected flow diagram
}

// Connected widgets (APD, ARCUS/IDOX, BOPS) - displayed in flow diagram
const connectedWidgets: PlanningWidget[] = [
  {
    id: 'apd',
    title: 'APD',
    description: 'Augmented Planning Decisions',
    color: '#f47738',
    status: 'active',
    link: 'https://mhclg.gpetoplanning.ai/login',
    isConnected: true
  },
  {
    id: 'idox',
    title: 'IDOX',
    description: 'Powered by Uniform/Cloud',
    color: '#4c6272',
    status: 'active',
    isConnected: true
  },
  {
    id: 'arcus',
    title: 'ARCUS',
    description: 'Powered by Salesforce',
    color: '#912b88',
    status: 'beta',
    isConnected: true
  },
  {
    id: 'bops',
    title: 'BOPS',
    description: 'Back-office town planning system',
    color: '#00703c',
    status: 'active',
    isConnected: true
  }
]

// AI Apps
const aiWidgets: PlanningWidget[] = [
  {
    id: 'neuro-ai',
    title: 'Neuro AI',
    description: 'AI agent orchestration for intelligent planning workflows',
    color: '#6366f1',
    status: 'active',
    link: 'https://neuro-ai.evolution.ml/multiAgentAccelerator?demo='
  },
  {
    id: 'responsible-ai',
    title: 'Responsible AI',
    description: 'AI governance, ethics, and compliance monitoring',
    color: '#10b981',
    status: 'active',
    link: 'https://white-dune-043f5eb0f.4.azurestaticapps.net/'
  },
  {
    id: 'agent-builder',
    title: 'Agent Builder Sandbox',
    description: 'Build, test, and deploy custom AI agents',
    color: '#8b5cf6',
    status: 'beta'
  },
  {
    id: 'ai-for-bi',
    title: 'AI for BI',
    description: 'Business intelligence powered by artificial intelligence',
    color: '#ec4899',
    status: 'active'
  }
]

// Other planning widgets
const otherWidgets: PlanningWidget[] = [
  {
    id: 'planx',
    title: 'PLANX',
    description: 'Digital planning application system for streamlined submissions and tracking',
    color: '#1d70b8',
    status: 'active'
  },
  {
    id: 'extract',
    title: 'EXTRACT',
    description: 'Data extraction and analytics service for planning intelligence',
    color: '#d4351c',
    status: 'active'
  }
]

const getWidgetIcon = (id: string) => {
  switch (id) {
    case 'planx':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      )
    case 'bops':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    case 'idox':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path d="M9 9h1M9 13h6M9 17h6" />
        </svg>
      )
    case 'arcus':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'extract':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    case 'apd':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    case 'neuro-ai':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4.5c-4.5 0-6.5 3-6.5 5.5 0 2.5 1 4 2.5 5.5s2 3 2 4.5h4c0-1.5.5-3 2-4.5s2.5-3 2.5-5.5c0-2.5-2-5.5-6.5-5.5z" />
          <path d="M10 20h4M12 4.5V3M8 8.5l-1.5-1M16 8.5l1.5-1M7 12H5.5M18.5 12H17" />
          <circle cx="10" cy="11" r="1" />
          <circle cx="14" cy="11" r="1" />
        </svg>
      )
    case 'responsible-ai':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'agent-builder':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 17.5h7M17.5 14v7" />
        </svg>
      )
    case 'ai-for-bi':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 5-6" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      )
    default:
      return null
  }
}

// Bidirectional Arrow Component
const BidirectionalArrow = () => (
  <div className={styles.arrowConnector}>
    <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2">
      {/* Left arrow head */}
      <polyline points="8,8 4,12 8,16" />
      {/* Line */}
      <line x1="4" y1="12" x2="44" y2="12" />
      {/* Right arrow head */}
      <polyline points="40,8 44,12 40,16" />
    </svg>
  </div>
)

export function Dashboard() {
  const [activeAgent, setActiveAgent] = useState<'planning' | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { localCouncil, userPersona } = useAuth()

  // Get filtered connected widgets based on local council selection
  // Order: APD -> ARCUS/IDOX -> BOPS
  const filteredConnectedWidgets = useMemo(() => {
    const apd = connectedWidgets.find(w => w.id === 'apd')!
    const bops = connectedWidgets.find(w => w.id === 'bops')!
    
    if (localCouncil === 'Manchester City') {
      // Manchester City: Show Arcus
      const arcus = connectedWidgets.find(w => w.id === 'arcus')!
      return [apd, arcus, bops]
    }
    // All other councils: Show IDOX
    const idox = connectedWidgets.find(w => w.id === 'idox')!
    return [apd, idox, bops]
  }, [localCouncil])

  // Combine AI widgets and other widgets for the standard grid
  const gridWidgets = useMemo(() => {
    return [...aiWidgets, ...otherWidgets]
  }, [])

  const handleAgentSelect = (agentType: 'planning') => {
    setActiveAgent(agentType)
    setIsChatOpen(true)
  }

  const handleChatClose = () => {
    setIsChatOpen(false)
  }

  const handleWidgetClick = (widgetId: string) => {
    // Placeholder for widget functionality
    console.log('Widget clicked:', widgetId)
  }

  return (
    <div className={styles.layout}>
      <Sidebar onAgentSelect={handleAgentSelect} activeAgent={activeAgent} />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Welcome Planning Officer – {localCouncil}
              </h1>
              <p className={styles.heroSubtitle}>
                Streamline your planning workflow with integrated systems and AI-powered assistance
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>2,847</span>
                <span className={styles.statLabel}>Active Applications</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>156</span>
                <span className={styles.statLabel}>Pending Reviews</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>94%</span>
                <span className={styles.statLabel}>Processing Rate</span>
              </div>
              <div className={`${styles.statCard} ${styles.statCardUser}`}>
                <span className={styles.statValue}>{userPersona || 'Planning Officer'}</span>
                <span className={styles.statLabel}>User Role</span>
              </div>
              <div className={`${styles.statCard} ${styles.statCardCouncil}`}>
                <span className={styles.statValue}>{localCouncil}</span>
                <span className={styles.statLabel}>Council</span>
              </div>
            </div>
          </div>

          <section className={styles.widgetsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Planning Systems</h2>
              <span className={styles.integrationNote}>
                * IDOX and ARCUS are integrated based on the availability of the tools for each LPA
              </span>
              <p className={styles.sectionDescription}>
                Access integrated planning tools and services
              </p>
            </div>

            {/* Connected Widgets Flow Diagram */}
            <div className={styles.connectedWidgetsSection}>
              <span className={styles.flowSectionLabel}>Core Planning Flow</span>
              <div className={styles.connectedWidgetsRow}>
                {filteredConnectedWidgets.map((widget, index) => (
                  <div 
                    key={widget.id} 
                    className={styles.connectedWidgetItem}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className={styles.connectedWidgetCard}>
                      <WidgetCard
                        id={widget.id}
                        title={widget.title}
                        description={widget.description}
                        icon={getWidgetIcon(widget.id)}
                        color={widget.color}
                        status={widget.status}
                        link={widget.link}
                        onClick={() => handleWidgetClick(widget.id)}
                      />
                    </div>
                    {/* Add bidirectional arrow after APD and ARCUS/IDOX */}
                    {index < filteredConnectedWidgets.length - 1 && <BidirectionalArrow />}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Apps and Other Widgets Grid */}
            <div className={styles.subSectionHeader}>
              <h3 className={styles.subSectionTitle}>AI Apps & Tools</h3>
            </div>
            <div className={styles.widgetsGrid}>
              {gridWidgets.map((widget, index) => (
                <div 
                  key={widget.id} 
                  className={styles.widgetWrapper}
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <WidgetCard
                    id={widget.id}
                    title={widget.title}
                    description={widget.description}
                    icon={getWidgetIcon(widget.id)}
                    color={widget.color}
                    status={widget.status}
                    link={widget.link}
                    onClick={() => handleWidgetClick(widget.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Agent Chat Panel */}
      {activeAgent && (
        <AgentChat 
          isOpen={isChatOpen}
          onClose={handleChatClose}
          agentType={activeAgent}
        />
      )}
    </div>
  )
}
