'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ImageUpload({ bucket = 'product-images', folder = 'general', onUploaded, label = 'Upload a photo' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (jpg, png, webp).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

    setError('')
    setUploading(true)
    setPreviewUrl(URL.createObjectURL(file))

    try {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      if (onUploaded) onUploaded(publicData.publicUrl)

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '.5rem', width: '100%', minHeight: '140px',
          border: '1.5px dashed #D6C2A0', borderRadius: '14px',
          background: previewUrl ? 'transparent' : '#F6F1E9',
          cursor: uploading ? 'not-allowed' : 'pointer',
          overflow: 'hidden', position: 'relative',
          transition: 'border-color .2s ease'
        }}
        onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = '#A8501F' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#D6C2A0' }}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
        ) : (
          <>
            <span style={{ fontSize: '1.6rem', color: '#BE9A66' }}>+</span>
            <span style={{ fontSize: '.82rem', color: '#5E4E3A', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
            <span style={{ fontSize: '.7rem', color: '#BE9A66' }}>JPG, PNG or WEBP — max 5MB</span>
          </>
        )}

        {uploading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(246,241,233,.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: '22px', height: '22px', border: '2.5px solid rgba(168,80,31,.2)',
              borderTopColor: '#A8501F', borderRadius: '50%',
              animation: 'gsSpin .7s linear infinite'
            }} />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploading ? 'not-allowed' : 'pointer' }}
        />
      </label>

      {error && (
        <p style={{ fontSize: '.78rem', color: '#A8501F', marginTop: '.5rem' }}>{error}</p>
      )}
    </div>
  )
}