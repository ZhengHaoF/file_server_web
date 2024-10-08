/**
 * 格式化时间
 * @param time {Date} 时间对象，可以是字符串
 * @param cFormat
 * @cFormat 格式化方法 例：'{y}-{m}-{d}-{h}-{i}-{s}-{a}'
 */
export const formatDate = function(time, cFormat = null) {
    const format = cFormat || '{y}-{m}-{d}';
    const date = new Date(time);
    const formatObj = {
        //年
        y: date.getFullYear(),
        //月
        m: date.getMonth() + 1,
        //日
        d: date.getDate(),
        //小时
        h: date.getHours(),
        //分钟
        i: date.getMinutes(),
        //秒
        s: date.getSeconds(),
        //星期
        a: date.getDay()

    };
    return format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            //如果key是a，就是星期，格式化成一~日
            //例如formatDate(new Date(), '{y}-{m}-{d}-{h}-{i}-{s}-{a}');
            //会输出2021-10-29-00-00-00-五
            //星期的value会返回0-6，['日', '一', '二', '三', '四', '五', '六'][2]代表周二
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        //padStart用于字符串头部补全，2个字符，如果不够前面补0
        return value.toString().padStart(2, '0');
    });
};

//获取屏幕缩放比例
export const  getRatio = function()
{
    var ratio=0;
    var screen=window.screen;
    var ua=navigator.userAgent.toLowerCase();

    if(window.devicePixelRatio !== undefined)
    {
        ratio=window.devicePixelRatio;
    }
    else if(~ua.indexOf('msie'))
    {
        if(screen.deviceXDPI && screen.logicalXDPI)
        {
            ratio=screen.deviceXDPI/screen.logicalXDPI;
        }

    }
    else if(window.outerWidth !== undefined && window.innerWidth !== undefined)
    {
        ratio=window.outerWidth/window.innerWidth;
    }

    if(ratio)
    {
        ratio=Math.round(ratio*100);
    }
    return ratio;
}