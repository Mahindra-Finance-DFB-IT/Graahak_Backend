


const sequelize = require("../core/Db");
// const { Sequelize, DataTypes } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const SchemeDCG = sequelize.define('Scheme_PCG', {
OEM_NAME:{
  field: 'oem_name',
  type: Sequelize.STRING(100),     
  allowNull: true,
},
PRODUCT_GROUP_ID:{
  field: 'product_group_id',
  type: Sequelize.STRING(100),     
  allowNull: true,
},
PRODUCT_NAME:{
  field: 'product_name',
  type: Sequelize.STRING(100),     
  allowNull: true,
},
PRODUCT_CODE:{
  field: 'product_code',
  type: Sequelize.STRING(100),     
  allowNull: true,
},
CREATION_DATE:{
  field: 'creation_date',
  type: Sequelize.STRING(100),     
  allowNull: true,
},
STATUS_ID:{
  field: 'status_id',
  type: Sequelize.STRING(100),     
  allowNull: true,
},
STATUS:{
  field: 'status',
  type: Sequelize.STRING(100),     
  allowNull: true,
},
 
}, {
  tableName: 'scheme_pcgs',
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
