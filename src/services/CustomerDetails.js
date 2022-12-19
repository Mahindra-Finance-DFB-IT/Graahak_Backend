const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { LOGIN_TYPE } = require("../Config");
const  sequelize  = require("../core/Db");
const { InternalServerError } = require("../core/Error");
const logger = require("../core/Logger");
const CustomerDetails = require("../models/CustomerDetails");
const ScheduleData = require("../models/ScheduleData");
const SmRsmFosData = require("../models/SmRsmFosData");


async function findOneCustomer(searchData){
    try{
        return  await CustomerDetails.findOne({
                where: {
                    [Op.or]: [
                          {mobile_number: searchData},
                          {pancard: searchData}
                    ]
                },
                attributes:[
                    "mobile_number",
                    "pancard"
                ],
                raw: true,
                plain: true,
            });
    }catch(err){
        throw new InternalServerError(err.message);
    }
}

async function GetCustomerDetails(customerDetailsPayload){
    try{
        

        const fosQuery = `SELECT customer_details.* 
                        FROM customer_details INNER JOIN sm_rsm_fos_data 
                        ON(sm_rsm_fos_data.sm_sap_id=  customer_details.sap_code_sm)
                        WHERE sm_rsm_fos_data.mobile_number=:mobileNumber 
                        AND (customer_details.mobile_number=:searchData or customer_details.pancard=:searchData)`;
        
        const smQuery = `select customer_details.* FROM 
                            customer_details INNER JOIN 
                            sm_rsm_fos_data ON(sm_rsm_fos_data.rsm_sap_id=  customer_details.sap_code_rsm)
                            WHERE sm_rsm_fos_data.sm_sap_id=:sapId AND
                            (customer_details.mobile_number=:searchData or customer_details.pancard=:searchData)`;
        
        const rsmQuery = `select customer_details.* FROM 
                            customer_details 
                            WHERE customer_details.sap_code_rsm=:sapId AND
                            (customer_details.mobile_number=:searchData or customer_details.pancard=:searchData)`;

        let result = null;
        if(customerDetailsPayload.loginType == LOGIN_TYPE.SALESEXECUTIVE){
            result = await sequelize.query(fosQuery,{
                raw: true,
                type: QueryTypes.SELECT,
                replacements: customerDetailsPayload,
                logging: (log)=>{
                    logger.info(log);
                }
            });
        }

        if(customerDetailsPayload.loginType == LOGIN_TYPE.SMRSM){
            result = await sequelize.query(smQuery,{
                raw: true,
                type: QueryTypes.SELECT,
                replacements: customerDetailsPayload
            });
          
            if(result.length == 0){
                result = await sequelize.query(rsmQuery,{
                    raw: true,
                    type: QueryTypes.SELECT,
                    replacements: customerDetailsPayload
                });
            }
        }
        
        return result;
    }catch(err){
        throw new InternalServerError(err.message);
    }
}

async function GetSMRSMMobileNumber(mobile_number){
    try{
        return await SmRsmFosData.findOne({
            where: {
                mobile_number
            },
            attributes:[
                "sm_mobile_no",
                "rsm_mobile_no",
                "fos_name"
            ],
            raw: true,
            plain: true,
        })
    }catch(err){
        throw new InternalServerError(err.message);
    }
}

async function GetScheduleData(){
    return await ScheduleData.findOne({
        order: [ [ 'Id', 'DESC' ]],
        plain: true,
        raw: true
    });
}

async function temp(){
    let result = await findOneCustomer("9930347580");
    console.log(result);
}

async function GetSchemeList(pos_id){
    var schemeMaster = "SELECT * FROM scheme_masters;";
    var schemePcg = "SELECT product_group_id, product_name FROM scheme_pcgs;";
    // var schemeMaster = "SELECT *,GROUP_CONCAT(product_name SEPARATOR '|')  as pname FROM scheme_masters B inner JOIN scheme_pcgs C ON B.product_group_code = C.product_group_id group by product_group_id;";
    try{
        // if(pos_id > 0){
        //     schemeMaster = "SELECT *,GROUP_CONCAT(product_name SEPARATOR '|')  as pname FROM scheme_dcgs A   inner JOIN scheme_masters B ON A.dealer_code_id = B.dealer_group_code  inner JOIN scheme_pcgs C ON B.product_group_code = C.product_group_id  WHERE A.pos_id ="+pos_id+ " group by product_group_id;";
        // } else{
        //     schemeMaster = "SELECT * from scheme_masters";
        // }
        let result = null;
        result = await sequelize.query(schemeMaster,{
            raw: true,
            type: 'SELECT',
            // replacements: customerDetailsPayload,
            logging: (log)=>{
                logger.info(log);
            }
        });
        let resultPcg = null;
        resultPcg = await sequelize.query(schemePcg,{
            raw: true,
            type: 'SELECT',
            // replacements: customerDetailsPayload,
            logging: (log)=>{
                logger.info(log);
            }
        });
        // return result;
        return {
            schemeMaster: result,
            schemePcg: resultPcg
        };
    } catch(err){
        throw new InternalServerError(err.message);
    }
}

