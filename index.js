(function() {
    var app = angular.module('app', []);

    app.controller('AppController', ['$scope', '$log', '$http', '$q', '$sce', function($scope, $log, $http, $q, $sce) {
        var ctrl = this;

        var resultContainer = angular.element(document.getElementById('resultContainer'));

        var restMockArray = [
            'response-mocks/success.json',
            'response-mocks/error.json',
            'response-mocks/progress.json'
        ];

        ctrl.restMock = '';

        ctrl.randomRestMock = function() {
            // return random response mock
            return restMockArray[Math.floor(Math.random() * 3)];
        };

        ctrl.formValidStatus = {
            fio: true,

            email: true,

            phone: true,

            valid: function() {
                return this.fio && this.email && this.phone;
            }
        };

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

                var rePattern = '[A-Za-z0-9._%+-]+@';

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
            },

            all: function() {
                ctrl.formValidStatus.fio = this.fio(ctrl.form.fio);

                ctrl.formValidStatus.email = this.email(ctrl.form.email);

                ctrl.formValidStatus.phone = this.phone(ctrl.form.phone);
            }
        };

        var getRequest = function() {
            // $log.debug('Rest is: ', rest);

            ctrl.restMock = ctrl.randomRestMock();
            
            $http.get(ctrl.restMock).then(function(res) {
                if (res.data.status == 'success') {
                    resultContainer.addClass('success');

                    resultContainer.html('Success');
                }

                if (res.data.status == 'error') {
                    resultContainer.addClass('success');

                    resultContainer.html(res.data.reason);
                }

                if (res.data.status == 'progress') {
                    resultContainer.addClass('progress');

                    setTimeout(function() {
                        getRequest();
                    }, res.data.timeout);
                }
            }, function(error) {
                return $q.reject(error);
            });
        };

        ctrl.form = {
            fio: 'Alex Alex Alex',

            email: 'ya@ya.ru',

            phone: '+7(211)212-12-12',

            submit: function(e) {
                e.preventDefault();
                
                $log.debug('Form has been submited.');

                ctrl.validate.all();

                if (!ctrl.formValidStatus.valid()) {
                    $log.debug('Validation did not passed.');

                    return;
                } else {
                    $log.debug('Validation passed.');

                    getRequest();
                }
            }
        };
    }]);
})();