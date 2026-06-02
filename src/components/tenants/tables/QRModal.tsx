import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { Table } from "@/types/table";

interface QRModalProps {
  isOpen: boolean;
  table: Table | null;
  baseOrderUrl: string;
  onClose: () => void;
}

const QRModal = ({ isOpen, table, baseOrderUrl, onClose }: QRModalProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!table) return null;

  const orderUrl = `${baseOrderUrl}?token=${table.qrToken}`;

  const handleDownload = async () => {
    if (!qrRef.current) return;

    const canvas = await html2canvas(qrRef.current, {
      background: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `table-${table.number}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order">
                    <QrCode size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                      Table {table.number} QR Code
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Scan to order
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* QR Content */}
              <div className="p-6 flex flex-col items-center gap-5">
                {/* QR Wrapper — ini yang di-screenshot */}
                <div
                  ref={qrRef}
                  className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col items-center gap-3"
                >
                  <QRCode
                    value={orderUrl}
                    size={180}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox="0 0 256 256"
                  />
                  <div className="text-center">
                    <p className="font-display font-bold text-neutral-900 text-base">
                      Table {table.number}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Scan to place your order
                    </p>
                  </div>
                </div>

                {/* URL preview */}
                <div className="w-full bg-neutral-50 dark:bg-neutral-800 rounded-xl px-3 py-2.5 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-0.5">
                    Order URL
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 font-mono break-all">
                    {orderUrl}
                  </p>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-warm text-white rounded-xl shadow-order hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Download size={15} />
                  Download QR
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QRModal;
