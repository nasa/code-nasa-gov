(function() {
  'use strict';

  angular.module('services', [])

  .factory('CatalogService', ['$resource', function($resource) {
    var baseURL = '/data/catalog.json',
        catalogService = {
          get: $resource(baseURL, {}, {
            query: {
              method: 'GET',
              isArray: true
            }
          })
        };

    return catalogService;
  }])

  .factory('SraService', ['$resource', function($resource) {
    var baseURL = '/data/SRA.json',
        sraService = {
          get: $resource(baseURL, {}, {
            query: {
              method: 'GET',
              isArray: true
            }
          })
        };

    return sraService;
  }]);
})();
