(function() {
    var app = angular.module('app', []);

    app.controller('AppController', ['$scope', '$log', function($scope, $log) {
        var ctrl = this;

        ctrl.validate = {
            fio: function(fio) {
                var re =  new RegExp('[А-ЯЁа-яёA-Za-z]+ [А-ЯЁа-яёA-Za-z]+ [А-ЯЁа-яёA-Za-z]+');
                
                return re.test(fio);
            },

            email: function(email) {
                var isValid = false;

                var appropriateDomains = [
                     'ya.ru',
                     'yandex.ru',
                     'yandex.ua',
                     'yandex.by',
                     'yandex.kz',
                     'yandex.com'
                ];

                var rePattern = '[A-Za-z0-9._%+-]+';

                try {
                    appropriateDomains.forEach(function(domain) {
                        var re = new RegExp(rePattern + domain);

                        if (re.test(email)) {
                            isValid = true;

                            throw 'BreakException';
                        }
                    });
                } catch (e) {
                    if ( e !== 'BreakException') throw e;
                }

                return isValid;
            },

            phone: function(phone) {
                var re = new RegExp(/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/);

                if (!re.test(phone)) {
                    return false;
                } else {
                    var sum = phone.match(/\d/g).reduce(function(a, b) {
                        return Number(a) + Number(b);
                    });

                    return sum < 30;
                }
            }
        };

        ctrl.form = {
            fio: null,

            email: null,

            phone: null,

            submit: function() {
                $log.debug('Form has been submited.');
            }
        };
    }]);
})();