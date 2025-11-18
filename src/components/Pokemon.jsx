import { useEffect, useState } from "react";

const Pokemon = ({ index, data, loadPokemon, capitalizeFirstLetter }) => {

    const [types, setTypes] = useState([]);
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${index + 1
        }.gif`;

    useEffect(() => {
        async function getPokemonTypes(id) {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            return data.types.map(t => t.type.name);
        }

        getPokemonTypes(index + 1).then(setTypes);
    }, [index]);

    return (
        <div
            className="pokemon-card pokemon-detail-card"
            onClick={loadPokemon ? () => loadPokemon(index) : undefined}
        >
            <div className="pokemon-detail-main">
                { }
                <div className="pokemon-detail-header">
                    <h2>{capitalizeFirstLetter(data.name)}</h2>
                    <img
                        className="pokemon-detail-image"
                        src={imgUrl}
                        alt={data.name}
                    />
                </div>

                { }
                <div className="pokemon-detail-info">
                    <div className="pokemon-info-block">
                        <p>Types</p>
                        {types.map(
                            (type) =>
                                type && (
                                    <span
                                        key={type}
                                        className={`type-box type-${type.toLowerCase()}`}
                                    >
                                        {capitalizeFirstLetter(type)}
                                    </span>
                                )
                        )}
                        <p>Weight: {data.weight}</p>
                        <p>Height: {data.height}</p>
                    </div>

                    <div className="pokemon-info-block">
                        <p>Abilities</p>
                        <ul>
                            {data.abilities.map((abilityInfo) => (
                                <li key={abilityInfo.ability.name}>
                                    {capitalizeFirstLetter(abilityInfo.ability.name)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pokemon-info-block">
                        <p>Stats</p>
                        <div className="pokemon-stats">
                            {data.stats.map((statInfo) => {
                                const value = statInfo.base_stat;
                                const maxStat = 160;
                                const percentage = (value / maxStat) * 100;

                                return (
                                    <div key={statInfo.stat.name} className="pokemon-stat-row">
                                        <span className="pokemon-stat-label">
                                            {capitalizeFirstLetter(
                                                statInfo.stat.name.replace("-", " ")
                                            )}
                                        </span>

                                        <div className="pokemon-stat-bar">
                                            <div
                                                className="pokemon-stat-bar-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>

                                        <span className="pokemon-stat-value">
                                            {value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pokemon-info-block">
                        <p>Other</p>
                        <p>Base Experience: {data.base_experience}</p>
                        <p>Species: {capitalizeFirstLetter(data.species.name)}</p>
                        <p>Held Items:</p>
                        <div className="held-items-list">
                            {data.held_items.length > 0 ? (
                                data.held_items.map((heldItem) => (
                                    <span key={heldItem.item.name} className="held-item-badge">
                                        {capitalizeFirstLetter(heldItem.item.name)}
                                    </span>
                                ))
                            ) : (
                                <span>None</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pokemon;