const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const MandateCases = sequelize.define('MandateCases', {
    Id:{
        field: "id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CustomerName:{
        field: "customer_name",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SourceFlag:{
      field: "source_flag",
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CustomerId:{
        field: "customer_id",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    MobileNumber:{
        field: "mobile_number",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    LoanLimit:{
        field: "loan_limit",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RejectionType:{
        field: "rejection_type",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RejectionReason:{
        field: "rejection_reason",
        type: DataTypes.TEXT,
        allowNull: true
    },
    Bank:{
        field: "bank",
        type: DataTypes.STRING(50),
        allowNull: true
    },
    IFSC:{
        field: "ifsc",
        type: DataTypes.STRING(50),
        allowNull: true
    },
    AccountNumber:{
        field: "account_number",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    LastMandateUploadDate:{
        field: "last_mandate_upload_date",
        type: DataTypes.DATE,
        allowNull: true
    },
    FinType:{
        field:"fintype",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    VasFos:{
        field:"vas_fos",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    VasFosNumber:{
        field: "vas_fos_number",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    VasSM:{
        field: "vas_sm",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    VasRSM:{
        field: "vas_rsm",
        type: DataTypes.STRING(100),
        allowNull: true
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
    VasDealer:{
        field: "vas_dealer",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Tid:{
        field:"tid",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    VasTid:{
        field:"vas_tid",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Finreference:{
        field:"finreference",
        type: DataTypes.STRING(100),
        allowNull: true
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
    tableName: 'mandate_cases',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored:true,
    indexes:[
        
        {unique:false,fields:["rejection_type"],name:"rejection_type_index"},
        {unique:false,fields:["last_mandate_upload_date"],name:"last_mandate_upload_date_index"},
        {unique:false,fields:["vas_fos_number"],name:"vas_fos_number_index"},
        //{unique:false,fields:["sap_code_rsm"],name:"sap_code_rsm_index"}*/
    ]
 });

 module.exports = MandateCases;
