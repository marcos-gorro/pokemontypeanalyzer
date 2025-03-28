import { POKEMON_TYPES } from "../data/typeChart";
import { TypeBadge } from "./TypeBadge";
import { PokemonType } from "../data/typeChart";

export const TypeSelector = ({
  onSelect,
}: {
  onSelect: (type: PokemonType) => void;
}) => {
  return (
    <div className="grid grid-cols-6 gap-2 p-4">
      {POKEMON_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`bg-${type} hover:opacity-80 transition rounded-full`}
        >
          <TypeBadge type={type} />
        </button>
      ))}
    </div>
  );
};
