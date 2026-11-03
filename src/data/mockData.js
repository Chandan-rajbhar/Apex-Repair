export const TRACKING_STATUSES = [
  {
    id: 1,
    key: 'request_received',
    label: 'Request Received',
    shortTitle: 'Received',
    desc: 'Diagnostic request logged and entered into our regional dispatch queue.',
    iconName: 'ClipboardCheck',
    badgeText: 'Received'
  },
  {
    id: 2,
    key: 'booking_confirmed',
    label: 'Booking Confirmed',
    shortTitle: 'Confirmed',
    desc: 'Time slot confirmed. Dedicated master technician flagged for your area.',
    iconName: 'CalendarCheck2',
    badgeText: 'Confirmed'
  },
  {
    id: 3,
    key: 'tech_assigned',
    label: 'Technician Assigned',
    shortTitle: 'Tech Assigned',
    desc: 'Master certified technician Marcus Vance assigned with OEM inventory.',
    iconName: 'UserCheck',
    badgeText: 'Assigned'
  },
  {
    id: 4,
    key: 'on_the_way',
    label: 'Technician On The Way',
    shortTitle: 'En Route',
    desc: 'Service van is in transit. Live GPS tracking and 15-minute arrival alert active.',
    iconName: 'Truck',
    badgeText: 'En Route'
  },
  {
    id: 5,
    key: 'diagnosis_in_progress',
    label: 'Diagnosis In Progress',
    shortTitle: 'Diagnosing',
    desc: 'Technician on-site performing 32-point electrical and mechanical diagnostic.',
    iconName: 'Search',
    badgeText: 'On Site'
  },
  {
    id: 6,
    key: 'quote_approval_needed',
    label: 'Quote Approval Needed',
    shortTitle: 'Approval Needed',
    desc: 'Root cause identified. Itemized quote submitted for your immediate digital sign-off.',
    iconName: 'FileCheck',
    badgeText: 'Action Required'
  },
  {
    id: 7,
    key: 'repair_in_progress',
    label: 'Repair In Progress',
    shortTitle: 'In Progress',
    desc: 'OEM parts installation, seal pressure testing, and factory calibration underway.',
    iconName: 'Wrench',
    badgeText: 'Repairing'
  },
  {
    id: 8,
    key: 'completed',
    label: 'Repair Completed',
    shortTitle: 'Completed',
    desc: 'Appliance fully restored and test-cycled. 90-day parts & labor warranty active.',
    iconName: 'CheckCircle2',
    badgeText: 'Restored'
  },
  {
    id: 9,
    key: 'payment_done',
    label: 'Payment Done',
    shortTitle: 'Paid & Closed',
    desc: 'Invoice receipt cleared. Warranty certificate generated and sent to email.',
    iconName: 'Receipt',
    badgeText: 'Closed'
  }
];

export const DEMO_USER = {
  id: 'usr_demo_101',
  name: 'Saurabh Yadav',
  initials: 'SY',
  email: 'demo@apex.com',
  phone: '(877) 225-2046',
  address: '742 Evergreen Terr, Suite 4B',
  city: 'Springfield',
  zip: '62704',
  clientSince: '2026',
  clientId: 'APEX-2409',
  avatarUrl: null
};

export const INITIAL_BOOKINGS = [
  {
    id: 'AR-1024',
    userId: 'usr_demo_101',
    customerName: 'Saurabh Yadav',
    customerEmail: 'demo@apex.com',
    customerPhone: '(877) 225-2046',
    address: '742 Evergreen Terr, Suite 4B, Springfield, IL 62704',
    applianceId: 'refrigerators',
    applianceName: 'Refrigerator & Freezer',
    brand: 'Samsung',
    modelNumber: 'RF28R7351SR French Door',
    issue: 'Lower freezer compartment frost buildup & ice maker not cycling',
    date: 'Today',
    timeSlot: '11:00 AM – 2:00 PM',
    currentStep: 4, // "Technician On The Way" for instant wow factor
    statusUpdatedAt: new Date().toISOString(),
    technician: {
      name: 'Marcus Vance',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      title: 'Senior Master Appliance Specialist',
      rating: 4.98,
      completedJobs: 1420,
      phone: '(877) 225-2046 ext 412',
      vehicle: 'Ford Transit Master Van #TX-482',
      etaMinutes: 12
    },
    quote: {
      status: 'pending', // 'pending', 'approved', 'declined'
      diagnosisTitle: 'Defrost Thermistor Sensor & Bi-Metal Defrost Thermostat Failure',
      breakdown: [
        { item: 'Diagnostic Fee (Waived upon repair approval)', price: 79, waived: true },
        { item: 'OEM Samsung Defrost Sensor Probe Assembly', price: 95, waived: false },
        { item: 'Bi-Metal Defrost Thermal Cutoff Switch', price: 48, waived: false },
        { item: 'Sealed System Evaporator De-ice & Labor', price: 118, waived: false }
      ],
      subtotal: 261,
      tax: 20.88,
      total: 281.88,
      notes: 'Includes 90-day unconditional parts & labor warranty.'
    },
    timeline: [
      { step: 1, time: '08:15 AM', note: 'Diagnostic request logged' },
      { step: 2, time: '08:20 AM', note: 'Priority morning slot locked' },
      { step: 3, time: '08:35 AM', note: 'Master tech Marcus assigned with Samsung OEM inventory' },
      { step: 4, time: '09:05 AM', note: 'Van en route • Current ETA: 12 mins' }
    ]
  },
  {
    id: 'AR-0982',
    userId: 'usr_demo_101',
    customerName: 'Saurabh Yadav',
    customerEmail: 'demo@apex.com',
    customerPhone: '(877) 225-2046',
    address: '742 Evergreen Terr, Suite 4B, Springfield, IL 62704',
    applianceId: 'washers',
    applianceName: 'Washing Machine',
    brand: 'LG',
    modelNumber: 'WM4000HBA Front Load',
    issue: 'OE Drain Error code - standing water in drum',
    date: 'Last Week',
    timeSlot: '2:00 PM – 5:00 PM',
    currentStep: 9, // Completed & Paid
    statusUpdatedAt: new Date(Date.now() - 604800000).toISOString(),
    technician: {
      name: 'Elena Rostova',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      title: 'Certified Laundry Specialist',
      rating: 4.96,
      completedJobs: 980,
      phone: '(877) 225-2046 ext 105',
      vehicle: 'Mercedes Sprinter Van #IL-204',
      etaMinutes: 0
    },
    quote: {
      status: 'approved',
      diagnosisTitle: 'Foreign Object Blockage in Drain Pump Impeller Chamber',
      breakdown: [
        { item: 'Drain Pump Cleanout & Housing Gasket Replacement', price: 145, waived: false },
        { item: 'Drain Impeller Motor Testing & Recalibration', price: 45, waived: false }
      ],
      subtotal: 190,
      tax: 15.20,
      total: 205.20,
      notes: 'Test cycle completed successfully. 90-Day warranty active.'
    }
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg_welcome',
    sender: 'bot',
    text: "Hello! Welcome to Apex Appliance Repair Live Support. I'm Alex, your automated diagnostic coordinator. How can we assist you today?",
    timestamp: 'Just now',
    status: 'seen',
    quickChips: [
      'Book a repair',
      'Get a price estimate',
      'Track my order',
      'Talk to a technician'
    ]
  }
];

