'use client'

import { useEffect, useState } from 'react'

interface Domain {
  name?: string
  description?: string
  id?: string
}

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // API call example as mentioned in instructions
    fetch('https://execai-platform-api.onrender.com/api/knowledge/domains')
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data)
        // Handle different response formats
        if (Array.isArray(data)) {
          setDomains(data)
        } else if (data && Array.isArray(data.domains)) {
          setDomains(data.domains)
        } else if (data && typeof data === 'object') {
          // If it's an object, convert to array
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
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Micro AI Studios
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Platform for Business Intelligence
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Knowledge Domains
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading domains...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-semibold">Error loading domains</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            </div>
          ) : domains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domains.map((domain: Domain, index: number) => (
                <div key={domain.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {domain.name || `Domain ${index + 1}`}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {domain.description || 'No description available'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No domains available</p>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by EXECAI Platform API</p>
        </footer>
      </div>
    </main>
  )
}

