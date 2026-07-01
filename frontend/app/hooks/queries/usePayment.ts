import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';

type props = {
    itemId: number,
    itemType?: string,
    phoneNumber: string
}


export const usePayment = () => {
  return useMutation({
    mutationFn: async ({itemId, itemType= "course", phoneNumber}: props) => {
        const response = await api.post('/payment/buy-item', {
            itemId,
            itemType,
            phoneNumber
        });
        console.log(response.data)
        return response.data;
    },
  });
};
