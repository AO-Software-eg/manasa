'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type AssetType = 'lesson' | 'homework' | 'file' | 'exam';

export interface CourseAsset {
  id: string;
  title: string;
  type: AssetType;
  description?: string;
  duration?: string;
  videoUrl?: string;
  fileUrl?: string;
  children?: CourseAsset[];
}

interface CourseAssetAccordionProps {
  assets: CourseAsset[];
}

export default function CourseAssetAccordion({ assets }: CourseAssetAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderAction = (asset: CourseAsset) => {
    switch (asset.type) {
      case 'file':
        return asset.fileUrl ? (
          <a
            href={asset.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e6d3a3] text-sm hover:underline"
          >
            تحميل
          </a>
        ) : null;

      case 'lesson':
        return asset.videoUrl ? (
          <a
            href={asset.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e6d3a3] text-sm hover:underline"
          >
            مشاهدة
          </a>
        ) : null;

      case 'homework':
        return (
          <a
            href={`/homework/${asset.id}`}
            className="text-[#e6d3a3] text-sm hover:underline"
          >
            حل الواجب
          </a>
        );

      case 'exam':
        return (
          <a
            href={`/exam/${asset.id}`}
            className="text-[#e6d3a3] text-sm hover:underline"
          >
            دخول الامتحان
          </a>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="rounded-xl border border-[#e6d3a3]/30 overflow-hidden transition-all duration-300 hover:border-[#e6d3a3]/50"
        >
          <button
            onClick={() => toggleExpand(asset.id)}
            className="w-full px-6 py-4 flex items-center justify-between gap-4 text-right"
          >
            <div className="flex flex-col items-end gap-1">
              <h3 className="text-lg md:text-xl font-bold text-[#e6d3a3]">
                {asset.title}
              </h3>
              {asset.duration && (
                <span className="text-sm text-[#e6d3a3]/70">{asset.duration}</span>
              )}
            </div>

            <ChevronDown
              size={20}
              className={`text-[#e6d3a3] transition-transform duration-300 ${
                expandedId === asset.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedId === asset.id && (
            <div className="border-t border-[#e6d3a3]/30 px-6 py-4 space-y-4">
              {asset.description && (
                <p className="text-[#E5E5E5] text-sm leading-relaxed">
                  {asset.description}
                </p>
              )}

              {asset.videoUrl && asset.type === 'lesson' && (
                <div>{renderAction(asset)}</div>
              )}

              {asset.children && asset.children.length > 0 && (
                <div className="space-y-2 pt-2">
                  {asset.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between bg-[#111] px-4 py-3 rounded-lg border border-[#e6d3a3]/20"
                    >
                      <span className="text-sm text-[#E5E5E5]">
                        {child.title}
                      </span>
                      {renderAction(child)}
                    </div>
                  ))}
                </div>
              )}

              {!asset.description &&
                !asset.videoUrl &&
                (!asset.children || asset.children.length === 0) && (
                  <p className="text-[#E5E5E5]/70 text-sm">
                    لا توجد تفاصيل إضافية
                  </p>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}