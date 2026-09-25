import React from "react";

export interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

// Field: Wrapper UI bao bọc các Form Input, tự động hiển thị tên trường (label), dấu hoa thị bắt buộc, và lỗi validation
export default function Field({
  label,
  required,
  error,
  children,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
