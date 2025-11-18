import { use, useEffect, useState } from 'react'
import './App.css'
import PokemonApplication from './components/PokemonApplication'

function App() {

  const [showPokemonApp, setShowPokemonApp] = useState(false);

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Pokémon Application</h1>
        {showPokemonApp && <p className="app-subtitle">Click a Pokémon or use the dropdown to see details.</p>}
        {!showPokemonApp && <p className="app-subtitle">A simple index of the first 151 Pokémons</p>}
      </header>
      <button id="show-pokemon-app" onClick={() => setShowPokemonApp(!showPokemonApp)}>
        {showPokemonApp ? 'Hide' : 'Show'} Pokémon Application
      </button>
      {showPokemonApp && <PokemonApplication />}
    </div>
  )
}

export default App
