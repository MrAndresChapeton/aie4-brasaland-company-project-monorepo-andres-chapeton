import type { Location, MenuItem } from "../../../shared/types/index.ts";
import type { Collection } from "./collections.ts";

export function findLocationById(locations: Collection<Location>, id: string): Location | null {
  return (locations ?? []).find((location) => location.id === id) ?? null;
}

export function findMenuItemByName(items: Collection<MenuItem>, name: string): MenuItem | null {
  return (items ?? []).find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()) ?? null;
}

export function binarySearchLocationByCapacity(sortedLocations: Collection<Location>, targetCapacity: number): number {
  const locations = sortedLocations ?? [];
  let left = 0;
  let right = locations.length - 1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const capacity = locations[middle].seatingCapacity;
    if (capacity === targetCapacity) return middle;
    if (capacity < targetCapacity) left = middle + 1;
    else right = middle - 1;
  }
  return -1;
}