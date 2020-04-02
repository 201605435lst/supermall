<template>
  <div class="bottom-bar">
      <div class="check-content">
          <check-button
           :is-checked="isSelectAll" 
           @click.native="checkClick"
           class="check-button"/>
            <span>全选</span>
      </div>
      <div class="price">
          合计：{{totalPrice}}
      </div>
      <div class="calculate" @click="calcClick">
          去结算：{{checkedLength}}
      </div>
  </div>

</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import {mapGetters} from 'vuex'
export default {
    name:'CartButtonBar',
    components:{
       CheckButton 
    },
    computed:{
        ...mapGetters(['cartList']),
        totalPrice(){
           return '￥'+ this.cartList.filter(item =>{
                return item.checked
            }).reduce((preValue,item) =>{
                return preValue+item.price*item.count
            },0).toFixed(2)
        },
        checkedLength(){
            // return this.$store.state.cartList.filter(item =>item.checked).length
       return this.cartList.filter(item =>item.checked).length
       },
       isSelectAll(){
        //  return !(this.cartList.filter(item => !item.checked).length)
        if(this.cartList.length ===0) return false 
            return !this.cartList.find(item => !item.checked)
       }

    },
    methods:{
        checkClick(){
           if(this.isSelectAll){//全部选中
                this.cartList.forEach(item =>item.checked = false)
           }else{//全部不选中或者部分选中
               this.cartList.forEach(item =>item.checked = true)
           }
        },
        calcClick() {
            if(!this.isSelectAll){
             this.$toast.show('请选择购买的商品',2000)
            }
  
        }
    }
}
</script>

<style scoped>
.bottom-bar{
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color:#eee;
    font-size: 14px;

}
.check-content{
    display: flex;
    align-items:center;
    margin-left: 10px;
    width: 60px;
}
.check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
}
.price{
    margin-left: 20px;
    flex:1
}
.calculate{
width:90px;
background-color:orangered;
text-align: center;
}
</style>