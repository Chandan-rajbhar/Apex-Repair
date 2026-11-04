export const APPLIANCE_CATEGORIES = [
  {
    id: 'refrigerators',
    name: 'Refrigerators',
    tag: 'REFRIGERATION',
    shortDesc: 'Cooling diagnostics, compressor servicing, coil cleaning, and seal replacement.',
    fullDesc: 'Comprehensive diagnostics and master repair for French-door, side-by-side, and built-in luxury refrigerators. We specialize in inverter compressors, thermistor sensors, dual evaporators, and electronic defrost systems.',
    diagnosticFee: 79,
    estDuration: '45-90 Mins',
    warranty: '90-Day Guarantee',
    badge: 'BEST-SELLER',
    image: '/images/services/refrigerator.jpg',
    commonIssues: [
      'Not cooling properly or fluctuating temperature',
      'Leaking water under or inside refrigerator',
      'Loud humming, buzzing or clicking compressor',
      'Excessive frost build-up on back freezer wall',
      'Digital touch display error code'
    ],
    popularBrands: ['Sub-Zero', 'Samsung', 'LG', 'Whirlpool', 'GE Profile', 'KitchenAid', 'Bosch', 'Thermador'],
    rating: 4.95,
    completedRepairs: 4120
  },
  {
    id: 'washers',
    name: 'Washing Machines',
    tag: 'LAUNDRY',
    shortDesc: 'Drum balance, pump drainage, leak elimination, and motor coupling repair.',
    fullDesc: 'Expert repair of high-efficiency front-load and heavy-duty top-load washing machines. From direct-drive motors and drain pump clogs to water inlet solenoids and main control PCB logic.',
    diagnosticFee: 79,
    estDuration: '40-75 Mins',
    warranty: '90-Day Guarantee',
    badge: 'SAME-DAY',
    image: '/images/services/washing-machine.jpg',
    commonIssues: [
      'Will not drain or stops mid-cycle',
      'Excessive shaking, banging or unbalanced spinning',
      'Door boot gasket leaking water onto floor',
      'Will not spin or drum does not rotate',
      'Error code (e.g. OE, 5E, UE, F21)'
    ],
    popularBrands: ['LG', 'Samsung', 'Maytag', 'Whirlpool', 'Speed Queen', 'Bosch', 'Electrolux'],
    rating: 4.92,
    completedRepairs: 3840
  },
  {
    id: 'dryers',
    name: 'Clothes Dryers',
    tag: 'LAUNDRY',
    shortDesc: 'Heating element replacement, thermal fuse testing, rollers and belt renewal.',
    fullDesc: 'Gas and electric dryer troubleshooting. We clear safety thermal cutoffs, replace snapped drive belts, balance squeaking idler pulleys, and inspect exhaust airflow for maximum fire safety.',
    diagnosticFee: 79,
    estDuration: '40-60 Mins',
    warranty: '90-Day Guarantee',
    badge: 'SAME-DAY',
    image: '/images/services/dryer.jpg',
    commonIssues: [
      'Tumbling but blowing no heat (cold air)',
      'Takes 2-3 cycles to dry clothes',
      'High-pitched screeching or thumping noise',
      'Shuts off unexpectedly after 5 minutes',
      'Will not turn on or start button unresponsive'
    ],
    popularBrands: ['Whirlpool', 'Samsung', 'Maytag', 'LG', 'GE', 'Kenmore', 'Amana'],
    rating: 4.89,
    completedRepairs: 2950
  },
  {
    id: 'dishwashers',
    name: 'Dishwashers',
    tag: 'KITCHEN',
    shortDesc: 'Spray arm pressure, leak detection, heater element, and drain clearing.',
    fullDesc: 'Restore sparkling clean dishes with precision dishwasher repair. We service circulation wash impellers, float switch sensors, drain valves, door latches, and electronic control modules.',
    diagnosticFee: 79,
    estDuration: '45-80 Mins',
    warranty: '90-Day Guarantee',
    badge: 'POPULAR',
    image: '/images/services/dishwasher.jpg',
    commonIssues: [
      'Dishes come out dirty or cloudy white residue',
      'Standing dirty water at the bottom after cycle',
      'Leaking water around door gasket or kickplate',
      'Soap tablet dispenser door fails to open',
      'E15 or overflow error sensor triggered'
    ],
    popularBrands: ['Bosch', 'KitchenAid', 'Miele', 'Whirlpool', 'GE Cafe', 'Frigidaire'],
    rating: 4.91,
    completedRepairs: 2610
  },
  {
    id: 'ovens-ranges',
    name: 'Ovens & Ranges',
    tag: 'COOKING',
    shortDesc: 'Igniter replacement, bake/broil elements, thermostat calibration, control boards.',
    fullDesc: 'Precision culinary appliance service for gas ranges, electric ovens, dual-fuel cooktops, and induction surfaces. Calibrate exact temperature probe accuracy and replace high-voltage spark modules.',
    diagnosticFee: 79,
    estDuration: '50-90 Mins',
    warranty: '90-Day Guarantee',
    badge: 'PRECISION',
    image: '/images/services/oven.jpg',
    commonIssues: [
      'Oven will not heat or igniter glows without gas flame',
      'Uneven baking or temperature 50° off target',
      'Gas burner clicks continuously and won\'t catch',
      'Oven door locked shut after self-clean cycle',
      'Induction cooktop error code or touch lock active'
    ],
    popularBrands: ['Wolf', 'Viking', 'Thermador', 'GE Profile', 'KitchenAid', 'Samsung', 'Bosch'],
    rating: 4.96,
    completedRepairs: 2190
  },
  {
    id: 'freezers',
    name: 'Deep Freezers',
    tag: 'REFRIGERATION',
    shortDesc: 'Thermostat tuning, defrost timers, compressor relays, and gasket seals.',
    fullDesc: 'Chest freezers, upright deep freezers, and specialty frozen food vaults. Fast emergency response to prevent costly food spoilage due to thermal failure.',
    diagnosticFee: 79,
    estDuration: '40-70 Mins',
    warranty: '90-Day Guarantee',
    badge: 'URGENT CARE',
    image: '/images/services/freezer.jpg',
    commonIssues: [
      'Freezer thawing food or clicking sounds',
      'Severe frost buildup around magnetic door seals',
      'Power indicator light on but compressor silent',
      'Internal alarm beeping continually'
    ],
    popularBrands: ['Frigidaire', 'GE', 'Whirlpool', 'Danby', 'Haier'],
    rating: 4.88,
    completedRepairs: 1420
  },
  {
    id: 'microwaves',
    name: 'Microwaves',
    tag: 'KITCHEN',
    shortDesc: 'Magnetron repair, high voltage diode, turntable motors, interlock switches.',
    fullDesc: 'Over-the-range and built-in drawer microwaves. We test high-voltage capacitors, door safety interlock switches, ventilation exhaust blowers, and display membranes safely.',
    diagnosticFee: 79,
    estDuration: '30-55 Mins',
    warranty: '90-Day Guarantee',
    badge: 'SAME-DAY',
    image: '/images/services/microwave.jpg',
    commonIssues: [
      'Turns on and spins but produces zero heat',
      'Sparks or arcing inside microwave cavity',
      'Turntable glass tray will not rotate',
      'Blows circuit breaker immediately when started',
      'Keypad buttons unresponsive'
    ],
    popularBrands: ['Sharp', 'Panasonic', 'GE Profile', 'KitchenAid', 'Whirlpool', 'Samsung'],
    rating: 4.85,
    completedRepairs: 1890
  },
  {
    id: 'disposals',
    name: 'Garbage Disposals',
    tag: 'PLUMBING & KITCHEN',
    shortDesc: 'Jam release, flywheel replacement, under-sink leak sealing, motor resets.',
    fullDesc: 'Heavy-duty under-sink garbage disposal units. We safely clear internal impeller jams, replace fractured bottom seal housings, and reinstall vibration-dampened sink flanges.',
    diagnosticFee: 79,
    estDuration: '30-50 Mins',
    warranty: '90-Day Guarantee',
    badge: 'QUICK FIX',
    image: '/images/services/disposal.jpg',
    commonIssues: [
      'Humming loudly without blades turning (jammed)',
      'Water leaking from disposal housing into cabinet',
      'Completely dead (reset button does not click)',
      'Foul odor or slow drainage from sink'
    ],
    popularBrands: ['InSinkErator', 'Moen', 'Waste King', 'Kohler'],
    rating: 4.93,
    completedRepairs: 2310
  },
  {
    id: 'ice-makers',
    name: 'Dedicated Ice Makers',
    tag: 'SPECIALTY',
    shortDesc: 'Water inlet valves, harvest cycle timers, mold heaters, refrigerant loops.',
    fullDesc: 'Under-counter clear ice machines and freestanding nugget ice makers. Precision water filter diagnostics, harvest finger sensors, condenser descaling, and pump service.',
    diagnosticFee: 79,
    estDuration: '50-85 Mins',
    warranty: '90-Day Guarantee',
    badge: 'SPECIALTY',
    image: '/images/services/ice-maker.jpg',
    commonIssues: [
      'No ice production at all',
      'Ice cubes are hollow, small, or cloudy',
      'Leaking water inside storage bin',
      'Stuck mid-harvest cycle with red error light'
    ],
    popularBrands: ['Scotsman', 'Sub-Zero', 'U-Line', 'Hoshizaki', 'KitchenAid'],
    rating: 4.87,
    completedRepairs: 1180
  },
  {
    id: 'wine-coolers',
    name: 'Wine Coolers & Cellars',
    tag: 'SPECIALTY',
    shortDesc: 'Dual-zone calibration, vibration isolation, UV glass door seals, circulation fans.',
    fullDesc: 'Luxury wine preservation refrigeration. Dual-zone temperature calibration, ultra-quiet brushless circulation fans, high-humidity maintenance, and sealed system restoration.',
    diagnosticFee: 79,
    estDuration: '50-90 Mins',
    warranty: '90-Day Guarantee',
    badge: 'LUXURY CARE',
    image: '/images/services/wine-cooler.jpg',
    commonIssues: [
      'Upper or lower zone temperature out of spec',
      'Excessive fan noise vibrating bottle racks',
      'Condensation dripping onto wooden shelves',
      'Display flashing temperature alarm'
    ],
    popularBrands: ['Sub-Zero', 'EuroCave', 'Viking', 'Marvel', 'U-Line', 'Liebherr'],
    rating: 4.97,
    completedRepairs: 950
  }
];

