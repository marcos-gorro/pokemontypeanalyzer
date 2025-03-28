import { typeChart, PokemonType } from "../data/typeChart";
import { TypeBadge } from "./TypeBadge";
import { POKEMON_TYPES } from "../data/typeChart";

const getMultiplierLabel = (multiplier: number) => {
  if (multiplier >= 4) return `${multiplier}x Weak`;
  if (multiplier === 2) return "2x Weak";
  if (multiplier === 1) return "Neutral";
  if (multiplier === 0.5) return "0.5x Resistant";
  if (multiplier <= 0.25) return `${multiplier}x Resistant`;
  if (multiplier === 0) return "Immune";
  return `${multiplier}x`;
};

export const MatchupDisplay = ({ types }: { types: PokemonType[] }) => {
  const matchupGroups: Record<string, PokemonType[]> = {};

  // Calculate effectiveness against all types
  POKEMON_TYPES.forEach((attackType) => {
    const multiplier = types.reduce(
      (total, defType) => total * (typeChart[defType][attackType] || 1),
      1
    );
    const label = getMultiplierLabel(multiplier);

    if (!matchupGroups[label]) {
      matchupGroups[label] = [];
    }
    matchupGroups[label].push(attackType);
  });

  return (
    <div className="space-y-4">
      {Object.entries(matchupGroups).map(([label, types]) => (
        <div key={label}>
          <h3 className="font-bold mb-2">{label}:</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
