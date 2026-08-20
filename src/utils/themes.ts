import { BoardTheme, CheckerTheme, Player } from '../types/backgammon';

export interface CheckerColorDef {
  name: string;
  bg: string;
  border: string;
  boxShadow: string;
  grooveBorder: string;
  grooveShadow: string;
  innerBg: string;
  innerBorder: string;
  innerShadow: string;
  centerDotBg: string;
  centerDotShadow: string;
  sheenBg: string;
  avatarBg: string;
  avatarBorder: string;
  dotBg: string;
}

export interface CheckerPair {
  id: string;
  name: string;
  description: string;
  whiteName: string;
  blackName: string;
  white: CheckerColorDef;
  black: CheckerColorDef;
}

export interface ThemeColors {
  id: BoardTheme;
  name: string;
  description: string;
  outerFrame: string;
  outerBorder: string;
  fieldBg: string;
  fieldBorder: string;
  barBg: string;
  barBorder: string;
  trayBg: string;
  pointDarkGradient: [string, string, string, string];
  pointLightGradient: [string, string, string, string];
  pointDarkStroke: string;
  pointLightStroke: string;
  pointGlow: string; // subtle outer edge inlay highlight
  pointNumberColor: string;
  defaultCheckers: CheckerPair;
}

// Preset Checker Pairs
export const CHECKER_PAIRS: Record<Exclude<CheckerTheme, 'auto'>, CheckerPair> = {
  ivory_amber: {
    id: 'ivory_amber',
    name: 'Sedef Fildişi & Kehribar Ağacı',
    description: 'Sıcak meşe tahtaya özel sedef fildişi ve parlatılmış kehribar ağacı pullar',
    whiteName: 'Sedef Fildişi',
    blackName: 'Sıcak Kehribar',
    white: {
      name: 'Sedef Fildişi',
      bg: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #faf3e8 35%, #eedfc7 70%, #d4bf9c 100%)',
      border: '1.5px solid #d8c29d',
      boxShadow: '0 4px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,1), inset 0 -1.5px 3px rgba(160,130,90,0.3)',
      grooveBorder: '1px solid rgba(180, 150, 110, 0.5)',
      grooveShadow: 'inset 0 1px 2px rgba(120,90,50,0.2), 0 1px 1px rgba(255,255,255,0.9)',
      innerBg: 'radial-gradient(circle at 38% 32%, #ffffff 0%, #f4ebd9 55%, #dfceb1 100%)',
      innerBorder: '1px solid rgba(190, 160, 120, 0.6)',
      innerShadow: 'inset 0 1.5px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(255,255,255,0.8)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #c4ab82 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.3)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #ffffff 0%, #faf3e8 50%, #d4bf9c 100%)',
      avatarBorder: '#d8c29d',
      dotBg: '#f9f3e5',
    },
    black: {
      name: 'Sıcak Kehribar',
      bg: 'radial-gradient(circle at 35% 28%, #784826 0%, #522e17 40%, #351d0e 75%, #1d0f07 100%)',
      border: '1.5px solid #8e5831',
      boxShadow: '0 4px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.85), inset 0 1.5px 2px rgba(255,200,150,0.4), inset 0 -1.5px 3px rgba(0,0,0,0.7)',
      grooveBorder: '1px solid rgba(229, 192, 123, 0.35)',
      grooveShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.15)',
      innerBg: 'radial-gradient(circle at 38% 32%, #5a3319 0%, #381f0f 60%, #201007 100%)',
      innerBorder: '1px solid rgba(229, 192, 123, 0.4)',
      innerShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.7), 0 1px 1px rgba(255,255,255,0.15)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #c27d42 0%, #1a0c06 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.6)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #784826 0%, #522e17 50%, #1d0f07 100%)',
      avatarBorder: '#8e5831',
      dotBg: '#c27d42',
    },
  },
  classic_ebony: {
    id: 'classic_ebony',
    name: 'Masif Şimşir & Koyu Abanoz',
    description: 'Klasik ceviz tahtayla tam uyumlu masif şimşir ve kömür abanoz pullar',
    whiteName: 'Masif Şimşir',
    blackName: 'Koyu Abanoz',
    white: {
      name: 'Masif Şimşir',
      bg: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #f6edd9 40%, #e2d2b5 75%, #caa67d 100%)',
      border: '1.5px solid #c9b18c',
      boxShadow: '0 4px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,1), inset 0 -1.5px 3px rgba(0,0,0,0.2)',
      grooveBorder: '1px solid rgba(150, 130, 105, 0.45)',
      grooveShadow: 'inset 0 1px 2px rgba(0,0,0,0.15), 0 1px 1px rgba(255,255,255,0.8)',
      innerBg: 'radial-gradient(circle at 38% 32%, #ffffff 0%, #ede5d4 60%, #d5c8b2 100%)',
      innerBorder: '1px solid rgba(160, 140, 115, 0.5)',
      innerShadow: 'inset 0 1.5px 2px rgba(0,0,0,0.12), 0 1px 1px rgba(255,255,255,0.7)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #ab9d87 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.3)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #ffffff 0%, #f4ecd8 50%, #caa67d 100%)',
      avatarBorder: '#c9b18c',
      dotBg: '#f9f3e5',
    },
    black: {
      name: 'Koyu Abanoz',
      bg: 'radial-gradient(circle at 35% 28%, #4a423d 0%, #26221f 40%, #151312 75%, #050504 100%)',
      border: '1.5px solid #4a3e36',
      boxShadow: '0 4px 8px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.85), inset 0 1.5px 2px rgba(255,255,255,0.3), inset 0 -1.5px 3px rgba(0,0,0,0.7)',
      grooveBorder: '1px solid rgba(194, 162, 120, 0.25)',
      grooveShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.12)',
      innerBg: 'radial-gradient(circle at 38% 32%, #382e26 0%, #201a15 60%, #110e0c 100%)',
      innerBorder: '1px solid rgba(194, 162, 120, 0.3)',
      innerShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.7), 0 1px 1px rgba(255,255,255,0.15)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #5a4b3f 0%, #0d0a08 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.6)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #4a423d 0%, #26221f 50%, #050504 100%)',
      avatarBorder: '#4a3e36',
      dotBg: '#5a4b3f',
    },
  },
  cream_ruby: {
    id: 'cream_ruby',
    name: 'Turnuva Kremisi & Yakut Kırmızısı',
    description: 'Dünya şampiyonaları standardı yüksek kontrastlı krem ve asil yakut taşlar',
    whiteName: 'Turnuva Kremisi',
    blackName: 'Kraliyet Yakutu',
    white: {
      name: 'Turnuva Kremisi',
      bg: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #faf6ee 40%, #ece2ce 75%, #dacab0 100%)',
      border: '1.5px solid #e0d0b8',
      boxShadow: '0 4px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,1), inset 0 -1.5px 3px rgba(180,150,110,0.3)',
      grooveBorder: '1px solid rgba(190, 165, 130, 0.5)',
      grooveShadow: 'inset 0 1px 2px rgba(140,110,80,0.2), 0 1px 1px rgba(255,255,255,0.9)',
      innerBg: 'radial-gradient(circle at 38% 32%, #ffffff 0%, #f5eee0 55%, #e2d3bc 100%)',
      innerBorder: '1px solid rgba(200, 175, 140, 0.6)',
      innerShadow: 'inset 0 1.5px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(255,255,255,0.8)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #cbb18e 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.3)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #ffffff 0%, #f8f2e4 50%, #dacab0 100%)',
      avatarBorder: '#e0d0b8',
      dotBg: '#fefcf8',
    },
    black: {
      name: 'Kraliyet Yakutu',
      bg: 'radial-gradient(circle at 35% 28%, #a02831 0%, #721921 40%, #4a0d13 75%, #280408 100%)',
      border: '1.5px solid #c23843',
      boxShadow: '0 4px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.85), inset 0 1.5px 2px rgba(255,180,180,0.5), inset 0 -1.5px 3px rgba(0,0,0,0.7)',
      grooveBorder: '1px solid rgba(255, 180, 180, 0.35)',
      grooveShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.2)',
      innerBg: 'radial-gradient(circle at 38% 32%, #831d25 0%, #540f16 60%, #2e060a 100%)',
      innerBorder: '1px solid rgba(255, 150, 150, 0.45)',
      innerShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.7), 0 1px 1px rgba(255,255,255,0.15)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #df4854 0%, #200407 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.6)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #a02831 0%, #68151c 50%, #280408 100%)',
      avatarBorder: '#c23843',
      dotBg: '#df4854',
    },
  },
  platinum_gold: {
    id: 'platinum_gold',
    name: 'Platin Sedef & Altın Yaldızlı Oniks',
    description: 'Lüks gece abanozu zemin için gümüşi platin ve altın kakmalı siyah oniks',
    whiteName: 'Platin Sedef',
    blackName: 'Oniks & Altın',
    white: {
      name: 'Platin Sedef',
      bg: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #f0f4f8 40%, #d8e0e8 75%, #b4c0cc 100%)',
      border: '1.5px solid #c4d0dc',
      boxShadow: '0 4px 8px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,1), inset 0 -1.5px 3px rgba(140,160,180,0.3)',
      grooveBorder: '1px solid rgba(160, 180, 200, 0.5)',
      grooveShadow: 'inset 0 1px 2px rgba(100,120,140,0.2), 0 1px 1px rgba(255,255,255,0.9)',
      innerBg: 'radial-gradient(circle at 38% 32%, #ffffff 0%, #e6eef5 55%, #c8d5e2 100%)',
      innerBorder: '1px solid rgba(170, 190, 210, 0.6)',
      innerShadow: 'inset 0 1.5px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(255,255,255,0.85)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #9cb0c4 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.3)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #ffffff 0%, #e6eef5 50%, #b4c0cc 100%)',
      avatarBorder: '#c4d0dc',
      dotBg: '#f0f6fc',
    },
    black: {
      name: 'Oniks & Altın',
      bg: 'radial-gradient(circle at 35% 28%, #363230 0%, #1e1b1a 40%, #100e0d 75%, #000000 100%)',
      border: '1.5px solid #e5c07b',
      boxShadow: '0 4px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9), inset 0 1.5px 2px rgba(229,192,123,0.6), inset 0 -1.5px 3px rgba(0,0,0,0.8)',
      grooveBorder: '1px solid rgba(229, 192, 123, 0.5)',
      grooveShadow: 'inset 0 1px 2px rgba(0,0,0,0.7), 0 1px 1px rgba(229,192,123,0.3)',
      innerBg: 'radial-gradient(circle at 38% 32%, #221f1d 0%, #141211 60%, #060505 100%)',
      innerBorder: '1px solid rgba(229, 192, 123, 0.6)',
      innerShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.8), 0 1px 1px rgba(229,192,123,0.25)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #e5c07b 0%, #8c6a2e 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.7)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #363230 0%, #181514 50%, #000000 100%)',
      avatarBorder: '#e5c07b',
      dotBg: '#e5c07b',
    },
  },
  pearl_emerald: {
    id: 'pearl_emerald',
    name: 'Antik Sedef & Zümrüt Yeşili',
    description: 'Zengin zümrüt yeşili ve parlak inci beyazı koleksiyon taşları',
    whiteName: 'Antik Sedef',
    blackName: 'Derin Zümrüt',
    white: {
      name: 'Antik Sedef',
      bg: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #fbf8f0 40%, #ede6d4 75%, #d5cab0 100%)',
      border: '1.5px solid #d9ceb5',
      boxShadow: '0 4px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,1), inset 0 -1.5px 3px rgba(160,150,120,0.3)',
      grooveBorder: '1px solid rgba(175, 160, 130, 0.5)',
      grooveShadow: 'inset 0 1px 2px rgba(120,110,80,0.2), 0 1px 1px rgba(255,255,255,0.9)',
      innerBg: 'radial-gradient(circle at 38% 32%, #ffffff 0%, #f4eee2 55%, #dfd5be 100%)',
      innerBorder: '1px solid rgba(185, 170, 140, 0.6)',
      innerShadow: 'inset 0 1.5px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(255,255,255,0.8)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #c4b595 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.3)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #ffffff 0%, #fbf8f0 50%, #d5cab0 100%)',
      avatarBorder: '#d9ceb5',
      dotBg: '#faf5ea',
    },
    black: {
      name: 'Derin Zümrüt',
      bg: 'radial-gradient(circle at 35% 28%, #1f5f3f 0%, #13422a 40%, #0c2b1b 75%, #05160d 100%)',
      border: '1.5px solid #2d7a53',
      boxShadow: '0 4px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.85), inset 0 1.5px 2px rgba(180,255,210,0.4), inset 0 -1.5px 3px rgba(0,0,0,0.7)',
      grooveBorder: '1px solid rgba(100, 200, 150, 0.35)',
      grooveShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.15)',
      innerBg: 'radial-gradient(circle at 38% 32%, #194a31 0%, #0f3220 60%, #071b11 100%)',
      innerBorder: '1px solid rgba(100, 200, 150, 0.4)',
      innerShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.7), 0 1px 1px rgba(255,255,255,0.15)',
      centerDotBg: 'radial-gradient(circle at 40% 40%, #2f8d5f 0%, #04140b 100%)',
      centerDotShadow: '0 0.5px 1px rgba(0,0,0,0.6)',
      sheenBg: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
      avatarBg: 'linear-gradient(135deg, #1f5f3f 0%, #13422a 50%, #05160d 100%)',
      avatarBorder: '#2d7a53',
      dotBg: '#2f8d5f',
    },
  },
};

