angular.module('NotificationService', [])
    .service('Notification', function () {
        // available alert_type: danger, success, info
        this.postNotification = function ($rootScope, message, alert_type) {
            // console.log("notification: " + message);
            if (alert_type === undefined) {
                alert_type = "info";
            }
            $("#notification").append(
                "<div class=\"alert alert-dismissable alert-"+alert_type+" ng-binding\">"+
                    "<button type=\"button\" data-dismiss=\"alert\" class=\"close\">"+
                        "<span aria-hidden=\"true\">&times;</span>"+
                    "</button>" +
                    message +
                "</div>"
            );
        };
    });