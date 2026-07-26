import * as service from './payment.service.ts';
import * as validation from './payment.validation.ts';

import { isNumberParameter, getUserPayload } from '../util.ts';

import { type Request, type Response } from 'express';
import { ZodError } from 'zod';

import * as db from '../../database.ts';
import * as err from '../error.ts';

export async function buyItem(req: Request, res: Response) {
  const payload = getUserPayload(req);

  let intention = {};
  if (validation.buyItemSchema.safeParse(req.body).success) {
    intention = await service.startItemPurchase(
      req.body,
      payload.id,
      payload.email,
      payload.name,
    );
  } else if (validation.walletDepositSchema.safeParse(req.body).success) {
    intention = await service.startWalletDeposit(
      req.body,
      payload.id,
      payload.email,
      payload.name,
    );
  } else {
    return res.status(400).send();
  }

  return res.status(200).json(intention);
}

export async function paymobCallback(req: Request, res: Response) {
  if (req.body?.type === 'TRANSACTION') {
    const buyData = req.body?.obj?.payment_key_claims?.extra?.buyData;
    const billData = req.body?.obj?.payment_key_claims?.billing_data;
    if (!buyData || !billData) {
      return res.status(400).send();
    }

    if (validation.buyItemSchema.safeParse(buyData).success) {
      await service.buyItem(billData, buyData);
    } else if (validation.walletDepositSchema.safeParse(buyData).success) {
      await service.depositWallet(billData, buyData);
    } else {
      return res.status(400).send();
    }
  } else {
    return res.status(400).send();
  }

  return res.status(200).send();
}

export async function buyItemWithWallet(req: Request, res: Response) {
  const payload = getUserPayload(req);

  const data = validation.buyItemSchema.parse(req.body);

  await service.buyItemWithWallet(payload.id, data);

  return res.status(200).json({
    message: 'Item purchased successfully',
  });
}
