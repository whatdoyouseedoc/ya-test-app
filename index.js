var MyForm = {
    // validate() => { isValid: Boolean, errorFields: String[] }
    // getData() => Object
    // setData(Object) => undefined
    // submit() => undefined
};

var app = angular.module('app', []);
    
app.controller('AppController', ['$log', '$http', '$q', '$scope', function($log, $http, $q, $scope) {
    var ctrl = this;

    var restMockArray = [
        'success.json',
        
        'error.json',
        
        'progress.json'
    ];

    ctrl.rest = restMockArray[0];

    var resultContainer = angular.element(document.getElementById('resultContainer'));

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
        invalidFields: [],

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
            ctrl.validate.invalidFields = [];

            ctrl.formValidStatus.fio = this.fio(ctrl.form.fio);

            if (!ctrl.formValidStatus.fio) {
                ctrl.validate.invalidFields.push('fio');
            }

            ctrl.formValidStatus.email = this.email(ctrl.form.email);

            if (!ctrl.formValidStatus.email) {
                ctrl.validate.invalidFields.push('email');
            }

            ctrl.formValidStatus.phone = this.phone(ctrl.form.phone);

            if (!ctrl.formValidStatus.phone) {
                ctrl.validate.invalidFields.push('phone');
            }
        }
    };    

    var getRequest = function() {
        // ctrl.restMock = ctrl.randomRestMock();
        
        $http.get(ctrl.rest).then(function(res) {
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
            if (e) e.preventDefault();
            
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

    MyForm.validate = function() {
        var result = {};

        ctrl.validate.all();

        result.isValid = ctrl.formValidStatus.valid();

        result.errorFields = ctrl.validate.invalidFields;

        return result;
    };

    MyForm.getData = function() {
        var result = {
            fio: ctrl.form.fio,

            email: ctrl.form.email,

            phone: ctrl.form.phone
        };
        
        return result;
    };

    MyForm.setData = function(data) {
        if (data.fio !== undefined) {
            ctrl.form.fio = data.fio;
        }

        if (data.email !== undefined) {
            ctrl.form.email = data.email;
        }

        if (data.phone !== undefined) {
            ctrl.form.phone = data.phone;
        }

        $scope.$digest();
    };

    MyForm.submit = ctrl.form.submit;
}]);