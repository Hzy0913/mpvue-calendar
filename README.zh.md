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

> 一款功能丰富的日历组件，支持多种模式和手势滑动。 基于vue 3.0+

<p align="center">
<img width="940" src="http://img.binlive.cn/upload/1613974387283calendar-preview.png" alt="mpvue-calendar preview">
</p>

- #### [预览](http://preview.binlive.cn/mpvue-calendar#/ "Preview")
- #### [例子](https://github.com/Hzy0913/mpvue-calendar/blob/master/example/App.vue "Demo")

## 💻 安装
mpvue-calendar 只支持 **vue@3.0+**

```
npm i mpvue-calendar -S
```
## 🔨 使用

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
| selectMode  | String  | 'select'  | 对于日历组件的选择模式，可以通过传入**'select'**, **'multi'**,**'range'**, **'multiRange'** 参数使用  |
|  mode | String  |  'month'|  配置日历显示模式，可以通过传入 **'month'**, **'week'**,**'monthRange'**  使用该功能 |
| selectDate  | String / String[] / {start: String; end: String} / {start: String; end: String} [] |   |在不同的选择模式下，需要对应不同的数据类型。  `String` 类型对应在 'select' 模式下，`String[]` 数组类型对应在 'multi' 模式下，`{start: String; end: String}` 类型对应在 'range' 模式下，`{start: String; end: String}[]` 数组类型对应在 'multiRange' 模式下 |
|  monthRange  |  String[]  |    |如果使用monthRange模式，则需要设置要显示的月份的内容。 例如[2021-1、2021-2、2021-3]   |
| remarks  | Object  |   |  创建某一天的备注，key是日期字符串，value是备注内容。 例如{'2021-1-13'：'一些备注'} |
| tileContent  |  Object |   | 创建某一天的贴片内容，key是日期字符串，value是object类型，`object`有**className**和**content**字段。例如{2021-1-5'：{className:'tip class'，content:'some tip'}  |
|  holidays  |  Object  |    |  自定义节假日信息，例如{'2021-1 ':'New Year'} |
|  completion | Boolean  | false  | 用6行补全日历表格 |
| useSwipe  | Boolean  |  true |  启用移动端支持手势滑动切换日历   |
| arrowLeft  | String  |   |  工具栏左侧箭头图片   |
| arrowRight  | String  |   |  工具栏右侧箭头图片   |
| monFirst  | Boolean  |  false |  一周的第一天从星期一开始 |
| backgroundText  | Boolean  |  false | 显示当前月份的背景文本 |
|  language  |  String  |    | 使用 **'en'** 或 **'cn'** 语言   |
|  format  |  (year, month) => [String, String]  |    | 格式化头部的日期显示。 您需要返回一个数组，该数组的内容是对应的年和月  |
|  weeks  |  String[]  |    | 自定义标题的每周显示内容，例如['星期一', '星期二', '星期三', '星期四', ...] |
|  begin  |  String  |    |   设置开始的可用日期，在此之前的日期将被禁用，例如 '2021-1-5'  |
|  end  |  String  |    |  设置结束的可用日期，在此之后的日期将被禁用，例如 '2021-2-5'   |
|  disabled  |  String[]  |    | 禁用某些日期，例如 `['2021-1-9', '2021-2-5']`|

#### 农历
如果你需要展示中国农历，你需要导入农历模块。
```javascript
<Calendar
  :lunar="lunar"
/>

import lunar from 'mpvue-calendar/dist/lunar'
export default {
  ...,
  setup() {
    return {
      lunar,
    }
  }
}
```

## ⚙️ methods
|  name | type  |  description |
| ------------ | ------------ | ------------ |
| onSelect  |  (selectDate) => void |   选择日期时触发此函数 |
| monthChange | (year, month, day) => void  |   当月份发生变化时会触发该回调  |
| next | (year, month) => void  |  进入下月时触发该回调方法|
| prev | (year, month) => void  |    进入上月时触发该回调方法 |
| setToday | ref method | 回到今天，您需要传递ref参数来调用组件内部方法 |
