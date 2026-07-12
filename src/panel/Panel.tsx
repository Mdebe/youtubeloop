import React from 'react'

function Panel() {
  console.log('[Panel] Rendering') // you'll see this in console if it works

  return (
    <div
      style={{
        width: '320px',
        backgroundColor: '#ff0000',
        color: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
    >
      REACT IS RENDERING
    </div>
  )
}

export default Panel