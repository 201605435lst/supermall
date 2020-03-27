<template>
   <div class="cart">
     <!-- 顶部导航栏 -->
     <nav-bar class="nav-bar">
       <div slot="center">购物车({{length}})</div>
     </nav-bar>
     <!-- 购物车列表 -->
     <cart-list></cart-list>
     <!-- 底部汇总 -->
    <cart-button-bar></cart-button-bar>
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import CartButtonBar from './childComps/CartButtonBar'

import {mapGetters} from 'vuex'

export default {
    name:'Cart',
    components:{
      NavBar,
      CartList,
      CartButtonBar
    },
    computed:{
      // cartLength(){
      //   // return this.$store.state.cartList.length
      //   return this.$store.getters.cartLength
      // }
      // ...mapGetters(['cartLength','cartList'])
      ...mapGetters({
        length:'cartLength',
        list:'cartList'
      })
    }
}
</script>

<style scoped>
  .nav-bar{
    background-color:var(--color-tint);
    color: #fff;
  }
</style>