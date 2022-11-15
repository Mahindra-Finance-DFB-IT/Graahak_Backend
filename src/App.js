const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require("helmet");
// var mysql = require('mysql2');
const ldapRouter = require('./routes/Ldap');
const merchantRouter = require("./routes/Merchant");
const tokenRouter = require("./routes/Token");
const customerDetailsRouter = require("./routes/CustomerDetails");
const reportRouter = require("./routes/Report");
const admin = require('./routes/admin');
const app = express();
const db = require("./modelss");
const initRoutes = require("./routes/dcgMaster");
const pgcRoutes = require("./routes/pcgMaster");
const schemeMasterRoutes = require("./routes/Scheme-master");
global.__basedir = __dirname + "/..";


db.sequelize.sync();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "../", 'public')));


app.use('/ldap', ldapRouter);
app.use("/merchant", merchantRouter);
app.use("/token", tokenRouter);
app.use("/customer_details", customerDetailsRouter);
app.use("/report", reportRouter);
app.use("/admin", admin);
app.use("/schemeMasterRoutes",schemeMasterRoutes);
app.use("/dcg",initRoutes);
app.use("/pcg",pgcRoutes);

// var con = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "Root",
//     database: "sys"
// });

// con.connect(function (err) {
//         if (err) throw err;
//         console.log("Database connected!");
//         var sql = "CREATE TABLE sm_rsm_fos_data (id int NOT NULL AUTO_INCREMENT,mobile_number  VARCHAR(255),fos_name  VARCHAR(255),sm_name  VARCHAR(255),rsm_name  VARCHAR(255),location VARCHAR(255),doj VARCHAR(255),status  VARCHAR(255),ct_code  VARCHAR(255),employee_code  VARCHAR(255),last_day  VARCHAR(255),branch_code_mapping VARCHAR(255),final_locations VARCHAR(255),state  VARCHAR(255),sm_location  VARCHAR(255),rsm_location  VARCHAR(255),sm_sap_id  VARCHAR(255),rsm_sap_id VARCHAR(255),sm_mobile_no VARCHAR(255),rsm_mobile_no  VARCHAR(255),sm_rsm_fos_data  VARCHAR(255),PRIMARY KEY (id))";
//         con.query(sql, sql, function (err, result) {
//             if (err) throw err;
//             console.log("Table created");
//         });
//     });
// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Database connected!");
//     var sql = "CREATE TABLE scheme_dcgs (id int NOT NULL AUTO_INCREMENT,oem_name  VARCHAR(255),pos_id  VARCHAR(255),store_id  VARCHAR(255),status  VARCHAR(255),merchant_name VARCHAR(255),dealer_code VARCHAR(255),dealer_code_id VARCHAR(255),PRIMARY KEY (id))";
//     con.query(sql, sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });
// });
// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Database connected!");
//     var sql = "CREATE TABLE scheme_pcgs (id int NOT NULL AUTO_INCREMENT,oem_name VARCHAR(255), product_group_id VARCHAR(255),product_name VARCHAR(255), product_code VARCHAR(255),creation_date VARCHAR(255), status_id VARCHAR(255),status VARCHAR(255),PRIMARY KEY (id))";
//     con.query(sql, sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });
// });
// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Database connected!");
//     var sql = "CREATE TABLE scheme_masters (id int NOT NULL AUTO_INCREMENT,oem VARCHAR(255), scheme_id VARCHAR(255),scheme_description VARCHAR(255), tenure VARCHAR(255),scheme_irr VARCHAR(255), roi VARCHAR(255),advance_emi VARCHAR(255),dbd VARCHAR(255), scheme_start_Date VARCHAR(255),scheme_end_date VARCHAR(255), max_amount VARCHAR(255),min_amount VARCHAR(255), processing_fee VARCHAR(255),portal_description VARCHAR(255),action VARCHAR(255), status VARCHAR(255),special_scheme_flag VARCHAR(255), is_pf_scheme VARCHAR(255),processing_fee_percentage VARCHAR(255), mdr_percentage VARCHAR(255),mdr_amount VARCHAR(255),mbd_percentage VARCHAR(255), mbd_amount VARCHAR(255),product_group_code VARCHAR(255), action_spm_file VARCHAR(255),status_spm_file VARCHAR(255), dealer_group_code VARCHAR(255),action_sdm_file VARCHAR(255),status_sdm_file VARCHAR(255),PRIMARY KEY (id))";
//     con.query(sql, sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });
// });

module.exports = app;



