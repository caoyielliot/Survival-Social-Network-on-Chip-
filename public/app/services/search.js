angular.module('SearchService', [])
    .service('search', function () {
        this.getsection = function() {
            return this.sectionname;
        };

        this.setsection= function(sectionname) {
            this.sectionname = sectionname;
        };
        this.getkeywords = function() {
            return this.keywords;
        };

        this.setkeywords= function(keywords) {
            this.keywords = keywords;
        };
    });