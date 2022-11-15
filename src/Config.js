const SEND_OTP = "https://esbuat.mmfsl.com/mahindrafinance/uat/crm/ivrotp";
const RESEND_OTP = "https://esbuat.mmfsl.com/mahindrafinance/uat/crm/ivrotp";
const VERIFY_OTP = "https://esbuat.mmfsl.com/mahindrafinance/uat/api/otp/validate";
const MERCHANT_API= "https://esbuat.mmfsl.com/mahindrafinance/uat/api/merchant/authentication";
const LDAP_AUTHENTICATE = "https://esbuat.mmfsl.com/mahindrafinance/uat/ldap/userauthentication/v2";
const LDAP_CRYPTO = "https://esbuat.mmfsl.com/mahindrafinance/uat/ldap/cryptography/v2";

const RSA_PUBLIC_PASS_KEY = `LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFE
Q0JpUUtCZ1FDcHZmVy9HK1J4ZUlKaHhZS0pFaEZhbkFlbwoydnhEWjFLY3VNa1cyc29Ya1VBWHk0
Nm40cThlWko2VEF3VDFyR04zSEphVEMzUG5hLzU1eHNDL1ovWmVTN21UCjZzY0VIL2tBdyt2aWhB
bjNnUW5hRUZMZkpYcU9ObGRqV2lwdVUvWEphbkdCVzlybkFiMDIxVnhQbDJoR1oyeC8KbU5tQW1j
eWZqZlhzYWZ4MmR3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=`;

const RSA_PRIVATE_PASS_KEY = `LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlDWEFJQkFBS0JnUUNwdmZXL0crUnhl
SUpoeFlLSkVoRmFuQWVvMnZ4RFoxS2N1TWtXMnNvWGtVQVh5NDZuCjRxOGVaSjZUQXdUMXJHTjNI
SmFUQzNQbmEvNTV4c0MvWi9aZVM3bVQ2c2NFSC9rQXcrdmloQW4zZ1FuYUVGTGYKSlhxT05sZGpX
aXB1VS9YSmFuR0JXOXJuQWIwMjFWeFBsMmhHWjJ4L21ObUFtY3lmamZYc2FmeDJkd0lEQVFBQgpB
b0dBTDVBbkdGSDhoVDg3YWFJcW5iWU9YdEZ4NUFMWXhScGlyNytudVZ1OVhUVTZQSEN4bktHTWFI
dlJZMmhwCkwxNEswUW1WdDhaeHg5c2ZCNGlGNGh5RGtCdXk1THhVWjFKWTlzOTBlazFPVUtqTVBp
akUvanpaV0x2U05pZE4KN2YyZ24rQTJKOWVsTGpybGpYN2NVZXJxaWViVGlUUWgwY1VpcFN2dzNl
dkdXMEVDUVFEYjBiMFZqUFNHQ0RETwpRYlAvQ05qL3IrSkxwSHRBeUtIdVE4cWZXdkFlekx1MTd2
V2ljY3lPb0NXYlJkaXdBa28vbWN2dE01aFpaeTBmCkw0WHdGZUhmQWtFQXhhNHREUGpoZ1JFeGlU
Z1IxVmtHL0lQNGVxUmQ5UHVzVHAyRnYvQjhVV1VXWkdpUGIyYXQKNytrSlc5cVE1amlWZXVNbXA2
V2FGcnlnSHZQRGxxdHVhUUpCQUx5SU1nVld4SzVrUGYvWkNGa1hySTMzdXo0bgpUM0xyNFQ2cXRC
RmkvSWxlRFN6b1M1TE15YVlXSXNyKzUrOWx0MnEvTE5FL3JFNFptUENqWU52ZTJMOENRRHNXCjgz
UjdPTDBoN0pLOTVlYkdNK1pyZEcwRWtPbFlDWXQrWHFxZk1pb0tjNFVVRkR3U2owKzFjd3kzNnJS
R21iZ2cKQ2ovMnFuYTliNGVSQ2hnUnFuRUNRQ0FnNHRSVlFyTmlUbGJETjl6d3VrTjNUd3kxRXpP
MXJMbnpDekZzNXFidApFSWlGSEtJTDY4c0psamtzS2ZtbDFUdHB5enZUZlNyWWVTakVEQTJiTVZR
PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=`;
const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST : 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWDED: 405,
    NOT_ACCPETABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    TOO_MANY_REQUEST: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502
};

const DB = {
        DIALECT: "mysql",
        USERNAME: "root",
        PASSWORD: "Shubham@123",
        DATABASE: "sys",
        HOST: "127.0.0.1",
    // tutorials : require("./models/tutorial.model")(sequelize, Sequelize)
};

// const db = {};


// db.tutorials1 = require("./PGC.model")(sequelize, Sequelize);
// db.schememaster = require("./Scheme-master")(sequelize, Sequelize);

// module.exports = db;


const LOGIN_TYPE ={
    SALESEXECUTIVE:'SALESEXECUTIVE',
    SMRSM : 'SMRSM'
};

const FROM_PAGE = {
    LOGINPAGE:'LoginPage',
    CUSTOMERDETAILS : 'CustomerDetails',
    HOME: 'Home',
    SEREPORT: 'SEReport'
};

const DEFAULT_QUERY_LIMIT = 10;

module.exports = {
    SEND_OTP,
    RESEND_OTP,
    VERIFY_OTP,
    MERCHANT_API,
    //HEADERS,
    HTTP_CODES,
    LDAP_AUTHENTICATE,
    LDAP_CRYPTO,
    DB,
    LOGIN_TYPE,
    DEFAULT_QUERY_LIMIT,
    FROM_PAGE,
    RSA_PUBLIC_PASS_KEY,
    RSA_PRIVATE_PASS_KEY
};
