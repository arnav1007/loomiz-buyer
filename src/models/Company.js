// src/models/Company.js
import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  // Person of Contact
  contactPersonName: { 
    type: String, 
    required: [true, 'Contact person name is required'] 
  },
  contactPhoneNo: { 
    type: String, 
    required: [true, 'Contact phone number is required'] 
  },
  contactEmail: { 
    type: String, 
    required: [true, 'Contact email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  // Company Profile
  registeredCompanyName: { 
    type: String, 
    required: [true, 'Registered company name is required'] 
  },
  gstTaxId: { 
    type: String, 
    required: [true, 'GST/Tax ID is required'] 
  },
  taxRegistrationCert: { 
    type: String, 
    required: [true, 'Tax registration certificate is required'] 
  },
  businessNo: { 
    type: String, 
    required: [true, 'Business number is required'] 
  },
  countryOfIncorporation: { 
    type: String, 
    required: [true, 'Country of incorporation is required'] 
  },

  // Address Detail
  address: { 
    type: String, 
    required: [true, 'Address is required'] 
  },
  addressState: { 
    type: String, 
    required: [true, 'State is required'] 
  },
  addressCountry: { 
    type: String, 
    required: [true, 'Country is required'] 
  },
  addressPostcode: { 
    type: String, 
    required: [true, 'Postcode is required'] 
  },

  // Financial Detail
  bankBranchName: { 
    type: String, 
    required: [true, 'Bank branch name is required'] 
  },
  bankState: { 
    type: String, 
    required: [true, 'Bank state is required'] 
  },
  bankCountry: { 
    type: String, 
    required: [true, 'Bank country is required'] 
  },
  bankPostcode: { 
    type: String, 
    required: [true, 'Bank postcode is required'] 
  },
  bankCertificate: { 
    type: String 
  },
  importExportLicense: { 
    type: String 
  }
}, { timestamps: true });

// Check if the model is already defined to prevent overwriting during hot reloads in development
export default mongoose.models.Company || mongoose.model('Company', CompanySchema);