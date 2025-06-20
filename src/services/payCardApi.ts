import type { ApiResponse } from '../models/Common';
import type { PayCard } from '../models/PayCard';
import http from './http';

const savePayCard = async (params: PayCard): Promise<ApiResponse> => {
  const response = await http.post<ApiResponse>(`/payCard/save`, params);
  return response.data;
}

const queryPayCards = async (userId: number): Promise<ApiResponse> => {
  const response = await http.get<ApiResponse>(`/payCard/list/${userId}`);
  return response.data;
}


export default {
  savePayCard,
  queryPayCards,
}