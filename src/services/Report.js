
const { DEFAULT_QUERY_LIMIT, LOGIN_TYPE } = require("../Config");
const { NotFoundError } = require("../core/Error");
const CustomerDetails = require("../models/CustomerDetails");
const StarterNonStarter = require("../models/StarterNonStarter");
const MandateCases = require("../models/MandateCases");
const AllNAbndCases = require("../models/AllNAbndCases");
const { Op } = require("sequelize");
const jose = require('jose');
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const sequelize = require("../core/Db");


async function GetReportData(searchData, header) {
    try {
        const token = jose.decodeJwt(header);
        let username = "";
        if (token.loginType == LOGIN_TYPE.SMRSM.toString()) {
            username = token.EntityUserName;
        }

        if (token.loginType == LOGIN_TYPE.SALESEXECUTIVE.toString()) {
            username = token.mobileNumber;
        }
        const selectReport = searchData.selectReport;
        const _choiceReport = selectReport.split("#");
        const textSearch = searchData?.searchData || '';
        let data = {
            count: 0,
            rows: []
        };
        let conditionStmt = {};
        let select = []
        switch (_choiceReport[0]) {
            case "overdue":
                select = [
                    "customer_name",
                    "mobile_number",
                    "EMI_Amount",
                    "total_overdue",
                    "bounce_reason",
                    "mandate_status",
                    "alternate_number",
                    "customer_address",
                    "dealer_name",
                    "dpd_bucket",
                    "fos_number"
                ];

                let starterCond = {};
                if (_choiceReport[1] == "nonstarter") {
                    starterCond.starter_non_starter_flag = "NON-STARTER";
                } else {
                    starterCond = {
                        [Op.and]: [{
                            [Op.or]: [
                                {
                                    dpd_bucket: {
                                        [Op.ne]: "DPD S"
                                    }
                                },
                                {
                                    total_overdue: {
                                        [Op.gt]: 0
                                    }
                                }
                            ]
                        }]
                    };
                }

                if (token.loginType == LOGIN_TYPE.SALESEXECUTIVE.toString()) {
                    conditionStmt = {
                        fos_number: username
                    };
                }
                if (token.loginType == LOGIN_TYPE.SMRSM.toString()) {
                    //console.log(" i ama here")
                    conditionStmt = {
                        [Op.or]: [
                            { sap_code_sm: username },
                            { sap_code_rsm: username }
                        ]
                    };
                }
                if (textSearch != '') {
                    conditionStmt.mobile_number = {
                        [Op.like]: textSearch + "%"
                    };
                }
                console.log({
                    ...conditionStmt,
                    ...starterCond
                });
                data = await StarterNonStarter.findAndCountAll({
                    attributes: select,
                    limit: searchData?.limit || DEFAULT_QUERY_LIMIT,
                    offset: searchData?.offset || 0,
                    where: {
                        ...conditionStmt,
                        ...starterCond
                    },
                    order: [
                        ['loan_date', 'DESC'],
                        ['customer_name', 'ASC'],
                    ],
                    raw: true
                });

                break;
            case "mandate":
                let rejectionType = {};
                if (_choiceReport[1] == "rejected_mandate") {
                    rejectionType = {
                        rejection_type: {
                            [Op.ne]: "Initial Rejection"
                        }
                    };
                } else {
                    rejectionType = {
                        rejection_type: "Initial Rejection"
                    };
                }

                conditionStmt = {};
                if (token.loginType == LOGIN_TYPE.SALESEXECUTIVE.toString()) {
                    conditionStmt = {
                        vas_fos_number: username
                    };
                }
                if (token.loginType == LOGIN_TYPE.SMRSM.toString()) {
                    conditionStmt = {
                        [Op.or]: [
                            { sap_code_rsm: username },
                            { sap_code_sm: username }
                        ]
                    };
                }
                select = [
                    'customer_name',
                    'mobile_number',
                    'loan_limit',
                    'rejection_type',
                    'rejection_reason',
                    'bank',
                    'ifsc',
                    'account_number',
                    'vas_dealer',
                    ['DATE_FORMAT(last_mandate_upload_date,"%Y-%m-%d") ', 'last_mandate_upload_date'],
                    "vas_fos_number"
                ];

                if (textSearch != '') {
                    conditionStmt.mobile_number = {
                        [Op.like]: textSearch + "%"
                    };
                }
                data = await MandateCases.findAndCountAll({
                    attributes: select,
                    limit: searchData?.limit || DEFAULT_QUERY_LIMIT,
                    offset: searchData?.offset || 0,
                    where: {
                        ...rejectionType,
                        ...conditionStmt,
                    },
                    order: [
                        ['last_mandate_upload_date', 'DESC'],
                        ['customer_name', 'ASC'],
                    ],
                    raw: true
                });
                break;
            case "all":
                let where = {
                    //limit: searchData?.limit || DEFAULT_QUERY_LIMIT,
                    //offset: searchData?.offset || 0,
                };

                if (token.loginType == LOGIN_TYPE.SALESEXECUTIVE.toString()) {
                    where.fos_number = username;
                }
                if (token.loginType == LOGIN_TYPE.SMRSM.toString()) {
                    where = {
                        ...where,
                        [Op.or]: [
                            { sap_code_rsm: username },
                            { sap_code_sm: username }
                        ]
                    };
                }

                let allType = {};
                if (_choiceReport[1] == "abnd") {
                    where = {
                        ...where,
                        finamount: {
                            [Op.eq]: null
                        }
                    };
                } else {
                    // where.push(" finamount IS NOT NULL and disbursement_dt IS NOT NULL");
                    where = {
                        ...where,
                        [Op.and]: {
                            finamount: {
                                [Op.ne]: null
                            },
                            disbursement_dt: {
                                [Op.ne]: null
                            }
                        }
                    };
                }
                // console.log(textSearch);
                if (textSearch != '') {
                    // where.push(" customer_number like '"+textSearch+"%'");
                    where = {
                        ...where,
                        customer_number: {
                            [Op.like]: textSearch + "%"
                        }
                    };
                }
                /*
                               let wherestmt = "";
                               if(where.length >0){
                                   wherestmt = where.join( " AND ");
                               }
                              
                               SELECT COUNT(*) as cnt from (
                                           SELECT 
                                               custshrtname, 
                                               customer_number, 
                                               limitsanctioned, 
                                               DATE_FORMAT(disbursement_dt,"%Y-%m-%d %H:%M:%S"), 
                                               (CASE disbursement_dt  WHEN NULL THEN 'Yes' ELSE 'No' END) AS transaction_done, 
                                               dealer_name, 
                                               count(*) AS count 
                                           FROM all_n_abnd_cases WHERE 1=1 AND `+wherestmt+` 
                                           GROUP BY custshrtname, 
                                                    customer_number, 
                                                    limitsanctioned, 
                                                    disbursement_dt, 
                                                    (CASE disbursement_dt  WHEN NULL THEN 'Yes' ELSE 'No' END), 
                                                    dealer_name
                                           ) as dt
               
                               count = await sequelize.query(
                                       `SELECT
                                               count(*) AS count 
                                           FROM all_n_abnd_cases WHERE 1=1 AND `+wherestmt,
                                       {
                                           replacements:{
                                               sap_code: username
                                           },
                                           plain: true,
                                           raw: true,
                                           type: QueryTypes.SELECT
                                       });
                               data = await sequelize.query(
                                       `SELECT 
                                       custshrtname, 
                                       customer_number, 
                                       limitsanctioned, 
                                       DATE_FORMAT(disbursement_dt,"%Y-%m-%d %H:%i:%s") as disbursement_dt,
                                       (CASE transaction_done  WHEN 'Y' THEN 'Yes' ELSE 'No' END) AS transaction_done, 
                                       dealer_name, 
                                       loan_cnt AS count,
                                       finamount,
                                       fos_number
                                   FROM all_n_abnd_cases WHERE 1=1 AND `+wherestmt+` 
                                   ORDER BY disbursement_dt desc, custshrtname asc
                                   LIMIT :offset,:limit `,
                                   {
                                       replacements:{
                                           sap_code: username,
                                           limit:  searchData?.limit || DEFAULT_QUERY_LIMIT,
                                           offset: searchData?.offset || 0,
                                       },
                                       raw: true,
                                       type: QueryTypes.SELECT
               
                                   });
                               */

                select = [
                    'custshrtname',
                    'customer_number',
                    'limitsanctioned',
                    ['DATE_FORMAT(disbursement_dt,"%Y-%m-%d %H:%i:%s")', 'disbursement_dt'],
                    ["(CASE transaction_done  WHEN 'Y' THEN 'Yes' ELSE 'No' END)", 'transaction_done'],
                    'dealer_name',
                    ['loan_cnt', 'count'],
                    'finamount',
                    'fos_number'
                ],

                    data = await AllNAbndCases.findAndCountAll({
                        attributes: select,
                        limit: searchData?.limit || DEFAULT_QUERY_LIMIT,
                        offset: searchData?.offset || 0,
                        where: {
                            ...where
                        },
                        order: [
                            ['disbursement_dt', 'DESC'],
                            ['custshrtname', 'ASC'],
                        ],
                        raw: true
                    });

                break;
        }
        return {
            draw: searchData?.draw,
            recordsFiltered: data.count,
            recordsTotal: data.count,
            data: data.rows
        };
    } catch (err) {
        console.log(err);
        throw new NotFoundError(err.message);
    }
}

async function temp() {
    let data = await GetReportData(
        {
            "selectReport": "overdue#nonstarter",
            "searchData": "",
            "limit": 10,
            "offset": 0,
            "draw": 1,
            "loginType": LOGIN_TYPE.SMRSM.toString(),
        }
    );
    console.log(data);
}
//temp();
module.exports = {
    GetReportData
}; 