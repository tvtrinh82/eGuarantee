import React from "react";
import { Upload, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

export interface UploadProps {
  signedFileList: UploadFile[];
  setSignedFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  unsignedFileList: UploadFile[];
  setUnsignedFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  beforeUpload: (file: RcFile) => boolean | string;
  handlePreview: (file: UploadFile) => void;
  t: any;
}

const fileItemClass = "flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#1f1f1f] dark:hover:bg-[#303030] transition-colors";
const fileNameClass = "truncate text-sm font-medium text-gray-800 dark:text-gray-200";
const fileSizeClass = "text-gray-500 dark:text-gray-400 text-xs mt-0.5";
const fileIconClass = "text-gray-600 dark:text-gray-400 text-xl";

export default function UploadFiles({
  signedFileList,
  setSignedFileList,
  unsignedFileList,
  setUnsignedFileList,
  beforeUpload,
  handlePreview,
  t,
}: UploadProps) {
  const tCommon = useTranslations("common");
  return (
    <div className="min-h-[300px] mb-24 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hồ sơ có ký số */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{t("form.upload.signedTitle")}</h3>
        <Upload.Dragger
          multiple
          showUploadList={false}
          fileList={signedFileList}
          beforeUpload={beforeUpload}
          onChange={(info) => {
            const newList = info.fileList.map((f) => ({ ...f, isSigned: true }));
            setSignedFileList(newList);
          }}
        >
          <p className="ant-upload-drag-icon text-green-500">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text font-medium text-gray-700">
            {t("form.upload.dragHint")}
          </p>
          <p className="ant-upload-hint text-xs text-gray-500 mb-4">
            {t("form.upload.formatHint")}
          </p>
          <Button>{t("form.upload.chooseFile")}</Button>
          <p className="mt-4 text-[11px] text-gray-400">
            {t("form.upload.sizeLimit")}
          </p>
        </Upload.Dragger>

        {signedFileList.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {signedFileList.map((file) => (
              <div key={file.uid} className={fileItemClass}>
                <FileTextOutlined className={fileIconClass} />
                <div
                  className="flex-1 overflow-hidden cursor-pointer"
                  onClick={() => handlePreview(file)}
                >
                  <div className={fileNameClass}>
                    {file.name}
                  </div>
                  <div className={fileSizeClass}>
                    {file.size ? Math.round(file.size / 1024) + " KB" : ""}
                  </div>
                </div>
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSignedFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                  }}
                >
                  {tCommon("buttons.delete")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hồ sơ không có chữ ký số */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{t("form.upload.unsignedTitle")}</h3>
        <Upload.Dragger
          multiple
          showUploadList={false}
          fileList={unsignedFileList}
          beforeUpload={beforeUpload}
          onChange={(info) => {
            const newList = info.fileList.map((f) => ({ ...f, isSigned: false }));
            setUnsignedFileList(newList);
          }}
        >
          <p className="ant-upload-drag-icon text-green-500">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text font-medium text-gray-700">
            {t("form.upload.dragHint")}
          </p>
          <p className="ant-upload-hint text-xs text-gray-500 mb-4">
            {t("form.upload.formatHint")}
          </p>
          <Button>{t("form.upload.chooseFile")}</Button>
          <p className="mt-4 text-[11px] text-gray-400">
            {t("form.upload.sizeLimit")}
          </p>
        </Upload.Dragger>

        {unsignedFileList.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {unsignedFileList.map((file) => (
              <div key={file.uid} className={fileItemClass}>
                <FileTextOutlined className={fileIconClass} />
                <div
                  className="flex-1 overflow-hidden cursor-pointer"
                  onClick={() => handlePreview(file)}
                >
                  <div className={fileNameClass}>
                    {file.name}
                  </div>
                  <div className={fileSizeClass}>
                    {file.size ? Math.round(file.size / 1024) + " KB" : ""}
                  </div>
                </div>
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUnsignedFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                  }}
                >
                  {tCommon("buttons.delete")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}