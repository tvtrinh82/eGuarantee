import React from "react";
import { Row, Col, Card, Input, InputNumber, Select, DatePicker, AutoComplete } from "antd";
import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch, UseFormTrigger } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Field from "./Field";
import { GuaranteeFormData } from "@/features/guarantee/schemas/guarantee.schema";
import { CURRENCY_OPTIONS } from "@/features/guarantee/constants/guarantee";

const { TextArea } = Input;

const disabledInputClass = "bg-gray-50 text-gray-800 font-medium dark:bg-[#1f1f1f] dark:text-gray-200 dark:border-[#303030]";
export interface InfoProps {
  control: Control<GuaranteeFormData>;
  errors: FieldErrors<GuaranteeFormData>;
  watch: UseFormWatch<GuaranteeFormData>;
  setValue: UseFormSetValue<GuaranteeFormData>;
  trigger: UseFormTrigger<GuaranteeFormData>;
  t: any;
  customerOptions: any[];
  cifDropdownOpen: boolean;
  setCifDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customerMap: Map<string, { name: string; taxCode: string }>;
  isLoadingCustomers: boolean;
  guaranteeTypeOptions: any[];
}


// Cấu trúc chính: Sử dụng <Controller /> của react-hook-form để gắn kết state với các Component Ant Design
export default function Info({
  control,
  errors,
  watch,
  setValue,
  trigger,
  t,
  customerOptions,
  cifDropdownOpen,
  setCifDropdownOpen,
  customerMap,
  isLoadingCustomers,
  guaranteeTypeOptions,
}: InfoProps) {
  const effectiveDate = watch("effectiveDate");
  const expiryDate = watch("expiryDate");
  const guaranteeType = watch("guaranteeType");
  const currency = watch("currency") || "VND";
  
  const guaranteeDays =
    effectiveDate && expiryDate
      ? Math.max(dayjs(expiryDate).diff(dayjs(effectiveDate), "day"), 0)
      : 0;

  return (
    <>
      <Card title={t("form.sections.customerInfo")} size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.cif")} required error={errors.customerCif?.message}>
              <Controller
                name="customerCif"
                control={control}
                render={({ field }) => (
                  <AutoComplete
                    value={field.value || ""}
                    options={customerOptions}
                    open={cifDropdownOpen}
                    onOpenChange={setCifDropdownOpen}
                    onFocus={() => setCifDropdownOpen(true)}
                    onSelect={(cif) => {
                      field.onChange(cif);
                      setCifDropdownOpen(false);
                      const customer = customerMap.get(cif);
                      if (customer) {
                        setValue("customerName", customer.name, { shouldValidate: true });
                        setValue("taxCode", customer.taxCode, { shouldValidate: true });
                      }
                    }}
                    onChange={(val) => {
                      field.onChange(val);
                      setCifDropdownOpen(true);
                      const customer = customerMap.get(val);
                      if (customer) {
                        setValue("customerName", customer.name, { shouldValidate: true });
                        setValue("taxCode", customer.taxCode, { shouldValidate: true });
                      } else {
                        setValue("customerName", "", { shouldValidate: true });
                        setValue("taxCode", "", { shouldValidate: true });
                      }
                    }}
                    className="w-full"
                    popupMatchSelectWidth={false}
                    defaultActiveFirstOption={false}
                    notFoundContent={
                      isLoadingCustomers ? (
                        <div className="py-2 px-3 text-center text-xs text-gray-400">{t("form.placeholders.loading")}</div>
                      ) : (
                        <div className="py-2 px-3 text-center text-xs text-gray-400">{t("form.placeholders.noCustomerFound")}</div>
                      )
                    }
                  >
                    <Input
                      placeholder={t("form.placeholders.cif")}
                      maxLength={12}
                      allowClear
                      onClick={() => setCifDropdownOpen(true)}
                      suffix={
                        <SearchOutlined
                          className="text-gray-400 cursor-pointer hover:text-blue-500"
                          onClick={() => setCifDropdownOpen(!cifDropdownOpen)}
                        />
                      }
                      status={errors.customerCif ? "error" : ""}
                    />
                  </AutoComplete>
                )}
              />
            </Field>
          </Col>
          
          <Col xs={24} md={8}>
            <Field label={t("form.fields.customerName")}>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t("form.placeholders.autoFilled")} disabled className={disabledInputClass} />
                )}
              />
            </Field>
          </Col>

          <Col xs={24} md={8}>
            <Field label={t("form.fields.taxCode")} error={errors.taxCode?.message}>
              <Controller
                name="taxCode"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t("form.placeholders.autoFilled")} disabled className={disabledInputClass} />
                )}
              />
            </Field>
          </Col>
        </Row>
      </Card>

      <Card title={t("form.sections.guaranteeInfo")} size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.guaranteeType")} required error={errors.guaranteeType?.message}>
              <Controller
                name="guaranteeType"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder={t("form.placeholders.guaranteeType")} className="w-full" options={guaranteeTypeOptions} />
                )}
              />
            </Field>
          </Col>

          <Col xs={24} md={8}>
            <Field label={t("form.fields.currency")} required error={errors.currency?.message}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select {...field} className="w-full" options={CURRENCY_OPTIONS} />
                )}
              />
            </Field>
          </Col>
          
          <Col xs={24} md={8}>
            <Field label={t("form.fields.amount")} required error={errors.guaranteeAmount?.message}>
              <Controller
                name="guaranteeAmount"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    className="w-full"
                    inputMode="numeric"
                    placeholder={t("form.placeholders.amount")}
                    controls={false}
                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(val) => {
                      const clean = (val || "").toString().replace(/[^0-9]/g, "");
                      return clean ? Number(clean) : ("" as any);
                    }}
                    onKeyDown={(e) => {
                      const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
                      if (allowedKeys.includes(e.key) || (e.ctrlKey && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) || (e.metaKey && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase()))) {
                        return;
                      }
                      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                    }}
                    onPaste={(e) => {
                      const pasteText = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(pasteText.replace(/,/g, "").trim())) {
                        e.preventDefault();
                        const numericOnly = pasteText.replace(/[^0-9]/g, "");
                        if (numericOnly) field.onChange(Number(numericOnly));
                      }
                    }}
                    suffix={<span className="text-gray-400 font-semibold text-xs pr-1">{currency}</span>}
                    status={errors.guaranteeAmount ? "error" : ""}
                  />
                )}
              />
            </Field>
          </Col>

          <Col xs={24} md={8}>
            <Field label={t("form.fields.effectiveDate")} required error={errors.effectiveDate?.message}>
              <Controller
                name="effectiveDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(d) => {
                      field.onChange(d ? d.format("YYYY-MM-DD") : "");
                      if (watch("expiryDate")) trigger("expiryDate");
                    }}
                    format="DD/MM/YYYY"
                    className="w-full"
                    placeholder={t("form.placeholders.selectDate")}
                    disabledDate={(current) => current && current.isBefore(dayjs().startOf("day"))}
                    status={errors.effectiveDate ? "error" : ""}
                  />
                )}
              />
            </Field>
          </Col>
          
          <Col xs={24} md={8}>
            <Field label={t("form.fields.expiryDate")} required error={errors.expiryDate?.message}>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(d) => {
                      field.onChange(d ? d.format("YYYY-MM-DD") : "");
                      setTimeout(() => trigger("expiryDate"), 0);
                    }}
                    format="DD/MM/YYYY"
                    className="w-full"
                    placeholder={t("form.placeholders.selectDate")}
                    disabledDate={(current) => {
                      if (!current) return false;
                      if (current.isBefore(dayjs().startOf("day"))) return true;
                      if (effectiveDate) return current.isBefore(dayjs(effectiveDate).startOf("day").add(1, "day"));
                      return false;
                    }}
                    status={errors.expiryDate ? "error" : ""}
                  />
                )}
              />
            </Field>
          </Col>
          
          <Col xs={24} md={8}>
            <Field label={t("form.fields.validityDays")}>
              <Input
                value={effectiveDate && expiryDate ? t("detail.labels.days", { days: guaranteeDays }) : undefined}
                placeholder={t("form.placeholders.autoCalculated")}
                disabled
                className={disabledInputClass}
              />
            </Field>
          </Col>
          
          <Col xs={24} md={8}>
            <Field label={t("form.fields.relatedContractNumber")} error={errors.relatedContractNumber?.message}>
              <Controller
                name="relatedContractNumber"
                control={control}
                render={({ field }) => <Input {...field} value={field.value ?? ""} placeholder={t("form.placeholders.relatedContractNumber")} status={errors.relatedContractNumber ? "error" : ""} />}
              />
            </Field>
          </Col>
          <Col xs={24} md={8}>
            <Field label={t("form.fields.referenceNumber")} error={errors.referenceNumber?.message}>
              <Controller
                name="referenceNumber"
                control={control}
                render={({ field }) => <Input {...field} value={field.value ?? ""} placeholder={t("form.placeholders.referenceNumber")} status={errors.referenceNumber ? "error" : ""} />}
              />
            </Field>
          </Col>
          
          {guaranteeType === "BID_BOND" && (
            <Col xs={24} md={8}>
              <Field label={t("form.fields.tenderNumber")} required error={errors.tenderNumber?.message}>
                <Controller
                  name="tenderNumber"
                  control={control}
                  render={({ field }) => <Input {...field} value={field.value ?? ""} placeholder={t("form.placeholders.tenderNumber")} status={errors.tenderNumber ? "error" : ""} />}
                />
              </Field>
            </Col>
          )}
        </Row>
      </Card>

      <Card title={t("form.sections.beneficiaryInfo")} size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.beneficiaryName")} required error={errors.beneficiaryName?.message}>
              <Controller name="beneficiaryName" control={control} render={({ field }) => <Input {...field} placeholder={t("form.placeholders.beneficiaryName")} status={errors.beneficiaryName ? "error" : ""} />} />
            </Field>
          </Col>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.beneficiaryAddress")} error={errors.beneficiaryAddress?.message}>
              <Controller name="beneficiaryAddress" control={control} render={({ field }) => <Input {...field} placeholder={t("form.placeholders.beneficiaryAddress")} />} />
            </Field>
          </Col>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.contactEmail")} required error={errors.contactEmail?.message}>
              <Controller name="contactEmail" control={control} render={({ field }) => <Input {...field} placeholder={t("form.placeholders.contactEmail")} status={errors.contactEmail ? "error" : ""} />} />
            </Field>
          </Col>
          <Col xs={24} md={12}>
            <Field label={t("form.fields.phoneNumber")} required error={errors.phoneNumber?.message}>
              <Controller name="phoneNumber" control={control} render={({ field }) => <Input {...field} maxLength={10} placeholder={t("form.placeholders.phoneNumber")} status={errors.phoneNumber ? "error" : ""} />} />
            </Field>
          </Col>
          <Col xs={24}>
            <Field label={t("form.fields.purpose")} required error={errors.purpose?.message}>
              <Controller
                name="purpose"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <TextArea
                      {...field}
                      rows={3}
                      placeholder={t("form.placeholders.purpose")}
                      status={errors.purpose ? "error" : ""}
                      style={{ resize: "none", paddingBottom: 28 }}
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none">
                      {field.value?.length || 0}/1000
                    </span>
                  </div>
                )}
              />
            </Field>
          </Col>
        </Row>
      </Card>
    </>
  );
}
