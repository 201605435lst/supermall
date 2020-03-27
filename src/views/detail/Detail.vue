<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll"  @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shops"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad ="imageLoad"></detail-goods-info>
     <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
     <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
     <goods-list ref="recommend" :goods="recommends"></goods-list>
 
    </scroll>
       <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import  DetailParamInfo   from "./childComps/DetailParamInfo"
  import DetailCommentInfo from "./childComps/DetailCommentInfo"
  import DetailBottomBar from "./childComps/DetailBottomBar"

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  import {getDetail, Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import {debounce} from 'common/utils'
  import {itemListenerMixin,backTopMixin} from 'common/mixin'
  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      Scroll
    },
      mixins:[itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shops:{},
        detailInfo:{},
        paramInfo: {},
        commentInfo:{},
        recommends:[],
        themeTopsY:[],
        getThemTopY:null,
        currentIndex:0
          // itemImgListener:null
      }
    },
    // updated(){
    //   this.themeTopsY=[]
    //   this.themeTopsY.push(0);
    //   this.themeTopsY.push(this.$refs.param.$el.offsetTop)
    //   this.themeTopsY.push(this.$refs.comment.$el.offsetTop)
    //   this.themeTopsY.push(this.$refs.recommend.$el.offsetTop)
    //   console.log(this.themeTopsY)
    // },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        //3、创建店铺信息
          this.shops =new Shop(data.shopInfo)
        // 4、保存商品的详情数据
        this.detailInfo =data.detailInfo
        // 5、获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        // 6、取出评论的信息
        if(data.rate.cRate !==0){
          this.commentInfo = data.rate.list[0]
        }
        
      })
      //3、请求推荐数据
      getRecommend().then(res =>{
        this.recommends=res.data.list
      })
      // 4、给getThemTopY赋值
      this.getThemTopY=debounce(()=>{
           this.themeTopsY=[]
       this.themeTopsY.push(0);
      this.themeTopsY.push(this.$refs.param.$el.offsetTop)
      this.themeTopsY.push(this.$refs.comment.$el.offsetTop)
      this.themeTopsY.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopsY.push(Number.MAX_VALUE)
      })
    },
    //     mounted(){
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
    destroyed(){
      //取消全局事件的监听
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
    methods: {
      imageLoad() {
       this.newRefresh()
        this.getThemTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0,-this.themeTopsY[index],100)
      },
      contentScroll(position){
        const positionY =-position.y
        let length =this.themeTopsY.length
        //positiony和主题中的值对比[0,799,899,999]
        //positionY在0和799之间，index=1
        // for(let i =0;i<length;i++){
        //   if(this.currentIndex !== i && ((i < length -1 && positionY >= this.themeTopsY[i] && positionY < 
        //   this.themeTopsY[i+1]) || (i===length -1 && positionY >= this.themeTopsY[i]))){
        //     this.currentIndex = i;
        //       this.$refs.nav.currentIndex=this.currentIndex
        //   }
        // }
        for(let i=0;i<length -1 ;i++){
          if(this.currentIndex !== i && (positionY >= this.themeTopsY[i] && positionY < this.themeTopsY[i+1])){
            this.currentIndex = i;
              this.$refs.nav.currentIndex=this.currentIndex
          }
        }
        //是否显示回到底部
       this.listenShowBackTop(position)
      },
      addCart(){
        //获取购物车所需要的购物信息
        const product ={}
        product.image =this.topImages[0]
        product.title = this.goods.title
        product.desc =this.goods.desc
        product.price =this.goods.realPrice
        product.iid =this.iid
        //将商品添加到购物车中(mutations)
        // this.$store.commit("addCart",product)
        //在action中修改属性
        this.$store.dispatch("addCart",product)
      }
    }
  }
</script>

<style scoped>
 #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
