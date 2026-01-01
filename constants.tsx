
import React from 'react';
import { NewsItem, ComponentData, StockData } from './types';

export const COLORS = {
  primary: '#4F46E5', // Indigo-600
  secondary: '#94A3B8', // Slate-400
  accent: '#F59E0B', // Amber-500
};

export const NEWS_CATEGORIES = [
  "All",
  "Stocks",
  "New Products",
  "Dev Boards",
  "Tools",
  "Technology",
  "Papers"
];

export const MOCK_STOCKS: StockData[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    price: 135.58,
    change: 2.45,
    changePercent: 1.84,
    history: [128, 130, 129, 132, 131, 134, 135.58]
  },
  {
    symbol: 'STM',
    name: 'STMicroelectronics',
    price: 28.42,
    change: -0.15,
    changePercent: -0.52,
    history: [29.1, 28.8, 28.9, 28.5, 28.6, 28.3, 28.42]
  },
  {
    symbol: 'TSM',
    name: 'TSMC ADR',
    price: 188.20,
    change: 3.12,
    changePercent: 1.68,
    history: [182, 184, 185, 183, 186, 187, 188.2]
  },
  {
    symbol: 'ARM',
    name: 'Arm Holdings',
    price: 142.15,
    change: 1.05,
    changePercent: 0.74,
    history: [138, 140, 139, 141, 140, 143, 142.15]
  },
  {
    symbol: 'ADI',
    name: 'Analog Devices',
    price: 215.40,
    change: -1.20,
    changePercent: -0.55,
    history: [218, 217, 219, 216, 215, 217, 215.4]
  }
];

