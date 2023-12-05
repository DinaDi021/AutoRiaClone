import { updateCarPrices } from "./price-currency-crons";

export const cronRunner = () => {
  updateCarPrices.start();
};
