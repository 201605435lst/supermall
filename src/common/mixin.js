import {debounce} from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'
export const itemListenerMixin ={
  data(){
    return{
      itemImgListener:null,
      newRefresh:null
    }
  },
    mounted(){
        // 图片完成加载事件的监听
          //   this.$bus.$on('itemImageLoad' ,() =>{
          // this.$refs.scroll.refresh()
          // console.log("-----------------------")
        this.newRefresh =debounce(this.$refs.scroll.refresh,100)
        //对监听事件进行保存
        this.itemImgListener =()=>{
          this.newRefresh()
        }
        this.$bus.$on('itemImageLoad' ,this.itemImgListener)
        // console.log("我是混入中的内容")
      }
}
export const backTopMixin ={
  data(){
    return{
      isShowBackTop:false
    }
  },
  components:{
    BackTop
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
      },
      listenShowBackTop(position){
        this.isShowBackTop= (-position.y) >1000
      }   
  }
}