export const getServiceImage = (service) => {
  const name = (service?.name || service?.appliance || service?.category || '').toLowerCase();
  const code = (service?.code || service?.id || '').toLowerCase();

  if (code.includes('ac') || name.includes('ac') || name.includes('air condition')) {
    return {
      src: '/images/services/ac.jpg',
      alt: 'Technician servicing an air conditioner'
    };
  }
  if (code.startsWith('rf') || code.includes('refrigerat') || name.includes('refrigerat') || name.includes('cooling')) {
    return {
      src: '/images/services/refrigerator.jpg',
      alt: 'Technician repairing a refrigerator'
    };
  }
  if (code.startsWith('wm') || code.includes('washer') || name.includes('washing') || name.includes('laundry')) {
    return {
      src: '/images/services/washing-machine.jpg',
      alt: 'Technician repairing a washing machine'
    };
  }
  if (code.startsWith('dr') || code.includes('dryer') || name.includes('dryer')) {
    return {
      src: '/images/services/dryer.jpg',
      alt: 'Technician repairing a clothes dryer'
    };
  }
  if (code.startsWith('dw') || code.includes('dishwash') || name.includes('dishwash')) {
    return {
      src: '/images/services/dishwasher.jpg',
      alt: 'Technician repairing a dishwasher'
    };
  }
  if (code.startsWith('ov') || code.includes('oven') || name.includes('oven') || name.includes('range') || name.includes('cooktop')) {
    return {
      src: '/images/services/oven.jpg',
      alt: 'Technician repairing an oven and range'
    };
  }
  if (code.startsWith('fz') || code.includes('freezer') || name.includes('freezer')) {
    return {
      src: '/images/services/freezer.jpg',
      alt: 'Technician repairing a deep freezer'
    };
  }
  if (code.startsWith('mw') || code.includes('microwave') || name.includes('microwave')) {
    return {
      src: '/images/services/microwave.jpg',
      alt: 'Technician repairing a microwave'
    };
  }
  if (code.includes('disposal') || name.includes('disposal')) {
    return {
      src: '/images/services/disposal.jpg',
      alt: 'Technician repairing a garbage disposal'
    };
  }
  if (code.includes('ice') || name.includes('ice')) {
    return {
      src: '/images/services/ice-maker.jpg',
      alt: 'Technician repairing an ice maker'
    };
  }
  if (code.includes('wine') || name.includes('wine')) {
    return {
      src: '/images/services/wine-cooler.jpg',
      alt: 'Technician repairing a wine cooler'
    };
  }
  if (code.includes('water') || name.includes('water')) {
    return {
      src: '/images/services/water-heater.jpg',
      alt: 'Technician repairing a water heater'
    };
  }
  return {
    src: '/images/services/generic.jpg',
    alt: `Technician repairing ${service?.name || 'appliance'}`
  };
};

