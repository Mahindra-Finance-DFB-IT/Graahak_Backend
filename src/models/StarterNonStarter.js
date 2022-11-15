/*

*/
const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const StarterNonStarter= sequelize.define('StarterNonStarter', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CUSTCIF:{
        field: 'CUSTCIF',
        type: Sequelize.STRING(100),
        allowNull: true
    },
    CustomerName:{
        field: "customer_name",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    MobileNumber:{
        field: "mobile_number",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    EMIAmount:{
        field: "EMI_Amount",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    TotalOverdue:{
        field: "total_overdue",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    BounceReason:{ 
        field: "bounce_reason",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    MandateStatus:{
        field: "mandate_status",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    AlternateNumber:{
        field: "alternate_number",
        type: DataTypes.TEXT,
        allowNull: true
    },
    CustomerAddress:{
        field: "customer_address",
        type: DataTypes.TEXT,
        allowNull: true
    },
    DealerName:{
        field: "dealer_name",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    DpdBucket:{
        field: "dpd_bucket",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    StarterNonStarterFlag:{
        field: "starter_non_starter_flag",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    FosName:{
        field: "fos_name",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    FosNumber:{
        field: "fos_number", 
        type: DataTypes.STRING(100),
        allowNull: true
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

    SapCodeSm:{
        field: 'sap_code_sm',
        type: Sequelize.STRING(100),
        allowNull: true,
    },

    SapCodeRsm:{
        field:'sap_code_rsm',
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
    LoanNumber:{
        field:'loan_number',
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    LoanDate:{
        field:'loan_date',
        type: Sequelize.DATE,
        allowNull: true,
    }, 
    DisbursementAmount:{
        field:'disbursement_amount',
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
    tableName: 'starter_non_starter',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored:true,
    indexes:[
        
        {unique:false,fields:["starter_non_starter_flag"],name:"starter_non_starter_flag_index"},
        {unique:false,fields:["fos_number"],name:"fos_number_index"},
        {unique:false,fields:["sap_code_sm"],name:"sap_code_sm_index"},
        {unique:false,fields:["sap_code_rsm"],name:"sap_code_rsm_index"},
        /*{unique:false,fields:["sap_code_sm"],name:"sap_code_sm_index"},
        {unique:false,fields:["sap_code_rsm"],name:"sap_code_rsm_index"}*/
    ]
 });

 module.exports = StarterNonStarter;