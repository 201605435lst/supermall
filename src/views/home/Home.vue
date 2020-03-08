<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content" 
            ref="scroll" 
            :probe-type='3' 
            :pull-up-load='true'
            @scroll='contentScroll'
            @pullingUp='loadMore'
            >
            <!--  -->
      <home-swiper :banners="banners"/>
           <recommend-view :recommends="recommends"/>
          <feature-view/>
          <tab-control
             :titles="['流行','新款','精选']"
             class="tab-control"
             @tabclick="tabclick"
           ></tab-control>
           <goods-list :goods="showgoods" ></goods-list>
    </scroll>
   <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
</div>
</template>
<script>
//公共组件
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'
import GoodsList from 'components/content/goods/GoodsList'

import { getHomeMultidata,getHomeGoods } from 'network/home'
import {debounce} from 'common/utils'
export default {
    name:'Home',
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        isShowBackTop:false
      }
    },
    created(){
      this.getHomeMultidata(),
      this.getHomeGoods('pop'),
      this.getHomeGoods('new'),
      this.getHomeGoods('sell')
    /**
     * 监听item中图片加载完成
     */

    },
    mounted(){
        //   this.$bus.$on('itemImageLoad' ,() =>{
        // this.$refs.scroll.refresh()
        // console.log("-----------------------")
      const refresh =debounce(this.$refs.scroll.refresh)
      this.$bus.$on('itemImageLoad' ,() =>{
        refresh()
    })
    },
  
    computed:{
      showgoods(){
        return this.goods[this.currentType].list
      }
    },
    methods:{
      /**
       * 与事件有关的方法
       */
    
      tabclick(index){
        switch(index){
          case 0:
            this.currentType='pop'
            break
            case 1:
             this.currentType='new'
             break
             case 2:
                this.currentType='sell'
                break
        }
      },
      backClick(){
          this.$refs.scroll.scrollTo(0,0,500)
      },
      contentScroll(position){
          this.isShowBackTop= (-position.y) >1000
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        
      },
      /**
       * 与网络请求有关的方法
       */
      getHomeGoods(type){
        const page =this.goods[type].page +1
        getHomeGoods(type,page).then(res =>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page +=1
           this.$refs.scroll.finishPullUp()
      })
      },
      /**
       * 获得首页的数据
       */
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
        this.banners=res.data.banner.list,
        this.recommends=res.data.recommend.list
      })
      },

    }
}
</script>

<style scoped>
#home{
  padding-top:44px;
  position: relative;
  height: 100vh;
}
  .home-nav{
    background-color: var(--color-tint);
    color:#fff;
    position: fixed;
    left: 0;
    right:0;
    top:0;
    z-index: 9;
  }
  .tab-control{
    position: sticky;
    top:44px;
    z-index: 9;
  }
  .content{
    position: absolute;
    top:44px;
    bottom:49px;
    left:0;
    right:0;
    overflow: hidden;
  }
 
</style>