export const MOCK_COMPONENTS: ComponentData[] = [
  {
    id: '1',
    name: 'STM32C011D6Y6TR',
    manufacturer: 'STMicroelectronics',
    category: 'Microcontrollers (MCU)',
    description: 'Mainstream Arm Cortex-M0+ MCU with 32 KB Flash, 6 KB RAM, 48 MHz CPU.',
    specs: {
      'Core': 'ARM Cortex-M0+',
      'Speed': '48 MHz',
      'Flash': '32 KB',
      'RAM': '6 KB',
      'Package': 'WLCSP20',
      'Voltage': '2.0V - 3.6V'
    },
    pinout: [
      { pin: '1', func: 'VSS', desc: 'Ground' },
      { pin: '2', func: 'VDD', desc: 'Digital Power' },
      { pin: '3', func: 'PA0', desc: 'I/O (Supports ADC_IN0)' },
      { pin: '4', func: 'PA1', desc: 'I/O (Supports USART2_RTS)' },
      { pin: '5', func: 'NRST', desc: 'System Reset (Active Low)' },
      { pin: '6', func: 'PA2', desc: 'I/O (Supports USART2_TX)' },
      { pin: '7', func: 'PA3', desc: 'I/O (Supports USART2_RX)' },
      { pin: '8', func: 'PB0', desc: 'I/O (Supports TIM1_CH2N)' }
    ],
    engineeringInsights: {
      ratings: {
        newbieFriendly: 4,
        competitionPopularity: 5,
        failureRisk: 2
      },
      pitfalls: [
        'WLCSP package is difficult for hand soldering; prefer QFN for prototyping.',
        'Boot0 pin requires a pull-down resistor; floating may cause boot issues.',
        'High ADC input impedance; requires voltage follower for fast sampling.'
      ],
      bestFit: ['Education', 'Mass Production', 'IoT Nodes']
    },
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
    cad: {
      symbolUrl: 'https://cdn.worldvectorlogo.com/logos/microchip.svg',
      footprintUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/QFN-32_footprint.png',
      model3dUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/LQFP64_3D_Rendering.png'
    },
    aiAdvice: {
      pros: ['Very low cost', 'High integration', 'Flexible pinout'],
      cons: ['Small RAM size', 'No advanced encryption instructions'],
      precautions: ['Pay attention to pin layout for high-frequency interference', 'WLCSP requires precise reflow'],
      typicalApps: ['IoT Sensors', 'Consumer Appliances', 'Simple HMI'],
      risks: {
        lifecycle: 'Active',
        supply: 'Global supply is stable',
        thermalEMC: 'Low power, minimal heat, good EMC',
        secondSource: 'No direct Pin-to-Pin drop-in; requires firmware migration'
      }
    },
    datasheetInsights: {
      designNotes: 'Place a 100nF decoupling capacitor near the VDD pin. Configure unused GPIOs as analog inputs in low power mode.',
      parameterTable: {
        'Static Current (Stop)': 'Typ 0.5 μA',
        'ADC Conversion Time': '1.0 μs',
        'GPIO Drive Current': 'Max 8 mA'
      },
      datasheetUrl: 'https://www.st.com/resource/en/datasheet/stm32c011d6.pdf',
      previewUrl: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=400'
    },
    marketInfo: {
      priceTrend: 'Stable',
      buyingAdvice: 'Price is at historical low, recommended for stocking.',
      sources: [
        { 
          distributor: 'Digi-Key', 
          price: '$0.85', 
          stock: '50,000+', 
          isAuthorized: true, 
          leadTime: 'In Stock',
          priceBreaks: [
            { quantity: 1, price: '$0.8500' },
            { quantity: 10, price: '$0.7200' },
            { quantity: 100, price: '$0.5840' },
            { quantity: 1000, price: '$0.4670' }
          ]
        },
        { 
          distributor: 'Mouser', 
          price: '$0.87', 
          stock: '22,400', 
          isAuthorized: true, 
          leadTime: 'In Stock',
          priceBreaks: [
            { quantity: 1, price: '$0.8720' },
            { quantity: 50, price: '$0.6800' },
            { quantity: 500, price: '$0.5200' }
          ]
        }
      ]
    },
    alternatives: [
      { 
        mpn: 'STM32L011K4U6', 
        mfg: 'ST', 
        description: 'Low power series with better energy efficiency.', 
        package: 'UFQFPN32', 
        price: '$1.12', 
        compatibility: 'Functional', 
        reasoning: 'Lower power consumption, slightly higher cost', 
        riskScore: 10,
        isDomestic: false
      },
      { 
        mpn: 'GD32E230K6', 
        mfg: 'GigaDevice', 
        description: 'Cortex-M23 core, cost-effective alternative.', 
        package: 'LQFP32', 
        price: '$0.45', 
        compatibility: 'Functional', 
        reasoning: 'High value Asian source alternative', 
        riskScore: 25,
        isDomestic: true 
      },
      { 
        mpn: 'CH32V003F4P6', 
        mfg: 'WCH', 
        description: 'Ultra-low cost RISC-V core MCU.', 
        package: 'TSSOP20', 
        price: '$0.15', 
        compatibility: 'Functional', 
        reasoning: 'Extremely low cost, great for toys/disposables', 
        riskScore: 30,
        isDomestic: true 
      },
      { 
        mpn: 'STM32G030K6T6', 
        mfg: 'ST', 
        description: 'G0 Entry level, up to 64MHz.', 
        package: 'LQFP32', 
        price: '$0.95', 
        compatibility: 'Pin-to-Pin', 
        reasoning: 'Pin compatible, higher performance', 
        riskScore: 5,
        isDomestic: false 
      }
    ]
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'NVIDIA Unveils Blackwell GPU Architecture, Redefining AI Compute',
    summary: 'NVIDIA announces the Blackwell platform, designed to power trillion-parameter LLM inference and training.',
    content: `NVIDIA officially launched the B200 GPU based on the Blackwell architecture at the latest GTC. Compared to Hopper, Blackwell delivers a massive leap in AI performance.`,
    category: 'Technology',
    time: '3h ago',
    imageUrl: 'https://images.unsplash.com/photo-1591439657448-9f4b9ce436b9?auto=format&fit=crop&q=80&w=800',
    takeaway: 'FP4 precision support is a key breakthrough, significantly boosting inference efficiency.',
    affected: ['Data Centers', 'HBM3e', 'High-Speed Interconnects'],
    scenarios: ['LLM Pre-training', 'Real-time Multimodal Interaction']
  },
  {
    id: '2',
    title: 'Wi-Fi 7 Standard Officially Approved',
    summary: 'Wi-Fi Alliance officially launches Wi-Fi 7 certification, promising 4x throughput of Wi-Fi 6.',
    content: `Wi-Fi 7 (802.11be) introduces 320MHz channel bandwidth and MLO technology.`,
    category: 'Technology',
    time: '8h ago',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    takeaway: 'MLO solves latency and jitter issues caused by band switching.',
    affected: ['RF Front End (RFFE)', 'SoC Processors'],
    scenarios: ['8K Streaming', 'Wireless VR/AR']
  },
  {
    id: '3',
    title: 'ESP32-P4: Espressif Launches High-Performance SoC without Wi-Fi',
    summary: 'Featuring dual-core RISC-V up to 400MHz, designed for Edge AI and HMI.',
    content: `Espressif's ESP32-P4 fills the gap for high-performance general-purpose MCUs in their lineup.`,
    category: 'New Products',
    time: '1d ago',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800',
    takeaway: 'Rich HMI interfaces make it ideal for industrial control panels.',
    affected: ['HMI Displays', 'Industrial Gateways'],
    scenarios: ['Smart Home Panels', 'Edge Vision']
  },
  {
    id: '4',
    title: 'Arduino Pro Launch: Portenta C33 Industrial Board',
    summary: 'Based on Renesas RA6M3, offering a cost-effective alternative for industrial IoT.',
    content: `Arduino expands its Pro line to help SMEs accelerate Industry 4.0 adoption.`,
    category: 'Dev Boards',
    time: '2d ago',
    imageUrl: 'https://images.unsplash.com/photo-1558444479-c8a027920927?auto=format&fit=crop&q=80&w=800',
    takeaway: 'Portenta C33 balances low power with strong security features.',
    affected: ['Industrial Sensors', 'Automation'],
    scenarios: ['Machine Monitoring', 'Secure IoT']
  },
  {
    id: '5',
    title: 'KiCad 8.0 Released: Rivaling Paid EDA Tools',
    summary: 'New version brings improved library management, better differential pair routing, and smoother 3D viewer.',
    content: `The open-source PCB tool KiCad hits a new milestone, lowering barriers for hardware design.`,
    category: 'Tools',
    time: '3d ago',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
    takeaway: 'KiCad ecosystem is growing fast, becoming a strong competitor to Altium for startups.',
    affected: ['PCB Design Workflow', 'Open Hardware'],
    scenarios: ['Rapid Prototyping', 'Low-cost PCB Design']
  }
];
