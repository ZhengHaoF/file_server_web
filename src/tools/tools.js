/**
 * @description: 节流
 * @param {*} fn
 * @param time
 * @return {*}
 */
export const throttle = (fn, time) => {
    //3. 通过闭包保存一个 "节流阀" 默认为false
    let temp = false;
    return function () {
        //8.触发事件被调用 判断"节流阀" 是否为true  如果为true就直接trurn出去不做任何操作
        if (temp) {
            return;
        } else {
            //4. 如果节流阀为false  立即将节流阀设置为true
            temp = true; //节流阀设置为true
            //5.  开启定时器
            setTimeout(() => {
                //6. 将外部传入的函数的执行放在setTimeout中
                fn.apply(this, arguments);
                //7. 最后在setTimeout执行完毕后再把标记'节流阀'为false(关键)  表示可以执行下一次循环了。当定时器没有执行的时候标记永远是true，在开头被return掉
                temp = false;
            }, time);
        }
    };
}

/**
 * 存储当前文件夹的滚动位置
 */
export const setScroll = (path,scroll) => {
    sessionStorage.setItem(path,scroll)
}

/**
 * 获取当前文件夹的滚动位置
 */
export const getScroll = (path) => {
    return sessionStorage.getItem(path) || 0;
}

export function sum(a, b) {
    return a + b
}

/*
 *  根据某个字段实现对json数组的排序
 * @param   array  要排序的json数组对象
 * @param   field  排序字段（此参数必须为字符串）
 * @param   reverse 是否倒序（默认为false）
 * @return  array  返回排序后的json数组
*/
export const jsonSort = function (array, field, reverse) {
    // 数组长度小于2 或 没有指定排序字段 或 不是json格式数据
    if (array.length < 2 || !field || typeof array[0] !== "object") return array;
    // 数字类型排序
    if (typeof array[0][field] === "number") {
        array.sort(function (x, y) { return x[field] - y[field] });
    }
    // 字符串类型排序
    if (typeof array[0][field] === "string") {
        array.sort(function (x, y) { return x[field].localeCompare(y[field]) });
    }
    // 判断是否需要倒序
    if (reverse) {
        array.reverse();
    }
    return array;
}

export const determineFileType = function (suffix){
    const VIDEO = [".MP4", ".AVI", ".MOV", ".FLV", ".MKV", ".TS"];
    const IMG = [".JPG", ".JPEG", ".PNG", ".WEBP"];
    const PS = [".PSD"];
    const ZIP = [".RAR", ".ZIP", ".7Z"];
    const AUDIO = [".WAV", ".MP3", ".OGG"];
    const DOC = [".DOC", ".DOCX"];
    const PDF = [".PDF"];
    const DATA = [".SQL"];
    const EXCEL = [".XLS", ".XLSX"];
    const upperSuffix = suffix.toUpperCase();
    if (VIDEO.includes(upperSuffix)) {
        return 'VIDEO';
    } else if (IMG.includes(upperSuffix)) {
        return 'IMG';
    } else if (PS.includes(upperSuffix)) {
        return 'PS';
    } else if (ZIP.includes(upperSuffix)) {
        return 'ZIP';
    } else if (AUDIO.includes(upperSuffix)) {
        return 'AUDIO';
    } else if (DOC.includes(upperSuffix)) {
        return 'DOC';
    } else if (PDF.includes(upperSuffix)) {
        return 'PDF';
    } else if (DATA.includes(upperSuffix)) {
        return 'DATA';
    } else if (EXCEL.includes(upperSuffix)) {
        return 'EXCEL';
    } else {
        return 'UNKNOWN';
    }
}