import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutations-type'
export default {
    [ADD_COUNTER](state,payload){
        payload.count ++
     },
     [ADD_TO_CART](state,payload){
         //可以给添加的商品添加一个属性
        payload.checked = true
        state.cartList.push(payload)
     }
}