import React, { useState } from "react";
import { Upload, Button, Tabs } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";

export interface UploadProps {
  signedFileList: UploadFile[];
  setSignedFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  unsignedFileList: UploadFile[];
  setUnsignedFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  beforeUpload: (file: RcFile) => boolean | string;
  handlePreview: (file: UploadFile) => void;
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
}: UploadProps) {
  const [uploadType, setUploadType] = useState<"signed" | "unsigned">("signed");

  return (
    <div className="min-h-[300px] mb-24">
      <Tabs
        activeKey={uploadType}
        onChange={(key) => setUploadType(key as "signed" | "unsigned")}
        type="card"
        className="mb-4"
        items={[
          {
            key: "signed",
            label: "Hồ sơ có chữ ký số",
            children: (
              <>
                <Upload.Dragger
                  multiple
                  showUploadList={false}
                  fileList={signedFileList}
                  beforeUpload={beforeUpload}
                  onChange={(info) => setSignedFileList(info.fileList)}
                >
                  <p className="ant-upload-drag-icon text-green-500">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text font-medium text-gray-700">
                    Kéo hoặc thả tập tin vào đây
                  </p>
                  <p className="ant-upload-hint text-xs text-gray-500 mb-4">
                    Hỗ trợ các định dạng: .pdf, .doc
                  </p>
                  <Button>Chọn tệp tin</Button>
                  <p className="mt-4 text-[11px] text-gray-400">
                    Giới hạn kích thước tổng các file đính kèm: 200MB (100MB/file)
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
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ),
          },
          {
            key: "unsigned",
            label: "Hồ sơ không có chữ ký số",
            children: (
              <>
                <Upload.Dragger
                  multiple
                  showUploadList={false}
                  fileList={unsignedFileList}
                  beforeUpload={beforeUpload}
                  onChange={(info) => setUnsignedFileList(info.fileList)}
                >
                  <p className="ant-upload-drag-icon text-green-500">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text font-medium text-gray-700">
                    Kéo hoặc thả tập tin vào đây
                  </p>
                  <p className="ant-upload-hint text-xs text-gray-500 mb-4">
                    Hỗ trợ các định dạng: .pdf, .doc
                  </p>
                  <Button>Chọn tệp tin</Button>
                  <p className="mt-4 text-[11px] text-gray-400">
                    Giới hạn kích thước tổng các file đính kèm: 200MB (100MB/file)
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
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
}