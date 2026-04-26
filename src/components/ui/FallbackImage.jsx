import { useState } from 'react'

export default function FallbackImage({ src, alt, className, style, loading, decoding }) {
  const [error, setError] = useState(false)
  
  const placeholderStyle = {
    background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#EA580C',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    ...style
  }
  
  if (error) {
    return (
      <div style={placeholderStyle} className={className}>
        <span>图片加载失败</span>
      </div>
    )
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      onError={() => setError(true)}
    />
  )
}
