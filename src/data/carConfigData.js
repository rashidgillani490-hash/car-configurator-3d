export const CAR_MODELS = [
  {
    id: 'm5-lci-stealth',
    name: 'BMW M5 F90 LCI STEALTH',
    tagline: 'Black Sapphire Shadowline Specification',
    basePrice: 114900,
    presetPaintId: 'black-sapphire',
    presetFinishId: 'metallic',
    presetRimFinishId: 'jet-black',
    presetWheelStyleId: '789m-mono',
    presetCaliperId: 'm-red',
    presetTrimId: 'shadowline-black',
    drlColor: '#f3f7b5',
    specs: {
      power: '617 HP',
      zeroToSixty: '2.8 s',
      topSpeed: '190 mph',
      weight: '1,895 kg',
      drivetrain: 'M xDrive AWD / 2WD'
    }
  },
  {
    id: 'm5-cs',
    name: 'BMW M5 CS (F90)',
    tagline: 'Lightweight Motorsport Special Edition',
    basePrice: 142000,
    presetPaintId: 'frozen-green',
    presetFinishId: 'matte',
    presetRimFinishId: 'cs-gold-bronze',
    presetWheelStyleId: '789m-cs',
    presetCaliperId: 'm-red',
    presetTrimId: 'carbon-weave',
    drlColor: '#ffe047',
    specs: {
      power: '627 HP',
      zeroToSixty: '2.6 s',
      topSpeed: '190 mph',
      weight: '1,825 kg',
      drivetrain: '4.4L V8 TwinPower + M xDrive'
    }
  },
  {
    id: 'm5-comp',
    name: 'BMW M5 COMPETITION',
    tagline: 'BMW Individual Executive Track Saloon',
    basePrice: 119500,
    presetPaintId: 'marina-bay',
    presetFinishId: 'metallic',
    presetRimFinishId: 'ferric-silver',
    presetWheelStyleId: '789m-bicolor',
    presetCaliperId: 'm-blue',
    presetTrimId: 'carbon-weave',
    drlColor: '#e0f2fe',
    specs: {
      power: '617 HP',
      zeroToSixty: '2.8 s',
      topSpeed: '190 mph',
      weight: '1,895 kg',
      drivetrain: '4.4L S63 V8 + 8-Spd M Steptronic'
    }
  }
];

