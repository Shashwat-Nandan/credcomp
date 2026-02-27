import fs from "fs";
import path from "path";
import { CreditCard } from "@/types";

const cardsDirectory = path.join(process.cwd(), "src/data/cards");

export function getAllCards(): CreditCard[] {
  const files = fs.readdirSync(cardsDirectory).filter((f) => f.endsWith(".json"));
  const cards = files.map((file) => {
    const content = fs.readFileSync(path.join(cardsDirectory, file), "utf-8");
    return JSON.parse(content) as CreditCard;
  });
  return cards.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

export function getCardBySlug(slug: string): CreditCard | null {
  const filePath = path.join(cardsDirectory, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as CreditCard;
}

export function getCardsByCategory(category: string): CreditCard[] {
  return getAllCards().filter((card) => card.categories.includes(category));
}

export function getCardsByIssuer(issuer: string): CreditCard[] {
  return getAllCards().filter((card) => card.issuer === issuer);
}

export function getCardsByNetwork(network: string): CreditCard[] {
  return getAllCards().filter((card) => card.network === network);
}

export function getCardsByTier(tier: string): CreditCard[] {
  return getAllCards().filter((card) => card.tier === tier);
}

export function getCardSlugs(): string[] {
  return fs
    .readdirSync(cardsDirectory)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function searchCards(query: string): CreditCard[] {
  const q = query.toLowerCase();
  return getAllCards().filter(
    (card) =>
      card.name.toLowerCase().includes(q) ||
      card.issuer.toLowerCase().includes(q) ||
      card.categories.some((c) => c.toLowerCase().includes(q))
  );
}

export function getTopCards(limit = 6): CreditCard[] {
  return getAllCards().slice(0, limit);
}

export function getRelatedCards(card: CreditCard, limit = 3): CreditCard[] {
  return getAllCards()
    .filter(
      (c) =>
        c.slug !== card.slug &&
        (c.issuer === card.issuer ||
          c.categories.some((cat) => card.categories.includes(cat)))
    )
    .slice(0, limit);
}
