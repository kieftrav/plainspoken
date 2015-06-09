// @$, @config

app.plugins.fetch = function fetch(data, cb, is_get) {
	if (app.config.env == 'alpha')		production_fetch(data, cb) 
	else								production_fetch(data, cb, is_get);
};
	
function production_fetch(data, cb) {
	var url = app.config.get_base_url();
	
	if (data.endpoint) {
		url += data.endpoint;
		delete data.endpoint;
	}
	
	var type = data._type || 'POST';
	delete data._type;
	
	var obj = {
		url			: url,
		type		: type,
		data		: data,
		xhrFields: {
			withCredentials: false
		},
		success		: function (data) {
			try {
				data = JSON.parse(data);
			} catch(err) {}
			
			cb(data);
		},
		error		: function (data) {
			if (data.status == 401 || data.status == 403 || data.status == 0) {
				app.trigger('fetch:error', data);
			}
				cb({ errors: data });
		}
	};
	
	if (obj.type == 'GET')
		delete obj.data;

	$.ajax(obj);
};
