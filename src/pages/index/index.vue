<template>
  <div class="container">
    <div class="container-box" :class="{blur: isblur}">
      <div class="home-card">
        <div class="constellation">
          <div class="logo">
            <button class="login" open-type="getUserInfo" @getuserinfo="onGotUserInfo" v-if="!constellationName">
              <img src="../../assets/none.png" alt="">
            </button>
            <img :src=constellationName @click="handleChange" v-if="!!constellationName">
          </div>
          <div class="constellation-fate">
            <div class="constellation-item">
              <h1>幸运指数:</h1>
              <div class="start-box">
                <div class="start-bg">
                  <img src="../../assets/star-white.png" class="star-white" v-for="(i, a) in [1, 1, 1, 1, 1]" :key="a">
                </div>
                <div class="start">
                  <img src="../../assets/star.png" class="star-white" v-for="(i, a) in all" :key="a">
                  <img src="../../assets/star-half.png" class="star-white" v-if="allhalf">
                </div>
              </div>
            </div>
            <div class="constellation-item">
              <h1>爱情指数:</h1>
              <div class="start-box">
                <div class="start-bg">
                  <img src="../../assets/star-white.png" class="star-white" v-for="(i, a) in [1, 1, 1, 1, 1]" :key="a">
                </div>
                <div class="start">
                  <img src="../../assets/star.png" class="star-white" v-for="(i, a) in love" :key="a">
                  <img src="../../assets/star-half.png" class="star-white" v-if="lovehalf">
                </div>
              </div>
            </div>
            <div class="constellation-item">
              <h1>工作指数:</h1>
              <div class="start-box">
                <div class="start-bg">
                  <img src="../../assets/star-white.png" class="star-white" v-for="(i, a) in [1, 1, 1, 1, 1]" :key="a">
                </div>
                <div class="start">
                  <img src="../../assets/star.png" class="star-white" v-for="(i, a) in work" :key="a">
                  <img src="../../assets/star-half.png" class="star-white" v-if="workhalf">
                </div>
              </div>
            </div>
          </div>
          <div class="more" @click="handleMore">更多>></div>
        </div>
        <div class="remark-con">
          <p><span class="remark-con-tip">日程:</span>{{tedyremark}}</p>
          <p class="permonthmark" v-if="!!permonthmark"><span class="remark-con-tip">每月日程:</span>{{permonthmark}}</p>
        </div>
      </div>
      <calendar :clean="calendar1.clean" :events="calendar1.events" :lunar="calendar1.lunar" :value="calendar1.value" :begin="calendar1.begin" :end="calendar1.end" :weeks="calendar1.weeks" :months="calendar1.months" @select="select"></calendar>
      <div class="ctr-box">
        <div @click="toggle" class="toggle">{{lunarText}}农历</div>
        <div @click="toggleclean" class="toggle togglemode">{{calendarmode}}模式</div>

        <div class="add" >
          <button class="login" open-type="getUserInfo" @getuserinfo="onGotUserInfo" v-if="!constellationName"></button>
          <img src="../../assets/add.png" @click="handelEdit">
        </div>
      </div>
    </div>

    <div class="popup" v-if="visibletextarea">
      <div class="textarea zoomIn" :class="{zoomOut: isfadeOutUp}">
        <div class="edit-head">
          <div class="edit-head-title">
            <img src="../../assets/edit2.png" class="edit-icon">
            <span>编辑</span>
          </div>
          <img src="../../assets/close.png" class="close" @click="handelCloseEdit">
        </div>
        <textarea v-model="textarea" placeholder="备注"	fixed adjust-position	maxlength="200"/>
        <div class="edit-tip">
          <div class="date">编辑{{editDate}}备注</div>
          <div class="maxlength">{{textarea.length}}/200</div>
        </div>
        <switch @change="switchChange" class="switch" color="#2b84f8"/>
        <span class="switch-tip">{{switchValueTip}}设置为每月日程</span>
        <div class="submit" @click="updateremark">确定</div>
      </div>
    </div>

    <!--card-->
    <div class="dialog-bg" v-if="visible">
      <div class="dialog fadeInDown" :class="{fadeOutUp: isfadeOutUp}">
        <h1>星座选择</h1>
        <div class="dialog-content">
          <p class="dialog-content-tip">请选择您的出生年月日,为您展示每日星座运势</p>
          <picker mode="date" :value="selectdate" start="1900-01-01" end="2100-01-01" @change="DateChange">
            <view class="picker">
              <div class="picker-tip">当前选择:</div>
              <div class="date-button">{{selectdate}}</div>
            </view>
          </picker>
        </div>
        <div class="dialog-ctr">
          <div class="cancel" @click="handlecancel">取消</div>
          <div class="confirm" @click="handleconfirm">确定</div>
        </div>
      </div>
    </div>

    <div class="fortune-con" v-if="fortuneVisible">
      <div class="dialog fadeInDown" :class="{fadeOutUp: isfadeOutUp}">
        <h1>今日运势</h1>
        <div class="userinfo-box">
          <img :src="avatarurl" class="avatar">
          <h1>{{userName}}</h1>
          <p>{{userconstellation}}</p>
        </div>
        <div class="userinfo-con">
          <p><span>日期:</span>{{constellationObj.datetime}}</p>
          <p><span>幸运色:</span>{{constellationObj.color}}</p>
          <p><span>幸运数字:</span>{{constellationObj.number}}</p>
          <p><span>速配星座:</span>{{constellationObj.QFriend}}</p>
          <p><span>综合指数:</span>{{constellationObj.all}}</p>
          <p><span>健康指数:</span>{{constellationObj.health}}</p>
          <p><span>爱情指数:</span>{{constellationObj.love}}</p>
          <p><span>财运指数:</span>{{constellationObj.money}}</p>
          <p><span>工作指数:</span>{{constellationObj.work}}</p>
          <p><span>今日概述:</span>{{constellationObj.summary}}</p>
        </div>
        <div class="submit" @click="closefortune">确定</div>
      </div>
    </div>

  </div>
