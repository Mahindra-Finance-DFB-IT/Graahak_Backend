const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const ScheduleData = sequelize.define('ScheduleData', {
    Id:{
        field: "id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    LastSchedule:{
        field: "last_schedule",
        type: DataTypes.DATE,
        allowNull: true
    },
    CountAllNAbndCases:{
        field: "count_all_n_abnd_cases",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    CountMandateCases:{
        field: "count_mandate_cases",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    CountCustomerDetails:{
        field: "count_customer_details",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    CountSmRsmFosData:{
        field: "count_sm_rsm_fos_data",
        type: DataTypes.INTEGER,
        allowNull: true
    },
    CountStarterNonStarter:{
        field: "count_starter_non_starter_data",
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'schedule_data',
    timestamps: false,
    underscored:true,
    indexes:[
    ]
 });

module.exports = ScheduleData;