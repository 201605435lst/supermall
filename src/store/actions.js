import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutations-type'
export default {
    addCart(context,payload){
        return new Promise((resolve,reject) =>{
        //查找之前数组中是否有该商品
        let oldProduct =context.state.cartList.find(item => item.iid === payload.iid)
        //判断oldProduct
        if(oldProduct){//数量加  1
           // oldProduct.count +=1
           context.commit(ADD_COUNTER,oldProduct)
           resolve('当前商品的数量加1')
        }else{//商品数目加  1
           payload.count = 1
           // context.state.cartList.push(payload)
           context.commit(ADD_TO_CART,payload)
           resolve('添加了新的商品')
        } 
        })
     }
}