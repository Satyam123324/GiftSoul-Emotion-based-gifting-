'use client'
import { useState } from 'react'

export default function TestAI() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  async function testKey() {
    setLoading(true)
    setResult('')
    setStatus('')

    try {
      const res = await fetch('/api/test-key')
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setResult(data.message)
      } else {
        setStatus('error')
        setResult(data.error)
      }
    } catch {
      setStatus('error')
      setResult('Could not connect to API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#FBF7F2',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{background:'white',border:'1px solid #E4D3BE',borderRadius:'20px',padding:'2rem',maxWidth:'500px',width:'100%',textAlign:'center'}}>

        <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem',fontWeight:300,color:'#2B2019',marginBottom:'.5rem'}}>
          Gift<em style={{fontStyle:'italic',color:'#B5533C'}}>Soul</em>
        </div>
        <p style={{fontSize:'.85rem',color:'#7C6B60',marginBottom:'2rem'}}>AI Key Tester</p>

        <button
          onClick={testKey}
          disabled={loading}
          style={{padding:'.75rem 2rem',background: loading ? '#C99A54' : '#B5533C',color:'white',border:'none',borderRadius:'2rem',fontSize:'.9rem',cursor: loading ? 'not-allowed' : 'pointer',fontFamily:'DM Sans, sans-serif',fontWeight:500,marginBottom:'1.5rem',width:'100%'}}>
          {loading ? 'Testing your AI key...' : 'Test AI key now →'}
        </button>

        {status === 'success' && (
          <div style={{background:'#E7F3F0',border:'1px solid #3F9E86',borderRadius:'12px',padding:'1.2rem'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'.5rem'}}>✅</div>
            <div style={{fontWeight:500,color:'#1F4A40',marginBottom:'.5rem'}}>Key is working!</div>
            <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#2F6E63',fontStyle:'italic'}}>"{result}"</div>
          </div>
        )}

        {status === 'error' && (
          <div style={{background:'#F9EAE6',border:'1px solid rgba(181,83,60,.3)',borderRadius:'12px',padding:'1.2rem'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'.5rem'}}>❌</div>
            <div style={{fontWeight:500,color:'#7D3526',marginBottom:'.5rem'}}>Key not working</div>
            <div style={{fontSize:'.85rem',color:'#B5533C'}}>{result}</div>
          </div>
        )}

        {!status && !loading && (
          <p style={{fontSize:'.8rem',color:'#C99A54'}}>Click the button to test if your AI key is connected</p>
        )}
      </div>
    </div>
  )
}