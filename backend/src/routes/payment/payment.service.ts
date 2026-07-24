import z from 'zod';

import * as db from '../../database.ts';
import * as util from '../util.ts';
import * as err from '../error.ts';

import * as validation from './payment.validation.ts';
async function addItem(buyData: validation.buyItemData, user: db.SelectUser) {
  switch (buyData.itemType) {
    case 'course': {
      const courseEnrollment: db.InsertCourseEnrollment = {
        studentId: user.id,
        courseId: buyData.itemId,
      };

      try {
        await db.addCourseEnrollment(courseEnrollment);
      } catch (error: any) {
        if (error instanceof db.NonUniqueDataError) {
          throw new err.ItemAlreadyOwnedError();
        }

        throw error;
      }
      break;
    }
    default: {
      throw new err.NotPurchasableYetError();
    }
  }
}

async function getItemPrice(buyData: validation.buyItemData): Promise<number> {
  switch (buyData.itemType) {
    case 'course': {
      const course: db.SelectCourse = await db.getCourseById(buyData.itemId);
      return course.price;
    }
    default: {
      throw new err.NotPurchasableYetError();
    }
  }
}
export const billDataSchema = z.object({
  amount: z.number().positive(),
  phoneNumber: z
    .string()
    .regex(
      validation.EGYPT_MOBILE_REGEX,
      'Invalid egyptian mobile phone number',
    ),
  redirectionUrl: z.string(),
  itemData: z.any(),
});

type billDataType = z.infer<typeof billDataSchema>;

async function createPaymobIntention(
  billData: billDataType,
  email: string,
  name: string,
  buyData: any,
) {
  const payment: db.SelectPaymentTransaction = await db.createPayment();

  const nameParts = name.trim().split(/\s+/);

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || 'NA'; // maybe empty if user has only one name

  const body: BodyInit = JSON.stringify({
    amount: billData.amount * 100,
    currency: 'EGP',
    payment_methods: [5753956],
    billing_data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: billData.phoneNumber,

      apartment: 'NA',
      street: 'NA',
      building: 'NA',
      city: 'NA',
      country: 'EGY',
      floor: 'NA',
      state: 'NA',
    },
    extras: {
      itemData: billData.itemData,
      buyData: buyData,
    },
    special_reference: `${payment.id}-${payment.createdAt}`,
    expiration: 3600,
    notification_url: `${process.env.NGROK_BASE_URL}/payment/paymob-callback`,
    redirection_url: billData.redirectionUrl,
  });

  const headers: HeadersInit = new Headers();
  headers.append('Authorization', `Token ${process.env.PAYMOB_SECRET_KEY}`);
  headers.append('Content-Type', 'application/json');

  const options: RequestInit = {
    method: 'POST',
    headers: headers,
    body: body,
    redirect: 'follow',
  };

  const intentionRes = await fetch(
    'https://accept.paymob.com/v1/intention/',
    options,
  );

  if (!intentionRes.ok) {
    throw new Error('Paymob API Error');
  }

  return await intentionRes.json();
}

export async function startItemPurchase(
  data: validation.buyItemData,
  userId: number,
  userEmail: string,
  userName: string,
) {
  let billData = {} as billDataType;

  if (data.itemType == 'course') {
    const course: db.SelectCourse = await db.getCourseById(data.itemId);

    if (await db.isUserEnrolled(userId, course.id)) {
      throw new err.ItemAlreadyOwnedError();
    }

    billData.itemData = course;
    billData.amount = course.price;
    billData.redirectionUrl = `${process.env.FRONTEND_LOCAL_URL}/payment/result?type=course&courseId=${data.itemId}`;
    billData.phoneNumber = data.phoneNumber;
  } else {
    throw new err.NotPurchasableYetError();
  }

  try {
    billDataSchema.parse(billData);
  } catch (err: any) {
    throw new Error('Bill data was not filled correctly');
  }

  return await createPaymobIntention(billData, userEmail, userName, data);
}

export async function startWalletDeposit(
  data: validation.walletDepositData,
  userId: number,
  userEmail: string,
  userName: string,
) {
  let billData = {} as billDataType;

  billData.itemData = {};
  billData.amount = data.amount;
  billData.phoneNumber = data.phoneNumber;
  billData.redirectionUrl = `${process.env.FRONTEND_LOCAL_URL}/payment/result?type=wallet&amount=${data.amount}`;

  try {
    billDataSchema.parse(billData);
  } catch (err: any) {
    throw new Error('Bill data was not filled correctly');
  }

  return await createPaymobIntention(billData, userEmail, userName, data);
}

export async function buyItem(billData: any, buyData: validation.buyItemData) {
  const user = await db.getUserByEmail(billData.email);

  if (buyData.itemType == 'course') {
    const courseEnrollment: db.InsertCourseEnrollment = {
      studentId: user.id,
      courseId: buyData.itemId,
    };

    await db.addCourseEnrollment(courseEnrollment);
  } else {
    throw new err.NotPurchasableYetError();
  }
}

export async function depositWallet(
  billData: any,
  buyData: validation.walletDepositData,
) {
  const user = await db.getUserByEmail(billData.email);

  await db.addToWalletBalance(user.id, buyData.amount);
}


export async function buyItemWithWallet(
  userId: number,
  buyData: validation.buyItemData,
) {
  const user = await db.getUserById(userId);

  const price = await getItemPrice(buyData);

  const balance = await db.getBalance(user.id);

  if (balance < price) {
    throw new err.InsufficientFundsError();
  }

  await addItem(buyData, user);

  await db.addToWalletBalance(user.id, -price);
}
