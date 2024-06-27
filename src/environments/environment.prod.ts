export const environment = {
  production: true,
  cache: true,
  client_id: "RijekeMilosrdja",
  client_password: "RijekeMilosrdjaPristup",
  rest_server: {
    protokol: 'https://',
    //host: 'rest-api.mkovacic-dev.com', // dev server company: 2
    host: 'rijekamilosrda.versalink-api.com', // company : 3
    functions: {
        api: '/api/',
        token: '/token.php'
    },
    multimedia: '/Assets/multimedia'
  },
  google_map_api: '',
  cache_key: 'cache-key-',
  def_image: 'assets/imgs/no-image-icon-23485.png',
  company_id: 3,
  show_id: true,
  version: '13022024',
  db_version: '1.2.8',
};