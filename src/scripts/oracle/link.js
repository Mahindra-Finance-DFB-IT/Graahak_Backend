const oracledb = require('oracledb');
try {
  oracledb.initOracleClient({libDir: 'C:\\Users\\ghara\\Documents\\Software\\instantclient_21_6'});
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}



async function run() {
   let connection = await oracledb.getConnection({
    user          : "API_USERS",
    password      : "API@2022",
    connectString : "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.58.111)(PORT=1433))(CONNECT_DATA=(SID=ORCL)))",
    externalAuth  : false,
  });

}

run();