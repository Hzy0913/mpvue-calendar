<template>
  <div class="container" @click="clickHandle('test click', $event)">

    <div class="userinfo" @click="bindViewTap">
      <!--<img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />-->
      <div class="userinfo-nickname">
        <!--<card :text="userInfo.nickName"></card>-->
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>

    <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
    </form>
    <a href="/pages/counter/main" class="counter">去往Vuex示2例页面</a>
    <calendar :clean="calendar1.clean" :events="calendar1.events" :lunar="calendar1.lunar" :value="calendar1.value" :begin="calendar1.begin" :end="calendar1.end" :weeks="calendar1.weeks" :months="calendar1.months" @select="select"></calendar>
  </div>
</template>

<script>
import card from '@/components/card'
import calendar from '@/components/calendar'


export default {
  data () {
    return {
      calendar1: {
        clean: true,
        value: [2018, 6, 16], //默认日期
        // lunar:true, //显示农历
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

  methods: {
    select(value) {
      console.log(value.toString());
    },
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
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
</style>
