<template>
  <div class="container">
    <div class="home-card">
      <div class="constellation">
        <div class="logo">
          <img src="../../assets/logo.png" alt="">
        </div>
        <div class="constellation-fate">
          <div>
            <h1>星语数:</h1>
          </div>
        </div>
        <div class="more">更多>></div>
      </div>
    </div>
    <calendar :clean="calendar1.clean" :events="calendar1.events" :lunar="calendar1.lunar" :value="calendar1.value" :begin="calendar1.begin" :end="calendar1.end" :weeks="calendar1.weeks" :months="calendar1.months" @select="select"></calendar>
    <div class="add" @click="handelEdit">
      <img src="../../assets/add.png" alt="">
    </div>
    <div class="popup" v-if="visibletextarea">
      <div class="textarea fadeInDown" :class="{fadeOutUp: isfadeOutUp}">
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
        <div class="submit">确定</div>
      </div>
    </div>
    <div @click="toggle">{{lunarText}}农历</div>
    <button open-type="getUserInfo" @getuserinfo="onGotUserInfo" >login</button>
    <a href="/pages/counter/main" class="counter">去往Vuex示2例页面</a>
  </div>
</template>

<script>
import card from '@/components/card'
import calendar from '@/components/calendar'


export default {
  data () {
    return {
      textarea: '',
      visibletextarea: false,
      lunar: false,
      isfadeOutUp: false,
      editDate: '',
      calendar1: {
        clean: false,
        value: [2018, 6, 16], //默认日期
        lunar:false, //显示农历
        weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        events: {
          '2018-6-14': '大撒上大阿斯顿撒打算', '2018-2-15': '$460', '2018-2-16': '$500',
        }
      },
    }
  },

  components: {
    card,
    calendar
  },
  computed: {
    lunarText() {
      return this.calendar1.lunar ? '隐藏' : '显示';
    }
  },

  methods: {
    onGotUserInfo(info) {
      console.log(11111111)
      console.log(info)
    },
    handelCloseEdit() {
      this.isfadeOutUp = true;
      setTimeout(() => {
        this.isfadeOutUp = false;
        this.visibletextarea = false;
      }, 400)
    },
    toggle() {
      console.log(123123)
      if (!this.calendar1.lunar) {
        this.calendar1.clean = true;
      }
      this.calendar1.lunar = !this.calendar1.lunar;

      this.lunar = !this.lunar;
    },
    handelEdit() {
      console.log(123)
      this.visibletextarea = true;
      console.log(this.visibletextarea)
    },
    select(value) {
      console.log(value)
      this.editDate = value.join('-');
      console.log(value.toString());
    },
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: (respone) => {
          console.log(respone)
          wx.getUserInfo({
            success: (res) => {
              console.log(res)
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // let res = fly.get(`topic/${id}`)
    this.getUserInfo()
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
  }

  .add {
    width: 88rpx;
    height: 88rpx;
    background-color: #2864e0;
    padding: 20rpx;
    box-sizing: border-box;
    border-radius: 50%;
    box-shadow: 5rpx 5rpx 4rpx rgba(31, 91, 214, 0.3);
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
  }
  .popup .textarea {
    width: 80%;
    height: 600rpx;
    background-color: #fff;
    border-radius: 14rpx;
    position: absolute;
    left: 10%;
    top: 100rpx;
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
    margin-top: 10rpx;
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
</style>
