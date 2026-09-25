import React from "react";
import Breadcrumb, { type BreadcrumbItem } from "../molecules/Breadcrumb";

export type { BreadcrumbItem };

export interface PageContainerProps {
  title?: string;
  subTitle?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subTitle,
  breadcrumbs,
  extra,
  children,
  className = "",
}) => {
  return (
    <div className={`h-full flex flex-col overflow-hidden ${className}`}>
      {(breadcrumbs || title || extra) && (
        <div className="flex flex-col gap-2 shrink-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} />
          )}

          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {title}
                </h1>
                {subTitle && (
                  <div className="mt-2 text-md font-medium text-gray-500 dark:text-gray-400">
                    {subTitle}
                  </div>
                )}
              </div>
            </div>

            {extra && <div className="flex flex-1 justify-end items-center gap-3 ml-8">{extra}</div>}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 overflow-auto px-6 py-4 `}>{children}</div>
    </div>
  );
};

export default PageContainer;
