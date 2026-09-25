"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Button,
  Space,
  App,
  Steps,
  Upload,
  Result,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
  GuaranteeFormData,
  guaranteeFormSchema,
} from "@/features/guarantee/schemas/guarantee.schema";
import { Guarantee } from "@/features/guarantee/types/guarantee";
import { useCustomers } from "../../hooks/useGuaranteeMutations";
import { useGuaranteeOptions } from "../../hooks/useGuaranteeOptions";

import Info from "./Info";
import UploadFiles from "./Upload";
import Review from "./Review";
import FilePreviewModal from "./FilePreviewModal";

export interface GuaranteeFormProps {
  initialData?: Guarantee;
  onSaveDraft: (data: GuaranteeFormData) => void;
  onSubmitForApproval: (data: GuaranteeFormData) => void;
  isLoading?: boolean;
  currentStep?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
}

export default function GuaranteeForm({
  initialData,
  onSaveDraft,
  onSubmitForApproval,
  isLoading = false,
  currentStep: propCurrentStep,
  setCurrentStep: propSetCurrentStep,
}: GuaranteeFormProps) {
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useCustomers();

  const [cifDropdownOpen, setCifDropdownOpen] = React.useState(false);

  const customerMap = useMemo(() => {
    const map = new Map<string, { name: string; taxCode: string }>();
    if (customers) {
      customers?.forEach((c: any) => {
        map.set(c.cif, { name: c.customerName, taxCode: c.taxCode });
      });
    }
    return map;
  }, [customers]);

  const router = useRouter();
  const isEdit = !!initialData;
  const { modal, message } = App.useApp();

  const [internalStep, setInternalStep] = React.useState(0);
  const currentStep = propCurrentStep !== undefined ? propCurrentStep : internalStep;
  const setCurrentStep = propSetCurrentStep || setInternalStep;

  const [signedFileList, setSignedFileList] = React.useState<UploadFile[]>([]);
  const [unsignedFileList, setUnsignedFileList] = React.useState<UploadFile[]>([]);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState<{ url: string; type: string; name: string; buffer?: ArrayBuffer } | null>(null);

  const beforeUpload = (file: RcFile) => {
    const ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity)).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.xml'];
    if (!allowedExtensions.includes(ext)) {
      message.error(`File không đúng định dạng (${allowedExtensions.join(', ')})`);
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 100) {
      message.error('File không được vượt quá 100MB!');
      return Upload.LIST_IGNORE;
    }
    const totalSize = (signedFileList.reduce((acc, f) => acc + (f.size || 0), 0) + unsignedFileList.reduce((acc, f) => acc + (f.size || 0), 0) + file.size) / 1024 / 1024;
    if (totalSize > 200) {
      message.error('Tổng dung lượng các file không được vượt quá 200MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handlePreview = async (file: UploadFile) => {
    if (file.url && !file.originFileObj) {
      window.open(file.url, '_blank');
      return;
    }
    if (!file.originFileObj) return;
    const url = URL.createObjectURL(file.originFileObj);
    const ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity)).toLowerCase();

    if (ext === '.docx' || ext === '.doc') {
      try {
        const arrayBuffer = await file.originFileObj.arrayBuffer();
        setPreviewFile({ url, type: ext, name: file.name, buffer: arrayBuffer });
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi đọc file docx");
      }
    } else {
      setPreviewFile({ url, type: ext, name: file.name });
    }
  };

  const t = useTranslations("guarantees");
  const tCommon = useTranslations("common");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<GuaranteeFormData>({
    resolver: zodResolver(guaranteeFormSchema),
    mode: "onChange",
    defaultValues: initialData || {
      currency: "VND",
      guaranteeType: "BID_BOND",
      contractNumber: "",
      relatedContractNumber: "",
    },
  }); 
  
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.files && initialData.files.length > 0) {
        const mappedFiles = initialData.files.map((f: any, i: number) => ({
          uid: f.uid || String(i),
          name: f.name || 'file',
          status: 'done' as const,
          url: f.url,
          size: f.size,
          type: f.type,
          isSigned: f.isSigned === true || f.isSigned === 'true',
        }));
        setSignedFileList(mappedFiles.filter((f: any) => f.isSigned));
        setUnsignedFileList(mappedFiles.filter((f: any) => !f.isSigned));
      }
    }
  }, [initialData, reset]);

  const guaranteeType = watch("guaranteeType");
  const customerCifValue = watch("customerCif");

  // Tự động re-validate tenderNumber khi loại bảo lãnh thay đổi
  useEffect(() => {
    if (guaranteeType) {
      trigger("tenderNumber");
    }
  }, [guaranteeType, trigger]);

  const customerOptions = useMemo(() => {
    const query = (customerCifValue || "").trim().toLowerCase();
    return (customers || [])
      .filter((cust) => {
        if (!query) return true;
        return (
          cust.cif?.toLowerCase().includes(query) ||
          cust.customerName?.toLowerCase().includes(query) ||
          cust.taxCode?.toLowerCase().includes(query)
        );
      })
      .map((cust) => ({
        value: cust.cif,
        label: (
          <div className="flex flex-col py-1.5 px-0.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">
                CIF: {cust.cif}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                MST: {cust.taxCode}
              </span>
            </div>
            <div className="text-xs text-gray-800 dark:text-gray-200 font-medium truncate mt-0.5">
              {cust.customerName}
            </div>
          </div>
        ),
      }));
  }, [customers, customerCifValue]);

  const { guaranteeTypeOptions } = useGuaranteeOptions();

  // Chuẩn hóa dữ liệu form, loại bỏ các trường thừa từ initialData trước khi gửi
  const cleanFormData = (raw: any): GuaranteeFormData => ({
    customerCif: raw.customerCif || "",
    customerName: raw.customerName || "",
    taxCode: raw.taxCode || "",
    guaranteeType: raw.guaranteeType || "BID_BOND",
    guaranteeAmount: Number(raw.guaranteeAmount || 0),
    currency: raw.currency || "VND",
    effectiveDate: raw.effectiveDate || "",
    expiryDate: raw.expiryDate || "",
    tenderNumber: raw.tenderNumber || "",
    contractNumber: raw.contractNumber || "",
    relatedContractNumber: raw.relatedContractNumber || "",
    referenceNumber: raw.referenceNumber || "",
    purpose: raw.purpose || "",
    beneficiaryName: raw.beneficiaryName || "",
    beneficiaryAddress: raw.beneficiaryAddress || "",
    contactEmail: raw.contactEmail || "",
    phoneNumber: raw.phoneNumber || "",
    files: [
      ...signedFileList.map(f => {
        let url = f.url;
        if (!url && f.originFileObj && f.originFileObj instanceof Blob) {
          try { url = URL.createObjectURL(f.originFileObj); } catch(e) {}
        }
        return { isSigned: true, uid: f.uid, name: f.name, size: f.size, type: f.type, url };
      }),
      ...unsignedFileList.map(f => {
        let url = f.url;
        if (!url && f.originFileObj && f.originFileObj instanceof Blob) {
          try { url = URL.createObjectURL(f.originFileObj); } catch(e) {}
        }
        return { isSigned: false, uid: f.uid, name: f.name, size: f.size, type: f.type, url };
      })
    ],
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) setCurrentStep((prev) => prev + 1);
  };
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSaveDraft = () => {
    const values = watch();
    if (!values.customerCif || !values.customerName) {
      modal.warning({
        title: t("form.alerts.missingInfoTitle"),
        content: t("form.alerts.missingInfoContent"),
      });
      return;
    }
    onSaveDraft(cleanFormData(values));
  };

  const onValidSubmit = (data: GuaranteeFormData) => {
    modal.confirm({
      title: t("form.alerts.confirmSubmitTitle"),
      icon: <ExclamationCircleOutlined />,
      content: t("form.alerts.confirmSubmitContent"),
      okText: t("form.buttons.submitApproval"),
      cancelText: tCommon("buttons.cancel"),
      onOk: () => {
        onSubmitForApproval(cleanFormData(data));
        setIsSuccess(true);
      },
    });
  };

  if (isSuccess) {
    return (
      <Result
        status="success"
        title="Thành công"
        subTitle="Hồ sơ bảo lãnh đã được lưu/gửi duyệt thành công!"
        extra={[
          <Button type="primary" key="console" onClick={() => router.push("/guarantees")}>
            Về danh sách
          </Button>,
          <Button key="buy" onClick={() => { setIsSuccess(false); setCurrentStep(0); reset(); setSignedFileList([]); setUnsignedFileList([]); }}>
            Tạo mới
          </Button>,
        ]}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {propCurrentStep === undefined && (
        <Steps
          current={currentStep}
          items={[
            { title: 'Nhập thông tin' },
            { title: 'Upload hồ sơ' },
            { title: 'Xem lại' },
          ]}
          className="mb-8"
        />
      )}
      <form onSubmit={handleSubmit(onValidSubmit)}>
        {currentStep === 0 && (
          <div>
            <Info
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              trigger={trigger}
              t={t}
              customerOptions={customerOptions}
              cifDropdownOpen={cifDropdownOpen}
              setCifDropdownOpen={setCifDropdownOpen}
              customerMap={customerMap}
              isLoadingCustomers={isLoadingCustomers}
              guaranteeTypeOptions={guaranteeTypeOptions}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <UploadFiles
              signedFileList={signedFileList}
              setSignedFileList={setSignedFileList}
              unsignedFileList={unsignedFileList}
              setUnsignedFileList={setUnsignedFileList}
              beforeUpload={beforeUpload}
              handlePreview={handlePreview}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Review
              watch={watch}
              t={t}
              guaranteeTypeOptions={guaranteeTypeOptions}
              signedFileList={signedFileList}
              unsignedFileList={unsignedFileList}
              handlePreview={handlePreview}
            />
          </div>
        )}

        <Card size="small" className="mt-4">
          <div className="flex justify-between items-center">
            <Button onClick={() => router.back()} disabled={isLoading}>Hủy</Button>
            <Space>
              {currentStep > 0 && <Button onClick={handlePrev}>Quay lại</Button>}
              {currentStep < 2 && <Button type="primary" onClick={handleNext}>Tiếp tục</Button>}
              {currentStep === 2 && (
                <>
                  <Button onClick={handleSaveDraft} loading={isLoading}>
                    {isEdit ? t("form.buttons.saveChanges") : t("form.buttons.saveDraft")}
                  </Button>
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    {t("form.buttons.submitApproval")}
                  </Button>
                </>
              )}
            </Space>
          </div>
        </Card>
      </form>

      <FilePreviewModal
        previewFile={previewFile}
        setPreviewFile={setPreviewFile as any}
      />
    </div>
  );
}
