const env = process.env.NODE_ENV;

const development = {
    MONGODB_URL : "mongodb://yakup:yakup@qrpilotdb-shard-00-00-eqssx.gcp.mongodb.net:27017,qrpilotdb-shard-00-01-eqssx.gcp.mongodb.net:27017,qrpilotdb-shard-00-02-eqssx.gcp.mongodb.net:27017/test?ssl=true&replicaSet=QRPilotDB-shard-0&authSource=admin&retryWrites=true&w=majority",
    node_port : 7000,
    jwtsecret : "myverysecretjwtsecret",
};

const production = {
    MONGODB_URL : "mongodb://yakup:yakup@qrpilotdb-shard-00-00-eqssx.gcp.mongodb.net:27017,qrpilotdb-shard-00-01-eqssx.gcp.mongodb.net:27017,qrpilotdb-shard-00-02-eqssx.gcp.mongodb.net:27017/test?ssl=true&replicaSet=QRPilotDB-shard-0&authSource=admin&retryWrites=true&w=majority",
    node_port : process.env.PORT || 7000,
    jwtsecret : "myverysecretjwtsecret",
};

const config = {
    development, production
};

//module.exports = config[env];
module.exports = development;
