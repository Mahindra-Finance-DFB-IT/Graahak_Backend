const { Sequelize } = require('sequelize');
//const { DB } = require('../Config');
const logger = require('../../core/Logger');
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const CustomerDetails = require('../../models/CustomerDetails');
const AllNAbndCases = require('../../models/AllNAbndCases');
const StarterNonStarter = require('../../models/StarterNonStarter');
const MandateCases = require('../../models/MandateCases');
const SmRsmFosData = require('../../models/SmRsmFosData');
const ScheduleData = require('../../models/ScheduleData');
const SchemeDCG = require('../../models/tutorial.model')


//const path = require('path');
const sequelize = new Sequelize({
    dialect: 'mssql',
    host: "192.168.58.111",
    username: "API_USERS",
    password: "API@2022",
    database: "DFB_DEV",
    logging: (log) => {
        logger.debug(log);
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 300000,
        idle: 10000
    },
    //timezone: "+05:30",
    typeValidation: true,
    logQueryParameters: true
});


async function checkDbLink(){
    try {
        await sequelize.authenticate();     
        console.log('Connection has been established successfully.');
        return true;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
      }
}

async function processCustomerData() {
    try {
        /*
        */
        const data = await sequelize.query(`
        SELECT
        CIF as cif,
        Customer_Name as customer_name,
        Mobile_Number as mobile_number,
        Pancard as pancard,
        Alternate_Contact as alternate_contact,
        Loan_Number as loan_number,
        Loan_Date as loan_date,
        LOAN_STATUS as loan_status,
        EMI_Amount as emi_amount,
        Total_EMI as total_emi,
        BOUNCE_CHARGES as bounce_charges,
        OTHER_CHARGES as other_charges,
        TOTAL_EMI_OVERDUE as total_emi_overdue,
        MANDATE_TYPE as mandate_type,
        Mandate_ID as mandate_id,
        Mandate_Status as mandate_status,
        REJECT_REASON as reject_reason,
        "Reject Reason Category" as reject_reason_category,
        LAST_MANDATE_UPLOAD_DATE as last_mandate_upload_date,
        BANK as bank,
        "ACCOUNT HOLDER NAME" as account_holder_name,
        "ACCOUNT TYPE" as account_type,
        IFSC as ifsc,
        "ACCOUNT NUMBER" as account_number,
        CUSTOMER_LIMIT as customer_limit,
        BALANCE_LIMIT as balance_limit,
        LIMIT_STATUS as limit_status,
        Scheme_ID as scheme_id,
        Scheme_Description as scheme_description,
        CUSTOMER_ADDRESS as customer_address,
        Transaction_ID as transaction_id,
        Branch_Code as branch_code,
        Branch_Description as branch_description,
        Transaction_Amount as transaction_amount,
        Disbursement_Amount as disbursement_amount,
        Advance_EMI as advance_emi,
        Net_Tenure as net_tenure,
        First_EMI_date as first_emi_date,
        Last_EMI_date as last_emi_date,
        Maturity_Date as maturity_date,
        Sector_Code as sector_code,
        OEM as oem,
        Model_Description as model_description,
        Product_Serial_Number as product_serial_number,
        Dealer_Code as dealer_code,
        Dealer_Name as dealer_name,
        Cashback_Amount as cashback_amount,
        Cashback_Status as cashback_status,
        STARTER_NON_STARTER_FLAG as starter_non_starter_flag,
        Scheme_Type as scheme_type,
        Net_Loan as net_loan,
        FOS_NAME as fos_name,
        FOS_NUMBER as fos_number,
        SM_NAME as sm_name,
        RSM_NAME as rsm_name,
        SAP_CODE_RSM as sap_code_rsm,
        SAP_CODE_SM as sap_code_sm,
        CITY as city,
        STATE as state,
        BOUNCE_REASON as bounce_reason,
        BOUNCE_STATUS as bounce_status,
        BOUNCE_TYPE as bounce_type,
        DPD_DAYS as dpd_days,
        DPD_BUCKET as dpd_bucket,
        FINTYPE as fintype,
        BOUNCE_SINCE_LOAN_TAKEN as bounce_since_loan_taken,
        "BLOCKED/UNBLOCKED" as blocked_unablocked,
        DATE_OF_LAST_LOAN_TAKEN as date_of_last_loan_taken,
        POA as poa
        FROM CUSTOMER_DATA
             `, {
            raw: true,
            type: QueryTypes.SELECT,
            model: CustomerDetails,
            mapToModel: true,
        });
        if(data.length >0){
            await CustomerDetails.truncate({
                force: true,
            });
            
            for (let _d of data) {
                await CustomerDetails.create(_d,{
                    ignoreDuplicates: true,
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
}


async function processCustomerFosData() {
    /*
    ALTER TABLE `all_n_abnd_cases`
    CHANGE `createdon` `createdon` datetime NULL AFTER `cc_crmstatusname`;

    ALTER TABLE `all_n_abnd_cases`
    ADD `crm_fos_name` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `custcif`,
    ADD `ccs_mobilenumber` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `crm_fos_name`,
    ADD `transaction_done` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `ccs_mobilenumber`,
    ADD `loan_cnt` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `transaction_done`;

    ALTER TABLE `all_n_abnd_cases`
CHANGE `disbursement_dt` `disbursement_dt` datetime NULL AFTER `loan_number`;
    */
    try {
        await AllNAbndCases.truncate({
            force: true,
        });
        const data = await sequelize.query(`
                SELECT
                    CUSTSHRTNAME as custshrtname,
                    CUSTOMER_NUMBER as customer_number,
                    Alternate_Number as alternate_number,
                    FINAMOUNT as finamount,
                    DEDUCTFEEDISB as deductfeedisb,
                    DOWNPAYMENT as downpayment,
                    DISBURSEMENT_AMT as disbursement_amt,
                    LIMITSANCTIONED as limitsanctioned,
                    UTILISEDLIMIT as utilisedlimit,
                    LOAN_NUMBER as loan_number,
                    DISBURSEMENT_DT as disbursement_dt,
                    DEALER_NAME as dealer_name,
                    FINCATEGORY as fincategory,
                    FINTYPE as fintype,
                    FOS_Name as fos_name,
                    FOS_Number as fos_number,
                    SAP_CODE_SM as sap_code_sm,
                    SM_NAME as sm_name,
                    SM_NUMBER as sm_number,
                    SAP_CODE_RSM as sap_code_rsm,
                    RSM_NAME as rsm_name,
                    RSM_NUMBER as rsm_number,
                    STATE as state,
                    CITY as city,
                    CLOSINGSTATUS as closingstatus,
                    FINISACTIVE as finisactive,
                    EMI_AMOUNT as emi_amount,
                    CCS_LEAD_ID as cc_lead_id,
                    CCS_CRMSTATUSNAME as cc_crmstatusname,
                    CREATEDON as createdon,
                    CUSTID as custid,
                    CUSTCIF as custcif,
                    CRM_FOS_NAME as crm_fos_name,
                    CCS_MOBILENUMBER as ccs_mobilenumber,
                    TRANSACTION_DONE as transaction_done,
                    LOAN_CNT as loan_cnt
                FROM CUSTOMER_FOS_DATA WHERE CUSTSHRTNAME is not null`, {
            raw: true,
            type: QueryTypes.SELECT,
            model: AllNAbndCases,
            mapToModel: true,
        });
        for (let _d of data) {
            await AllNAbndCases.create(_d);
        }
    } catch (e) {
        console.log(e);
    }
}

async function processStarterAndNonStarterData() {
    try {
        await StarterNonStarter.truncate({
            force: true,
        });
        const data = await sequelize.query(`
            SELECT
                CUSTCIF,
                Customer_Name as customer_name,
                Mobile_Number as mobile_number,
                EMI_Amount as EMI_Amount,
                TOTAL_OVERDUE as total_overdue,
                BOUNCE_REASON as bounce_reason,
                MANDATE_STATUS as mandate_status,
                Alternate_Number as alternate_number,
                CUSTOMER_ADDRESS as customer_address,
                Dealer_Name as dealer_name,
                DPD_BUCKET as dpd_bucket,
                STARTER_NON_STARTER_FLAG as starter_non_starter_flag,
                FOS_Name as fos_name,
                FOS_Number as fos_number,
                SM_NAME as sm_name,
                SM_NUMBER as sm_number,
                RSM_NAME as rsm_name,
                RSM_NUMBER as rsm_number,
                SAP_CODE_SM as sap_code_sm,
                SAP_CODE_RSM as sap_code_rsm,
                STATE as state,
                CITY as city,
                Loan_Number as loan_number,
                Loan_Date as loan_date,
                Disbursement_Amount as disbursement_amount
            FROM STARTER_AND_NON_STARTER_DATA
        `, {
            raw: true,
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: StarterNonStarter
        });
        for (let _d of data) {
            await StarterNonStarter.create(_d);
        }
    } catch (err) {
        console.log(err);
    }
}

async function processMandate() {
    try {
        /*
        ALTER TABLE `mandate_cases`
        ADD `sap_code_sm` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `finreference`,
        ADD `sm_name` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `sap_code_sm`,
        ADD `sm_number` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `sm_name`,
        ADD `sap_code_rsm` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `sm_number`,
        ADD `rsm_name` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `sap_code_rsm`,
        ADD `rsm_number` varchar(100) COLLATE 'latin1_swedish_ci' NULL AFTER `rsm_name`;
        */
        await MandateCases.truncate({
            force: true,
        });
        const data = await sequelize.query(`
            SELECT
                Customer_Name as customer_name,
                CUSTOMER_ID as customer_id,
                MOBILE_NUMBER as mobile_number,
                REJECTION_TYPE as rejection_type,
                REJECTION_REASON as rejection_reason,
                BANK as bank,
                IFSC as ifsc,
                ACCOUNT_NUMBER as account_number,
                LAST_MANDATE_UPLOAD_DATE as last_mandate_upload_date,
                LOAN_LIMIT as loan_limit,
                FINTYPE as fintype,
                FOS_Name as vas_fos,
                FOS_Number as vas_fos_number,
                SAP_CODE_SM as sap_code_sm,
                SM_NAME as sm_name,
                SM_NUMBER as sm_number,
                SAP_CODE_RSM as sap_code_rsm,
                RSM_NAME as rsm_name,
                RSM_NUMBER as rsm_number,
                DEALER_NAME as vas_dealer
                FROM MANDATE_INITAIL_REJECTED_DATA
            UNION
            SELECT
                Customer_Name as customer_name,
                CUSTOMER_ID as customer_id,
                MOBILE_NUMBER as mobile_number,
                REJECTION_TYPE as rejection_type,
                REJECTION_REASON as rejection_reason,
                BANK as bank,
                IFSC as ifsc,
                ACCOUNT_NUMBER as account_number,
                LAST_MANDATE_UPLOAD_DATE as last_mandate_upload_date,
                LOAN_LIMIT as loan_limit,
                FINTYPE as fintype,
                FOS_Name as vas_fos,
                FOS_Number as vas_fos_number,
                SAP_CODE_SM as sap_code_sm,
                SM_NAME as sm_name,
                SM_NUMBER as sm_number,
                SAP_CODE_RSM as sap_code_rsm,
                RSM_NAME as rsm_name,
                RSM_NUMBER as rsm_number,
                DEALER_NAME as vas_dealer
            FROM MANDATE_REJECTED_DATA
        `, {
            raw: true,
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: MandateCases
        });
        for (let _d of data) {
            await MandateCases.create(_d);
        }
    } catch (err) {
        console.log(err);
    }
}

async function processSMRsmFosData() {
    try {
        await SmRsmFosData.truncate({
            force: true
        });
        const data = await sequelize.query(`SELECT
        distinct Mobile_Number as mobile_number,
        FOS_name as fos_name,
        "SM _Name" as sm_name,
        RSM_name as rsm_name,
        Location as location,
        DOJ as doj,
        Status as status,
        CT_Code as ct_code,
        Employee_Code as employee_code,
        Last_Day as last_day,
        Branch_Code_Mapping as branch_code_mapping,
        Final_Locations as final_locations,
        State as state,
        SM_Location as sm_location,
        RSM_Location as rsm_location,
        SAP_CODE_RSM as rsm_sap_id,
        RSM_NUMBER as rsm_mobile_no,
        SAP_CODE_SM as sm_sap_id,
        SM_NUMBER as sm_mobile_no
        FROM RSM_SM_DATA`, {
            raw: true,
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: SmRsmFosData
        });
        for (let _d of data) {
            await SmRsmFosData.create(_d, {
                ignoreDuplicates: true,
            });
        }
    } catch (err) {
        console.log(err);
    }
}

async function dumpData() {
    try {
        const boolDbLink = await checkDbLink();
        if(boolDbLink){
            await processCustomerData();
            await dcgData();
            await processCustomerFosData();
            await processStarterAndNonStarterData();
            await processMandate();
            await processSMRsmFosData();
            await dummyData();
            let allnabndcase_cnt = await AllNAbndCases.count({
                plain:true
            });
            let smrsmfosdata_cnt = await SmRsmFosData.count({
                plain:true
            });
            let customerdetails_cnt = await CustomerDetails.count({
                plain:true
            });
            let mandatecases_cnt = await MandateCases.count({
                plain:true
            });
            let starternonstarter_cnt = await StarterNonStarter.count({
                plain:true
            });
            await ScheduleData.create({
                LastSchedule: Date.now(),
                CountAllNAbndCases: allnabndcase_cnt,
                CountMandateCases: mandatecases_cnt,
                CountCustomerDetails: customerdetails_cnt,
                CountSmRsmFosData: smrsmfosdata_cnt,
                CountStarterNonStarter: starternonstarter_cnt
            });/**/
        }
    } catch (err) {
        console.log(err);
    }
}


async function dummyData() {
    try {
        await SmRsmFosData.bulkCreate([{
            MobileNumber: "9930347580",
            FOSName: "Nikhil Patil",
            SMName: "Nithin Valsalan",
            RSMName: "Sajeesh",
            Location: "Kottayam",
            DOJ: "2021-02-10",
            Status: "ACTIVE",
            CTCode: "TR10348067",
            EmployeeCode: "4000042051",
            BranchCodeMapping: "CRO",
            FinalLocations: "Thane",
            State: "Kerala",
            SMLocation: "Cochin",
            RSMLocation: "Cochin",
            SMSAPId: '100003035',
            RSMSAPId: "27020628",
            SMMobileNo: "9930347580",
            RSMMobileNo: "9930347580"
        }, {
            MobileNumber: "9999403408",
            FOSName: "Jaspreet Lamba",
            SMName: "Nithin Valsalan",
            RSMName: "Sajeesh",
            Location: "Kottayam",
            DOJ: "2021-02-10",
            Status: "ACTIVE",
            CTCode: "TR10348067",
            EmployeeCode: "4000042051",
            BranchCodeMapping: "CRO",
            FinalLocations: "Thane",
            State: "Kerala",
            SMLocation: "Cochin",
            RSMLocation: "Cochin",
            SMSAPId: '100003035',
            RSMSAPId: "27020628",
            SMMobileNo: "9999403408",
            RSMMobileNo: "7745801845"
        }, {
            MobileNumber: "7745801845",
            FOSName: "Sachin",
            SMName: "Nithin Valsalan",
            RSMName: "Sajeesh",
            Location: "Kottayam",
            DOJ: "2021-02-10",
            Status: "ACTIVE",
            CTCode: "TR10348067",
            EmployeeCode: "4000042051",
            BranchCodeMapping: "CRO",
            FinalLocations: "Thane",
            State: "Kerala",
            SMLocation: "Cochin",
            RSMLocation: "Cochin",
            SMSAPId: '100003035',
            RSMSAPId: "27020628",
            SMMobileNo: "9999403408",
            RSMMobileNo: "7745801845"
        }, {
            MobileNumber: "7972505101",
            FOSName: "Saurabh",
            SMName: "Nithin Valsalan",
            RSMName: "Sajeesh",
            Location: "Kottayam",
            DOJ: "2021-02-10",
            Status: "ACTIVE",
            CTCode: "TR10348067",
            EmployeeCode: "4000042051",
            BranchCodeMapping: "CRO",
            FinalLocations: "Thane",
            State: "Kerala",
            SMLocation: "Cochin",
            RSMLocation: "Cochin",
            SMSAPId: '100003228',
            RSMSAPId: "27020469",
            SMMobileNo: "7972505101",
            RSMMobileNo: "7745801845"
        }]);

        await StarterNonStarter.update({
            FosNumber: "9930347580",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [1, 1000]
                }
            }
        });

        await StarterNonStarter.update({
            FosNumber: "7745801845",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [1000, 2000]
                }
            }
        });
        await StarterNonStarter.update({
            FosNumber: "9999403408",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [2000, 3000]
                }
            }
        });

        await StarterNonStarter.update({
            FosNumber: "7972505101",
            SapCodeSm: "100003228",
            SapCodeRsm: "27020469"
        }, {
            where: {
                Id: {
                    [Op.between]: [3000, 4000]
                }
            }
        });

        await MandateCases.update({
            VasFosNumber: "9930347580",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [1, 1000]
                }
            }
        });
        await MandateCases.update({
            VasFosNumber: "7745801845",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [1000, 2000]
                }
            }
        });
        await MandateCases.update({
            VasFosNumber: "9999403408",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [2000, 3000]
                }
            }
        });
        await MandateCases.update({
            VasFosNumber: "7972505101",
            SapCodeSm: "100003228",
            SapCodeRsm: "27020469"
        }, {
            where: {
                Id: {
                    [Op.between]: [3000, 4000]
                }
            }
        });
        await AllNAbndCases.update({
            FosNumber: "9930347580",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [1, 1000]
                }
            }
        });
        await AllNAbndCases.update({
            FosNumber: "7745801845",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [1000, 2000]
                }
            }
        });
        await AllNAbndCases.update({
            FosNumber: "9999403408",
            SapCodeSm: "100003035",
            SapCodeRsm: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [2000, 3000]
                }
            }
        });
        await AllNAbndCases.update({
            FosNumber: "7972505101",
            SapCodeSm: "100003228",
            SapCodeRsm: "27020469"
        }, {
            where: {
                Id: {
                    [Op.between]: [3000, 4000]
                }
            }
        });

        await CustomerDetails.update({
            FosNumber: "9930347580",
            SAPCodeSM: "100003035",
            SAPCodeRSM: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [1, 1000]
                }
            }
        });

        await CustomerDetails.update({
            FosNumber: "9999403408",
            SAPCodeSM: "100003035",
            SAPCodeRSM: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [2000, 3000]
                }
            }
        });
        await CustomerDetails.update({
            FosNumber: "7745801845",
            SAPCodeSM: "100003035",
            SAPCodeRSM: "27020628"
        }, {
            where: {
                Id: {
                    [Op.between]: [3000, 4000]
                }
            }
        });
        await CustomerDetails.update({
            FosNumber: "7972505101",
            SAPCodeSM: "100003228",
            SAPCodeRSM: "27020469"
        }, {
            where: {
                Id: {
                    [Op.between]: [4000, 5000]
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
    /**/
}

dumpData();