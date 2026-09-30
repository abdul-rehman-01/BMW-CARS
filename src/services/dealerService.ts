import { DEALERS } from '../data/dealers';
import { Dealer } from '../types';

export const dealerService = {
  getAllDealers(): Dealer[] {
    return DEALERS.filter((d) => d.active);
  },

  getDealerById(id: string): Dealer | undefined {
    return DEALERS.find((d) => d.id === id);
  },

  searchDealers(query: string): Dealer[] {
    if (!query.trim()) return this.getAllDealers();
    const q = query.toLowerCase().trim();
    return DEALERS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.postalCode.includes(q) ||
        d.address.toLowerCase().includes(q)
    );
  },

  getCities(): string[] {
    const cities = new Set<string>();
    DEALERS.forEach((d) => cities.add(d.city));
    return Array.from(cities).sort();
  }
};
