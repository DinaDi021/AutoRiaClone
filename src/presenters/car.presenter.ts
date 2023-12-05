import { configs } from "../configs/configs";
import { ICar } from "../types/cars.types";

interface IPresenter<I, O> {
  present(payload: I): O;
}

class CarPresenter implements IPresenter<ICar, Partial<ICar>> {
  present(data: ICar): Partial<ICar> {
    const images = Array.isArray(data.image) ? data.image : [data.image];
    return {
      _id: data._id,
      carModel: data.carModel,
      year: data.year,
      price: data.price,
      currency: data.currency,
      description: data.description,
      image: images.map((img) => `${configs.AWS_S3_URL}/${img}`),
      _userId: data._userId,
    };
  }
}

export const carPresenter = new CarPresenter();
