import { configs } from "../configs/configs";
import { IUser } from "../types/users.types";

interface IPresenter<I, O> {
  present(payload: I): O;
}

class UserPresenter implements IPresenter<IUser, Partial<IUser>> {
  present(data: IUser): Partial<IUser> {
    return {
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      email: data.email,
      password: data.password,
      status: data.status,
      roles: data.roles,
      isBlocked: data.isBlocked,
      isAccountPremium: data.isAccountPremium,
      avatar: `${configs.AWS_S3_URL}/${data.avatar}`,
    };
  }
}

export const userPresenter = new UserPresenter();
