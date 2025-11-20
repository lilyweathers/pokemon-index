import { useEffect, useState } from "react";
import Pokemon from "./Pokemon";

const PokemonApplication = () => {
    const [pokemons, setPokemons] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [loadedPokemon, setLoadedPokemon] = useState(null);
    const [showPokemon, setShowPokemon] = useState(false);
    const [showPokemons, setShowPokemons] = useState(true);
    const [index, setIndex] = useState(0);


    useEffect(() => {
        const loadPokemons = async () => {
            let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
            let json = await response.json();
            const normalized = Array.isArray(json.results)
                ? json.results
                : [json.results];
            setPokemons(normalized);
        };

        loadPokemons();
    }, []);

    useEffect(() => {

    }, [loadPokemon]);

    async function loadPokemon(index) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
        const json = await response.json();
        setIndex(index);
        setLoadedPokemon(json);
        setShowPokemon(true);
        setShowPokemons(false);
    }

    function goBack() {
        setShowPokemon(false);
        setShowPokemons(true);
    }

    return (
        <div className="app-page">
            {showPokemon && loadedPokemon && (
                <div className="pokemon-detail-section">
                    <Pokemon index={index} data={loadedPokemon} loadPokemon={loadPokemon}/>
                    <button className="back-button" onClick={goBack}>
                        Back to list
                    </button>
                </div>
            )}

            {showPokemons && (
                <div className="pokemon-layout">
                    <div className="pokemon-top-bar">
                        <h2 className="section-title">Pokédex (1–151)</h2>

                        <select
                            className="pokemon-select"
                            defaultValue=""
                            onChange={(e) => {
                                const selectedIndex = Number(e.target.value);
                                if (!Number.isNaN(selectedIndex)) {
                                    loadPokemon(selectedIndex);
                                }
                            }}
                        >
                            <option value="" disabled>
                                Select a Pokémon
                            </option>
                            {pokemons.map((pokemon, i) => (
                                <option className="capitalize" key={i} value={i}>
                                    {pokemon.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    { }
                    <div id="pokemons" className="pokemon-grid">
                        {pokemons.slice(0, visibleCount).map((pokemon, index) => (
                            <div
                                key={index}
                                className="pokemon-card"
                                onClick={() => loadPokemon(index)}
                            >
                                <h2>{pokemon.name}</h2>
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                                    alt={pokemon.name}
                                />
                            </div>
                        ))}
                    </div>
                    {pokemons.length > visibleCount && (
                            <div className="load-more-wrapper">
                                <button
                                    className="load-more-button"
                                    onClick={() =>
                                        setVisibleCount((prev) => Math.min(prev + 12, pokemons.length))
                                    }
                                >
                                    Load more
                                </button>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};

export default PokemonApplication;