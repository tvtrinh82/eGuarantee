import { z } from "zod";
import dayjs from "dayjs";

export const guaranteeFormSchema = z
  .object({
    // 1. Nhóm khách hàng
    customerCif: z
      .string({ message: 'Mã CIF là bắt buộc' })
      .nonempty("Mã CIF là bắt buộc")
      .regex(/^[0-9]{6,12}$/, "Mã CIF phải từ 6 đến 12 chữ số"),
    customerName: z
      .string({ message: "Tên khách hàng là bắt buộc" })
      .trim()
      .min(1, "Tên khách hàng là bắt buộc")
      .max(255, "Tối đa 255 ký tự"),
    taxCode: z.string().max(20).optional().or(z.literal("")),

    // 2. Nhóm thông tin bảo lãnh
    guaranteeType: z.enum(
      ["BID_BOND", "PERFORMANCE", "ADVANCE_PAYMENT", "PAYMENT", "OTHER"],
      { message: "Vui lòng chọn loại bảo lãnh" },
    ),
    guaranteeAmount: z
      .number({ message: "Số tiền bảo lãnh phải là số" })
      .gt(0, "Số tiền bảo lãnh phải lớn hơn 0")
      .lte(1_000_000_000_000, "Số tiền bảo lãnh tối đa là 1.000 tỷ VND"),
    currency: z.enum(["VND", "USD"]),
    effectiveDate: z.string({ message: 'Ngày hiệu lực là bắt buộc' }).nonempty("Ngày hiệu lực là bắt buộc"),
    expiryDate: z.string({ message: 'Ngày hết hạn là bắt buộc' }).nonempty("Ngày hết hạn là bắt buộc"),
    tenderNumber: z.string().optional().or(z.literal("")),
    contractNumber: z.string().max(100, "Số hợp đồng tối đa 100 ký tự").optional().or(z.literal("")),

    relatedContractNumber: z
      .string()
      .max(100, "Số hợp đồng tối đa 100 ký tự")
      .optional()
      .or(z.literal("")),
    referenceNumber: z
      .string()
      .max(100, "Số tham chiếu tối đa 100 ký tự")
      .optional()
      .or(z.literal("")),
    purpose: z
      .string({ message: 'Mục đích bảo lãnh là bắt buộc' })
      .nonempty("Mục đích bảo lãnh là bắt buộc")
      .max(1000, "Tối đa 1000 ký tự"),
    files: z.array(z.any()).optional(),

    // 3. Nhóm bên thụ hưởng & liên hệ
    beneficiaryName: z
      .string({ message: 'Tên bên thụ hưởng là bắt buộc' })
      .nonempty("Tên bên thụ hưởng là bắt buộc")
      .max(255),
    beneficiaryAddress: z.string().max(500).optional().or(z.literal("")),
    contactEmail: z
      .string({ message: "Email liên hệ là bắt buộc" })
      .trim()
      .min(1, "Email liên hệ là bắt buộc")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email không đúng định dạng ",
      ),
    phoneNumber: z
      .string({ message: "Số điện thoại là bắt buộc" })
      .trim()
      .nonempty("Số điện thoại là bắt buộc")
      .regex(/^[0-9]{10}$/, "Số điện thoại phải gồm đúng 10 chữ số"),
  })
  // Ngày hết hạn phải sau ngày hiệu lực
  .refine(
    (data) => {
      if (!data.effectiveDate || !data.expiryDate) return true;
      return dayjs(data.expiryDate).isAfter(dayjs(data.effectiveDate), "day");
    },
    {
      message: "Ngày hết hạn phải sau ngày hiệu lực ",
      path: ["expiryDate"],
    },
  )

  .refine(
    (data) => {
      if (data.guaranteeType === "BID_BOND") {
        return !!data.tenderNumber && data.tenderNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: "Số hiệu thầu là bắt buộc khi chọn Bảo lãnh dự thầu ",
      path: ["tenderNumber"],
    },
  );

// Tự động sinh kiểu TypeScript
export type GuaranteeFormData = z.infer<typeof guaranteeFormSchema>;

// Schema kiểm tra lý do từ chối dành cho Checker (10 đến 500 ký tự)
export const rejectReasonSchema = z.object({
  reason: z
    .string()
    .nonempty("Lý do từ chối là bắt buộc")
    .min(10, "Lý do từ chối phải có từ 10 ký tự trở lên ")
    .max(500, "Lý do từ chối tối đa 500 ký tự "),
});

export type RejectReasonFormData = z.infer<typeof rejectReasonSchema>;
