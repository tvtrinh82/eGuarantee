export type GuaranteeStatus =
  "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";

export type GuaranteeType =
  "BID_BOND" | "PERFORMANCE" | "ADVANCE_PAYMENT" | "PAYMENT" | "OTHER";

export type Currency = "VND" | "USD";

export type UserRole = "MAKER" | "CHECKER";

export type HistoryAction =
  "CREATE" | "UPDATE" | "SUBMIT" | "APPROVE" | "REJECT";

export interface User {
  username: string;
  fullName: string;
  role: UserRole;
}

export interface ProcessingHistory {
  id: string;
  guaranteeId: string;
  action: HistoryAction;
  performedBy: string;
  performByFullName: string;
  role: UserRole;
  timestamp: string; // ISO string
  comment?: string;
}

export interface Guarantee {
  id: string;
  status: GuaranteeStatus;

  // Customer Information
  customerCif: string;
  customerName: string;
  taxCode?: string;
  customerAddress?: string;

  // Guarantee Information
  guaranteeType: GuaranteeType;
  guaranteeAmount: number;
  currency: Currency;
  effectiveDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  guaranteeDays: number;
  tenderNumber?: string;
  relatedContractNumber?: string;
  referenceNumber?: string;
  purpose: string;

  // Beneficiary Information
  beneficiaryName: string;
  beneficiaryAddress?: string;

  // Contact Information
  contactEmail: string;
  phoneNumber?: string;

  // Audit Information
  createdBy: string;
  createdByFullName?: string;
  createdDate: string; // ISO string
  updatedBy?: string;
  updatedByFullName?: string;
  updatedDate?: string; // ISO string

  // Histories
  histories?: ProcessingHistory[];
  files?: any[];
}

export type GuaranteeListItem = Pick<
  Guarantee,
  | "id"
  | "customerCif"
  | "customerName"
  | "taxCode"
  | "status"
  | "guaranteeType"
  | "guaranteeAmount"
  | "currency"
  | "createdDate"
>;

export interface GuaranteeQueryParams {
  keyword?: string;
  status?: GuaranteeStatus;
  guaranteeType?: GuaranteeType;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  size?: number;
  sortBy?: "createdDate" | "guaranteeAmount" | "customerName";
  sortDirection?: "asc" | "desc";
}

export interface PageData<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface GuaranteeListResult {
  items: GuaranteeListItem[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

export type GuaranteeListResponse = ApiResponse<PageData<GuaranteeListItem>>;

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  errors?: ApiFieldError[];
}

export type CreateGuaranteePayload = Omit<
  Guarantee,
  | "id"
  | "status"
  | "guaranteeDays"
  | "createdBy"
  | "createdDate"
  | "updatedBy"
  | "updatedDate"
  | "histories"
>;

export type UpdateGuaranteePayload = Partial<CreateGuaranteePayload>;

export interface RejectGuaranteePayload {
  reason: string;
}

export interface Customer {
  cif: string;
  customerName: string;
  taxCode: string;
  address?: string;
}
