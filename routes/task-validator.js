/**
 * Created by wb-xiongsongsong on 14-2-10.
 */

exports.任务时长 = function (str) {
    //1-360
    str = typeof str === 'string' ? str : ''
    return /^([1-9]|[1-9]\d|[1-2]\d\d|[1-3][0-5]\d|360)$/.test(str)
}

exports.需求名称 = function (str) {
    return str.length > 1
}

exports.任务类型 = function (str) {
    return str.length > 1
}

exports.任务时长 = function (str) {
    return str.length > 1
}

exports.需求方 = function (str) {
    return str.length > 1
}
