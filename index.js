var MyForm = {
    // validate() => { isValid: Boolean, errorFields: String[] }
    // getData() => Object
    // setData(Object) => undefined
    // submit() => undefined
};

var app = angular.module('app', []);
    
app.controller('AppController', ['$log', '$http', '$q', function($log, $http, $q) {
    var ctrl = this;

    MyForm = ctrl.test;

    var restMockArray = [
        'response-mocks/success.json',
        
        'response-mocks/error.json',
        
        'response-mocks/progress.json'
    ];

    var resultContainer = angular.element(document.getElementById('resultContainer'));
        
    ctrl.randomRestMock = function() {

        // return random response mock
        
        return restMockArray[Math.floor(Math.random() * 3)];
    };

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
            return this.fio
                && this.email
                && this.phone;
        }
    };

    ctrl.validate = {
        fio: function(fio) {
            var re =  /^\s*[А-ЯЁа-яёA-Za-z]+\s+[А-ЯЁа-яёA-Za-z]+\s+[А-ЯЁа-яёA-Za-z]+\s*$/;
            
            return re.test(fio);
        },

        email: function(email) {
            var appropriateDomains = [
                    'ya.ru',
                    
                    'yandex.ru',
                    
                    'yandex.ua',
                    
                    'yandex.by',
                    
                    'yandex.kz',
                    
                    'yandex.com'
            ];

            var rePattern = /^\s*[A-Za-z0-9._%+-]+@/;

            var reDomains = '(' + appropriateDomains.join('|') + ')\s*$';

            var reEmail = new RegExp(rePattern.source + reDomains);

            return reEmail.test(email);
        },

        phone: function(phone) {
           var re = /^\s*\+7\(\d{3}\)\d{3}-\d{2}-\d{2}\s*$/;

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

                    resultContainer.html('');

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