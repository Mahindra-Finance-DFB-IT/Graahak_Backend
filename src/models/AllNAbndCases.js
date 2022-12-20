/*

*/

const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const AllNAbndCases= sequelize.define('AllNAbndCases', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Custshrtname:{
        field: 'custshrtname',
        type: Sequelize.STRING(100),     
        allowNull: true,
    },
    CustomerNumber:{
        field: 'customer_number',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    AlternateNumber:{
        field: 'alternate_number',
        type: Sequelize.STRING(100),
        allowNull: true
    },
    Finamount:{
        field: 'finamount',
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    Deductfeedisb:{
        field: 'deductfeedisb',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Downpayment:{
        field: 'downpayment',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    DisbursementAmt:{
        field: 'disbursement_amt',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Limitsanctioned:{
        field: 'limitsanctioned',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Utilisedlimit:{
        field: 'utilisedlimit',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    LoanNumber:{
        field:'loan_number',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    DisbursementDt:{
        field: 'disbursement_dt',
        type: Sequelize.DATE,
        allowNull: true,
    },
    DealerName:{
        field: 'dealer_name',
        type: Sequelize.STRING(100),
        allowNull: true
    },
    Fincategory:{
        field: 'fincategory',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Fintype:{
        field: 'fintype',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    FosName:{
        field: 'fos_name',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    FosNumber:{
        field: 'fos_number',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    SapCodeSm:{
        field: 'sap_code_sm',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    SmName:{
        field: 'sm_name',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    SmNumber:{
        field: 'sm_number',
        type: Sequelize.STRING(100),
        allowNull: true,                
    },
    SapCodeRsm:{
        field:'sap_code_rsm',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    RsmName:{
        field:'rsm_name',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    RsmNumber:{
        field:'rsm_number',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    State:{
        field:'state',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    City:{
        field:'city',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Closingstatus:{
        field:'closingstatus',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Finisactive:{
        field:'finisactive',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    EmiAmount:{
        field:'emi_amount',
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    CcLeadId:{
        field:'cc_lead_id',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CcCrmStatusName:{
        field:'cc_crmstatusname',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Createdon:{
        field:'createdon',
        type: Sequelize.DATE,
        allowNull: true,
    },
    CustId:{
        field:'custid',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    Custcif:{
        field:'custcif',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CrmFosName:{
        field:'crm_fos_name',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CrmRsmName:{
        field:'crm_rsm_name',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CrmSmName:{
        field:'crm_sm_name',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CrmSmNumber:{
        field:'crm_sm_number',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CrmRsmNumber:{
        field:'crm_rsm_number',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CrmRsmSapid:{
        field:'crm_rsm_sapid',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CrmSmSapid:{
        field:'crm_sm_sapid',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CcsMobilenumber:{
        field:'ccs_mobilenumber',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    TransactionDone:{
        field:'transaction_done',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    LoanCnt:{
        field:'loan_cnt',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    CreatedAt:{
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW()
    },
    UpdatedAt:{
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: true
    }    
}, {
    tableName: 'all_n_abnd_cases',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored:true,
    indexes:[
        
        {unique:false,fields:["fos_number"],name:"fos_number_index"},
        {unique:false,fields:["sap_code_sm"],name:"sap_code_sm_index"},
        {unique:false,fields:["sap_code_rsm"],name:"sap_code_rsm_index"},
        /*{unique:false,fields:["pancard"],name:"pancard_index"},
        {unique:false,fields:["sap_code_sm"],name:"sap_code_sm_index"},
        {unique:false,fields:["sap_code_rsm"],name:"sap_code_rsm_index"}*/
    ]
 });

module.exports = AllNAbndCases;