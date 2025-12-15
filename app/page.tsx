/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react";
import QRCode from "qrcode";
import { unescape } from "querystring";

export default function Home() {
  const [input, setInput] = useState('');
  const [qrSrc, setQrSrc] = useState('');
  const [shareLink, setShareLink] = useState('');

  const handleGenerate = async () => {
    if (!input) return;

    try {
      const url = await QRCode.toDataURL(input, { width: 300, margin: 2 });
      setQrSrc(url);

      const base64Text = btoa(unescape(encodeURIComponent(input)));

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setShareLink(`${origin}/share/${base64Text}`);
    } catch (error) {
      console.error(error);
    }
  };


  const downloadQR = () => {
    if (!qrSrc) return;

    const link = document.createElement('a');

    link.href = qrSrc;
    link.download = 'qrcode.png';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Đã copy link');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md w-full bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          QR Gen & Share
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nhập nội dung bất kỳ..."
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 transition text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Tạo QR Code
          </button>
        </div>

        {qrSrc && (
          <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-2 rounded-lg mb-4">
              <img src={qrSrc} alt="Generated QR" className="rounded" />
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={downloadQR}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition"
              >
                Download Ảnh
              </button>
              <button
                onClick={copyLink}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
              >
                Copy Link Share
              </button>
            </div>

            {/* Vùng hiển thị link để test */}
            <div className="mt-4 p-2 bg-slate-900 rounded text-xs text-gray-400 break-all w-full">
              Link: {shareLink}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
