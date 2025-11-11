export type LinearityRow = {
  nominalValue: string
  reading: string
  error: string
  allowableError: string
  withinTolerance: string
}

export type EccentricityPositions = {
  displayedValue: string
  deviation: string
}

export type EccentricityData = {
  testWeight: string
  positions: {
    center: EccentricityPositions
    leftFront: EccentricityPositions
    leftRear: EccentricityPositions
    rightRear: EccentricityPositions
    rightFront: EccentricityPositions
  }
  maximumDeviation: string
  allowableDeviation: string
  withinTolerance: string
}

export type RepeatabilityMeasurement = {
  withoutTestWeight: string
  withTestWeight: string
  asFound: string
}

export type RepeatabilityData = {
  testWeight: string
  measurements: RepeatabilityMeasurement[]
  deviation: string
  allowableError: string
  withinTolerance: string
}

export type UncertaintyTableOne = Record<'xi' | '0 kg' | '20 kg' | '50 kg' | '70 kg', string>
export type UncertaintyTableTwo = Record<'xi' | '100 kg' | '120 kg' | '150 kg' | 'N/A', string>

export type UncertaintyData = {
  tableOne: UncertaintyTableOne
  tableTwo: UncertaintyTableTwo
}

export interface Device {
  id: string
  deviceName: string
  manufacturer: string
  model: string
  serialNumber: string
  tagNumber?: string
  terminalModel?: string
  maxCapacity?: string
  readability?: string
  verificationValue?: string
  location?: string
  customer: string
  linearityRows: LinearityRow[]
  eccentricityData: EccentricityData
  repeatabilityData: RepeatabilityData
  uncertaintyData: UncertaintyData
}

