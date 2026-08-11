/**
 * Заглушка точек FIRE FOOD, Калининград. Позже: БД + objectId R-Keeper.
 * @typedef {{ id: string, name: string, address: string, city: string, rkeeperObjectId: number | null, pickup: boolean, delivery: boolean, workHours: string }} Location
 */

/** @type {Location[]} */
export const mockLocations = [
  {
    id: "kgd-leninsky",
    name: "FIRE FOOD · Ленинский",
    address: "ул. Ленинский проспект, 30",
    city: "Калининград",
    rkeeperObjectId: null,
    pickup: true,
    delivery: true,
    workHours: "10:00–23:00",
  },
  {
    id: "kgd-moscow",
    name: "FIRE FOOD · Московский",
    address: "пр-т Московский, 40",
    city: "Калининград",
    rkeeperObjectId: null,
    pickup: true,
    delivery: true,
    workHours: "10:00–23:00",
  },
  {
    id: "kgd-north",
    name: "FIRE FOOD · Северный",
    address: "ул. Северная, 12",
    city: "Калининград",
    rkeeperObjectId: null,
    pickup: true,
    delivery: false,
    workHours: "11:00–22:00",
  },
];
