import React from 'react'
import ReactDOM from 'react-dom/client'

// 最简单的 React 渲染测试
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement('div', { 
    style: { 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'system-ui'
    } 
  }, [
    React.createElement('h1', { 
      style: { color: '#F97316' } 
    }, '🎉 React 简化测试'),
    React.createElement('p', null, '如果你看到这个，说明 React 构建版本正常工作'),
    React.createElement('div', { 
      style: { 
        background: '#10B981', 
        color: 'white', 
        padding: '10px',
        borderRadius: '8px',
        marginTop: '20px'
      } 
    }, '✅ Build Success')
  ])
)