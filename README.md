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
