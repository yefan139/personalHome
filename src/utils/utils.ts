// 写一个判断是移动端还是web端的函数
export function isMobile() {
    const userAgentInfo = navigator.userAgent;
    const mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let mobileFlag = false;
    // 根据userAgent判断是否是手机
    for (let v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobileFlag = true
            break
        }
    }
    if (window.innerHeight <= 768) {
        // 当前设备是移动端
        mobileFlag = true;
    }
    return mobileFlag;
}
