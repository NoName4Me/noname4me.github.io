// -------- basic router
angular
    .module("root", ["ui.router"])
    .controller("urlRouterCtrl", function($scope, $stateParams) {
        $scope.desc = $stateParams.desc;
    })
    .config(function($stateProvider) {
        var helloState = {
            name: "router1",
            url: "/router1",
            template: `<h3>Router 1!</h3>
            Here goes sub-state-view
            <ui-view></ui-view>`
        };

        var aboutState = {
            name: "router2",
            url: "/router2",
            template: "<h3>This is router 2~</h3>"
        };

        var urlState = {
            name: "router1.sub",
            url: "/sub/:desc",
            controller: 'urlRouterCtrl',
            template: `<p ng-bind="desc"></p>`
        };

        $stateProvider.state(helloState);
        $stateProvider.state(aboutState);
        $stateProvider.state(urlState);
    });

// -------- basic router
angular.module("namedView", ["ui.router"]).config(function($stateProvider) {
        $stateProvider.state('main', {
            url: '/main', // tempalte/Url将失效（无法设置）
            views: {
                'header': {
                    template: `
                    <strong>This is header~</strong>
                    `,
                    controller: function($scope) {}
                },
                'nav': {
                    template: `
                    <strong>navigation~</strong>
                    <ul><li>Nav-1</li><li>Nav-2</li><li>Nav-3</li></ul>
                    `,
                    controller: function($scope) {}
                },
                'content': {
                    template: `<strong>This is content~</strong>`,
                    controller: function($scope) {}
                }
            }
        })
    });