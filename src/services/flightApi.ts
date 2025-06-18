import type { ApiResponse } from '../models/Common';
import type { QueryFlightListRequest } from '../models/Flight';
import http from './http';

const queryFlights = async (params: QueryFlightListRequest): Promise<ApiResponse> => {
  const response = await http.post<ApiResponse>('/flight/list', params);
  return response.data;
}

const queryFlightDetail = async (id: string): Promise<ApiResponse> => {
  const response = await http.get<ApiResponse>(`/flight/detail/${id}`);
  return response.data;
}

export default {
  queryFlights,
  queryFlightDetail,
}