import React from 'react'

export default function ParentMode({ addXp, close }) {
  return (
    <div style={{ border: '1px solid white', padding: '20px', marginTop: '20px' }}>
      <h2>Parent Mode</h2>
      <button onClick={() => addXp(50)}>Approve Mission (+50 XP)</button>
      <br />
      <button onClick={close}>Close</button>
    </div>
  )
}
