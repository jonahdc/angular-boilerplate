
  (function () {
  'use strict';
  angular.module('a', ['ngMaterial'])
      .controller('DemoCtrl', DemoCtrl);

      DemoCtrl.$inject = ['$mdDialog'];

  function DemoCtrl($mdDialog) {
    var self = this;
    self.openDialog = function($event) {
      $mdDialog.show({
        controller: DialogCtrl,
        controllerAs: 'ctrl',
        templateUrl: 'dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose:true
      })
    }
  }
DialogCtrl.$inject = ['$timeout','$q','$scope','$mdDialog'];

  function DialogCtrl ($timeout, $q, $scope, $mdDialog) {
    var self = this;
    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    // ******************************
    // Template methods
    // ******************************
    self.cancel = function($event) {
      $mdDialog.cancel();
    };
    self.finish = function($event) {
      $mdDialog.hide();
    };
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      return query ? self.states.filter( createFilterFor(query) ) : self.states;
    }
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }
})();

angular
  .module('a', ['ngMaterial'])
  .controller('AppCtrl',AppCtrl)
  .controller('LeftCtrl', LeftCtrl)
  .controller('RightCtrl',RightCtrl);

AppCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];
LeftCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];
RightCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];

  function LeftCtrl($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  }

  function RightCtrl($scope, $timeout, $mdSidenav, $log) {
   $scope.close = function () {
     $mdSidenav('right').close()
       .then(function () {
         $log.debug("close RIGHT is done");
       });
   };
 }

  function AppCtrl($scope, $timeout, $mdSidenav, $log) {
   $scope.toggleLeft = buildDelayedToggler('left');
   $scope.toggleRight = buildToggler('right');
   $scope.isOpenRight = function(){
     return $mdSidenav('right').isOpen();
   };
   /**
    * Supplies a function that will continue to operate until the
    * time is up.
    */
   function debounce(func, wait, context) {
     var timer;
     return function debounced() {
       var context = $scope,
           args = Array.prototype.slice.call(arguments);
       $timeout.cancel(timer);
       timer = $timeout(function() {
         timer = undefined;
         func.apply(context, args);
       }, wait || 10);
     };
   }
   /**
    * Build handler to open/close a SideNav; when animation finishes
    * report completion in console
    */
   function buildDelayedToggler(navID) {
     return debounce(function() {
       $mdSidenav(navID)
         .toggle()
         .then(function () {
           $log.debug("toggle " + navID + " is done");
         });
     }, 200);
   }
   function buildToggler(navID) {
     return function() {
       $mdSidenav(navID)
         .toggle()
         .then(function () {
           $log.debug("toggle " + navID + " is done");
         });
     }
   }
 }
