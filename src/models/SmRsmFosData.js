/*
Mobile_Number	
FOS_name	
SM_Name	
RSM_name	
Location	
DOJ	
Status	
CT_Code	
Employee_Code	
Last_Day	
Branch_Code_Mapping	
Final_Locations	
State	
SM_Location	
RSM_Location	
SM_SAP_ID	
RSM_SAP_ID
*/

const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const SmRsmFosData = sequelize.define('SmRsmFosData', {
    Id: {
        field: "id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    MobileNumber:{
      field: "mobile_number",
      type: DataTypes.STRING(100),
      allowNull: false
    },
    FOSName:{
        field: "fos_name",
        type: DataTypes.STRING(200),
        allowNull: true
    },
    SMName:{
        field: "sm_name",
        type: DataTypes.STRING(200),
        allowNull: true
    },
    RSMName:{
        field: "rsm_name",
        type: DataTypes.STRING(200),
        allowNull: true
    },
    Location:{
        field: "location",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    DOJ:{
        field: "doj",
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    Status:{
        field: "status",
        type: DataTypes.STRING(50),
        allowNull: true
    },
    CTCode:{
        field: "ct_code",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    EmployeeCode:{
        field: "employee_code",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    LastDay:{
        field: "last_day",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    BranchCodeMapping:{
        field: "branch_code_mapping",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    FinalLocations:{
        field: "final_locations",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    State:{
        field: "state",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SMLocation:{
        field: "sm_location",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RSMLocation:{
        field: "rsm_location",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SMSAPId:{
        field: "sm_sap_id",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RSMSAPId:{
        field: "rsm_sap_id",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SMMobileNo:{
        field: "sm_mobile_no",
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RSMMobileNo:{
        field: "rsm_mobile_no",
        type: DataTypes.STRING(100),
        allowNull: true
    }
  }, {
    tableName: 'sm_rsm_fos_data',
    timestamps: false,
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    underscored:true,
    indexes:[
            {unique:false,fields:["sm_sap_id"],name:"sm_sap_id_index"},
            {unique:false,fields:["rsm_sap_id"],name:"rsm_sap_id_index"},
            {unique:true,fields:["mobile_number"],name:"mobile_number_unique"},
            {unique:false,fields:["status"],name:"status_index"},
        ]
 });

 module.exports = SmRsmFosData;