</template>

<script>
import calendar from '@/components/calendar'
import fly from '@/utils/fly'


export default {
  data () {
    return {
      selectdate:'',
      selectisfadeOutUp: false,
      isblur: false,
      visible: false,
      fortuneVisible: false,
      textarea: '',
      date: '',
      avatarurl: '',
      permonthmark: '',
      userName: '',
      calendarmode: '',
      constellationObj: {},
      visibletextarea: false,
      changeDate: false,
      lunar: false,
      isfadeOutUp: false,
      switchValue: false,
      editDate: '',
      tedyremark: '',
      switchValueTip: '不',
      constellationName: '',
      userconstellation: '',
      all: [],
      work: [],
      love: [],
      allhalf:false,
      workhalf:false,
      lovehalf:false,
      calendar1: {
        clean: false,
        value: [2018, 6, 16], //默认日期
        lunar:false, //显示农历
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        events: {}
      },
    }
  },
  components: {
    calendar
  },
  computed: {
    lunarText() {
      return this.calendar1.lunar ? '隐藏' : '显示';
    },
  },
  methods: {
    handleMore() {
      const userInfo = wx.getStorageSync('userInfo');
      const fortune = wx.getStorageSync('fortune');
      const {constellation, avatarUrl, nickName} = userInfo;
      if (!constellation) {
        return wx.showToast({
          title: '请先点击左侧问号选择您的出生年月日',
          icon: 'none',
          duration: 2000
        })
      }
      this.constellationObj = fortune;
      this.isblur = true;
      this.fortuneVisible = true;
      this.avatarurl = avatarUrl;
      this.userconstellation = constellation;
      this.userName = nickName;
    },
    closefortune() {
      this.isfadeOutUp = true;
      setTimeout(() => {
        this.isfadeOutUp = false;
        this.fortuneVisible = false;
        this.isblur = false;
      }, 400)
    },
    handlecancel() {
      this.isfadeOutUp = true;
      setTimeout(() => {
        this.isfadeOutUp = false;
        this.visible = false;
        this.isblur = false;
      }, 400)
    },
    handleconfirm() {
      const {id} = wx.getStorageSync('userInfo');
      if (!this.selectdate) {
        return wx.showToast({
          title: '您还未选择出生年月日',
          icon: 'none',
          duration: 1000
        })
      }
      const dateArr = this.selectdate.split('-');
      const mon = dateArr[1];
      const day = dateArr[2];
      const s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
      const d = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
      const i = mon * 2 - (day < d[mon - 1] ? 2 : 0);
      const constellation = s.substring(i, i + 2) + "座";
      wx.showLoading({title: 'Loading...'})
      fly.post('api/setConstellation', {id, date: this.selectdate, constellation}).then(res => {
        const userInfo = wx.getStorageSync('userInfo')
        userInfo.constellation = constellation;
        wx.setStorageSync('userInfo', userInfo);
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1000
        });
        fly.post('api/fortune', {constellation}).then(res => {
          const {data} = res;
          wx.setStorageSync('fortune', data);
          this.renderstar();
        })
      }).catch(err =>  {
        wx.showToast({
          title: '设置失败请重试',
          icon: 'none',
          duration: 1000
        })
      })
      this.isfadeOutUp = true;
      setTimeout(() => {
        this.isfadeOutUp = false;
        this.visible = false;
        this.isblur = false;
      }, 400)
    },
    DateChange({target}) {
      const {value} = target;
      this.selectdate = value;
    },
    switchChange({target}) {
      const {value} = target;
      this.switchValue = value;
      this.switchValueTip = value ? '' : '不';
    },
    handleChange() {
      this.visible = true;
      this.isblur = true;
    },
    selectconstellation(name) {
        switch(name) {
          case '白羊座':
            return 'constel10';
            break;
          case '金牛座':
            return 'constel11';
            break;
          case '双子座':
            return 'constel1';
            break;
          case '巨蟹座':
            return 'constel12';
            break;
          case '狮子座':
            return 'constel2';
            break;
          case '处女座':
            return 'constel3';
            break;
          case '天秤座':
            return 'constel4';
            break;
          case '天蝎座':
            return 'constel5';
            break;
          case '射手座':
            return 'constel6';
            break;
          case '摩羯座':
            return 'constel10';
            break;
          case '水瓶座':
            return 'constel8';
            break;
          default:
            return 'constel9';
            break;
        }
    },
    async renderstar() {
      const {constellation} = wx.getStorageSync('userInfo');
      const {date} = wx.getStorageSync('fortune');
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      const day = today.getDate();
      month = month < 10 ? '0' + month : month;
      const todayStr = year + '' + month + day;
      const isdate = date != todayStr;
      if (constellation && isdate) {
        const {data} = await fly.post('api/fortune', {constellation});
        wx.setStorageSync('fortune', data);
      }
      const {all, work, love, name} = wx.getStorageSync('fortune');
      this.constellationName =  name ? `http://img.binlive.cn/${this.selectconstellation(name)}.png` : '';
      const allArr = [];
      const workArr = [];
      const loveArr = [];
      const allLength = (all || '').substring(0, 1) - 0;
      const workLength = (work || '').substring(0, 1) - 0;
      const loveLength = (love || '').substring(0, 1) - 0;
      allArr[parseInt(allLength / 2) - 1] = '';
      workArr[parseInt(workLength / 2) - 1] = '';
      loveArr[parseInt(loveLength / 2) - 1] = '';
      const allHalf = (allLength % 2) > 0
      const workHalf = (workLength % 2) > 0
      const loveHalf = (loveLength % 2) > 0
      this.all = allArr;
      this.work = workArr;
      this.love = loveArr;
      this.allhalf = allHalf;
      this.workhalf = workHalf;
      this.lovehalf = loveHalf;
    },
    updateremark() {
      wx.showLoading({title: 'Loading...'});
      const userInfo = wx.getStorageSync('userInfo');
      const {id, remark = [], permonth = []} = userInfo;
      fly.post('api/updateremark', {id, permonth: this.switchValue, date: this.editDate, remark: this.textarea}).then(res => {
        const {status} = res;
        this.isfadeOutUp = true;
        setTimeout(() => {
          this.isfadeOutUp = false;
          this.visibletextarea = false;
          this.switchValueTip = '不';
          this.switchValue = false;
          this.isblur = false;
        }, 400);
        const events = this.calendar1.events;
        const newevents = {};
        Object.keys(events).forEach(item => {
          newevents[item] = events[item]
        })
        newevents[this.editDate] = this.textarea;
        if (this.switchValue) {
          this.permonthmark = this.textarea;
        } else {
          this.tedyremark = this.textarea ? this.textarea : '暂无日程...';
        }
        if (this.switchValue && this.textarea) {
          const today = new Date();
          let year = today.getFullYear();
          let month = today.getMonth() + 1;
          for (let i = 0; i < 6; i ++) {
            const key = `${year}-${month}-${this.editDate.split('-')[2]}`
            if (year === 12) {
              year ++;
            }
            month ++;
            newevents[key] = this.textarea
          }
        }
        this.calendar1.events = newevents;
        this.calendar1.value = this.editDate.split('-');
        if (status === 1) {
          if (this.switchValue) {
            permonth.push({date: this.editDate.split('-')[2], remark: this.textarea});
          } else {
            remark.push({date: this.editDate, remark: this.textarea});
          }
          wx.setStorageSync('userInfo', userInfo);
          wx.showToast({
            title: '备注添加成功',
            icon: 'success',
            duration: 1000
          });
          return;
        }
        if (this.switchValue) {
          permonth.forEach((item, index) => {
            if (item.date === this.editDate.split('-')[2]) {
              permonth[index].remark = this.textarea;
            }
          });
        } else {
          remark.forEach((item, index) => {
            if (item.date === this.editDate) {
              remark[index].remark = this.textarea;
            }
          });
        }
        wx.setStorageSync('userInfo', userInfo);
        wx.showToast({
          title: '备注修改成功',
          icon: 'success',
          duration: 1000
        })
      })
    },
    onGotUserInfo(info) {
      this.getUserInfo();
    },
    handelCloseEdit() {
      this.isfadeOutUp = true;
      setTimeout(() => {
        this.isfadeOutUp = false;
        this.isblur = false;
        this.visibletextarea = false;
        this.switchValueTip = '不';
        this.switchValue = false;
      }, 400)
    },
    toggleclean() {
      this.calendar1.clean = !this.calendar1.clean;
      this.calendarmode = this.calendar1.clean ? '缩略' : '简洁';
      wx.setStorageSync('mode', this.calendar1.clean);
    },
    toggle() {
      if (!this.calendar1.lunar) {
        this.calendar1.clean = true;
      }
      this.calendar1.lunar = !this.calendar1.lunar;
      this.lunar = !this.lunar;
    },
    handelEdit() {
      this.visibletextarea = true;
      this.isblur = true;
    },
    select(value) {
      const {remark = [], permonth = []} = wx.getStorageSync('userInfo');
      this.editDate = value.join('-');
      this.textarea = this.calendar1.events[this.editDate] || '';
      const todyremark = remark.find(item => item.date === this.editDate) || {}
      this.tedyremark = todyremark.remark ? todyremark.remark : '暂无日程...';
      this.permonthmark = (permonth.find(item => item.date == value[2]) || {}).remark;
    },
    getUserInfo () {
      // 调用登录接口
      const self = this;
      wx.login({
        success(respone) {
          const {code} = respone;
          if (code) {
            wx.getUserInfo({
              success(res) {
                // userInfo 只存储个人的基础数据
                const {userInfo} = res;
                fly.post('api/getOpenId', {code, userInfo}).then(res => {
                  const {userInfo} = res;
                  const {remark = [], permonth = [], constellation = '', avatarUrl = ''} = userInfo;
                  wx.setStorageSync('userInfo', userInfo);
                  const event = {};
                  remark.forEach(item => {
                    if (!item.remark) return;
                    event[item.date] = item.remark
                  });

                  const today = new Date();
                  let year = today.getFullYear();
                  let month = today.getMonth() + 1;
                  const day = today.getDate();
                  permonth.forEach(item => {
                    if (!item.remark) return;
                    for (let i = 0; i < 6; i ++) {
                      const key = `${year}-${month}-${item.date}`
                      if (year === 12) {
                        year ++;
                      }
                      if (month === 12) {
                        month = 0;
                      }
                      month ++;
                      event[key] = item.remark;
                    }
                  });
                  self.calendar1.events = event;
                  self.tedyremark = (remark.find(item => item.date === self.editDate) || {}).remark;
                  self.permonthmark = (permonth.find(item => item.date == day) || {}).remark;
                  if (!constellation) {
                    self.visible = true;
                  }
                  self.renderstar()
                })
              }
            })
          }
        }
      });
    },
  },
  created () {
    this.getUserInfo();
    this.renderstar();
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    this.calendar1.value = [year, month, day];
    this.editDate = [year, month, day].join('-');
    const mode = wx.getStorageSync('mode');
    if (!mode && typeof mode !== 'boolean') {
      this.calendar1.clean = false;
      this.calendarmode = '简洁';
      wx.setStorageSync('mode', false);
    } else if(typeof mode === 'boolean') {
      this.calendar1.clean = mode;
      this.calendarmode = mode ? '简洁' : '缩略';
    }
  }
}
</script>

