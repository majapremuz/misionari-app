// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  app_version: 114,
  cache: false,
  client_id: "testclient",
  client_password: "testpass",
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
  version: '02122023',
  db_version: '1.0.3'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
