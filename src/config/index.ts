export default {
    node_env: process.env.REACT_APP_BASIC_NODE_ENV,
    client: {
        host: process.env.REACT_APP_BASIC_CLIENT_HOST,
    },
    server: {
        protocol: process.env.REACT_APP_BASIC_SERVER_PROTOCOL,
        host: process.env.REACT_APP_BASIC_SERVER_HOST,
        port: process.env.REACT_APP_BASIC_SERVER_PORT,
    },
    aws: {
        cdn_name: process.env.REACT_APP_BASIC_AWS_CDN_NAME,
        bucket_name: process.env.REACT_APP_BASIC_AWS_BUCKET_NAME,
        region: process.env.REACT_APP_BASIC_AWS_REGION,
    },
};
