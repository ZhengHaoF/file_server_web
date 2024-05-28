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