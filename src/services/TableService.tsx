import { ApiResponse } from "@/types";
import api from "../config/api";
import { Table } from "@/types/table";

export const getTables = async (
  tenantId: string
): Promise<ApiResponse<Table[]>> => {
  const result = await api.get<ApiResponse<Table[]>>(
    `/tables/tenants/${tenantId}`
  );

  return result.data;
};

export const getTableById = async (
  tableId: string
): Promise<ApiResponse<Table>> => {
  const result = await api.get<ApiResponse<Table>>(`/tables/${tableId}`);

  return result.data;
};

export const createTable = async (data: {
  tenantId: string;
  number: number;
}): Promise<ApiResponse<Table>> => {
  const result = await api.post<ApiResponse<Table>>(`/tables`, data);

  return result.data;
};

export const updateTable = async (data: {
  tableId: string;
  number?: number;
  isActive?: boolean;
}): Promise<ApiResponse<Table>> => {
  const { tableId, ...payload } = data;

  const result = await api.patch<ApiResponse<Table>>(
    `/tables/${tableId}`,
    payload
  );

  return result.data;
};

export const deleteTable = async (
  tableId: string
): Promise<ApiResponse<string>> => {
  const result = await api.delete<ApiResponse<string>>(`/tables/${tableId}`);

  return result.data;
};

export const regenerateTableQR = async (
  tableId: string
): Promise<ApiResponse<Table>> => {
  const result = await api.post<ApiResponse<Table>>(
    `/tables/${tableId}/regenerate-qr`
  );

  return result.data;
};
