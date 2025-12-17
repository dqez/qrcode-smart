/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import Link from "next/link";

export default function Home() {
  const [input, setInput] = useState('');
  const [qrSrc, setQrSrc] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [base64NoPadding, setBase64NoPadding] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const url = await QRCode.toDataURL(input, { width: 400, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
      setQrSrc(url);

      const base64Text = btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );

      const noPadding = base64Text.replace(/=+$/, '');
      setBase64NoPadding(noPadding);

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setShareLink(`${origin}/share/${noPadding}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrSrc) return;
    const link = document.createElement('a');
    link.href = qrSrc;
    link.download = `qrcode-smart-${base64NoPadding.substring(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySmart = async () => {
    if (!shareLink || !qrSrc) return;

    try {
      const imgBlob = await fetch(qrSrc).then((r) => r.blob());
      const textBlob = new Blob([shareLink], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/plain': textBlob,
        'image/png': imgBlob,
      });
      await navigator.clipboard.write([item]);
      alert('Copied Link & Image to clipboard!');
    } catch (err) {
      console.error('Smart copy failed:', err);
      navigator.clipboard.writeText(shareLink);
      alert('Copied Link (Image copy not supported)');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h-2v2h2v-2zm-2 2h-2v2h2v-2zm2-2h2v2h-2v-2zm0 4h-2v2h2v-2z" />
              </svg>
            </div>
            <span>QRCode<span className="text-indigo-600 dark:text-indigo-400">Smart</span></span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#api" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">API</a>
            <a href="https://github.com" target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full text-sm font-medium hover:opacity-90 transition-all">
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Hero Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium border border-indigo-100 dark:border-indigo-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Smart Sharing 2.0
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
              The <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Smartest</span> Way to Share Links
            </h1>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Generate QR codes that come with beautiful social preview cards.
              Perfect for sharing on Twitter, LinkedIn, and Discord.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-neutral-500 dark:text-neutral-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Instant Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Smart Clipboard</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Social Previews</span>
              </div>
            </div>
          </div>

          {/* Generator Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur-lg opacity-30 dark:opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">

              <div className="space-y-6">
                <div>
                  <label htmlFor="url-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Enter URL or Text
                  </label>
                  <div className="relative group">
                    <input
                      id="url-input"
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={!input || loading}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-600/20"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {qrSrc && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="shrink-0 mx-auto sm:mx-0 bg-white p-3 rounded-xl shadow-sm border border-neutral-100">
                        <img src={qrSrc} alt="Generated QR" className="w-32 h-32 sm:w-40 sm:h-40" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={downloadQR}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                          </button>
                          <button
                            onClick={copySmart}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            Smart Copy
                          </button>
                        </div>

                        {shareLink && (
                          <div className="bg-neutral-50 dark:bg-neutral-950/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Share Link</div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 truncate text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                                {shareLink}
                              </div>
                              <Link href={shareLink} target="_blank" className="text-indigo-600 hover:text-indigo-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-32">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Clipboard",
                desc: "Copy both the QR image and the share link to your clipboard simultaneously. Paste anywhere.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                )
              },
              {
                title: "Dynamic OG Cards",
                desc: "Links shared on social media automatically generate a preview card containing your QR code.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )
              },
              {
                title: "Developer Friendly",
                desc: "Use our simple API to generate QR codes and social cards programmatically for your own apps.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 transition-colors">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* API Section */}
        <div id="api" className="max-w-4xl mx-auto mt-32 mb-20">
          <div className="bg-neutral-900 dark:bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs font-mono text-neutral-500">API Usage</div>
            </div>
            <div className="p-6 space-y-8">

              {/* Endpoint */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Endpoint</h3>
                <div className="font-mono text-sm bg-neutral-950 p-4 rounded-lg border border-neutral-800 overflow-x-auto">
                  <div className="flex items-center gap-2 text-indigo-400 whitespace-nowrap">
                    <span className="text-purple-400 font-bold">GET</span>
                    <span className="text-white">/api/og</span>
                    <span className="text-neutral-500">?text=...&bg=...&dark=...&light=...&title=...</span>
                  </div>
                </div>
              </div>

              {/* Parameters */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Parameters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-indigo-400 font-bold">text</span>
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase font-bold">Required</span>
                    </div>
                    <div className="text-xs text-neutral-400">Base64 encoded content for the QR code.</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-indigo-400 font-bold">bg</span>
                      <span className="text-[10px] bg-neutral-700 text-neutral-400 px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <div className="text-xs text-neutral-400">Background color of the card (Hex without #).</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-indigo-400 font-bold">dark</span>
                      <span className="text-[10px] bg-neutral-700 text-neutral-400 px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <div className="text-xs text-neutral-400">Color of the QR dots (Hex without #).</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-indigo-400 font-bold">light</span>
                      <span className="text-[10px] bg-neutral-700 text-neutral-400 px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <div className="text-xs text-neutral-400">Background color of the QR code (Hex without #).</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-indigo-400 font-bold">title</span>
                      <span className="text-[10px] bg-neutral-700 text-neutral-400 px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <div className="text-xs text-neutral-400">Title text displayed above the QR code.</div>
                  </div>
                </div>
              </div>

              {/* Example */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Example Usage</h3>
                <div className="font-mono text-xs bg-neutral-950 p-4 rounded-lg border border-neutral-800 overflow-x-auto text-neutral-400">
                  <span className="text-green-400">https://qr-preview-app.vercel.app/api/og</span>
                  <span className="text-indigo-400">?text=</span>SGVsbG8=
                  <span className="text-indigo-400">&bg=</span>F3F4F6
                  <span className="text-indigo-400">&dark=</span>2563EB
                  <span className="text-indigo-400">&title=</span>Scan%20Me
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-600 border-t border-neutral-200 dark:border-neutral-800">
        <p>&copy; {new Date().getFullYear()} QRCode Smart. Built for the modern web.</p>
      </footer>
    </div>
  );
}
