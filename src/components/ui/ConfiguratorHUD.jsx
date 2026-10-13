import React, { useState } from 'react';
import {
  Palette,
  Disc,
  Layers,
  Sun,
  Camera,
  Sparkles,
  Wind,
  Lightbulb,
  RotateCw,
  DoorOpen,
  Wrench,
  Eye,
  EyeOff,
  Shuffle,
  ChevronRight,
  Sliders
} from 'lucide-react';
import {
  CAR_MODELS,
  PAINT_COLORS,
  MATERIAL_FINISHES,
  TRIM_PACKAGES,
  WHEEL_STYLES,
  RIM_FINISHES,
  CALIPER_COLORS,
  WINDOW_TINTS,
  STUDIO_ENVIRONMENTS,
  CAMERA_PRESETS
} from '../../data/carConfigData';

const TABS = [
  { id: 'paint', label: 'Individual Paint', icon: Palette },
  { id: 'wheels', label: '789M Rims & Brakes', icon: Disc },
  { id: 'aero', label: 'M Carbon & Tint', icon: Layers },
  { id: 'studio', label: 'Studio Light', icon: Sun }
];

export default function ConfiguratorHUD({
  config,
  setConfig,
  onSelectModelEdition,
  activeCameraPreset,
  onSelectCameraPreset,
  doorsOpen,
  setDoorsOpen,
  wingDeployed,
  setWingDeployed,
  headlightsOn,
  setHeadlightsOn,
  driveMode,
  setDriveMode,
  autoRotate,
  setAutoRotate,
  showHotspots,
  setShowHotspots,
  totalPrice,
  onOpenSummary,
  onRandomize,
  onCaptureScreenshot
}) {
  const [activeTab, setActiveTab] = useState('paint');
  const [zenMode, setZenMode] = useState(false);

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

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (zenMode) {
    return (
      <div className="fixed top-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={onCaptureScreenshot}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-xl text-xs font-medium transition shadow-lg"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          Capture Render
        </button>
        <button
          onClick={() => setZenMode(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition shadow-lg"
        >
          <Eye className="w-4 h-4" />
          Exit Photo Mode
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 lg:p-6 select-none">
      {/* ============================================================
          TOP HEADER BAR: BMW M BRANDING, EDITION SWITCHER & SPECS
         ============================================================ */}
      <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#090d16]/85 backdrop-blur-xl border border-white/10 px-4 py-3 shadow-2xl relative overflow-hidden">
        {/* Authentic BMW M Tricolor Top Micro-Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0066b1] via-[#1c2b59] to-[#e22718]" />

        {/* Brand Identity & BMW M5 Edition Selector */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 pr-3 border-r border-white/10">
            {/* Iconic M Tricolor Slanted Bars */}
            <div className="flex items-center gap-0.5 -skew-x-12 px-1">
              <span className="w-2 h-6 bg-[#0066b1] rounded-[1px]" />
              <span className="w-2 h-6 bg-[#1b365d] rounded-[1px]" />
              <span className="w-2 h-6 bg-[#e22718] rounded-[1px]" />
            </div>
            <div>
              <div className="text-xs font-display font-extrabold tracking-widest text-white">
                BMW <span className="text-[#38bdf8]">M5</span> STUDIO
              </div>
              <div className="text-[10px] tracking-wider uppercase text-slate-400">
                F90 LCI • Individual Configurator
              </div>
            </div>
          </div>

          {/* BMW M5 Edition Switcher */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
            {CAR_MODELS.map((model) => {
              const active = carModel.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => onSelectModelEdition(model)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-display tracking-wide transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#0066b1] to-[#e22718] text-white font-bold shadow-[0_0_15px_rgba(0,102,177,0.45)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {model.name.replace('BMW ', '')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live S63 V8 Telemetry Readouts (Desktop) */}
        <div className="hidden xl:flex items-center gap-6 px-4 py-1 rounded-xl bg-white/[0.02] border border-white/5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">S63 V8 Output</div>
            <div className="text-xs font-display font-bold text-cyan-400">{carModel.specs.power}</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">0–60 MPH</div>
            <div className="text-xs font-display font-bold text-white">{carModel.specs.zeroToSixty}</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Top Speed</div>
            <div className="text-xs font-display font-bold text-white">{carModel.specs.topSpeed}</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Drivetrain</div>
            <div className="text-xs font-medium text-slate-200">{carModel.specs.drivetrain}</div>
          </div>
        </div>

        {/* Right Header Utilities & Price / Summary CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRandomize}
            title="Randomize BMW Individual Configuration"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Randomize</span>
          </button>

          <button
            onClick={() => setZenMode(true)}
            title="Hide UI for clean 3D Studio View"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Photo Mode</span>
          </button>

          <button
            onClick={onOpenSummary}
            className="flex items-center gap-3 pl-4 pr-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0066b1] via-[#0284c7] to-[#e22718] text-white font-display font-bold text-xs tracking-wide hover:brightness-110 transition shadow-[0_0_20px_rgba(2,132,199,0.4)]"
          >
            <span>${totalPrice.toLocaleString()}</span>
            <span className="flex items-center gap-0.5 bg-black/30 px-2 py-0.5 rounded-md text-[10px] uppercase">
              Build Sheet <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </header>

      {/* ============================================================
          MIDDLE / MAIN AREA: LEFT VEHICLE INFO + RIGHT CUSTOMIZER PANEL
         ============================================================ */}
      <div className="flex-1 flex flex-col lg:flex-row items-end lg:items-stretch justify-between gap-4 my-3 overflow-hidden">
        {/* Left Bottom Column: Active Car Title & Interactive Controls Dock */}
        <div className="w-full lg:w-auto flex flex-col justify-between pointer-events-none">
          {/* Top-left floating BMW M5 badge */}
          <div className="hidden sm:block max-w-xs p-3.5 rounded-2xl bg-[#090d16]/70 backdrop-blur-md border border-white/10 pointer-events-auto">
            <div className="text-[10px] font-display uppercase tracking-widest text-cyan-400">
              {carModel.tagline}
            </div>
            <h1 className="text-lg font-display font-extrabold tracking-wide text-white mt-0.5">
              {carModel.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-white/40"
                style={{ backgroundColor: paintColor.hex }}
              />
              <span>{paintColor.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">{rimFinish.name} 789M</span>
            </div>
          </div>

          {/* Bottom-left Interactive Vehicle Controls & Camera Presets */}
          <div className="pointer-events-auto space-y-2.5 mt-auto">
            {/* Interactive BMW M5 Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-[#090d16]/85 backdrop-blur-xl border border-white/10 shadow-xl">
              <button
                onClick={() => {
                  const next = !doorsOpen;
                  setDoorsOpen(next);
                  if (next) {
                    const cockpitCam = CAMERA_PRESETS.find((c) => c.id === 'cockpit');
                    if (cockpitCam) onSelectCameraPreset(cockpitCam);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  doorsOpen
                    ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Front Doors</span>
              </button>

              <button
                onClick={() => {
                  const next = !wingDeployed;
                  setWingDeployed(next);
                  if (next) {
                    const engCam = CAMERA_PRESETS.find((c) => c.id === 'engine');
                    if (engCam) onSelectCameraPreset(engCam);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  wingDeployed
                    ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>S63 V8 Hood</span>
              </button>

              <button
                onClick={() => setHeadlightsOn(!headlightsOn)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  headlightsOn
                    ? 'bg-amber-400 text-black font-semibold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>LCI Laser DRLs</span>
              </button>

              <button
                onClick={() => setDriveMode(!driveMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  driveMode
                    ? 'bg-[#e22718] text-white font-semibold shadow-[0_0_18px_rgba(226,39,24,0.5)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>{driveMode ? 'M xDrive Roll: ON' : 'Rolling Road'}</span>
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  autoRotate
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>Turntable</span>
              </button>

              <button
                onClick={() => setShowHotspots(!showHotspots)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  showHotspots
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hotspots</span>
              </button>
            </div>

            {/* Camera Angle Presets Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-[#090d16]/85 backdrop-blur-xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-1 px-2 text-[11px] font-display uppercase tracking-wider text-slate-400">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Views:</span>
              </div>
              {CAMERA_PRESETS.map((preset) => {
                const isActive = activeCameraPreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectCameraPreset(preset);
                      if (preset.id === 'engine') setWingDeployed(true);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT BMW INDIVIDUAL CUSTOMIZER STUDIO PANEL
           ============================================================ */}
        <aside className="pointer-events-auto w-full lg:w-[395px] max-h-[54vh] lg:max-h-full flex flex-col rounded-2xl bg-[#090d16]/85 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Category Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1.5 bg-black/40 border-b border-white/10">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-b from-[#0066b1]/35 to-[#1b365d]/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {/* TAB 1: BMW INDIVIDUAL PAINT & PBR FINISH */}
            {activeTab === 'paint' && (
              <>
                {/* Paint Swatches */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                      BMW Individual Paint Palette
                    </span>
                    <span className="text-xs font-medium text-cyan-400">
                      {paintColor.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    {PAINT_COLORS.map((swatch) => {
                      const selected = paintColor.id === swatch.id;
                      return (
                        <button
                          key={swatch.id}
                          onClick={() => updateConfig('paintColor', swatch)}
                          title={`${swatch.name} (+$${swatch.price.toLocaleString()})`}
                          className={`group relative flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                            selected
                              ? 'border-cyan-400 bg-cyan-500/10 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-full shadow-inner border border-white/25 relative overflow-hidden"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/40 rounded-full" />
                          </span>
                          <span className="mt-1 text-[10px] text-slate-300 truncate w-full text-center">
                            {swatch.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom BMW Individual Manufaktur Hex Picker */}
                  <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>BMW Individual Custom Hex</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="color"
                        value={paintColor.hex}
                        onChange={(e) =>
                          updateConfig('paintColor', {
                            id: 'custom',
                            name: `Individual Manufaktur (${e.target.value.toUpperCase()})`,
                            hex: e.target.value,
                            price: 5500
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300">
                        {paintColor.hex.toUpperCase()}
                      </span>
                    </label>
                  </div>
                </div>

                {/* PBR Material Surface Finishes */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                      Clearcoat & Frozen Finish
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      PBR Shader
                    </span>
                  </div>

                  <div className="space-y-2">
                    {MATERIAL_FINISHES.map((finish) => {
                      const selected = materialFinish.id === finish.id;
                      return (
                        <button
                          key={finish.id}
                          onClick={() => updateConfig('materialFinish', finish)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            selected
                              ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">
                              {finish.name}
                            </span>
                            <span className="text-xs font-mono text-cyan-400">
                              {finish.price === 0 ? 'Standard' : `+$${finish.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {finish.description}
                          </p>
                          {/* PBR Material Property Bars */}
                          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                            <div>
                              <span>Metallic</span>
                              <div className="h-1 w-full bg-white/10 rounded-full mt-0.5 overflow-hidden">
                                <div
                                  className="h-full bg-cyan-400"
                                  style={{ width: `${finish.metalness * 100}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <span>Gloss</span>
                              <div className="h-1 w-full bg-white/10 rounded-full mt-0.5 overflow-hidden">
                                <div
                                  className="h-full bg-blue-400"
                                  style={{ width: `${(1 - finish.roughness) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <span>Clearcoat</span>
                              <div className="h-1 w-full bg-white/10 rounded-full mt-0.5 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400"
                                  style={{ width: `${finish.clearcoat * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: 789M FORGED WHEELS, RIM FINISHES & M BRAKE CALIPERS */}
            {activeTab === 'wheels' && (
              <>
                {/* Forged Wheel Styling Mode */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                      M Forged Wheel Specification
                    </span>
                    <button
                      onClick={() => {
                        const wheelCam = CAMERA_PRESETS.find((c) => c.id === 'wheel');
                        if (wheelCam) onSelectCameraPreset(wheelCam);
                      }}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Zoom to 789M Rim →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {WHEEL_STYLES.map((style) => {
                      const selected = wheelStyle.id === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => updateConfig('wheelStyle', style)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            selected
                              ? 'border-cyan-400 bg-cyan-500/10'
                              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{style.name}</span>
                            <span className="text-xs font-mono text-cyan-400">
                              {style.price === 0 ? 'Included' : `+$${style.price.toLocaleString()}`}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{style.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rim Alloy Finish */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                      789M Rim Finish
                    </span>
                    <span className="text-xs text-cyan-400">{rimFinish.name}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {RIM_FINISHES.map((rim) => {
                      const selected = rimFinish.id === rim.id;
                      return (
                        <button
                          key={rim.id}
                          onClick={() => updateConfig('rimFinish', rim)}
                          title={rim.name}
                          className={`flex flex-col items-center p-2 rounded-xl border transition ${
                            selected
                              ? 'border-cyan-400 bg-cyan-500/15'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-full border border-white/30 shadow-inner"
                            style={{ backgroundColor: rim.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6-Piston M Compound / Carbon-Ceramic Brake Caliper Color */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                      M Brake Caliper Finish
                    </span>
                    <span className="text-xs text-cyan-400">{caliperColor.name}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {CALIPER_COLORS.map((cal) => {
                      const selected = caliperColor.id === cal.id;
                      return (
                        <button
                          key={cal.id}
                          onClick={() => updateConfig('caliperColor', cal)}
                          title={cal.name}
                          className={`flex flex-col items-center p-2 rounded-xl border transition ${
                            selected
                              ? 'border-cyan-400 bg-cyan-500/15'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-full border border-white/30"
                            style={{ backgroundColor: cal.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: M CARBON EXTERIOR PACKAGE & SOLAR PRIVACY GLASS */}
            {activeTab === 'aero' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                      Kidney Grille, Roof, Spoiler & Diffuser
                    </span>
                  </div>
                  <div className="space-y-2">
                    {TRIM_PACKAGES.map((trim) => {
                      const selected = trimPackage.id === trim.id;
                      return (
                        <button
                          key={trim.id}
                          onClick={() => updateConfig('trimPackage', trim)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                            selected
                              ? 'border-cyan-400 bg-cyan-500/10'
                              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-6 h-6 rounded-lg border border-white/25"
                              style={{ backgroundColor: trim.hex }}
                            />
                            <div className="text-left">
                              <div className="text-xs font-semibold text-white">{trim.name}</div>
                              <div className="text-[11px] text-slate-400">
                                {trim.useCarbonTexture
                                  ? 'CFRP Carbon Weave Roof, Spoiler & Diffuser'
                                  : 'Shadowline / Metallic Exterior Accents'}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-cyan-400">
                            {trim.price === 0 ? 'Standard' : `+$${trim.price.toLocaleString()}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sun Protection Window Glass Tint */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                      Sun Protection Glazing Tint
                    </span>
                  </div>
                  <div className="space-y-2">
                    {WINDOW_TINTS.map((tint) => {
                      const selected = windowTint.id === tint.id;
                      return (
                        <button
                          key={tint.id}
                          onClick={() => updateConfig('windowTint', tint)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                            selected
                              ? 'border-cyan-400 bg-cyan-500/10'
                              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-6 h-6 rounded-lg border border-white/30"
                              style={{ backgroundColor: tint.color }}
                            />
                            <span className="text-xs font-medium text-white">{tint.name}</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {Math.round(tint.opacity * 100)}% Density
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: STUDIO LIGHTING & ENVIRONMENT */}
            {activeTab === 'studio' && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-display uppercase tracking-wider text-slate-300">
                    3D Showroom & HDR Reflections
                  </span>
                </div>
                <div className="space-y-2.5">
                  {STUDIO_ENVIRONMENTS.map((env) => {
                    const selected = studioEnv.id === env.id;
                    return (
                      <button
                        key={env.id}
                        onClick={() => updateConfig('studioEnv', env)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          selected
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{env.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/30"
                              style={{ backgroundColor: env.accentLight }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/30"
                              style={{ backgroundColor: env.secondaryLight }}
                            />
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{env.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Panel Footer Hint */}
          <div className="px-4 py-2.5 bg-black/50 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Drag to orbit • Scroll to zoom</span>
            <button
              onClick={onCaptureScreenshot}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              Snapshot
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
