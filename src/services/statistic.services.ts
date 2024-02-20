import { statisticRepository } from "../repositories/statistic.repository";
import { IPriceStatistic, IViewsStatistic } from "../types/statistic.types";

class StatisticServices {
  public async getPriceStatisticByCarId(
    carId: string,
  ): Promise<IPriceStatistic> {
    return await statisticRepository.getPriceStatisticByCarId(carId);
  }
  public async getViewsStatisticByCarId(
    carId: string,
  ): Promise<IViewsStatistic> {
    return await statisticRepository.getViewsStatisticByCarId(carId);
  }
}

export const statisticServices = new StatisticServices();
