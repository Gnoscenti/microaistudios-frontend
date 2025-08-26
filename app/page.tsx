'use client'

import { useEffect, useState } from 'react'

interface Domain {
  name?: string
  description?: string
  id?: string
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

interface PersonaProfile {
  name?: string
  description?: string
  capabilities?: string[]
}

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'profile'>('chat')
  const [personaProfile, setPersonaProfile] = useState<PersonaProfile | null>(null)
  const [selectedDomain, setSelectedDomain] = useState<string>('business')

  const API_BASE = 'https://execai-platform-api.onrender.com'

  useEffect(() => {
    // Load knowledge domains
    fetch(`${API_BASE}/api/knowledge/domains`)
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data)
        if (Array.isArray(data)) {
          setDomains(data)
        } else if (data && Array.isArray(data.domains)) {
          setDomains(data.domains)
        } else if (data && typeof data === 'object') {
          setDomains([data])
        } else {
          setDomains([])
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching domains:', error)
        setError(error.message)
        setLoading(false)
      })

    // Load persona profile
    fetch(`${API_BASE}/api/personas/strategic-catalyst/profile`)
      .then(res => res.json())
      .then(data => {
        setPersonaProfile(data)
      })
      .catch(error => {
        console.error('Error fetching persona profile:', error)
      })
  }, [])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const response = await fetch(`${API_BASE}/api/personas/strategic-catalyst/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage,
          context: selectedDomain
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || 'I apologize, but I\'m currently experiencing connectivity issues. Please try again later.',
        sender: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m currently experiencing connectivity issues. Please try again later.',
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const domainColors = [
    'bg-blue-500',
    'bg-purple-500', 
    'bg-yellow-500',
    'bg-pink-500',
    'bg-teal-500'
  ]

  const domainIcons = ['💼', '🧮', '💻', '📄', '🎤']

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Knowledge Domains */}
      <div className="w-80 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Knowledge Domains</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading domains...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <p className="text-sm font-semibold">Error loading domains</p>
              <p className="text-xs mt-2">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {domains.map((domain: Domain, index: number) => (
              <button
                key={domain.id || index}
                onClick={() => setSelectedDomain(domain.name?.toLowerCase() || 'business')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedDomain === (domain.name?.toLowerCase() || 'business')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{domainIcons[index] || '📋'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {domain.name || `Domain ${index + 1}`}
                    </h3>
                    <p className="text-gray-600 text-xs mt-1">
                      {domain.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-blue-600">EXECAI Platform</h1>
            <p className="text-gray-600">Strategic Catalyst Persona</p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Persona Profile
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      🤖
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Ask the Strategic Catalyst a question to get started.
                    </h3>
                    <p className="text-gray-600">
                      Example: "How can I create a business model for my startup?"
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl p-4 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-1">
                            <div className="font-semibold text-sm mb-1">
                              {message.sender === 'user' ? 'You' : 'Strategic Catalyst'}
                            </div>
                            <div className="whitespace-pre-wrap">{message.text}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="font-semibold text-sm">Strategic Catalyst</div>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isTyping}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Persona Profile Tab */
            <div className="flex-1 p-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Persona Profile</h2>
                
                {personaProfile ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Name</h3>
                      <p className="text-gray-600">{personaProfile.name || 'Strategic Catalyst'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                      <p className="text-gray-600">{personaProfile.description || 'AI-powered strategic advisor for business intelligence and decision-making.'}</p>
                    </div>
                    
                    {personaProfile.capabilities && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Capabilities</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {personaProfile.capabilities.map((capability, index) => (
                            <li key={index}>{capability}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-6 py-3">
          <div className="text-center text-sm text-gray-500">
            <p>EXECAI Platform © 2025 | Strategic Catalyst Persona</p>
            <p>Powered by the EXECAI Multi-Agentic Framework</p>
          </div>
        </div>
      </div>
    </div>
  )
}