<style>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}


  .constellation {
    position: relative;
    height: 140rpx;
  }
  .constellation-fate {
    position: absolute;
    left: 0px;
    top: 0px;
    padding-left: 220rpx;
    box-sizing: border-box;
  }
  .constellation-fate div h1 {
    font-size: 28rpx;
    color: #fff;
  }
  .home-card {
    height: 300rpx;
    width: 100%;
    background-color: #3976f7;
    padding: 30rpx;
    box-sizing: border-box;
  }
  .logo {
     float: left;
      margin-left: 30rpx;
    margin-top: 10rpx;
    position: relative;
    z-index: 99;
  }
  .logo img {
    width: 120rpx;
    height: 120rpx;
  }
  .more {
    background-color: #2864e0;
    color: #fff;
    font-size: 22rpx;
    display: inline-block;
    padding: 4rpx 10rpx;
    border-radius: 6rpx;
    position: absolute;
    right: 20rpx;
    bottom: 0px;
  }

  .add {
    width: 88rpx;
    height: 88rpx;
    background-color: #2864e0;
    padding: 20rpx;
    box-sizing: border-box;
    border-radius: 50%;
    box-shadow: 5rpx 5rpx 4rpx rgba(31, 91, 214, 0.3);
    float: right;
    position: relative;
  }
  .add .login {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 4;
  }
  .add img {
    width: 100%;
    height: 100%;
  }

  .popup {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background-color: rgba(0,0,0,.6);
    z-index: 999;
  }
  .popup .textarea {
    width: 80%;
    height: 660rpx;
    background-color: #fff;
    border-radius: 14rpx;
    position: absolute;
    left: 10%;
    top: 70rpx;
    overflow: hidden;
  }
  .edit-icon {
    width: 46rpx;
    height: 46rpx;
    position: relative;
    top: 10rpx;
  }
  .edit-head {margin: 8rpx 0rpx}
  .edit-head-title {
    width: 120rpx;
    margin: 0 auto;
    line-height: 24rpx;
  }
  .edit-head-title span {
    font-size: 28rpx;
    height: 44rpx;
    line-height: 44rpx;
    color: #666;
    padding-left: 10rpx;
  }
  .submit {
    width: 86%;
    height: 56rpx;
    color: #fff;
    background-color: #2b84f8;
    margin: 0 auto;
    font-size: 28rpx;
    line-height: 56rpx;
    text-align: center;
    border-radius: 6rpx;
    box-shadow: 4rpx 4rpx 2rpx rgba(43, 132, 248, 0.2);
    margin-top: 20rpx;
  }
  .textarea textarea {
    height: 360rpx;
    margin-bottom: 40rpx;
    box-sizing: border-box;
    padding: 18rpx;
    color: #666;
    font-size: 28rpx;
    border: 1px solid #ebebeb;
    width: 90%;
    margin: 0 auto;
  }
  .edit-tip {
    overflow: hidden;
    box-sizing: border-box;
    padding: 0px 8%;
  }
  .edit-tip div {
    font-size: 24rpx;
    color: #999;
    margin: 10rpx 0rpx;
  }
  .edit-tip .maxlength {
    float: right;
  }
  .edit-tip .date {
    float: left;
  }
  .close {
    width: 40rpx;
    height: 40rpx;
    position: absolute;
    right: 20rpx;
    top: 14rpx;
  }
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(.8, .8, .8);
  }

  50% {
    opacity: 1;
  }
}

