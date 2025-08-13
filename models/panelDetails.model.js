import mongoose from "mongoose";

const panelDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'MotherPanel'
  },
  website_name: {
    type: String,
    required: true,
    trim: true
  },
  website_url: {
    type: String,
    required: true,
    trim: true
  },
  website_logo: {
    type: String,
    default: ""
  },
  website_logo_variant: { 
    type: String, 
    default: "Logo" 
  },
  website_logo_second: {
    type: String,
    default: ""
  },
  website_logo_variant_second: { 
    type: String, 
    default: "Logo" 
  },
  website_logo_web: {
    type: String,
    default: ""
  },
  website_logo_web_variant: { 
    type: String, 
    default: "LoginImage" 
  },
  website_logo_mobile: {
    type: String,
    default: ""
  },
  website_logo_mobile_variant: { 
    type: String, 
    default: "MloginImage" 
  },
  website_favicon: {
    type: String,
    default: ""
  },
  website_favicon_variant: { 
    type: String, 
    default: "Favicon" 
  },
  refresh_endpoint_url: {
    type: String,
    default: ""
  },
  website_version: {
    type:Number,
    default:0
  }
}, {
  timestamps: true
});

const PanelDetails = mongoose.model('PanelDetails', panelDetailsSchema);

export default PanelDetails;
