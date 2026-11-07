import type { Metadata } from "next";
import { FavoritesClientView } from "./FavoritesClientView";

export const metadata: Metadata = {
  title: "My Favourites — The Irish Grocer",
  description: "Your saved authentic Irish groceries and farmhouse provisions.",
};

export default function FavoritesPage() {
  return <FavoritesClientView />;
}

