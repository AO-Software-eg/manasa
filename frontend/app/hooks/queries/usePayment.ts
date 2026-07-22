import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';

type payment = {
  itemId: number;
  itemType?: string;
  phoneNumber: string;
  type?: string;
};

export const usePayment = () => {
  return useMutation({
    mutationFn: async ({
      itemId,
      itemType = 'course',
      phoneNumber,
      type = 'item',
    }: payment) => {
      console.log(itemId, itemType, phoneNumber, type);
      const response = await api.post('/payment/buy-item', {
        itemId,
        itemType,
        phoneNumber,
        type,
      });
      console.log(response.data);
      return response.data;
    },
  });
};

// { amount: number, phoneNumber: string,  type: string }

type props = {
  amount: number;
  phoneNumber: string;
  type: string;
};
export const useWallet = () => {
  return useMutation({
    mutationFn: async ({
      amount,
      phoneNumber,
      type = 'wallet-deposit',
    }: props) => {
      const response = await api.post('/payment/buy-item', {
        amount,
        phoneNumber,
        type,
      });
      console.log(response.data);
      return response.data;
    },
  });
};

// get wallet balance

export const useGetWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    staleTime: 1000 * 60 * 30, // 30 minutes
    queryFn: async () => {
      const response = await api.get('/user/balance');
      return response.data;
    },
  });
};

// make payment for a course using wallet

export const useWalletPayment = () => {
  return useMutation({
    mutationFn: async ({
      itemId,
      itemType = 'course',
      phoneNumber,
      type = 'item',
    }: payment) => {
      const response = await api.post('/payment/buy-item-wallet', {
        itemId,
        itemType,
        phoneNumber,
        type,
      });
      console.log(response.data);
      return response.data;
    },
  });
};
