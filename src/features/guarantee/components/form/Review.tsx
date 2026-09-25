import React from "react";
import { Row, Col, Card } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { FileTextOutlined } from "@ant-design/icons";
import { UseFormWatch } from "react-hook-form";
import dayjs from "dayjs";
import Field from "./Field";
import { GuaranteeFormData } from "@/features/guarantee/schemas/guarantee.schema";

export interface ReviewProps {
  watch: UseFormWatch<GuaranteeFormData>;
  t: any;
  guaranteeTypeOptions: any[];
  signedFileList: UploadFile[];
  unsignedFileList: UploadFile[];
  handlePreview: (file: UploadFile) => void;
}

const valueBoxClass = "font-semibold text-gray-800 dark:text-gray-200 p-2 bg-gray-50 dark:bg-[#1f1f1f] rounded border border-transparent dark:border-[#303030]";

// Sử dụng hàm watch() của react-hook-form để tự động cập nhật realtime khi dữ liệu form thay đổi
export default function Review({
  watch,
  t,
  guaranteeTypeOptions,
  signedFileList,
  unsignedFileList,
  handlePreview,
}: ReviewProps) {
  const effectiveDate = watch("effectiveDate");
  const expiryDate = watch("expiryDate");
  const guaranteeDays =
    effectiveDate && expiryDate
      ? Math.max(dayjs(expiryDate).diff(dayjs(effectiveDate), "day"), 0)
      : 0;

  return (
    <>
      <Card title={t("form.sections.customerInfo")} size="small" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.cif")}>
              <div className={valueBoxClass}>{watch("customerCif")}</div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.customerName")}>
              <div className={valueBoxClass}>{watch("customerName")}</div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.taxCode")}>
              <div className={valueBoxClass}>{watch("taxCode")}</div>
            </Field>
          </Col>
        </Row>
      </Card>

      <Card title={t("form.sections.guaranteeInfo")} size="small" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.guaranteeType")}>
              <div className={valueBoxClass}>
                {guaranteeTypeOptions?.find(o => o.value === watch("guaranteeType"))?.label || watch("guaranteeType")}
              </div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.currency")}>
              <div className={valueBoxClass}>{watch("currency")}</div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.amount")}>
              <div className={valueBoxClass}>
                {watch("guaranteeAmount") ? `${watch("guaranteeAmount")}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""} {watch("currency")}
              </div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.effectiveDate")}>
              <div className={valueBoxClass}>
                {watch("effectiveDate") ? dayjs(watch("effectiveDate")).format("DD/MM/YYYY") : ""}
              </div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.expiryDate")}>
              <div className={valueBoxClass}>
                {watch("expiryDate") ? dayjs(watch("expiryDate")).format("DD/MM/YYYY") : ""}
              </div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.validityDays")}>
              <div className={valueBoxClass}>
                {guaranteeDays} ngày
              </div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.relatedContractNumber")}>
              <div className={valueBoxClass}>
                {watch("relatedContractNumber") || "-"}
              </div>
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.referenceNumber")}>
              <div className={valueBoxClass}>
                {watch("referenceNumber") || "-"}
              </div>
            </Field>
          </Col>
          {watch("guaranteeType") === "BID_BOND" && (
            <Col xs={24} md={8}>
              <Field label={t("form.fields.tenderNumber")}>
                <div className={valueBoxClass}>
                  {watch("tenderNumber") || "-"}
                </div>
              </Field>
            </Col>
          )}
        </Row>
      </Card>

      <Card title={t("form.sections.beneficiaryInfo")} size="small" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.beneficiaryName")}>
              <div className={valueBoxClass}>{watch("beneficiaryName")}</div>
            </Field>
          </Col>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.beneficiaryAddress")}>
              <div className={valueBoxClass}>{watch("beneficiaryAddress") || "-"}</div>
            </Field>
          </Col>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.contactEmail")}>
              <div className={valueBoxClass}>{watch("contactEmail")}</div>
            </Field>
          </Col>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.phoneNumber")}>
              <div className={valueBoxClass}>{watch("phoneNumber")}</div>
            </Field>
          </Col>
          <Col xs={24}>
            <Field label={t("form.fields.purpose")}>
              <div className={`${valueBoxClass} whitespace-pre-wrap`}>{watch("purpose")}</div>
            </Field>
          </Col>
        </Row>
      </Card>

      <Card title="Hồ sơ đã upload" size="small">
        <div className="flex flex-col gap-2">
          {[...signedFileList.map(f => ({...f, isSigned: true})), ...unsignedFileList.map(f => ({...f, isSigned: false}))].map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#1f1f1f] dark:hover:bg-[#303030] transition-colors cursor-pointer" onClick={() => handlePreview(f as any)}>
              <FileTextOutlined className="text-gray-600 dark:text-gray-400 text-xl" />
              <div className="flex-1 flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {f.name} 
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400"> ({f.isSigned ? 'Có chữ ký số' : 'Không chữ ký số'})</span>
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{f.size ? Math.round(f.size / 1024) + " KB" : ""}</span>
              </div>
            </div>
          ))}
          {(signedFileList.length === 0 && unsignedFileList.length === 0) && <span className="text-gray-400 dark:text-gray-500 text-sm">Chưa có file nào được tải lên.</span>}
        </div>
      </Card>
    </>
  );
}
