import type { Booking, BookingRequest } from '../models/Booking';
import type { ApiResponse } from '../models/Common';
import http from './http';

const queryBookingList = async (userId: number): Promise<ApiResponse> => {
  const response = await http.get<ApiResponse>(`/booking/list/${userId}`);
  return response.data;
}

const queryBookingDetail = async (params: BookingRequest): Promise<ApiResponse> => {
  const response = await http.post<ApiResponse>(`/booking/detail`, params);
  return response.data;
}

const saveBooking = async (params: Booking): Promise<ApiResponse> => {
  const response = await http.post<ApiResponse>(`/booking/save`, params);
  return response.data;
}

const updateStatus = async (id: number, status: string): Promise<ApiResponse> => {
  const response = await http.get<ApiResponse>(`/booking/updateStatus/${id}/${status}`);
  return response.data;
}


export default {
  saveBooking,
  updateStatus,
  queryBookingList,
  queryBookingDetail,
}