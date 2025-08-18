import React from 'react'

export default function CrystalDisplay({ xp }) {
  const height = 100 + xp / 2
  const width = 60

  return (
    <svg width={width} height={height} viewBox="0 0 60 120" style={{ display: 'block', margin: '20px auto' }}>
      <polygon points="30,0 60,40 60,80 30,120 0,80 0,40" fill="deepskyblue" stroke="white" strokeWidth="2" />
    </svg>
  )
}
