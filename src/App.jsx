import React, { useState } from 'react'
import CrystalDisplay from './components/CrystalDisplay'
import ParentMode from './components/ParentMode'

export default function App() {
  const [xp, setXp] = useState(0)
  const [rank, setRank] = useState('Youngling')
  const [parentMode, setParentMode] = useState(false)

  const addXp = (amount) => {
    const newXp = xp + amount
    setXp(newXp)
    if (newXp >= 100 && rank === 'Youngling') setRank('Padawan')
    if (newXp >= 250 && rank === 'Padawan') setRank('Knight')
  }

  return (
    <div style={{ textAlign: 'center', color: 'white', background: 'black', height: '100vh', padding: '20px' }}>
      <h1>Jedi Crystal App</h1>
      <CrystalDisplay xp={xp} />
      <p>Rank: {rank} | XP: {xp}</p>
      {!parentMode && <button onClick={() => setParentMode(true)}>Parent Mode</button>}
      {parentMode && <ParentMode addXp={addXp} close={() => setParentMode(false)} />}
    </div>
  )
}
