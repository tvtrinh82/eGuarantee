"use client";
import { useState } from "react";
import type { Guarantee } from "../../types/guarantee";
import { Button, Modal, Popconfirm, Space, Input } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  rejectReasonSchema,
  type RejectReasonFormData,
} from "../../schemas/guarantee.schema";

interface CheckerActionsProps {
  guarantee: Guarantee;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export default function CheckerActions({
  guarantee,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: CheckerActionsProps) {
  const t = useTranslations("guarantees");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectReasonFormData>({
    resolver: zodResolver(rejectReasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleOpenRejectModal = () => {
    reset({
      reason: "",
    });
    setOpen(true);
  };

  const handleCloseRejectModal = () => {
    setOpen(false);
    reset({
      reason: "",
    });
  };

  const handleReject = (data: RejectReasonFormData) => {
    onReject?.(data.reason);
    setOpen(false);
    reset({
      reason: "",
    });
  };

  const canProcess = guarantee.status === "PENDING_APPROVAL";
  if (!canProcess) {
    return null;
  }

  return (
    <>
      <Space wrap>
        <Button
          danger
          icon={<CloseOutlined />}
          loading={isRejecting}
          onClick={handleOpenRejectModal}
        >
          {t("detail.actions.reject")}
        </Button>

        <Popconfirm
          title={t("detail.actions.confirmApproveTitle")}
          description={t("detail.actions.confirmApproveDesc")}
          okText={t("detail.actions.approve")}
          cancelText={tCommon("buttons.cancel")}
          okButtonProps={{
            type: "primary",
            loading: isApproving,
          }}
          onConfirm={onApprove}
        >
          <Button
            type="primary"
            icon={<CheckOutlined />}
            loading={isApproving}
          >
            {t("detail.actions.approve")}
          </Button>
        </Popconfirm>
      </Space>

      <Modal
        title={t("detail.actions.rejectModalTitle")}
        open={open}
        onCancel={handleCloseRejectModal}
        onOk={handleSubmit(handleReject)}
        okText={t("detail.actions.reject")}
        cancelText={tCommon("buttons.cancel")}
        confirmLoading={isRejecting}
      >
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              placeholder={t("detail.actions.rejectReasonPlaceholder")}
              rows={5}
              maxLength={500}
              showCount
            />
          )}
        />
        {errors.reason && (
          <div className="mt-1 text-sm text-red-500">
            {errors.reason.message}
          </div>
        )}
      </Modal>
    </>
  );
}