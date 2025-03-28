import { PokemonType } from "../data/typeChart";

export const TypeBadge = ({ type }: { type: PokemonType }) => (
  <span
    className={`px-3 py-1 rounded-full text-white text-sm font-medium type-${type}`}
  >
    {type.toUpperCase()}
  </span>
);
