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
    var schemeMaster = "SELECT *,GROUP_CONCAT(product_name SEPARATOR '|')  as pname FROM scheme_masters B inner JOIN scheme_pcgs C ON B.product_group_code = C.product_group_id group by product_group_id;";
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
        return result;
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
    console.log(searchParam);
    var reqData = searchParam.searchData;
    var schemeData = "";
    var schemeCount = "";
    if (searchParam.type == 'master') {
        schemeCount = "SELECT COUNT(*) as count from scheme_masters";
        schemeData = "SELECT * FROM scheme_masters LIMIT " + reqData.limit + " OFFSET " + reqData.offset;
    }
    if (searchParam.type == 'pcg') {
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

module.exports = {
    GetCustomerDetails,
    GetSMRSMMobileNumber,
    findOneCustomer,
    GetScheduleData,
    GetSchemeList,
    GetSchemeDetail,
    GetSchemeData
};