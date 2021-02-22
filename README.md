<p align="center">
<a href="http://preview.binlive.cn/mpvue-calendar#/">
<img width="100" src="https://raw.githubusercontent.com/Hzy0913/hanlibrary/master/mpvue-calendar.png" alt="mpvue-calendar logo">
</a>
</p>
<p align="center">
  <a href="https://npmcharts.com/compare/mpvue-calendar?minimal=true">
  <img src="https://img.shields.io/npm/dm/mpvue-calendar.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/mpvue-calendar">
  <img src="https://img.shields.io/npm/v/mpvue-calendar.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/mpvue-calendar">
  <img src="https://img.shields.io/npm/l/mpvue-calendar.svg" alt="License">
  </a>
</p>

<h1 align="center">mpvue-calendar</h1>

> A feature-rich calendar component, support multiple modes and gesture sliding.

## 💻 Install
mpvue-calendar only support **vue@3.0+**

```
npm i mpvue-calendar -S
```
## 🔨 Usage

```javascript
<Calendar
  backgroundText
  class-name="select-mode"
  :remarks="remarks"
/>

import { ref } from 'vue'
import Calendar from 'mpvue-calendar'

export default {
  components: {
    Calendar,
  },
  setup() {
    const remarks = ref({'2021-1-13': 'some tings'})

    return {
      remarks,
    }
  }
}
```
## ⚙️ API
|  name  |  type  |  default  | description   |
| ------------ | ------------ | ------------ | ------------ |
| selectMode  | String  | 'select'  |  For the selection mode of calendar component, can be used by **'select'**, **'multi'**,**'range'**, **'multiRange'** mode.   |
|  mode | String  |  'month'|  Configure calendar display mode, the modes has **'month'**, **'week'**,**'monthRange'** |
| selectDate  | String / String[] / {start: String; end: String} / {start: String; end: String} [] |   |   In different selection modes, there are use different types.  **String** type for 'select' mode,** String[]** type for 'multi' mode, **{start: String; end: String} **type for 'range' mode, and **{start: String; end: String} [] ** type for 'multiRange' mode.  |
|  monthRange  |  String[]  |    | If you use **monthRange mode**,  you need to set the content of the month to be displayed. for example `[2021-1, 2021-2, , 2021-3]`   |
| remarks  | Object  |   |  Create remark for a day, key is date string, and value is remark content. for example** { '2021-1-13': 'some things' } **  |
| tileContent  |  Object |   | Create tile content  for a day, key is date string, and value is object, object have className and content . for example `{ '2021-1-5': { className: 'tip-class', content: 'some tip' } } `   |
|  holidays  |  Object  |    |   Custom holiday information,  for example `{'2021-1-1': 'New Year'}`  |
|  completion | Boolean  | false  |  Complete the calendar table with 6 lines   |
| useSwipe  | Boolean  |  true |  The mobile terminal supports gesture sliding to switch calendar   |
| monFirst  | Boolean  |  false |   The first day of the week begins on Monday  |
|  language  |  String  |    | use **'en'** ro **'cn'** language   |
|  format  |  (year, month) => [String, String]  |    | Format the date display at the header. you need return a array,  the contents of the array are year and month  |

