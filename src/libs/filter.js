let filter = {}

//时间处理
// 2017-12-14T14:32:45.000Z
filter.getYear = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return timestring.substring(0, 4)
}
filter.getMonth = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return timestring.substring(5, 7)
}
filter.getDay = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return timestring.substring(8, 10)
}
filter.getTime = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return timestring.substring(11, 19)
}
filter.getHour = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return timestring.substring(11, 13)
}
filter.getMinitus = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return timestring.substring(14, 16)
}
filter.getCNDate = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return (
    filter.getYear(timestring) +
    '年' +
    filter.getMonth(timestring) +
    '月' +
    filter.getDay(timestring) +
    '日'
  )
}
filter.getENDate = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return (
    filter.getYear(timestring) +
    '-' +
    filter.getMonth(timestring) +
    '-' +
    filter.getDay(timestring)
  )
}
filter.getCNDatetime = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return (
    filter.getCNDate(timestring) +
    ' ' +
    filter.getTime(timestring)
  )
}

filter.getENDatetime = function (timestring) {
  if (!timestring || timestring.length < 20) {
    return ''
  }
  return (
    filter.getENDate(timestring) +
    ' ' +
    filter.getTime(timestring)
  )
}

filter.getAbsolutePath = function (relativePath) {
  return CONFIG.SERVER_URL + relativePath;
}

export default filter
