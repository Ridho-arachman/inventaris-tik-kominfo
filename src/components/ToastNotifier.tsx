import { CSSProperties } from "react";
import { toast } from "sonner";

// --- Konfigurasi Default ---
const DEFAULT_DURATION = 3500;

const BASE_STYLE: CSSProperties = {
  padding: "16px",
  fontWeight: "600",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
  textAlign: "left",
  fontSize: "0.95rem",
};

// Helper untuk membuat konten custom (message + description berwarna)
const renderContent = (
  message: string,
  description?: string,
  descColor?: string
) => (
  <div>
    <div>{message}</div>
    {description && (
      <div
        style={{
          marginTop: 6,
          fontSize: "0.85rem",
          color: descColor,
        }}
      >
        {description}
      </div>
    )}
  </div>
);

export const notifier = {
  // --- SUCCESS ---
  success: (message = "Operasi berhasil!", description?: string) => {
    toast.success(renderContent(message, description, "#0f5132"), {
      duration: DEFAULT_DURATION,
      style: {
        ...BASE_STYLE,
        backgroundColor: "#d1f7d9",
        color: "#0f5132",
        border: "1px solid #8fdca3",
      },
    });
  },

  // --- ERROR ---
  error: (
    message = "Terjadi kesalahan. Silakan coba lagi.",
    description?: string
  ) => {
    toast.error(renderContent(message, description, "#842029"), {
      duration: DEFAULT_DURATION + 800,
      style: {
        ...BASE_STYLE,
        backgroundColor: "#f8d7da",
        color: "#842029",
        border: "1px solid #f5c2c7",
      },
    });
  },

  // --- INFO ---
  info: (message = "Informasi.", description?: string) => {
    toast.message(renderContent(message, description, "#055160"), {
      icon: "ℹ️",
      duration: DEFAULT_DURATION,
      style: {
        ...BASE_STYLE,
        backgroundColor: "#cff4fc",
        color: "#055160",
        border: "1px solid #9eeaf9",
      },
    });
  },

  // --- WARNING ---
  warning: (message = "Perhatian.", description?: string) => {
    toast.message(renderContent(message, description, "#664d03"), {
      icon: "⚠️",
      duration: DEFAULT_DURATION,
      style: {
        ...BASE_STYLE,
        backgroundColor: "#fff3cd",
        color: "#664d03",
        border: "1px solid #ffe69c",
      },
    });
  },
};
