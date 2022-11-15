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

//temp();

module.exports = {
    GetCustomerDetails,
    GetSMRSMMobileNumber,
    findOneCustomer,
    GetScheduleData
};