export const MAJOR_BRANDS = [
  'Whirlpool', 'Samsung', 'LG', 'Bosch', 'GE Profile', 
  'Sub-Zero', 'Viking', 'KitchenAid', 'Maytag', 'Frigidaire', 
  'Thermador', 'Miele', 'Kenmore', 'InSinkErator', 'Other'
];

export const TIME_SLOTS = [
  { id: 'morning', label: '8:00 AM – 11:00 AM', tag: 'Morning Slot' },
  { id: 'midday', label: '11:00 AM – 2:00 PM', tag: 'Midday Slot' },
  { id: 'afternoon', label: '2:00 PM – 5:00 PM', tag: 'Afternoon Slot' },
  { id: 'evening', label: '5:00 PM – 8:00 PM', tag: 'Evening Slot' }
];

export const COMPANY_INFO = {
  name: 'Apex Appliance Repair',
  phone: '(877) 225-2046',
  phoneRaw: '8772252046',
  whatsapp: '+18772252046',
  email: 'support@apexrepair.com',
  diagnosticFee: 79,
  diagnosticFeeNote: 'Waived with any completed repair',
  warrantyText: '90-Day Parts & Labor Guarantee',
  serviceHours: '7:00 AM – 9:00 PM (7 Days a Week)',
  rating: 4.98,
  reviewCount: '12,480+'
};

