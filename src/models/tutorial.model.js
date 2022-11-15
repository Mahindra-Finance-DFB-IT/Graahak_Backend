

const sequelize = require("../core/Db");
// const { Sequelize, DataTypes } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const SchemeDCG = sequelize.define('Scheme_DCG', {
  OEM_NAME:{
    field: 'oem_name',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  POS_ID:{
    field: 'pos_id',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  STORE_ID:{
    field: 'store_id',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  MERCHANT_NAME:{
    field: 'merchant_name',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  STATUS:{
    field: 'status',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  DEALER_CODE:{
    field: 'dealer_code',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },
  DEALER_CODE_ID:{
    field: 'dealer_code_id',
    type: Sequelize.STRING(100),     
    allowNull: true,
  },

}, {
  tableName: 'scheme_dcgs',
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
