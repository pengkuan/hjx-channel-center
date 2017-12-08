import { Message } from 'element-ui'

var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'

// 字符长度验证  汉字2字符 英文1字符
String.prototype.gblen = function() {
    var len = 0
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2
        } else {
            len++
        }
    }
    return len
}


function padding(s, len) {
    let l = len - (s + '').length
    for (var i = 0; i < l; i++) { s = '0' + s }
    return s
}

function Trim(str) {
    if (!str) return str
    else return str.replace(/(^\s*)|(\s*$)/g, "")
}

function checkSpecialWord(val) {
    var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    return reg.test(val)
}

function checkNumber(val) {
    var reg = new RegExp("[0-9]")
    return reg.test(val)
}

export default {
    jsonpUrl: process.env.NODE_ENV == 'development' ? 'https://dev-access.huanjixia.com/index/index' : '',//jsonp开发环境、线上环境
    api: process.env.NODE_ENV == 'development' ? '/pengkuan' : '',  
    apiCross: process.env.NODE_ENV == 'development' ? 'https://dev-amc-server.huanjixia.com' : 'https://dev-amc-server.huanjixia.com', //开发环境(51测试环境)
    // apiCross :  process.env.NODE_ENV == 'development'?'https://dev-amc-server.huanjixia.com':'https://amc-server.huanjixia.com' ,//开发环境 、线上环境 
    powerCenterLoginPage: 'http://api-amc.huishoubao.com.cn', //权限中心登录页面
    accessChannelHost: 'https://mba.huanjixia.com/channel_center', //登录后，后台跳转到渠道中心页面
    accessHomeHost: 'https://mba.huanjixia.com/login', //登录后，后台跳转到home页面
    channelCenterSystemId: '23', //渠道中心系统id 
    homeSystemId: '100', //总入口系统id  
    removeClass(obj, cls) {
        if (cls) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
            obj.className = obj.className.replace(reg, ' ')
            console.log(obj.className)
        }
    },
    setCookie(name, value) {
        var Days = 30
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
    },
    getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2])
        } 
        else {
            return null
        } 
    },
    delCookie(name) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var cval = this.getCookie(name)
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
    },
    // 设置本地储存
    Set_lsdata(key, value) {
        if (key != "") {
            if (value) {
                var lsobj = window.localStorage
                var datajson = JSON.stringify(value)
                lsobj.setItem(key, datajson)
            }
        }
    },
    Get_lsdata(key) {
        if (key != "") {
            var data = null
            var lsdata = window.localStorage
            try {
                var datajson = lsdata.getItem(key)
                datajson = JSON.parse(datajson)
                data = datajson
            } catch (e) {

            } finally {
                return data
            }
        }
    },
    // 设置本地储存
    Set_lsdata(key, value) {
        if (key != "") {
            if (value) {
                var lsobj = window.localStorage
                var datajson = JSON.stringify(value)
                lsobj.setItem(key, datajson)
            }
        }
    },
    Get_lsdata(key) {
        if (key != "") {
            var value = null
            var lsdata = window.localStorage
            try {
                var datajson = lsdata.getItem(key)
                datajson = JSON.parse(datajson)
                value = datajson
            } catch (e) {

            } finally {
                return value
            }
        }
    },
    //数组去重
    unique(list) {
        var res = []
        var json = {}
        for (var i = 0; i < list.length; i++) {
            if (!json[list[i]]) {
                res.push(list[i])
                json[list[i]] = 1
            }
        }
        return res
    },
    combineCell: function(list) {
        for (var field in list[0]) {
            var k = 0
            while (k < list.length) {
                list[k][field + 'Span'] = 1
                list[k][field + 'Dis'] = false
                for (var i = k + 1; i <= list.length - 1; i++) {
                    if (list[k][field] == list[i][field] && list[k][field] != '') {
                        list[k][field + 'Span']++
                            list[k][field + 'Dis'] = false
                        list[i][field + 'Span'] = 1
                        list[i][field + 'Dis'] = true
                    } else {
                        break
                    }
                }
                k = i
            }
        }
        return list
    },
    // 获取对应城市
    getCitys: function(val, addrList) {
        if (!val) {
            addrList.citys = []
            return
        }
        let provinces = addrList.provinces
        for (var index in provinces) {
            if (provinces[index].strProvinceId == val) {
                addrList.citys = provinces[index].citys
            }
        }
    },
    // 获取对应区域
    getAreas: function(val, addrList) {
        if (!val) {
            addrList.areas = []
            return
        }
        let citys = addrList.citys
        for (var index in citys) {
            if (citys[index].strCityId == val) {
                addrList.areas = citys[index].areas
            }
        }
    },
    // 特殊字符串处理
    checkSpecialWord: function(val) {
        var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        return reg.test(val)

    },
    ValidateValue: function(textbox) {
        var IllegalString = "\`~@#;,.!#$%^&*()+{}|\\:\"<>?-=/。，。\'"
        var textboxvalue = textbox.value
        var index = textboxvalue.length - 1

        var s = textbox.value.charAt(index)

        if (IllegalString.indexOf(s) >= 0) {
            s = textboxvalue.substring(0, index)
            textbox.value = s
        }
    },

    // 提交数据验证
    Validate: function(list) {
        for (var index in list) {
            if (!list[index].val) {
                Message({ message: list[index].msg, type: 'warning' })
                return false
            }
        }
        return true
    },
    //邮箱验证
    validatestrEmail: (rule, value, callback) => {
        if (!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g.test(value)) {
            callback(new Error('请输入正确邮箱'))
        }
        callback()
    },
    //手机号验证
    validateTel: (rule, value, callback) => {
        if (!/^1[3|4|5|7|8]\d{9}$/g.test(value)) {
            callback(new Error('请输入正确手机号'))
        }
        callback()
    },
    //名称验证
    validateName: (rule, value, callback) => {
        value = Trim(value)
        let len = value.gblen()
        if (len < 4 || len > 50) {
            callback(new Error('请输入4~50个字符'))
        } else if (checkSpecialWord(value)) {
            callback(new Error('不能包含特殊字符'))
        } else if (checkNumber(value)) {
            callback(new Error('不能包含数字'))
        }
        callback()
    },
    validateName1: (rule, value, callback) => {
        value = Trim(value)
        let len = value.gblen()
        if (len < 1 || len > 40) {
            callback(new Error('请输入40个以内字符'))
        } else if (checkSpecialWord(value)) {
            callback(new Error('不能包含特殊字符'))
        }
        callback()
    },
    //身份证验证
    validatestrCardNum: (rule, value, callback) => {
        value = Trim(value)
        if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/g.test(value)) {
            callback(new Error('请输入正确身份证号'))
        }
        callback()
    },
    //描述验证
    validateDesc: (rule, value, callback) => {
        value = Trim(value)
        let len = value.gblen()
        if (len < 1 || len > 100) {
            callback(new Error('请输入100个以内字符'))
        }
        callback()
    },
    //银行卡号验证
    validateAccountNum: (rule, value, callback) => {
        if (!/(^\d{10,30}$)/g.test(value)) {
            callback(new Error('请输入10~30位银行卡号'))
        }
        callback()
    },
    //营业执照验证
    validateLicenseNum: (rule, value, callback) => {
        if (!/^(([0-9a-zA-Z]{15})|([0-9a-zA-Z]{18}))$/g.test(value)) {
            callback(new Error('请输入15或18位营业执照号（字母或数字）'))
        }
        callback()
    },
    //输入详细地址验证
    validateAddr: (rule, value, callback) => {
        let len = value.gblen()
        if (len < 6 || len > 100) {
            callback(new Error('请输入6~100个字符'))
        }
        callback()
    },
    Trim: function(str) {
        if (!str) return str
        else return str.replace(/(^\s*)|(\s*$)/g, "")
    },

    getQueryStringByName: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.search.substr(1).match(reg)
        var context = ''
        if (r != null) { context = r[2] }
        reg = null
        r = null
        return context === null || context === '' || context === 'undefined' ? '' : context
    },
    formatDate: {

        format: function(date, pattern) {
            if(typeof(date) == "string") date = new Date(date)
            pattern = pattern || DEFAULT_PATTERN
            return pattern.replace(SIGN_REGEXP, function($0) {
                switch ($0.charAt(0)) {
                    case 'y':
                        return padding(date.getFullYear(), $0.length)
                    case 'M':
                        return padding(date.getMonth() + 1, $0.length)
                    case 'd':
                        return padding(date.getDate(), $0.length)
                    case 'w':
                        return date.getDay() + 1
                    case 'h':
                        return padding(date.getHours(), $0.length)
                    case 'm':
                        return padding(date.getMinutes(), $0.length)
                    case 's':
                        return padding(date.getSeconds(), $0.length)
                }
            })
        },
        parse: function(dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP)
            var matchs2 = dateString.match(/(\d)+/g)
            if (matchs1.length === matchs2.length) {
                var _date = new Date(1970, 0, 1)
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i])
                    var sign = matchs1[i]
                    switch (sign.charAt(0)) {
                        case 'y':
                            _date.setFullYear(_int);
                            break
                        case 'M':
                            _date.setMonth(_int - 1);
                            break
                        case 'd':
                            _date.setDate(_int);
                            break
                        case 'h':
                            _date.setHours(_int);
                            break
                        case 'm':
                            _date.setMinutes(_int);
                            break
                        case 's':
                            _date.setSeconds(_int);
                            break
                    }
                }
                return _date
            }
            return null
        },


    }

}
