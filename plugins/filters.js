import Vue from 'vue'
import dayjs from 'dayjs'
export const filters = {
  date: (value, format = 'YYYY-MM-DD') => {
    //import dayjs from 'dayjs' // ES 2015
    return dayjs(value).format(format)
  }
}

// Make sure to pick a unique name for the flag
// so it won't conflict with any other mixin.
if (!Vue.__my_filters__) {
  Vue.__my_filters__ = true
  for (const key in filters) {
    if (Object.hasOwnProperty.call(filters, key)) {
      Vue.filter(key, filters[key]) // Register your filter here
    }
  }
}
