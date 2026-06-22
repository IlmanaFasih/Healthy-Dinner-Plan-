import { useState, useEffect } from 'react';
import { QrCode, Github, ExternalLink, Zap, HelpCircle } from 'lucide-react';

interface QRCodeInstructionsProps {
  sharedUrl: string;
}

export default function QRCodeInstructions({ sharedUrl }: QRCodeInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const targetUrl = sharedUrl || 'https://ais-pre-yh7zuv7vhkfn7ll3qg765f-793897018743.us-east1.run.app';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}`;

  return (
    <div id="qr-instructions-root" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* QR Code Graphic Frame */}
        <div className="flex-shrink-0 text-center space-y-2 bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
          <div className="bg-white p-2.5 rounded-lg shadow-inner">
            <img
              src={qrCodeApiUrl}
              alt="Scan QR Code to access dinner planner app"
              referrerPolicy="no-referrer"
              className="w-48 h-48 border border-slate-100"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 font-mono tracking-wider uppercase pt-1">
            <QrCode className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            Live Mobile Code
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-4 flex-grow">
          <div>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 tracking-wider uppercase mb-1.5 border border-indigo-100">
              Instant Mobile Access
            </span>
            <h3 className="font-extrabold text-lg text-slate-800 leading-tight">Access on Your Mobile Device</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-1">
              Your Dinner Planner is deployed and accessible on any mobile browser. Scan this QR code with your phone camera or tablet to test meals, track your caloric budget on-the-go, and cross off shopping items right inside the grocery store!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 text-slate-600 font-mono w-full max-w-sm"
            />
            <button
              id="copy-link-btn"
              onClick={copyToClipboard}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer shrink-0"
            >
              {copied ? 'Copied Link!' : 'Copy Link'}
            </button>
          </div>
        </div>

      </div>

      {/* GitHub & Vercel deployment roadmap */}
      <div className="border-t border-slate-100 pt-6 space-y-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Github className="w-4 h-4 text-slate-700" />
            Vercel & GitHub Export Roadmap
          </h4>
          <p className="text-xs text-slate-400">Follow these standard steps to transfer your completed code to your GitHub and Vercel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px]">1</span>
              Export to your GitHub Account
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Open the **Settings** gear icon in the top right-hand portion of this AI Studio interface. Click **Export to GitHub**. Select your GitHub repository account space, name it, and push the code directly to repository, preserving all configuration scripts.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px]">2</span>
              Publish directly to Vercel
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Go to **vercel.com**, sign in with your GitHub, and click **Add New Project**. Select your newly exported repository. Under Environment Variables, ensure to click add **`GEMINI_API_KEY`** with the token from your AI secrets panel. Click **Deploy**; Vercel will build and assign you a global web url instantly!
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
