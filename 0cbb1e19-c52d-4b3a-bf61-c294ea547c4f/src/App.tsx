import { useState } from "react";
import { TypeSelector } from "./components/TypeSelector";
import { MatchupDisplay } from "./components/MatchupDisplay";
import { PokemonType } from "./data/typeChart";
import { TypeBadge } from "./components/TypeBadge";

export default function App() {
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);

  const handleSelectType = (type: PokemonType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : prev.length < 2
        ? [...prev, type]
        : [prev[1], type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Changed to semantic header tag */}
      <header className="bg-red-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Pokémon Type Calculator</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <TypeSelector onSelect={handleSelectType} />

        {selectedTypes.length > 0 && (
          <section className="mt-8 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 flex gap-2">
              {selectedTypes.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </h2>
            <MatchupDisplay types={selectedTypes} />
          </section>
        )}
      </main>
    </div>
  );
}
