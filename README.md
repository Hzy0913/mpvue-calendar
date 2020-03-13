<p align="center">
<a href="http://preview.binlive.cn/mpvue-calendar#/">
<img width="100" src="https://raw.githubusercontent.com/Hzy0913/hanlibrary/master/mpvue-calendar.png" alt="mpvue-calendar logo">
</a>
</p>
<p align="center">
  <a href="https://npmcharts.com/compare/mpvue-calendar?minimal=true">
  <img src="https://img.shields.io/npm/dt/mpvue-calendar.svg?color=00abe0&style=popout" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/mpvue-calendar">
  <img src="https://img.shields.io/npm/v/mpvue-calendar.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/mpvue-calendar">
  <img src="https://img.shields.io/npm/l/mpvue-calendar.svg" alt="License">
  </a>
</p>

<h1 align="center">mpvue-calendar</h1>

基于vue-calendar的适配**mpvue**平台的的微信小程序日历组件，现在已可以使用在**浏览器端**
## 预览
![比邻binlive](http://img.binlive.cn/xcx.jpg)

#### 🖥  [点击浏览器端预览](http://preview.binlive.cn/mpvue-calendar#/ "浏览器端预览")
## 安装
```
npm i mpvue-calendar -S
```
## 使用
- `import Calendar from 'mpvue-calendar'` 引入组件
- `import 'mpvue-calendar/src/style.css'` 引入样式文件(mpvue 小程序端)
- `components`中注册组件`Calendar `
- `template`中使用组件`<Calendar />`

⚠️在浏览器端使用要引入下面`browser-style.css`替换上面的`style.css`
- `import 'mpvue-calendar/src/browser-style.css'` 引入样式文件(浏览器端)

## 参数及方法
| 参数or方法  | 类型  | 说明  | 默认值  |
| ------------ | ------------ | ------------ |------------ |
| months  | Array  | 自定义月份显示  |['一月', '二月', ... , '十二月']|
| weeks  | Array  | 自定义星期显示  |['日', '一', '二', '三', '四', '五', '六']|
| value  | Array  | 选中日期，具体用法见下  |-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
| begin  | Array  | 设置可用日期开始时间，在此之前的日期会被禁用，不传则不限制。例如想禁用2018-6-21日之前的所有日期，设为`[2018, 6, 21]`  |-|
| end  | Array  | 设置可用日期结束时间，在此之后的日期会被禁用，不传则不限制。例如想禁用2022-10-8日之后的所有日期，设为`[2022, 10, 8]`   |-|
| disabled  | Array  | 禁用指定日期，如禁用2018-6-21日为`['2018-6-21']`  |-|
| events  | Object  | 自定义事件备注  |-|
| lunar  | Boolean  | 是否显示农历  |`false`|
| monFirst   | Boolean  | 是否日期以星期一作为开始  |`false` (默认为星期日开头)|
| completion   | Boolean  | 是否补全日期，设为`true`时会以每月6行展示，不足6行的会用下月日期补全  |`false`|
| clean  | Boolean  | 是否为简洁模式，简洁模式下自定义备注会显示为圆点   |`false`|
| now  | Boolean or String | 是否显示今日，传入字符串时可以自定义日历上今日的文字   |`true`|
| almanacs   | Object  | 自定义节日，如{'11-14': '学生日', '11-22': '感恩日'}, 自定义节日会覆盖组件的默认节日信息  |-|
| tileContent  | Array  | 为每个具体日期自定义class和插入文本内容，具体用法见下   |-|
| range  | Boolean  | 是否为范围模式   |`false`|
| multi  | Boolean  | 是否为多选模式   |`false`|
| weekSwitch  | Boolean  | 是否为按周切换日期模式  |`false`|
| arrowLeft  | String  | 自定义左箭头图片，填写图片路径，不填则使用默认字体图标   |-|
| arrowRight  | String  | 自定义右箭头图片，填写图片路径，不填则使用默认字体图标   |-|
| responsive  | Boolean  | 是否启用样式自适应(只支持浏览器端)，会自动调整日历内部元素到合适大小   |`false`|
| monthRange  | Array  | 会根据传入的开始年月到结束年月，显示多个在范围内的月份，如['2019-2', '2020-3']会显示从2019年2月-2020年3月的13个月份日期   ||
| rangeMonthFormat  | String  | 在monthRange传入情况下，用来格式化年月份标题，如'yyyy-MM'则会显示2019-12、'yy年MM月'则会显示19年12月   ||
| select(val, val2)  | function  | 日期选中事件的回调方法,在range模式下val为开始日期、val2为结束日期，非range模式下val为选中日期，val2为日期信息   ||
| setToday()  | function  | 组件实例中的方法，可以返回今日   ||
| renderer(year, month, payload)  | function  | 组件实例中的方法，可以重新渲染指定日期(参数中传入渲染的年份(year)和月份(month)，需要为数字类型) 。在weekSwitch模式下，payload传数字(0-5)时，根据周的索引渲染该周。如果传入字符串'1'-'31'，则会查找出该年月日所在的周进行渲染||
| dateInfo(y, m, d)  | function  | 组件实例中的方法，传入年、月、日三个参数会返回当天的信息(农历、节气、星座、星期、天干地支等)   ||
| selectYear(year)  | function  | 选择年份事件的回调方法，year为选中的年份   ||
| selectMonth(month, year)  | function  | 选择月份事件的回调方法，month为选中的月份，year为选中的年份   ||
| prev(year, month, weekIndex)  | function  | 选择上一月事件的回调方法，参数year为年、month为月份，在weekSwitch模式下，weekIndex为周的索引   ||
| next(year, month, weekIndex)  | function  | 选择下一月事件的回调方法，参数同prev方法一致   ||

#### 参数说明
- `value` <br>
在普通模式下value为一维数组如2018年6月21为`[2018,6,21]`。<br>在range和multi模式下value为二维数组，如multi模式选中2018年6月21和6月28为`[[2018,6,21], [2018,6,28]]`。<br> 在range模式下如果定义value参数必须定义开始日期和结束日期，如`[[2018,6,21], [2018,6,28]]`(⚠️从开始日期到结束日期)。若需要清空选中value时，将value参数设置为`[]`(空数组)即可。
- `events` <br>
events为自定义备注，例如备注2018年6月21日为`{'2018-6-21': '今日备注', '2018-6-22':'明日备注'}`，在`clean`模式下备注为圆点，`lunar`农历模式下备注会替代农历优先展示。
- `now` <br>
now参数可以选择是否将今天日期展示为`今`字，传入false则不展示，传入字符串则展示你定义等字符串内容，默认为`true`，展示`今`字样。
- `tileContent` <br>
tileContent参数可以为具体某日定义一个class名，还可以插入一段文本内容。如`[{date: '2018-9-20', className: 'holiday', content: '休'}]`可以设置2018-9-20这天的class名为holiday，并且生成一个文本内容为 **休** 的dom节点。

## 示例
```javascript
<template>
  <div>
    <Calendar
      :months="months"
      :value="value"
      @next="next"
      @prev="prev"
      :events="events"
      lunar
      clean
      @select="select"
      ref="calendar"
      @selectMonth="selectMonth"
      @selectYear="selectYear"
      :arrowLeft="arrowLeft"
      :tileContent="tileContent"
      :almanacs="almanacs"
    />
    <button @click="setToday">返回今日</button>
    <button @click="dateInfo">日期信息</button>
    <button @click="renderer">重新渲染年月日期</button>
  </div>
</template>

<script>
import Calendar from 'mpvue-calendar'
import 'mpvue-calendar/src/style.css'
import arrowLeft from '../assets/arrowLeft.png' //使用自定义箭头图片

export default {
  data () {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      disabledArray: ['2018-6-27', '2018-6-25'],
      value: [2018, 6, 7],
      begin:[2016, 1, 1],
      end:[2020, 1, 1],
      events: {'2018-6-7': '今日备注', '2018-6-8': '一条很长的明日备注'},
      almanacs: {'9-3': '抗战胜利日', '11-17': '学生日'},
      tileContent: [
          {date: '2018-9-22', className: 'holiday', content: '休'},
          {date: '2018-9-23', className: 'holiday', content: '休'}
      ],
      arrowLeft: arrowLeft
    }
  },
  components: {
    Calendar
  },
  methods: {
    prev(year, month, weekIndex) {
      console.log(year, month, weekIndex)
    },
    next(year, month, weekIndex) {
      console.log(year, month, weekIndex)
    },
    selectYear(year) {
      console.log(year)
    },
    selectMonth(month, year) {
      console.log(year, month)
    },
    setToday() {
      this.$refs.calendar.setToday()
    },
    dateInfo() {
      const info = this.$refs.calendar.dateInfo(2018, 8, 23)
      console.log(info)
    },
    renderer() {
      this.$refs.calendar.renderer(2018, 8); //渲染2018年8月份
    },
    select(val, val2) {
      console.log(val)
      console.log(val2)
    }
  }
}
</script>
```
