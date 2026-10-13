import React, { useState, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SupercarModel from './components/canvas/SupercarModel';
import ShowroomStage from './components/canvas/ShowroomStage';
import CameraRig from './components/canvas/CameraRig';
import ConfiguratorHUD from './components/ui/ConfiguratorHUD';
import BuildSummaryModal from './components/ui/BuildSummaryModal';
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
} from './data/carConfigData';

export default function App() {
  const [config, setConfig] = useState({
    carModel: CAR_MODELS[0], // BMW M5 F90 LCI STEALTH
    paintColor: PAINT_COLORS[0], // Black Sapphire Metallic
    materialFinish: MATERIAL_FINISHES[0], // BMW Metallic Clearcoat
    trimPackage: TRIM_PACKAGES[0], // M High-Gloss Shadowline
    wheelStyle: WHEEL_STYLES[0], // 20" M Y-Spoke Style 789M (Monoblock)
    rimFinish: RIM_FINISHES[0], // Jet Black High-Gloss
    caliperColor: CALIPER_COLORS[0], // M Compound High-Gloss Red
    windowTint: WINDOW_TINTS[0], // Sun Protection Dark Tint (15%)
    studioEnv: STUDIO_ENVIRONMENTS[0] // M Studio Dark Showroom
  });

  const [activeCameraPreset, setActiveCameraPreset] = useState(CAMERA_PRESETS[0]);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [wingDeployed, setWingDeployed] = useState(false); // S63 V8 Hood open/close
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [driveMode, setDriveMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Switch BMW M5 Edition and apply its signature factory specification
  const handleSelectModelEdition = (edition) => {
    const paint = PAINT_COLORS.find((p) => p.id === edition.presetPaintId) || PAINT_COLORS[0];
    const finish =
      MATERIAL_FINISHES.find((f) => f.id === edition.presetFinishId) || MATERIAL_FINISHES[0];
    const rim = RIM_FINISHES.find((r) => r.id === edition.presetRimFinishId) || RIM_FINISHES[0];
    const wStyle = WHEEL_STYLES.find((w) => w.id === edition.presetWheelStyleId) || WHEEL_STYLES[0];
    const caliper =
      CALIPER_COLORS.find((c) => c.id === edition.presetCaliperId) || CALIPER_COLORS[0];
    const trim = TRIM_PACKAGES.find((t) => t.id === edition.presetTrimId) || TRIM_PACKAGES[0];

    setConfig((prev) => ({
      ...prev,
      carModel: edition,
      paintColor: paint,
      materialFinish: finish,
      rimFinish: rim,
      wheelStyle: wStyle,
      caliperColor: caliper,
      trimPackage: trim
    }));
  };

  // Calculate Total Configured MSRP
  const totalPrice = useMemo(() => {
    return (
      config.carModel.basePrice +
      (config.paintColor.price || 0) +
      (config.materialFinish.price || 0) +
      (config.trimPackage.price || 0) +
      (config.wheelStyle.price || 0)
    );
  }, [config]);

  // Handle 3D Hotspot selection
  const handleSelectHotspot = (spot) => {
    if (activeHotspot?.id === spot.id) {
      setActiveHotspot(null);
      return;
    }
    setActiveHotspot(spot);
    if (spot.cameraPreset) {
      const targetPreset = CAMERA_PRESETS.find((p) => p.id === spot.cameraPreset);
      if (targetPreset) setActiveCameraPreset({ ...targetPreset });
    }
    if (spot.id === 'cockpit-door') {
      setDoorsOpen(true);
    }
    if (spot.id === 'engine-bay') {
      setWingDeployed(true);
    }
  };

  // Randomize BMW Individual Configuration
  const handleRandomize = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setConfig((prev) => ({
      ...prev,
      paintColor: pick(PAINT_COLORS),
      materialFinish: pick(MATERIAL_FINISHES),
      trimPackage: pick(TRIM_PACKAGES),
      wheelStyle: pick(WHEEL_STYLES),
      rimFinish: pick(RIM_FINISHES),
      caliperColor: pick(CALIPER_COLORS)
    }));
  };

  // Capture high-resolution PNG render from the 3D WebGL Canvas
  const handleCaptureScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `bmw-${config.carModel.id}-${config.paintColor.id}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07090e] select-none">
      {/* 3D Interactive WebGL Viewport */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [-3.6, 1.32, 3.85], fov: 36, near: 0.1, far: 100 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        onPointerMissed={() => setActiveHotspot(null)}
      >
        <Suspense fallback={null}>
          <ShowroomStage
            studioEnv={config.studioEnv}
            driveMode={driveMode}
            caliperColor={config.caliperColor.hex}
          />

          <SupercarModel
            carModel={config.carModel}
            paintColor={config.paintColor}
            materialFinish={config.materialFinish}
            trimPackage={config.trimPackage}
            wheelStyle={config.wheelStyle}
            rimFinish={config.rimFinish}
            caliperColor={config.caliperColor.hex}
            windowTint={config.windowTint}
            doorsOpen={doorsOpen}
            wingDeployed={wingDeployed}
            headlightsOn={headlightsOn}
            driveMode={driveMode}
            showHotspots={showHotspots}
            activeHotspot={activeHotspot}
            onSelectHotspot={handleSelectHotspot}
          />

          <CameraRig
            activePreset={activeCameraPreset}
            autoRotate={autoRotate}
            onUserInteract={() => {}}
          />
        </Suspense>
      </Canvas>

      {/* Glassmorphic Studio HUD & Configurator Controls */}
      <ConfiguratorHUD
        config={config}
        setConfig={setConfig}
        onSelectModelEdition={handleSelectModelEdition}
        activeCameraPreset={activeCameraPreset}
        onSelectCameraPreset={(preset) => setActiveCameraPreset({ ...preset })}
        doorsOpen={doorsOpen}
        setDoorsOpen={setDoorsOpen}
        wingDeployed={wingDeployed}
        setWingDeployed={setWingDeployed}
        headlightsOn={headlightsOn}
        setHeadlightsOn={setHeadlightsOn}
        driveMode={driveMode}
        setDriveMode={setDriveMode}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        showHotspots={showHotspots}
        setShowHotspots={setShowHotspots}
        totalPrice={totalPrice}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onRandomize={handleRandomize}
        onCaptureScreenshot={handleCaptureScreenshot}
      />

      {/* Bespoke Build Summary & Spec Dossier Modal */}
      <BuildSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        config={config}
        totalPrice={totalPrice}
        onCaptureScreenshot={handleCaptureScreenshot}
      />
    </div>
  );
}
