/** 时间：时间格式化成字符串 */
const dateFormat = (date, fmt)=> {
  let ret;
  const opt = {
    "y+": date.getFullYear().toString(),        // 年
    "M+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "m+": date.getMinutes().toString(),         // 分
    "s+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}


/** 增加天数 */
const addDays = (date, number)=> {
  var adjustDate = new Date(date.getTime() + 24 * 60 * 60 * 1000 * number)
  // alert("Date" + adjustDate.getFullYear() + "-" + adjustDate.getMonth() + "-" + adjustDate.getDate());
  return adjustDate;
}
/** 增加秒数 */
const addSeconds=(date, number)=> {
  var adjustDate = new Date(date.getTime() + 1000 * number)
  // alert("Date" + adjustDate.getFullYear() + "-" + adjustDate.getMonth() + "-" + adjustDate.getDate());
  return adjustDate;
}

/** 增加月数 */
const addMonths=(date, number)=> {
  return new Date(date.getFullYear(),date.getMonth()+number,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
  // alert("Date" + adjustDate.getFullYear() + "-" + adjustDate.getMonth() + "-" + adjustDate.getDate());
}

export const tool = {
  dateFormat,
  addDays,
  addMonths,
  addSeconds,
}