export const PAINT_COLORS = [
  { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#090b0f', price: 0 },
  { id: 'frozen-green', name: 'Frozen Deep Green', hex: '#162b22', price: 5500 },
  { id: 'marina-bay', name: 'Marina Bay Blue', hex: '#0047ab', price: 1950 },
  { id: 'brands-hatch', name: 'Brands Hatch Grey', hex: '#3d4248', price: 1950 },
  { id: 'aventurine-red', name: 'Aventurine Red III', hex: '#631019', price: 1950 },
  { id: 'alpine-white', name: 'Alpine White III', hex: '#f2f5f8', price: 0 },
  { id: 'isle-of-man', name: 'Isle of Man Green', hex: '#0b5435', price: 3600 },
  { id: 'sao-paulo', name: 'Sao Paulo Yellow', hex: '#d2e017', price: 3600 },
  { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#7a828a', price: 1950 },
  { id: 'twilight-purple', name: 'Individual Twilight Purple', hex: '#4a196b', price: 5500 }
];

export const MATERIAL_FINISHES = [
  {
    id: 'metallic',
    name: 'BMW Metallic Clearcoat',
    description: 'Factory multi-stage metallic flake with mirror-gloss 2K clearcoat',
    price: 0,
    metalness: 0.85,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    sheen: 0.15
  },
  {
    id: 'matte',
    name: 'BMW Individual Frozen Matte',
    description: 'Velvety low-sheen satin diffuser coat for sharp body line definition',
    price: 5500,
    metalness: 0.48,
    roughness: 0.48,
    clearcoat: 0.14,
    clearcoatRoughness: 0.42,
    sheen: 0.35
  },
  {
    id: 'pearl',
    name: 'Individual Ceramic Pearl',
    description: 'Ultra-deep ceramic lacquer with high specular reflection',
    price: 6800,
    metalness: 0.72,
    roughness: 0.07,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    sheen: 0.8
  },
  {
    id: 'carbon',
    name: 'Full M Carbon Body Conversion',
    description: 'Exposed 2x2 twill carbon-fiber exterior panels with UV gloss resin',
    price: 22000,
    metalness: 0.58,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    sheen: 0.25,
    useCarbonTexture: true
  }
];

export const TRIM_PACKAGES = [
  {
    id: 'shadowline-black',
    name: 'M High-Gloss Shadowline',
    hex: '#0a0c10',
    metalness: 0.75,
    roughness: 0.14,
    useCarbonTexture: false,
    price: 0
  },
  {
    id: 'carbon-weave',
    name: 'M Carbon Exterior Package',
    hex: '#1c1f26',
    metalness: 0.52,
    roughness: 0.2,
    useCarbonTexture: true,
    price: 5800
  },
  {
    id: 'cs-gold-trim',
    name: 'M5 CS Gold Bronze Accents',
    hex: '#bda064',
    metalness: 0.88,
    roughness: 0.22,
    useCarbonTexture: false,
    price: 4200
  },
  {
    id: 'titanium-trim',
    name: 'Cerium Grey Titanium',
    hex: '#8e96a3',
    metalness: 0.9,
    roughness: 0.25,
    useCarbonTexture: false,
    price: 2400
  }
];

export const WHEEL_STYLES = [
  {
    id: '789m-mono',
    name: '20" M Y-Spoke Style 789M (Monoblock)',
    subtitle: 'Full uniform forged finish across spokes and inner barrel',
    mode: 'mono',
    price: 0
  },
  {
    id: '789m-bicolor',
    name: '20" M Y-Spoke Style 789M (Bi-Color)',
    subtitle: 'Jet Black inner pockets with diamond-cut machined spoke faces',
    mode: 'bicolor',
    price: 1950
  },
  {
    id: '789m-cs',
    name: '20" M5 CS Motorsport Forged',
    subtitle: 'Lightweight track-spec forged alloy with contrast inner barrel',
    mode: 'cs-spec',
    price: 3400
  },
  {
    id: '810m-dark',
    name: '20" M Performance Dark Tint',
    subtitle: 'Smoked clearcoat face over gloss obsidian inner barrel',
    mode: 'dark-tint',
    price: 2800
  }
];

export const RIM_FINISHES = [
  { id: 'jet-black', name: 'Jet Black High-Gloss', hex: '#0b0d11', metalness: 0.85, roughness: 0.14 },
  { id: 'cs-gold-bronze', name: 'M5 CS Gold Bronze', hex: '#bda064', metalness: 0.88, roughness: 0.22 },
  { id: 'orbit-grey', name: 'Orbit Grey Metallic', hex: '#383e47', metalness: 0.82, roughness: 0.28 },
  { id: 'ferric-silver', name: 'Machined Ferric Silver', hex: '#dce2ea', metalness: 0.95, roughness: 0.12 },
  { id: 'frozen-gunmetal', name: 'Frozen Satin Gunmetal', hex: '#22262e', metalness: 0.75, roughness: 0.38 }
];

export const CALIPER_COLORS = [
  { id: 'm-red', name: 'M Compound High-Gloss Red', hex: '#d91e18' },
  { id: 'm-gold', name: 'M Carbon-Ceramic Gold', hex: '#eab308' },
  { id: 'm-blue', name: 'M Performance Blue', hex: '#0284c7' },
  { id: 'acid-yellow', name: 'Track Acid Yellow', hex: '#dfff00' },
  { id: 'm-black', name: 'M High-Gloss Black', hex: '#14171d' }
];

export const WINDOW_TINTS = [
  { id: 'privacy-dark', name: 'Sun Protection Dark Tint (15%)', color: '#07090d', opacity: 0.88 },
  { id: 'limo', name: 'Stealth Blackout Tint (5%)', color: '#030406', opacity: 0.95 },
  { id: 'factory-smoke', name: 'Factory Solar Smoke (35%)', color: '#0f1620', opacity: 0.72 }
];

export const STUDIO_ENVIRONMENTS = [
  {
    id: 'obsidian',
    name: 'M Studio Dark Showroom',
    subtitle: 'High-contrast dark studio with crisp softbox reflections',
    bgHex: '#07090e',
    fogHex: '#07090e',
    accentLight: '#38bdf8',
    secondaryLight: '#ef4444',
    ambientIntensity: 0.85
  },
  {
    id: 'asphalt-bay',
    name: 'Stealth Detail Bay',
    subtitle: 'Neutral daylight studio lighting inspired by tuning bays',
    bgHex: '#0e1116',
    fogHex: '#0e1116',
    accentLight: '#e2e8f0',
    secondaryLight: '#94a3b8',
    ambientIntensity: 1.15
  },
  {
    id: 'cyberpunk',
    name: 'Munich Night Garage',
    subtitle: 'BMW M tricolor cyan, blue & crimson neon reflections',
    bgHex: '#060814',
    fogHex: '#060814',
    accentLight: '#00a8e8',
    secondaryLight: '#e11d48',
    ambientIntensity: 0.9
  },
  {
    id: 'apex-tunnel',
    name: 'Autobahn Wind Tunnel',
    subtitle: 'Aerodynamic testing bay with overhead speed arches',
    bgHex: '#050b14',
    fogHex: '#050b14',
    accentLight: '#0ea5e9',
    secondaryLight: '#38bdf8',
    ambientIntensity: 0.85
  }
];

export const CAMERA_PRESETS = [
  {
    id: 'hero',
    name: 'Front 3/4 Stance',
    position: [-3.6, 1.32, 3.85],
    target: [0, 0.58, 0.15]
  },
  {
    id: 'front',
    name: 'Kidney Grille & LCI DRLs',
    position: [0.0, 0.92, 4.65],
    target: [0, 0.62, 0.8]
  },
  {
    id: 'wheel',
    name: '789M Rim & Caliper',
    position: [-2.05, 0.52, 1.68],
    target: [-0.75, 0.36, 1.58]
  },
  {
    id: 'rear',
    name: 'Rear Diffuser & Quad M Exhaust',
    position: [3.35, 1.35, -4.15],
    target: [0, 0.62, -0.4]
  },
  {
    id: 'cockpit',
    name: 'Doors & M Cockpit',
    position: [-2.85, 1.55, 0.55],
    target: [0, 0.72, 0.1]
  },
  {
    id: 'engine',
    name: 'S63 V8 Engine Bay',
    position: [-1.85, 1.72, 3.35],
    target: [0, 0.72, 1.45]
  }
];

export const CAR_HOTSPOTS = [
  {
    id: 'kidney-grille',
    label: 'M Double-Slat Kidney Grille & LCI Laserlight',
    detail: 'High-gloss Shadowline kidney grille flanked by adaptive Dual L-Blade BMW Laserlight DRLs.',
    position: [0.58, 0.72, 2.28],
    cameraPreset: 'front'
  },
  {
    id: 'wheel-fl',
    label: '20" Forged 789M Wheels & M Compound Brakes',
    detail: '6-piston fixed front M Compound calipers with cross-drilled, inner-vented brake discs.',
    position: [-0.88, 0.42, 1.62],
    cameraPreset: 'wheel'
  },
  {
    id: 'engine-bay',
    label: '4.4L S63 M TwinPower Turbo V8',
    detail: 'Cross-bank exhaust manifold V8 delivering up to 627 HP and 750 Nm of torque.',
    position: [0, 0.92, 1.55],
    cameraPreset: 'engine'
  },
  {
    id: 'cockpit-door',
    label: 'M Multifunction Cockpit & Merino Cabin',
    detail: 'M leather steering wheel with red M1/M2 drive-mode buttons and illuminated M5 seats.',
    position: [-0.92, 0.92, 0.15],
    cameraPreset: 'cockpit'
  },
  {
    id: 'rear-diffuser',
    label: 'M Carbon Diffuser & Quad Sport Exhaust',
    detail: 'Twin dual-branch M Sport exhaust system with electronically controlled sound flaps.',
    position: [0, 0.56, -2.42],
    cameraPreset: 'rear'
  }
];
