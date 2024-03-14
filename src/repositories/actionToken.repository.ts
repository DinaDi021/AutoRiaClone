import { FilterQuery } from "mongoose";

import { EActionTokenType } from "../enums/actionTokenType";
import { ActionTokenModel } from "../models/ActionToken.model";
import { IActionToken } from "../types/token.types";

export class ActionTokenRepository {
  public async create(dto: IActionToken): Promise<IActionToken> {
    return await ActionTokenModel.create(dto);
  }

  public async findOne(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken> {
    return await ActionTokenModel.findOne(params);
  }

  public async deleteOne(params: FilterQuery<IActionToken>): Promise<void> {
    await ActionTokenModel.deleteOne(params);
  }

  public async deleteManyByUserIdAndType(
    userId: string,
    type: EActionTokenType,
  ): Promise<void> {
    await ActionTokenModel.deleteMany({ _userId: userId, type });
  }
}

export const actionTokenRepository = new ActionTokenRepository();