export const BOARD_THEMES: Record<BoardTheme, ThemeColors> = {
  warm_oak: {
    id: 'warm_oak',
    name: 'Sıcak Meşe (Açık Ton)',
    description: 'Aydınlık ve ferah ceviz-meşe zemin, altın yaldız detaylar',
    outerFrame: 'linear-gradient(145deg, #442d1d 0%, #2e1d13 50%, #1e130c 100%)',
    outerBorder: '#362114',
    fieldBg: '#543824',
    fieldBorder: '#6d4c33',
    barBg: 'linear-gradient(90deg, #2b1d14 0%, #3d2a1c 20%, #4a3424 50%, #3d2a1c 80%, #2b1d14 100%)',
    barBorder: '#724f35',
    trayBg: 'linear-gradient(180deg, #2d1d14 0%, #3f2a1d 50%, #2d1d14 100%)',
    pointDarkGradient: ['#5a3921', '#754b2d', '#654025', '#4d301b'],
    pointLightGradient: ['#d1b48c', '#ebd2ab', '#e0c69d', '#c9aa7f'],
    pointDarkStroke: '#e5c07b',
    pointLightStroke: '#f5e2b8',
    pointGlow: 'rgba(243, 229, 171, 0.45)',
    pointNumberColor: 'rgba(243, 229, 171, 0.55)',
    defaultCheckers: CHECKER_PAIRS.ivory_amber,
  },
  classic_walnut: {
    id: 'classic_walnut',
    name: 'Klasik Masif Ceviz',
    description: 'Dengeli klasik ton, sedef ve abanoz kakma üçgenler',
    outerFrame: 'linear-gradient(145deg, #3d2719 0%, #27180e 50%, #180e08 100%)',
    outerBorder: '#28170d',
    fieldBg: '#442b1a',
    fieldBorder: '#5b3c25',
    barBg: 'linear-gradient(90deg, #23160e 0%, #322115 20%, #3e2a1b 50%, #322115 80%, #23160e 100%)',
    barBorder: '#634229',
    trayBg: 'linear-gradient(180deg, #251810 0%, #342216 50%, #251810 100%)',
    pointDarkGradient: ['#4e311c', '#674125', '#57361e', '#412816'],
    pointLightGradient: ['#c4a477', '#dfc296', '#d3b688', '#ba986a'],
    pointDarkStroke: '#d4af37',
    pointLightStroke: '#ebd5b3',
    pointGlow: 'rgba(229, 192, 123, 0.4)',
    pointNumberColor: 'rgba(229, 192, 123, 0.5)',
    defaultCheckers: CHECKER_PAIRS.classic_ebony,
  },
  royal_green: {
    id: 'royal_green',
    name: 'Turnuva Yeşili (Royal Felt)',
    description: 'Klasik kulüp yeşili keçe zemin, yüksek kontrastlı ahşap üçgenler',
    outerFrame: 'linear-gradient(145deg, #382416 0%, #22150d 50%, #160d08 100%)',
    outerBorder: '#26160c',
    fieldBg: '#213a2a',
    fieldBorder: '#32543d',
    barBg: 'linear-gradient(90deg, #18281d 0%, #243c2c 50%, #18281d 100%)',
    barBorder: '#3d6349',
    trayBg: 'linear-gradient(180deg, #1a2a1f 0%, #273d2e 50%, #1a2a1f 100%)',
    pointDarkGradient: ['#5a3a22', '#784d2d', '#633e24', '#482d1a'],
    pointLightGradient: ['#d6bd96', '#f0dac0', '#e3caa6', '#ccae85'],
    pointDarkStroke: '#d4af37',
    pointLightStroke: '#f7ebd2',
    pointGlow: 'rgba(240, 218, 192, 0.45)',
    pointNumberColor: 'rgba(230, 240, 230, 0.6)',
    defaultCheckers: CHECKER_PAIRS.cream_ruby,
  },
  midnight_ebony: {
    id: 'midnight_ebony',
    name: 'Gece Abanozu & Altın',
    description: 'Koyu füme lüks abanoz zemin, parlak altın sarısı kakmalar',
    outerFrame: 'linear-gradient(145deg, #242220 0%, #171514 50%, #0d0c0b 100%)',
    outerBorder: '#1c1b19',
    fieldBg: '#2c2825',
    fieldBorder: '#453e3a',
    barBg: 'linear-gradient(90deg, #191716 0%, #252220 50%, #191716 100%)',
    barBorder: '#4d4641',
    trayBg: 'linear-gradient(180deg, #1c1a19 0%, #2a2725 50%, #1c1a19 100%)',
    pointDarkGradient: ['#38322e', '#4c443e', '#3d3732', '#2c2723'],
    pointLightGradient: ['#c9b082', '#e5cca0', '#d8be90', '#bfa373'],
    pointDarkStroke: '#e5c07b',
    pointLightStroke: '#f9f3e5',
    pointGlow: 'rgba(229, 192, 123, 0.5)',
    pointNumberColor: 'rgba(229, 192, 123, 0.65)',
    defaultCheckers: CHECKER_PAIRS.platinum_gold,
  },
};

