export const patientHistories = [
  {
    patientEmail: "jane@example.com",
    records: [
      {
        date: "2025-11-01",
        diagnosis: "Flu",
        prescriptions: [
          {
            brand: "Paracetamol",
            strengthValue: 500,
            strengthUnit: "mg",
            dosage: "Tablet",
            durationValue: 5,
            durationUnit: "days",
            frequency: 2
          },
          {
            brand: "Cough Syrup",
            strengthValue: 10,
            strengthUnit: "ml",
            dosage: "Syrup",
            durationValue: 7,
            durationUnit: "days",
            frequency: 3
          }
        ],
        doctorEmail: "john@example.com",
      },
      {
        date: "2025-11-15",
        diagnosis: "Headache",
        prescriptions: [
          {
            brand: "Ibuprofen",
            strengthValue: 200,
            strengthUnit: "mg",
            dosage: "Tablet",
            durationValue: 3,
            durationUnit: "days",
            frequency: 3
          },
          {
            brand: "Paracetamol",
            strengthValue: 500,
            strengthUnit: "mg",
            dosage: "Tablet",
            durationValue: 3,
            durationUnit: "days",
            frequency: 2
          }
        ],
        doctorEmail: "sarah@example.com",
      },
    ],
  },
  {
    patientEmail: "mike@example.com",
    records: [
      {
        date: "2025-11-05",
        diagnosis: "Allergy",
        prescriptions: [
          {
            brand: "Antihistamine",
            strengthValue: 10,
            strengthUnit: "mg",
            dosage: "Tablet",
            durationValue: 7,
            durationUnit: "days",
            frequency: 1
          },
          {
            brand: "Nasal Spray",
            strengthValue: 2,
            strengthUnit: "ml",
            dosage: "Spray",
            durationValue: 5,
            durationUnit: "days",
            frequency: 2
          }
        ],
        doctorEmail: "john@example.com",
      },
    ],
  },
];