.zoomIn {
  animation-duration: 0.6s;
  animation-fill-mode: both;
  animation-name: zoomIn;
}
@keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    transform: scale3d(.8, .8, .8);
  }

  to {
    opacity: 0;
  }
}

.zoomOut {
  animation-duration: 0.6s;
  animation-fill-mode: both;
  animation-name: zoomOut;
}
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -40px, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .fadeInDown {
    animation-duration: 0.6s;
    animation-fill-mode: both;
    animation-name: fadeInDown;
  }
  @keyframes fadeOutUp {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translate3d(0, -20px, 0);
    }
  }
  .fadeOutUp {
    animation-duration: 0.4s;
    animation-fill-mode: both;
    animation-name: fadeOutUp;
  }
  .login {
    width: 120rpx;
    height: 120rpx;
    padding: 0px;
    float: left;
    background-color: rgba(0,0,0,0);
  }
  .login::after {
    border: 0;
  }

  .star-white {
    width: 34rpx;
    height: 34rpx;
  }
  .start-box {
    position: relative;
    width: 400rpx;
  }
  .start-bg {
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .start {
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .constellation-item {
    width: 600rpx;
    overflow: hidden;
  }
  .constellation-item h1{
    float: left;
    line-height: 48rpx;
  }
  .constellation-item .start-box{
    float: left;
    margin-left: 14rpx;
  }
  .remark-con {
    margin-top: 10rpx;
    overflow: scroll;
    height: 100rpx;
  }
  .remark-con p {
    color: #fff;
    font-size: 24rpx;
  }
  .remark-con-tip{
    background-color: #2864e0;
    padding: 4rpx 10rpx;
    margin-right: 6rpx;
  }
  .ctr-box {
    height: 100rpx;
    width: 100%;
    padding-right: 100rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
  }
  .toggle {
    float: left;
    background-color: #3976f7;
    border-radius: 4rpx;
    color: #fff;
    font-size: 24rpx;
    padding: 4rpx 6rpx;
    margin-left: 20rpx;
    position: relative;
    top: 60rpx;
  }

.dialog-bg, .fortune-con {
  position: fixed;
  left: 0px;
  top: 0px;
  background-color: rgba(0,0,0,0.6);
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.dialog {
  width: 80%;
  min-height: 350rpx;
  background-color: #fff;
  border-radius: 10rpx;
  position: absolute;
  left: 10%;
  top: 50%;
  margin-top: -250rpx;
  box-shadow: 2rpx 2rpx 2rpx rgba(0,0,0,0.1);
}
.dialog h1 {
  font-size: 30rpx;
  color: #666;
  line-height: 78rpx;
  text-align: center;
}
.dialog-content {
  padding: 20rpx 40rpx;
  color: #999;
  font-size: 28rpx;
}
.dialog-ctr {
  height: 80rpx;
  position: absolute;
  bottom: 0px;
  left: 0px;
  border-top: 1rpx solid #eee;
  width: 100%;
}
.dialog-ctr div {width: 50%;float: left;height: 100%; text-align: center; line-height: 80rpx;
  font-size: 32rpx; color: #666}
.cancel{border-right: 1rpx solid #eee; box-sizing: border-box}
.confirm {color: #6dd448  !important}
.date-button {
  width: 300rpx;
  height: 60rpx;
  background-color: #fafafa;
  border: 1rpx solid #eee;
  border-radius: 6rpx;
  float: left;
  line-height: 60rpx;
  padding-left: 50rpx;
  box-sizing: border-box;
}
.picker-tip {
  float: left;
  line-height: 64rpx;
  margin-right: 20rpx;
}
.dialog-content-tip {
  font-size: 24rpx;
  margin-bottom: 20rpx;
}
.switch {
  margin-left: 40rpx;
}
  .switch-tip{
    color: #999;
    font-size: 28rpx;
  }
  .permonthmark {
    margin-top: 20rpx;
  }
  .container-box {width: 100%}
.blur {
  -moz-filter: blur(5px);
  -webkit-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
  .avatar{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }
  .userinfo-box {
    width: 300rpx;
    height: 120rpx;
    margin: 0 auto;
  }
  .userinfo-box img {
    float: left;
    margin-right: 20rpx;
  }
  .userinfo-box h1 {
    float: left;
    font-size: 32rpx;
    line-height:52rpx;
    color: #777;
  }
  .userinfo-con {
    box-sizing: border-box;
    padding-left: 120rpx;
    padding-right: 120rpx;
  }
  .userinfo-box p {
    float: left;
    color: #777;
    font-size: 28rpx;
    line-height: 52rpx;
  }
  .userinfo-con p {
    color: #666;
    font-size: 28rpx;
  }
.userinfo-con p span{
  width: 130rpx;
  display: inline-block;
}
  .fortune-con .dialog {
    top: 30%;
    padding-bottom: 30rpx;
  }
</style>
