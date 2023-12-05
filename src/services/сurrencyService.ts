import axios from "axios";

import { currencyUrl } from "../constatnts/currency.constant";
import { ExchangeRate, ExchangeRateData } from "../types/currency.types";
import { carService } from "./car.services";

class CurrencyService {
  async updateExchangeRates(): Promise<void> {
    try {
      const response = await axios.get<ExchangeRate[]>(currencyUrl);

      const updateObject: ExchangeRateData = {
        usd: parseFloat(
          response.data.find((rate) => rate.ccy === "USD")?.sale || "0",
        ),
        eur: parseFloat(
          response.data.find((rate) => rate.ccy === "EUR")?.sale || "0",
        ),
        uah: 1.0,
      };

      await carService.updateCarPrices(updateObject);
    } catch (error) {
      throw error;
    }
  }
}

export const currencyService = new CurrencyService();
