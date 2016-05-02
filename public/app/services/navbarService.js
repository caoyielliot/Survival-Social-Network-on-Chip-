"use strict";

angular.module('NavbarService', [])
    .service('Navbar', function () {
        // available alert_type: danger, success, info
        this.message_count = 0;
        this.private_message_count = 0;
    });