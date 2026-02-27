import { CreditCard } from "@/types";
import { CardTile } from "./CardTile";

export function CardGrid({
  cards,
  emptyMessage = "No cards found.",
}: {
  cards: CreditCard[];
  emptyMessage?: string;
}) {
  if (cards.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <CardTile key={card.slug} card={card} />
      ))}
    </div>
  );
}
