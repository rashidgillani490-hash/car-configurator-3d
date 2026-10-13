import React, { useState } from 'react';
import { X, Check, Download, Share2, ShieldCheck, Sparkles } from 'lucide-react';

export default function BuildSummaryModal({
  isOpen,
  onClose,
  config,
  totalPrice,
  onCaptureScreenshot
}) {
  const [copied, setCopied] = useState(false);
  const [reserved, setReserved] = useState(false);

  if (!isOpen) return null;

  const {
    carModel,
    paintColor,
    materialFinish,
    trimPackage,
    wheelStyle,
    rimFinish,
    caliperColor,
    windowTint,
    studioEnv
  } = config;

  const buildCode = `AE-${carModel.id.slice(0, 3).toUpperCase()}-${paintColor.id.slice(0, 2).toUpperCase()}${wheelStyle.id.slice(0, 2).toUpperCase()}-2026`;

  const handleCopySpec = () => {
    const summaryText = [
      `AETHER BESPOKE BUILD // ${buildCode}`,
      `Model: ${carModel.name}`,
      `Exterior Paint: ${paintColor.name} (${materialFinish.name})`,
      `Aero Trim Package: ${trimPackage.name}`,
      `Wheels: ${wheelStyle.name} in ${rimFinish.name}`,
      `Brake Calipers: ${caliperColor.name}`,
      `Canopy Glass: ${windowTint.name}`,
      `Total Configured MSRP: $${totalPrice.toLocaleString()}`
    ].join('\n');

    navigator.clipboard?.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0b0f19]/95 border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden text-white">
        {/* Top Accent Gradient Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-rose-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Commission Dossier
            </div>
            <h2 className="text-xl font-display font-bold tracking-wide text-white mt-0.5">
              {carModel.name}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300">
              CODE: {buildCode}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Performance Telemetry Banner */}
          <div className="grid grid-cols-4 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Output</div>
              <div className="text-sm font-display font-bold text-cyan-400">{carModel.specs.power}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">0-60 MPH</div>
              <div className="text-sm font-display font-bold text-white">{carModel.specs.zeroToSixty}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Top Speed</div>
              <div className="text-sm font-display font-bold text-white">{carModel.specs.topSpeed}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Drivetrain</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{carModel.specs.drivetrain}</div>
            </div>
          </div>

          {/* Itemized Spec Breakdown */}
          <div className="space-y-2.5">
            <div className="text-xs font-display uppercase tracking-wider text-slate-400">
              Configured Specifications
            </div>

            <div className="divide-y divide-white/10 rounded-xl bg-white/[0.02] border border-white/10 px-4">
              <div className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Base Chassis</span>
                  <span className="font-medium text-white">{carModel.name}</span>
                </div>
                <span className="font-mono text-slate-200">${carModel.basePrice.toLocaleString()}</span>
              </div>

              <div className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: paintColor.hex }}
                  />
                  <div>
                    <span className="text-slate-400 block text-xs">Exterior Paint & Finish</span>
                    <span className="font-medium text-white">
                      {paintColor.name} — {materialFinish.name}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-slate-200">
                  +${(paintColor.price + materialFinish.price).toLocaleString()}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Aero & Exterior Trim Package</span>
                  <span className="font-medium text-white">{trimPackage.name}</span>
                </div>
                <span className="font-mono text-slate-200">+${trimPackage.price.toLocaleString()}</span>
              </div>

              <div className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Forged Wheels & Finish</span>
                  <span className="font-medium text-white">
                    {wheelStyle.name} ({rimFinish.name})
                  </span>
                </div>
                <span className="font-mono text-slate-200">+${wheelStyle.price.toLocaleString()}</span>
              </div>

              <div className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: caliperColor.hex }}
                  />
                  <div>
                    <span className="text-slate-400 block text-xs">Brake Calipers & Glass Canopy</span>
                    <span className="font-medium text-white">
                      {caliperColor.name} Calipers / {windowTint.name}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-emerald-400 text-xs uppercase">Included</span>
              </div>
            </div>
          </div>

          {/* Total Price Row */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/30">
            <div>
              <div className="text-xs uppercase tracking-wider text-cyan-300">
                Total Configured MSRP
              </div>
              <div className="text-[11px] text-slate-400">
                Includes bespoke wind-tunnel calibration & studio delivery
              </div>
            </div>
            <div className="text-2xl font-display font-extrabold text-white">
              ${totalPrice.toLocaleString()}
            </div>
          </div>

          {reserved && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold block text-emerald-300">
                  Allocation Slot Requested ({buildCode})
                </span>
                Your bespoke 3D configuration has been locked in the studio session.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-black/40 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={onCaptureScreenshot}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Save Studio Snapshot
            </button>
            <button
              onClick={handleCopySpec}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied Build Spec!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  Copy Spec Sheet
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => setReserved(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:brightness-110 transition shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            {reserved ? 'Allocation Confirmed ✓' : 'Reserve Allocation'}
          </button>
        </div>
      </div>
    </div>
  );
}