export const defaultDevices: Device[] = [
  {
    id: 'device-001',
    deviceName: 'Analytical Balance ABT125',
    manufacturer: 'Mettler Toledo',
    model: 'ABT125',
    serialNumber: 'ABT125-2025-001',
    tagNumber: 'LAB-AB-01',
    terminalModel: 'TouchPro-20',
    maxCapacity: '125 g',
    readability: '0.0001 g',
    verificationValue: '0.0002 g',
    location: 'Analytical Laboratory',
    customer: 'Amnel Pharmaceutical Pvt Ltd',
    linearityRows: [
      {
        nominalValue: '0 g',
        reading: '0.0000 g',
        error: '0.0000 g',
        allowableError: '±0.0002 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '10 g',
        reading: '9.9999 g',
        error: '-0.0001 g',
        allowableError: '±0.0003 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '25 g',
        reading: '25.0001 g',
        error: '0.0001 g',
        allowableError: '±0.0004 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '50 g',
        reading: '50.0002 g',
        error: '0.0002 g',
        allowableError: '±0.0005 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '100 g',
        reading: '100.0003 g',
        error: '0.0003 g',
        allowableError: '±0.0006 g',
        withinTolerance: 'Yes'
      }
    ],
    eccentricityData: {
      testWeight: '50 g',
      positions: {
        center: { displayedValue: '50.000 g', deviation: '0.000 g' },
        leftFront: { displayedValue: '49.999 g', deviation: '-0.001 g' },
        leftRear: { displayedValue: '50.001 g', deviation: '0.001 g' },
        rightRear: { displayedValue: '49.998 g', deviation: '-0.002 g' },
        rightFront: { displayedValue: '50.000 g', deviation: '0.000 g' }
      },
      maximumDeviation: '0.002 g',
      allowableDeviation: '0.003 g',
      withinTolerance: 'Yes'
    },
    repeatabilityData: {
      testWeight: '50 g',
      measurements: [
        { withoutTestWeight: '0.000 g', withTestWeight: '50.000 g', asFound: '50.000 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '50.001 g', asFound: '50.001 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '49.999 g', asFound: '49.999 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '50.000 g', asFound: '50.000 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '50.000 g', asFound: '50.000 g' }
      ],
      deviation: '0.001 g',
      allowableError: '0.003 g',
      withinTolerance: 'Yes'
    },
    uncertaintyData: {
      tableOne: {
        xi: '±0.0002 g',
        '0 kg': '±0.0001 g',
        '20 kg': '±0.0002 g',
        '50 kg': '±0.0003 g',
        '70 kg': '±0.0004 g'
      },
      tableTwo: {
        xi: '±0.0005 g',
        '100 kg': '±0.0006 g',
        '120 kg': '±0.0007 g',
        '150 kg': '±0.0008 g',
        'N/A': '—'
      }
    }
  },
  {
    id: 'device-002',
    deviceName: 'Industrial Platform Scale IPS600',
    manufacturer: 'Avery Weigh-Tronix',
    model: 'IPS600',
    serialNumber: 'IPS600-2025-014',
    tagNumber: 'PLT-02',
    terminalModel: 'XT-Console',
    maxCapacity: '600 kg',
    readability: '0.05 kg',
    verificationValue: '0.1 kg',
    location: 'Packaging Bay',
    customer: 'Globex Laboratory Solutions',
    linearityRows: [
      {
        nominalValue: '0 kg',
        reading: '0.000 kg',
        error: '0.000 kg',
        allowableError: '±0.050 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '100 kg',
        reading: '99.980 kg',
        error: '-0.020 kg',
        allowableError: '±0.060 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '250 kg',
        reading: '249.990 kg',
        error: '-0.010 kg',
        allowableError: '±0.075 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '400 kg',
        reading: '400.030 kg',
        error: '0.030 kg',
        allowableError: '±0.090 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '600 kg',
        reading: '600.040 kg',
        error: '0.040 kg',
        allowableError: '±0.110 kg',
        withinTolerance: 'Yes'
      }
    ],
    eccentricityData: {
      testWeight: '400 kg',
      positions: {
        center: { displayedValue: '400.000 kg', deviation: '0.000 kg' },
        leftFront: { displayedValue: '399.970 kg', deviation: '-0.030 kg' },
        leftRear: { displayedValue: '400.020 kg', deviation: '0.020 kg' },
        rightRear: { displayedValue: '400.010 kg', deviation: '0.010 kg' },
        rightFront: { displayedValue: '399.990 kg', deviation: '-0.010 kg' }
      },
      maximumDeviation: '0.030 kg',
      allowableDeviation: '0.060 kg',
      withinTolerance: 'Yes'
    },
    repeatabilityData: {
      testWeight: '400 kg',
      measurements: [
        { withoutTestWeight: '0.000 kg', withTestWeight: '400.000 kg', asFound: '400.000 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '399.980 kg', asFound: '399.980 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '400.010 kg', asFound: '400.010 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '399.990 kg', asFound: '399.990 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '400.005 kg', asFound: '400.005 kg' }
      ],
      deviation: '0.020 kg',
      allowableError: '0.080 kg',
      withinTolerance: 'Yes'
    },
    uncertaintyData: {
      tableOne: {
        xi: '±0.020 kg',
        '0 kg': '±0.015 kg',
        '20 kg': '±0.018 kg',
        '50 kg': '±0.020 kg',
        '70 kg': '±0.025 kg'
      },
      tableTwo: {
        xi: '±0.030 kg',
        '100 kg': '±0.035 kg',
        '120 kg': '±0.040 kg',
        '150 kg': '±0.050 kg',
        'N/A': '—'
      }
    }
  },
  {
    id: 'device-003',
    deviceName: 'Moisture Analyzer XM200',
    manufacturer: 'Sartorius',
    model: 'XM200',
    serialNumber: 'XM200-2025-045',
    tagNumber: 'MA-03',
    terminalModel: 'XM-Touch',
    maxCapacity: '200 g',
    readability: '0.001 g',
    verificationValue: '0.002 g',
    location: 'Quality Control Lab',
    customer: 'Vertex Pharmaceuticals LLP',
    linearityRows: [
      { nominalValue: '0 g', reading: '0.000 g', error: '0.000 g', allowableError: '±0.001 g', withinTolerance: 'Yes' },
      {
        nominalValue: '20 g',
        reading: '19.999 g',
        error: '-0.001 g',
        allowableError: '±0.001 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '50 g',
        reading: '49.999 g',
        error: '-0.001 g',
        allowableError: '±0.002 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '100 g',
        reading: '100.001 g',
        error: '0.001 g',
        allowableError: '±0.002 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '150 g',
        reading: '150.002 g',
        error: '0.002 g',
        allowableError: '±0.003 g',
        withinTolerance: 'Yes'
      }
    ],
    eccentricityData: {
      testWeight: '100 g',
      positions: {
        center: { displayedValue: '100.000 g', deviation: '0.000 g' },
        leftFront: { displayedValue: '99.998 g', deviation: '-0.002 g' },
        leftRear: { displayedValue: '100.002 g', deviation: '0.002 g' },
        rightRear: { displayedValue: '99.999 g', deviation: '-0.001 g' },
        rightFront: { displayedValue: '100.001 g', deviation: '0.001 g' }
      },
      maximumDeviation: '0.002 g',
      allowableDeviation: '0.003 g',
      withinTolerance: 'Yes'
    },
    repeatabilityData: {
      testWeight: '100 g',
      measurements: [
        { withoutTestWeight: '0.000 g', withTestWeight: '100.000 g', asFound: '100.000 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '99.999 g', asFound: '99.999 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '100.001 g', asFound: '100.001 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '100.000 g', asFound: '100.000 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '100.000 g', asFound: '100.000 g' }
      ],
      deviation: '0.001 g',
      allowableError: '0.002 g',
      withinTolerance: 'Yes'
    },
    uncertaintyData: {
      tableOne: {
        xi: '±0.001 g',
        '0 kg': '±0.0008 g',
        '20 kg': '±0.0009 g',
        '50 kg': '±0.0010 g',
        '70 kg': '±0.0012 g'
      },
      tableTwo: {
        xi: '±0.0015 g',
        '100 kg': '±0.0018 g',
        '120 kg': '±0.0020 g',
        '150 kg': '±0.0025 g',
        'N/A': '—'
      }
    }
  },
  {
    id: 'device-004',
    deviceName: 'Bench Scale Titan500',
    manufacturer: 'Essae-Teraoka',
    model: 'Titan500',
    serialNumber: 'TIT500-2025-088',
    tagNumber: 'BEN-04',
    terminalModel: 'Titan Console',
    maxCapacity: '500 kg',
    readability: '0.02 kg',
    verificationValue: '0.04 kg',
    location: 'Finished Goods Warehouse',
    customer: 'Everest Biotech Pvt Ltd',
    linearityRows: [
      {
        nominalValue: '0 kg',
        reading: '0.000 kg',
        error: '0.000 kg',
        allowableError: '±0.030 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '80 kg',
        reading: '79.990 kg',
        error: '-0.010 kg',
        allowableError: '±0.040 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '200 kg',
        reading: '200.015 kg',
        error: '0.015 kg',
        allowableError: '±0.050 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '350 kg',
        reading: '349.980 kg',
        error: '-0.020 kg',
        allowableError: '±0.060 kg',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '500 kg',
        reading: '500.030 kg',
        error: '0.030 kg',
        allowableError: '±0.070 kg',
        withinTolerance: 'Yes'
      }
    ],
    eccentricityData: {
      testWeight: '300 kg',
      positions: {
        center: { displayedValue: '300.000 kg', deviation: '0.000 kg' },
        leftFront: { displayedValue: '299.990 kg', deviation: '-0.010 kg' },
        leftRear: { displayedValue: '300.015 kg', deviation: '0.015 kg' },
        rightRear: { displayedValue: '299.985 kg', deviation: '-0.015 kg' },
        rightFront: { displayedValue: '300.005 kg', deviation: '0.005 kg' }
      },
      maximumDeviation: '0.015 kg',
      allowableDeviation: '0.050 kg',
      withinTolerance: 'Yes'
    },
    repeatabilityData: {
      testWeight: '300 kg',
      measurements: [
        { withoutTestWeight: '0.000 kg', withTestWeight: '300.000 kg', asFound: '300.000 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '299.990 kg', asFound: '299.990 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '300.010 kg', asFound: '300.010 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '299.995 kg', asFound: '299.995 kg' },
        { withoutTestWeight: '0.000 kg', withTestWeight: '300.005 kg', asFound: '300.005 kg' }
      ],
      deviation: '0.010 kg',
      allowableError: '0.050 kg',
      withinTolerance: 'Yes'
    },
    uncertaintyData: {
      tableOne: {
        xi: '±0.015 kg',
        '0 kg': '±0.013 kg',
        '20 kg': '±0.015 kg',
        '50 kg': '±0.018 kg',
        '70 kg': '±0.020 kg'
      },
      tableTwo: {
        xi: '±0.025 kg',
        '100 kg': '±0.028 kg',
        '120 kg': '±0.030 kg',
        '150 kg': '±0.035 kg',
        'N/A': '—'
      }
    }
  },
  {
    id: 'device-005',
    deviceName: 'Precision Balance PG500',
    manufacturer: 'Shimadzu',
    model: 'PG500',
    serialNumber: 'PG500-2025-132',
    tagNumber: 'RND-05',
    terminalModel: 'STX-Display',
    maxCapacity: '500 g',
    readability: '0.001 g',
    verificationValue: '0.002 g',
    location: 'Research & Development Lab',
    customer: 'Zenith Industrial Solutions',
    linearityRows: [
      { nominalValue: '0 g', reading: '0.000 g', error: '0.000 g', allowableError: '±0.001 g', withinTolerance: 'Yes' },
      {
        nominalValue: '50 g',
        reading: '49.999 g',
        error: '-0.001 g',
        allowableError: '±0.001 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '150 g',
        reading: '149.999 g',
        error: '-0.001 g',
        allowableError: '±0.002 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '300 g',
        reading: '300.001 g',
        error: '0.001 g',
        allowableError: '±0.002 g',
        withinTolerance: 'Yes'
      },
      {
        nominalValue: '500 g',
        reading: '500.002 g',
        error: '0.002 g',
        allowableError: '±0.003 g',
        withinTolerance: 'Yes'
      }
    ],
    eccentricityData: {
      testWeight: '250 g',
      positions: {
        center: { displayedValue: '250.000 g', deviation: '0.000 g' },
        leftFront: { displayedValue: '249.998 g', deviation: '-0.002 g' },
        leftRear: { displayedValue: '250.002 g', deviation: '0.002 g' },
        rightRear: { displayedValue: '249.997 g', deviation: '-0.003 g' },
        rightFront: { displayedValue: '250.001 g', deviation: '0.001 g' }
      },
      maximumDeviation: '0.003 g',
      allowableDeviation: '0.004 g',
      withinTolerance: 'Yes'
    },
    repeatabilityData: {
      testWeight: '250 g',
      measurements: [
        { withoutTestWeight: '0.000 g', withTestWeight: '250.000 g', asFound: '250.000 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '249.999 g', asFound: '249.999 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '250.001 g', asFound: '250.001 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '250.000 g', asFound: '250.000 g' },
        { withoutTestWeight: '0.000 g', withTestWeight: '249.998 g', asFound: '249.998 g' }
      ],
      deviation: '0.002 g',
      allowableError: '0.003 g',
      withinTolerance: 'Yes'
    },
    uncertaintyData: {
      tableOne: {
        xi: '±0.001 g',
        '0 kg': '±0.0009 g',
        '20 kg': '±0.0010 g',
        '50 kg': '±0.0011 g',
        '70 kg': '±0.0013 g'
      },
      tableTwo: {
        xi: '±0.0018 g',
        '100 kg': '±0.0020 g',
        '120 kg': '±0.0022 g',
        '150 kg': '±0.0025 g',
        'N/A': '—'
      }
    }
  }
]
