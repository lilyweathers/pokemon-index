import { useEffect, useState } from "react";
import Pokemon from "./Pokemon";

const PokemonApplication = () => {
    const [pokemons, setPokemons] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [loadedPokemon, setLoadedPokemon] = useState(null);
    const [showPokemon, setShowPokemon] = useState(false);
    const [showPokemons, setShowPokemons] = useState(true);
    const [index, setIndex] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortOption, setSortOption] = useState("id-asc");

    useEffect(() => {
        const loadPokemons = async () => {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
            const json = await response.json();
            const results = Array.isArray(json.results) ? json.results : [json.results];

            const detailed = await Promise.all(
                results.map((result) =>
                    fetch(result.url).then((res) => res.json())
                )
            );

            setPokemons(detailed);
        };

        loadPokemons();
    }, []);

    const getBaseStat = (pokemon, statName) => {
        if (!pokemon?.stats) return 0;
        const stat = pokemon.stats.find((s) => s.stat.name === statName);
        return stat ? stat.base_stat : 0;
    };
    const getTotalStats = (pokemon) => {
        if (!pokemon?.stats) return 0;
        return pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
    };

    const allTypes = Array.from(
        new Set(
            pokemons.flatMap((p) =>
                p.types ? p.types.map((t) => t.type.name) : []
            )
        )
    ).sort();

    const filteredPokemons = pokemons.filter((pokemon) => {
        const matchesSearch = pokemon.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesType =
            typeFilter === "all" ||
            (pokemon.types &&
                pokemon.types.some((t) => t.type.name === typeFilter));

        return matchesSearch && matchesType;
    });

    const sortedPokemons = [...filteredPokemons].sort((a, b) => {
        switch (sortOption) {
            case "id-desc":
                return b.id - a.id;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "hp-desc":
                return getBaseStat(b, "hp") - getBaseStat(a, "hp");
            case "attack-desc":
                return getBaseStat(b, "attack") - getBaseStat(a, "attack");
            case "defense-desc":
                return getBaseStat(b, "defense") - getBaseStat(a, "defense");
            case "total-desc":
                return getTotalStats(b) - getTotalStats(a);
            case "id-asc":
            default:
                return a.id - b.id;
        }
    });

    useEffect(() => {
        setVisibleCount(12);
    }, [searchTerm, typeFilter, sortOption]);

    function loadPokemon(pokemon) {
        if (!pokemon) return;
        setIndex(pokemon.id - 1);
        setLoadedPokemon(pokemon);
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
                    <Pokemon index={index} data={loadedPokemon} loadPokemon={loadPokemon} />
                    <button className="back-button" onClick={goBack}>
                        Back to list
                    </button>
                </div>
            )}

            {showPokemons && (
                <div className="pokemon-layout">
                    <div className="pokemon-top-bar">
                        <h2 className="section-title">Pokédex (1–151)</h2>

                        <div className="pokemon-filters">
                            <input
                                type="text"
                                className="pokemon-search-input"
                                placeholder="Search by name…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <select
                                className="pokemon-type-select"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All types</option>
                                {allTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="pokemon-sort-select"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="id-asc">ID ↑ (1–151)</option>
                                <option value="id-desc">ID ↓ (151–1)</option>
                                <option value="name-asc">Name A–Z</option>
                                <option value="name-desc">Name Z–A</option>
                                <option value="hp-desc">HP (high → low)</option>
                                <option value="attack-desc">Attack (high → low)</option>
                                <option value="defense-desc">Defense (high → low)</option>
                                <option value="total-desc">Total stats (high → low)</option>
                            </select>
                        </div>

                        <select
                            className="pokemon-select"
                            defaultValue=""
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                if (!Number.isNaN(id)) {
                                    const selected = pokemons.find((p) => p.id === id);
                                    if (selected) {
                                        loadPokemon(selected);
                                    }
                                }
                            }}
                        >
                            <option value="" disabled>
                                Select a Pokémon
                            </option>
                            {pokemons
                                .slice()
                                .sort((a, b) => a.id - b.id)
                                .map((pokemon) => (
                                    <option className="capitalize" key={pokemon.id} value={pokemon.id}>
                                        {pokemon.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="pokemon-grid">
                        {sortedPokemons.slice(0, visibleCount).map((pokemon) => (
                            <div
                                key={pokemon.id}
                                className="pokemon-card"
                                onClick={() => loadPokemon(pokemon)}
                            >
                                <h2>{pokemon.name}</h2>
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                                    alt={pokemon.name}
                                />
                            </div>
                        ))}
                    </div>

                    {sortedPokemons.length > visibleCount && (
                        <div className="load-more-wrapper">
                            <button
                                className="load-more-button"
                                onClick={() =>
                                    setVisibleCount((prev) =>
                                        Math.min(prev + 12, sortedPokemons.length)
                                    )
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
