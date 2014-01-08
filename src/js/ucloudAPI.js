/*Библиотека для работы с API v1.0 платформы Unicloud Business 365*/

//Конструктор объекта работы с API. объект options должен содержать члены secretKey и email. Может содержать hostUrl - тогда он заменит дефолтный
var ucloudAPI = function (options) {
    this.hostUrl = "https://api.business365.ru";

    this.siteUrl = this.hostUrl.replace("api.", "");

	jQuery.extend(this, options);
    
    this.apiPath = "/api/1.0/";
	this.tasks = "tasks";
	this.projects = "projects";
	this.users = "users";

};
//Функция форматирования даты
Date.prototype.ucloudFormat = function(format) {
    if (this.toString() == "Invalid Date" || this.getYear() == 80 || this.getYear() == 70)
		return "Не задана";
	var f = {y : this.getFullYear(),m : this.getMonth() + 1,d : this.getDate(),H : this.getHours(),M : this.getMinutes(),S : this.getSeconds()}
	for(k in f)
		format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
	return format;
};

//функция расчёта служебного хеша для прохождения авторизации
ucloudAPI.prototype.getHash = function (url, date) {
	var sha1 = CryptoJS.HmacSHA1(this.dateToAuthString(date)+url, this.secretKey).toString();
	var base64 =Base64.encode(sha1);
	return base64;
};

ucloudAPI.prototype.dateToAuthString = function (date) {
	//return date.ucloudFormat("%y-%m-%dT%H:%M:%SZ")
	return date.toLocaleTimeString() +" "+ date.toLocaleDateString();
};

//добавляет заголовки авторизации ко всем ajax запросам
ucloudAPI.prototype.setAuthHeaders = function(){
	var self = this;
	jQuery.ajaxSetup({
	        beforeSend: function (xhr) {
	            if (self.secretKey == undefined || self.email == undefined)
	                return;
	                    //throw "Email and/or Secret Key is empty";
	            var date = new Date(); //получаем текущую дату/время
	            var url = this.url;
	            if (this.url.indexOf("?") != -1)
	                url = url.match("(/api/.*)[\?]")[1];
	            else url = url.match("(/api/.*)")[1];
	            xhr.setRequestHeader("X-Authorization", self.email + ":" + self.getHash(url, date));
	            xhr.setRequestHeader("X-Date", self.dateToAuthString(date) );
	            return xhr;
	        }
	});
}

//Получает list  Объектов и возвращает их в options.onSuccess функцию.
ucloudAPI.prototype.GetList = function(options){

	if (this.secretKey==undefined || this.email==undefined)
		throw "Email and/or Secret Key is empty";

	var date = new Date(); //получаем текущую дату/время

	$.ajax({
	  url: this.hostUrl+this.apiPath+options.entityName,
	  cache: true,
	  dataType: 'json',
	  data: options.params,
	  headers: {"X-Authorization": this.email+":"+this.getHash(this.apiPath+options.entityName, date), 
	  			"X-Date": this.dateToAuthString(date) },
	  success: function(data, textStatus){
		list = data.Data.Items;
		if (typeof options.onSuccess=="function")
			options.onSuccess(list);
		else throw new Error('"onSuccess" must be a function');
	  },
	  error : function(jqXHR, textStatus, errorThrown) {
	  	try{
		  	var serverError = JSON.parse(jqXHR.responseText);
			if (typeof options.onError=="function")
				options.onError(serverError.Status.Message);
			throw serverError.Status.Message;
		}	catch(e) {
			if (typeof options.onError=="function")
				options.onError(errorThrown);
			throw errorThrown;
		}
		}
	});
}


ucloudAPI.GetCredentials = function (url, success, error) {

    $.post(url + "?" + Math.random(), function (data) {
        var dataFromServer = JSON.parse(data);

        

        if (dataFromServer.Result != "Error") {
            this.secretKey = dataFromServer.SecretKey;
            this.email = dataFromServer.Email;
            console.log("Авторизация получена", dataFromServer)
            if (typeof success == "function")
                success(dataFromServer);
        } else {
            if (typeof error == "function")
                error(dataFromServer);
            console.log("Ошибка получения авторизации", dataFromServer)
        }

    });
}

//статический метод - получаем русский текст для статуса
ucloudAPI.StatusDictionary = {
	"InActive" : "Не активна",
	"Rejected" : "Отклонена",
	"Active" : "В работе",
	"Reported" : "С отчётом",
	"Clоsed" : "Решена",
	"Canceled" : "Отменена",
}

ucloudAPI.TaskActions = {
    "Rejected": "Отклонена",
    "Active": "В работе",
    "Clоsed": "Решена",
    "Canceled": "Отменена",
}

