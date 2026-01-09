import { useState, useCallback, useEffect, useRef } from 'react'

export interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface NeuroSanConfig {
  baseUrl: string
  wsUrl: string
  agentNetwork: string
}

const getConfig = (agentType: 'planning' | 'summarise'): NeuroSanConfig => {
  const baseUrl = import.meta.env.VITE_NEURO_SAN_URL || 'http://localhost:30011'
  const wsUrl = import.meta.env.VITE_NEURO_SAN_WS_URL || 'ws://localhost:30011'
  
  const agentNetwork = agentType === 'planning' 
    ? 'mhclg_planning_agent'
    : 'mhclg_summarise_agent'
  
  return { baseUrl, wsUrl, agentNetwork }
}

// Generate unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate unique message ID
const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function useNeuroSan(agentType: 'planning' | 'summarise') {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sessionIdRef = useRef<string>(generateSessionId())
  const wsRef = useRef<WebSocket | null>(null)
  const config = getConfig(agentType)

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`${config.wsUrl}/ws/${config.agentNetwork}/${sessionIdRef.current}`)
        
        ws.onopen = () => {
          console.log('Connected to Neuro SAN')
          setIsConnected(true)
        }
        
        ws.onclose = () => {
          console.log('Disconnected from Neuro SAN')
          setIsConnected(false)
          // Attempt reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000)
        }
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          setIsConnected(false)
        }
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            handleAgentResponse(data)
          } catch {
            // Handle plain text response
            handleAgentResponse({ content: event.data })
          }
        }
        
        wsRef.current = ws
      } catch (error) {
        console.error('Failed to connect to Neuro SAN:', error)
        setIsConnected(false)
        // Fallback: simulate connection for demo purposes
        setTimeout(() => setIsConnected(true), 1000)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [config.wsUrl, config.agentNetwork])

  const handleAgentResponse = useCallback((data: { content?: string; message?: string; text?: string }) => {
    const content = data.content || data.message || data.text || ''
    
    if (content) {
      const agentMessage: Message = {
        id: generateMessageId(),
        role: 'agent',
        content,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, agentMessage])
    }
    
    setIsLoading(false)
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Try WebSocket first
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        message: content,
        session_id: sessionIdRef.current,
        agent_network: config.agentNetwork
      }))
      return
    }

    // Fallback to REST API
    try {
      const response = await fetch(`${config.baseUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          session_id: sessionIdRef.current,
          agent_network: config.agentNetwork
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      handleAgentResponse(data)
    } catch (error) {
      console.error('Failed to send message:', error)
      
      // Simulate response for demo when Neuro SAN is not available
      setTimeout(() => {
        const simulatedResponse = getSimulatedResponse(content, agentType)
        handleAgentResponse({ content: simulatedResponse })
      }, 1500)
    }
  }, [config.baseUrl, config.agentNetwork, handleAgentResponse, agentType])

  const clearMessages = useCallback(() => {
    setMessages([])
    sessionIdRef.current = generateSessionId()
  }, [])

  return {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    clearMessages
  }
}

// Simulated responses when Neuro SAN is not available
function getSimulatedResponse(userMessage: string, agentType: 'planning' | 'summarise'): string {
  const lowerMessage = userMessage.toLowerCase()
  
  if (agentType === 'planning') {
    if (lowerMessage.includes('document') || lowerMessage.includes('required')) {
      return `For a standard planning application in England, you typically need:

**Essential Documents:**
• Completed application form
• Location plan (1:1250 or 1:2500 scale)
• Site plan (1:500 or 1:200 scale)
• Existing and proposed floor plans
• Existing and proposed elevations
• Design and Access Statement (for major applications)

**Additional Documents (if applicable):**
• Heritage Statement (for listed buildings)
• Flood Risk Assessment (flood zones 2 & 3)
• Tree Survey Report
• Transport Assessment
• Ecological Survey

Would you like more details on any specific document?`
    }
    
    if (lowerMessage.includes('process') || lowerMessage.includes('permission')) {
      return `The planning permission process in England typically follows these stages:

**1. Pre-application Stage**
Consider pre-application advice from your local planning authority (LPA).

**2. Submit Application**
Submit via the Planning Portal or directly to your LPA with required fee.

**3. Validation**
LPA checks if application is valid and complete.

**4. Consultation (21 days)**
Neighbours, parish council, and statutory consultees are notified.

**5. Assessment (8-13 weeks)**
• Minor applications: 8 weeks
• Major applications: 13 weeks
• EIA applications: 16 weeks

**6. Decision**
Application is approved, approved with conditions, or refused.

**7. Appeal (if refused)**
You can appeal to the Planning Inspectorate within 6 months.

Is there a specific stage you'd like more information about?`
    }
    
    if (lowerMessage.includes('permitted development') || lowerMessage.includes('pd rights')) {
      return `**Permitted Development Rights** allow certain building works and changes of use without needing planning permission.

**Common Permitted Development:**

**Householder:**
• Single-storey rear extensions up to 4m (detached) or 3m (attached)
• Loft conversions up to 40-50m³ (with conditions)
• Outbuildings up to 50% of garden area
• Solar panels on roofs

**Restrictions apply if:**
• Your property is in a Conservation Area
• Your home is a Listed Building
• Article 4 Directions are in place
• You live in an AONB or National Park

**Important:** Always check with your Local Planning Authority before starting work, as conditions vary.

Would you like to know about a specific type of development?`
    }
    
    return `Thank you for your planning enquiry. I'm the MHCLG Planning Agent, here to help with UK planning applications and regulations.

Based on your question about "${userMessage.substring(0, 50)}...", I can provide guidance on:

• Planning application requirements
• The planning process timeline
• Permitted development rights
• Local plan policies
• Planning appeals

Please provide more details about your specific planning query, and I'll do my best to assist you.

*Note: This is a demo response. For production use, connect to the Neuro SAN server.*`
  } else {
    // Summarise agent responses
    return `I'm the Summarise Agent. I can help you summarise and analyse planning documents.

To summarise a document, please:
1. Paste the text content you want summarised
2. Upload a document (when file upload is enabled)
3. Provide a URL to a planning document

I can extract key points, identify important dates and requirements, and create concise summaries of lengthy planning reports.

*Note: This is a demo response. Connect to Neuro SAN for full functionality.*`
  }
}

// Export types and utilities
export type { NeuroSanConfig }
export { generateSessionId, generateMessageId }

