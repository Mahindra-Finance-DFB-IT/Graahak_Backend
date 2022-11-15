/*
*/

const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const CustomerDetails = sequelize.define('CustomerDetails', {
    /**/Id:{
        field: "id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Cif:{
        field: "cif",
        type: DataTypes.STRING(100),
        allowNull: true,
        //primaryKey: true
    },
    CustomerName:{
      field: "customer_name",
      type: DataTypes.STRING(200),
      allowNull: true
    },
    MobileNumber:{
        field: "mobile_number",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Pancard:{
        field: "pancard",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    AlternateContact:{
        field: "alternate_contact",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    LoanNumber:{
        field: "loan_number",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    LoanDate:{
        field: "loan_date",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    LoanStatus:{
        field: "loan_status",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    EMIAmount:{
        field: "emi_amount",
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalEMI:{
        field: "total_emi",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    BounceCharges:{
        field: "bounce_charges",
        type: DataTypes.FLOAT,
        allowNull: true
    },
    OtherCharges:{
        field: "other_charges",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    TotalEmiOverdue:{
        field: "total_emi_overdue",
        type: DataTypes.FLOAT,
        allowNull: true
    },
    MandateType:{
        field: "mandate_type",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    MandateId:{
        field: "mandate_id",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    MandateStatus:{
        field: "mandate_status",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    RejectReason:{
        field: "reject_reason",
        type: DataTypes.TEXT,
        allowNull: true
    },
    RejectReasonCategory:{
        field: "reject_reason_category",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    LastMandateUploadDate:{
        field: "last_mandate_upload_date",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    Bank:{
        field: "bank",
        type: DataTypes.CHAR(200),
        allowNull: true
    },
    AccountHolderName:{
        field: "account_holder_name",
        type: DataTypes.CHAR(200),
        allowNull: true
    },
    AccountType:{
        field: "account_type",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    IFSC:{
        field: "ifsc",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    AccountNumber:{
        field: "account_number",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    CustomerLimit:{
        field: "customer_limit",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    BalanceLimit:{
        field: "balance_limit",
        type: DataTypes.FLOAT,
        allowNull: true
    },
    LimitStatus:{
        field: "limit_status",
        type: DataTypes.CHAR(50),
        allowNull: true
    },
    SchemeId:{
        field: "scheme_id",
        type: DataTypes.STRING(200),
        allowNull: true
    },
    SchemeDescription:{
        field: "scheme_description",
        type: DataTypes.STRING(200),
        allowNull: true
    },
    CustomerAddress:{
        field: "customer_address",
        type: DataTypes.TEXT,
        allowNull: true
    },
    TransactionId:{
        field: "transaction_id",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    BranchCode:{
        field: "branch_code",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    BranchDescription:{
        field: "branch_description",
        type: DataTypes.STRING(200),
        allowNull: true
    },
    TransactionAmount:{
        field: "transaction_amount",
        type: DataTypes.FLOAT,
        allowNull: true
    },
    DisbursementAmount:{
        field: "disbursement_amount",
        type: DataTypes.FLOAT,
        allowNull: true
    },
    AdvanceEMI:{
        field: "advance_emi",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    NetTenure:{
        field: "net_tenure",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    FirstEMIDate:{
        field: "first_emi_date",
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    LastEMIDate:{
        field: "last_emi_date",
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    MaturityDate:{
        field: "maturity_date",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    SectorCode:{
        field: "sector_code",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    Oem:{
        field: "oem",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    ModelDescription:{
        field:"model_description",
        type: DataTypes.TEXT,
        allowNull: true
    },
    ProductSerialNumber:{
        field:"product_serial_number",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    DealerCode:{
        field:"dealer_code",
        type: DataTypes.CHAR(50),
        allowNull: true
    },
    DealerName:{
        field: "dealer_name",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    CashbackAmount:{
        field: "cashback_amount",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    CashbackStatus:{
        field: "cashback_status",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    StarterNonStarterFlag:{
        field: "starter_non_starter_flag",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    SchemeType:{
        field: "scheme_type",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    NetLoan:{
        field:"net_loan",
        type:DataTypes.FLOAT,
        allowNull: true
    },
    FosName:{
        field: "fos_name",
        type: DataTypes.CHAR(200),
        allowNull: true
    },
    FosNumber:{
        field: "fos_number",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SMName:{
        field: "sm_name",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RSMName:{
        field: "rsm_name",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SAPCodeRSM:{
        field: "sap_code_rsm",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SAPCodeSM:{
        field: "sap_code_sm",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    City:{
        field: "city",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    State:{
        field: "state",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    BounceReason:{
        field: "bounce_reason",
        type: DataTypes.TEXT,
        allowNull: true
    },
    BounceStatus:{
        field: "bounce_status",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    BounceType:{
        field: "bounce_type",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    DPDDays:{
        field: "dpd_days",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    DPDBucket:{
        field: "dpd_bucket",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    Fintype:{
        field: "fintype",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    BounceSinceLoanTaken:{
        field: "bounce_since_loan_taken",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    BlockedUnBlocked:{
        field: "blocked_unablocked",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    DateOfLastLoanTaken:{
        field: "date_of_last_loan_taken",
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    poa:{
        field: "poa",
        type: DataTypes.CHAR(100),
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
    tableName: 'customer_details',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored:true,
    indexes:[
        {unique:false,fields:["mobile_number"],name:"mobile_number_index"},
        {unique:false,fields:["pancard"],name:"pancard_index"},
        {unique:false,fields:["sap_code_sm"],name:"sap_code_sm_index"},
        {unique:false,fields:["sap_code_rsm"],name:"sap_code_rsm_index"},
        //{unique:true,fields:["mobile_number"],name:"mobile_number_unique"},
        //{unique:false,fields:["status"],name:"status_index"},
    ]
 });

 module.exports = CustomerDetails;