/**
 * Returns the effective CheckerColorDef for a player based on board theme & checker theme.
 */
export function getCheckerStyle(
  player: Player,
  boardTheme?: BoardTheme | string,
  checkerTheme?: CheckerTheme | string
): CheckerColorDef {
  if (checkerTheme && checkerTheme !== 'auto' && (CHECKER_PAIRS as Record<string, CheckerPair>)[checkerTheme]) {
    return (CHECKER_PAIRS as Record<string, CheckerPair>)[checkerTheme][player];
  }

  const bTheme = (boardTheme && (BOARD_THEMES as Record<string, ThemeColors>)[boardTheme]) || BOARD_THEMES.royal_green;
  return bTheme.defaultCheckers[player];
}

/**
 * Returns the pair of checkers for the current settings.
 */
export function getActiveCheckerPair(
  boardTheme?: BoardTheme | string,
  checkerTheme?: CheckerTheme | string
): CheckerPair {
  if (checkerTheme && checkerTheme !== 'auto' && (CHECKER_PAIRS as Record<string, CheckerPair>)[checkerTheme]) {
    return (CHECKER_PAIRS as Record<string, CheckerPair>)[checkerTheme];
  }

  const bTheme = (boardTheme && (BOARD_THEMES as Record<string, ThemeColors>)[boardTheme]) || BOARD_THEMES.royal_green;
  return bTheme.defaultCheckers;
}