async function GetSchemeDetail(posid, scheme_id){
    var schemeMaster = "";
    try{
        // if (posid > 0) {
        //     schemeMaster = "SELECT * FROM scheme_dcgs A inner JOIN scheme_masters B ON A.dealer_code_id = B.dealer_group_code inner JOIN scheme_pcgs C  ON B.product_group_code = C.product_group_id WHERE A.pos_id =" + posid + " AND C.id =" + id;
        // } else{
            schemeMaster = "SELECT * FROM scheme_masters WHERE scheme_id =" + scheme_id;
        // }
        let result = null;
        result = await sequelize.query(schemeMaster,{
            raw: true,
            type: 'SELECT',
            // replacements: customerDetailsPayload,
            logging: (log)=>{
                logger.info(log);
            }
        });
        return result;
    } catch(err){
        throw new InternalServerError(err.message);
    }
};

async function GetSchemeData(searchParam){
    // console.log(searchParam);
    var reqData = searchParam.searchData;
    var schemeData = "";
    var schemeCount = "";
    if (reqData.selectReport == 'master') {
        schemeCount = "SELECT COUNT(*) as count from scheme_masters";
        schemeData = "SELECT * FROM scheme_masters LIMIT " + reqData.limit + " OFFSET " + reqData.offset;
    }
    if (reqData.selectReport == 'pcg') {
        schemeCount = "SELECT COUNT(*) as count from scheme_pcgs";
        schemeData = "SELECT * FROM scheme_pcgs LIMIT " + reqData.limit + " OFFSET " + reqData.offset;
    }
    try{    
        let result = null;
        result = await sequelize.query(schemeData,{
            raw: true,
            type: 'SELECT',
            logging: (log)=>{
                logger.info(log);
            }
        });
        let countTotal = null;
        countTotal = await sequelize.query(schemeCount,{
            raw: true,
            type: 'SELECT',
            logging: (log)=>{
                logger.info(log);
            }
        });
        return {
            draw: reqData?.draw,
            recordsFiltered: countTotal[0].count,
            recordsTotal: countTotal[0].count,
            data: result
        };
        
    } catch(err){
        throw new InternalServerError(err.message);
    }
};


async function Getdata(){
    var getSchemeData = "SELECT COUNT(*) as cnt, cast(created_at as date) as date, api_name,role FROM user_logs group by api_name"
    var getNameMatchData = "SELECT cast(createdAt as date) as Count, count(1) as cnt FROM namematches group by cast(createdAt as date) ORDER BY createdAt DESC";
    var getScheduleData = "SELECT count_all_n_abnd_cases,count_customer_details,count_mandate_cases,count_sm_rsm_fos_data,count_starter_non_starter_data,last_schedule,cast(last_schedule as date) as date  FROM schedule_data  ORDER BY last_schedule DESC";
    
    try{   
        let userLogs = null;
        userLogs = await sequelize.query(getSchemeData,{
            raw: true,
            type: 'SELECT',
            logging: (log)=>{
                logger.info(log);
            }
        });
        let nameMatch = null;
        nameMatch = await sequelize.query(getNameMatchData,{
            raw: true,
            type: 'SELECT',
            logging: (log)=>{
                logger.info(log);
            }
        });
        let scheduleData = null;
        scheduleData = await sequelize.query(getScheduleData,{
            raw: true,
            type: 'SELECT',
            logging: (log)=>{
                logger.info(log);
            }
        });
        return {
            userLogs: userLogs,
            nameMatch: nameMatch,
            scheduleData: scheduleData
        };
        
    } catch(err){
        throw new InternalServerError(err.message);
    }
};
async function GetLogData(searchParam){
    var reqData = searchParam.searchData;
    var apiCount = "SELECT COUNT(*) as count from user_logs where api_name = '" + reqData.selectReport + "'";
    var userLogs = "SELECT cast(created_at as date) as date, username, role, api_name FROM user_logs where api_name='" + reqData.selectReport + "' ORDER BY date DESC LIMIT "  + reqData.limit + " OFFSET " + reqData.offset;
       
    try{   
        let logApi = null;
        logApi = await sequelize.query(userLogs,{
            raw: true,
            type: 'SELECT',
            logging: (log)=>{
                logger.info(log);
            }
        }); 
        let requestCount = null;
        requestCount = await sequelize.query(apiCount,{
            raw: true,
            type: 'SELECT',
            logging: (log)=>{
                logger.info(log);
            }
        });
        return {
            data:logApi,
            draw: reqData?.draw,
            recordsFiltered: requestCount[0].count,
            recordsTotal: requestCount[0].count,
        };
        
    } catch(err){
        throw new InternalServerError(err.message);
    }
};
module.exports = {
    GetCustomerDetails,
    GetSMRSMMobileNumber,
    findOneCustomer,
    GetScheduleData,
    GetSchemeList,
    GetSchemeDetail,
    GetSchemeData,
    Getdata,
    GetLogData
};