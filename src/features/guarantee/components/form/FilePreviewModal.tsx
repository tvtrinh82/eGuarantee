import React from "react";
import { Modal } from "antd";

export interface FilePreviewModalProps {
  previewFile: { url: string; type: string; name: string; buffer?: ArrayBuffer } | null;
  setPreviewFile: (file: null) => void;
}


// Sử dụng Dynamic import cho 'docx-preview' để tối ưu bundle size, 
export default function FilePreviewModal({ previewFile, setPreviewFile }: FilePreviewModalProps) {
  const docxContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (previewFile && (previewFile.type === '.docx' || previewFile.type === '.doc') && previewFile.buffer) {
      setTimeout(() => {
        if (docxContainerRef.current) {
          import('docx-preview').then(docx => {
            docx.renderAsync(previewFile.buffer!, docxContainerRef.current!, undefined, {
              className: 'docx',
              inWrapper: true,
              ignoreWidth: false,
              ignoreHeight: false,
              ignoreFonts: false,
              breakPages: true,
              ignoreLastRenderedPageBreak: true,
              experimental: true,
              trimXmlDeclaration: true,
              debug: false,
            });
          }).catch(err => console.error("Docx render error", err));
        }
      }, 100);
    }
  }, [previewFile]);

  return (
    <Modal
      title={previewFile?.name}
      open={!!previewFile}
      onCancel={() => setPreviewFile(null)}
      footer={null}
      width={1000}
      style={{ top: 0, padding: 0, margin: '0 auto' }}
      styles={{ body: { height: 'calc(100vh - 55px)', overflow: 'auto', padding: 0 } }}
    >
      {(previewFile?.type === '.docx' || previewFile?.type === '.doc') ? (
        <div ref={docxContainerRef} className="w-full min-h-full bg-gray-100 p-4" />
      ) : previewFile ? (
        <iframe src={previewFile.url} className="w-full h-full border-0" />
      ) : null}
    </Modal>
  );
}
