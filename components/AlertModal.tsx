"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function AlertModal({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const bgColor =
    {
      success: "bg-green-50 border-green-200",
      error: "bg-red-50 border-red-200",
      warning: "bg-yellow-50 border-yellow-200",
      info: "bg-blue-50 border-blue-200",
    }[type] || "bg-gray-50 border-gray-200";

  const titleColor =
    {
      success: "text-green-800",
      error: "text-red-800",
      warning: "text-yellow-800",
      info: "text-blue-800",
    }[type] || "text-gray-800";

  const messageColor =
    {
      success: "text-green-700",
      error: "text-red-700",
      warning: "text-yellow-700",
      info: "text-blue-700",
    }[type] || "text-gray-700";

  const IconComponent =
    {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    }[type] || Info;

  const iconColor =
    {
      success: "text-green-600",
      error: "text-red-600",
      warning: "text-yellow-600",
      info: "text-blue-600",
    }[type] || "text-gray-600";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 pointer-events-none">
      <div className="pointer-events-auto max-w-md w-full">
        <div
          className={`flex gap-4 p-4 rounded-lg border-2 shadow-lg ${bgColor}`}
        >
          <IconComponent size={24} className={iconColor} />
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${titleColor}`}>{title}</h3>
            <p className={messageColor}>{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
