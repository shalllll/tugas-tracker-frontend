import axiosInstance from './axios';
import { MataKuliah, Tugas } from '@/types';

// ========== MATA KULIAH API ==========
export const getAllMataKuliah = async (): Promise<MataKuliah[]> => {
  const response = await axiosInstance.get('/matakuliah');
  return response.data;
};

export const getMataKuliahById = async (id: string): Promise<MataKuliah> => {
  const response = await axiosInstance.get(`/matakuliah/${id}`);
  return response.data;
};

export const createMataKuliah = async (data: Partial<MataKuliah>): Promise<MataKuliah> => {
  const response = await axiosInstance.post('/matakuliah', data);
  return response.data;
};

export const updateMataKuliah = async (id: string, data: Partial<MataKuliah>): Promise<MataKuliah> => {
  const response = await axiosInstance.put(`/matakuliah/${id}`, data);
  return response.data;
};

export const deleteMataKuliah = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/matakuliah/${id}`);
};

// ========== TUGAS API ==========
export const getAllTugas = async (): Promise<Tugas[]> => {
  const response = await axiosInstance.get('/tugas');
  return response.data;
};

export const getTugasById = async (id: string): Promise<Tugas> => {
  const response = await axiosInstance.get(`/tugas/${id}`);
  return response.data;
};

export const createTugas = async (data: Partial<Tugas>): Promise<Tugas> => {
  const response = await axiosInstance.post('/tugas', data);
  return response.data;
};

export const updateTugas = async (id: string, data: Partial<Tugas>): Promise<Tugas> => {
  const response = await axiosInstance.put(`/tugas/${id}`, data);
  return response.data;
};

export const deleteTugas = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tugas/${id}`);
};

export const toggleTugasStatus = async (id: string): Promise<Tugas> => {
  const response = await axiosInstance.patch(`/tugas/${id}/toggle`);
  return response.data;
};
