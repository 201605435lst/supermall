<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
             <tab-control
             class="tab-control"
              ref ="tabControl1"
              v-show="isTabFixed"
             :titles="['流行','新款','精选']"
             @tabclick="tabclick"
           ></tab-control>
    <scroll class="content" 
            ref="scroll" 
            :probe-type='3' 
            :pull-up-load='true'
            @scroll='contentScroll'
            @pullingUp='loadMore'
            >
            <!--  -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
           <recommend-view :recommends="recommends"/>
          <feature-view/>
          <tab-control
              ref ="tabControl2"
             :titles="['流行','新款','精选']"
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

// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'
import GoodsList from 'components/content/goods/GoodsList'

import { getHomeMultidata,getHomeGoods } from 'network/home'

import {itemListenerMixin,backTopMixin} from 'common/mixin'

export default {
    name:'Home',
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll
    },
    mixins:[itemListenerMixin,backTopMixin],
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
        tabOffSetTop:0,
        isTabFixed:false,
        saveY: 0,
        // itemImgListener:null
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
    // mounted(){
    //   // 图片完成加载事件的监听
    //     //   this.$bus.$on('itemImageLoad' ,() =>{
    //     // this.$refs.scroll.refresh()
    //     // console.log("-----------------------")
    //   const refresh =debounce(this.$refs.scroll.refresh)
    //   //对监听事件进行保存
    //   this.itemImgListener =()=>{
    //     refresh()
    //   }
    //   this.$bus.$on('itemImageLoad' ,this.itemImgListener)
    // },
  activated(){
     this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0,this.saveY,0)
   
  },
  deactivated(){
    //保存Y值
    this.saveY =this.$refs.scroll.getscrollY()
    //2、取消全局事件的监听
    this.$bus.$off('itemImageLoad',this.itemImgListener)
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
        this.$refs.tabControl1.currentIndex =index;
        this.$refs.tabControl2.currentIndex =index;
      },
  
      contentScroll(position){
        // 判断BackTop是否显示
          // this.isShowBackTop= (-position.y) >1000
          this.listenShowBackTop(position)
        //决定tabcontrol是否吸顶(position:fixed)
            this.isTabFixed =(-position.y) >this.tabOffSetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        
      },
      swiperImageLoad(){
        /**
         * 获取tabcontrol中的offsetTop
         * 所有的组件都有一个属性$el:用于获取组件中的元素
         */
         this.tabOffSetTop = this.$refs.tabControl2.$el.offsetTop
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
  /* padding-top:44px; */
  position: relative;
  height: 100vh;
}
  .home-nav{
    background-color: var(--color-tint);
    color:#fff;
    /*使用浏览器使用原生滚动，为了让导航不跟随一起滚动*/
    /* position: fixed;
    left: 0;
    right:0;
    top:0;
    z-index: 9; */
  }

  .content{
    position: absolute;
    top:44px;
    bottom:49px;
    left:0;
    right:0;
    overflow: hidden;
  }
 .tab-control{
   position: relative;
   z-index: 9;
 }
</style>