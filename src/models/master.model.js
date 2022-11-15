const sequelize = require("../core/Db");
// const { Sequelize, DataTypes } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const SchemeDCG = sequelize.define('Scheme_master', {
 
 OEM:{
    field: 'oem',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },

  SCHEME_ID:{
    field: 'scheme_id',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  SCHEME_DESCRIPTION:{
    field: 'scheme_description',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  TENURE :{
    field: 'tenure',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
 
  Scheme_IRR :{
    field: 'scheme_irr',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  
  ROI :{
    field: 'roi',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },

  ADVANCE_EMI :{
    field: 'advance_emi',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },

  DBD :{
    field: 'dbd',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },

SCHEME_START_DATE :{
  field: 'scheme_start_Date',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

SCHEME_END_DATE :{
  field: 'scheme_end_date',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

MAX_AMOUNT :{
  field: 'max_amount',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

MIN_AMOUNT :{
  field: 'min_amount',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

PROCESSING_FEE :{
  field: 'processing_fee',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

PORTAL_DESCRIPTION :{
  field: 'portal_description',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

Action :{
  field: 'action',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

STATUS :{
  field: 'status',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

SPECIAL_SCHEME_FLAG :{
  field: 'special_scheme_flag',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

IS_PF_SCHEME :{
  field: 'is_pf_scheme',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

PROCESSING_FEE_PERCENTAGE :{
  field: 'processing_fee_percentage',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

MDR_PERCENTAGE :{
  field: 'mdr_percentage',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

MDR_AMOUNT :{
  field: 'mdr_amount',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

MBD_PERCENTAGE :{
  field: 'mbd_percentage',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

MBD_AMOUNT :{
  field: 'mbd_amount',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

PRODUCT_GROUP_CODE :{
  field: 'product_group_code',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

ACTION_SPM_FILE :{
  field: 'action_spm_file',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

STATUS_SPM_FILE :{
  field: 'status_spm_file',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

DEALER_GROUP_CODE :{
  field: 'dealer_group_code',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

ACTION_SDM_FILE :{
  field: 'action_sdm_file',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

STATUS_SDM_FILE :{
  field: 'status_sdm_file',
  type: Sequelize.STRING(100),     
  allowNull: true,
},

}, {
  tableName: 'scheme_masters',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,  
  indexes: [
    // {unique:false,fields:["mobile_number"],name:"mobile_number_index"},
    // {unique:false,fields:["pancard"],name:"pancard_index"},
    // {unique:false,fields:["sap_code_sm"],name:"sap_code_sm_index"},
    // {unique:false,fields:["sap_code_rsm"],name:"sap_code_rsm_index"},
    //{unique:true,fields:["mobile_number"],name:"mobile_number_unique"},
    //{unique:false,fields:["status"],name:"status_index"},
  ]
});

module.exports = SchemeDCG;
