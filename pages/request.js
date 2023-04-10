//通用请求方法

export function request(url, method, params) {
	let header = {
		'Accept': 'application/json, text/plain, */*',
		'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
	}
		// header['content-type']= 'application/json;charset=UTF-8'
	return new Promise((resolve, reject) => {
		
		uni.request({
			url: url || '', // url 要与 proxy 匹配，不能写成 xx.com/api.1.json
			method: method || '',
			header: header,
			data: params ? params : {},
			success: (res) => {
				return resolve(res)
			},

			fail: (err) => {
				console.log('rejecterris',err)
				return reject(err)
			}
		})
	});
}
