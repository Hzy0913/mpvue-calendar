<template>
  <div class="dialog-bg" v-if="visible">
    <div class="dialog" :class="{fadeOutUp: isfadeOutUp}">
      <h1>弹窗</h1>
      <div class="dialog-content">
        <p class="dialog-content-tip">请选择您的出生年月日,为您展示每日星座运势</p>
        <picker mode="date" :value="date" start="1900-01-01" end="2100-01-01" @change="DateChange">
          <view class="picker">
            <div class="picker-tip">当前选择:</div>
            <div class="date-button">{{date}}</div>
          </view>
        </picker>
      </div>
      <div class="dialog-ctr">
        <div class="cancel" @click="handlecancel">取消</div>
        <div class="confirm" @click="handleconfirm">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import fly from '@/utils/fly'
  import store from './store'

  export default {
  props: ['text'],
  data() {
    return {
      date:'',
      isfadeOutUp: false,
      visible: true,
    }
  },
  methods: {
    handlecancel() {
      this.isfadeOutUp = true;
      setTimeout(() => {
        this.isfadeOutUp = false;
        this.visible = false;
      }, 400)
    },
    handleconfirm() {
      const {id} = wx.getStorageSync('userInfo');
      if (!this.date) {
        return wx.showToast({
          title: '您还未选择出生年月日',
          icon: 'none',
          duration: 1000
        })
      }
      const dateArr = this.date.split('-');
      const mon = dateArr[1];
      const day = dateArr[2];
      const s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
      const d = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
      const i = mon * 2 - (day < d[mon - 1] ? 2 : 0);
      const constellation = s.substring(i, i + 2) + "座";

      console.log(constellation)
      wx.showLoading({title: 'Loading...'})
      fly.post('api/setConstellation', {id, date: this.date, constellation}).then(res => {
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
            store.commit('increment', data)
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
      }, 400)
    },
    DateChange({target}) {
      const {value} = target;
      this.date = value;
    },
  }
}
</script>

<style>
.dialog-bg {
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
