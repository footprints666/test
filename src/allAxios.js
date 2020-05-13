import axios from "axios";
import store from "./store";

// axios.defaults.baseURL = 'https://music.tryto.cn';
axios.defaults.baseURL = 'http://musicapi.leanapp.cn';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前添加loading
    store.state.isLoad=true;
    store.state.loadingCount++;
    return config;
  }, function (error) {
    // 对请求错误做些什么
    store.state.isLoad=false;
    store.state.loadingCount=0;
    Message.error("网络异常，请稍候重试")
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么:请求到数据后，loading隐藏
     /* setTimeout(()=>{
        store.state.isLoad=false;
     },500)  */
     store.state.loadingCount--;
     if(store.state.loadingCount==0){   
        setTimeout(()=>{
          store.state.isLoad=false;
       },500) 
     }

     
    return response;
  }, function (error) {
    // 对响应错误做点什么
    store.state.isLoad=false;
    store.state.loadingCount=0;
    Message.error("网络异常，请稍候重试")
    return Promise.reject(error);
  });


//写法有误，数据未显示
/* function get(let_name,url,storage_name,data_name){
    let storage={};
    storage.get=key=>{
      return localStorage.getItem(key);
    }
    storage.set=(key,val)=>{
      return localStorage.setItem(key,val);
    }

    var let_name=JSON.parse(storage.get(storage_name));
    if(!let_name){
         return new Promise((resolve,reject)=>{
             axios.get(url).then(response=>{
                 resolve(response.data.result);
                 storage.set(storage_name,JSON.stringify(response.data.result));  
             })
             .catch(error=>{
                 reject(error)
             })
         })
      }else{
         data_name=let_name;
      }  
} */

function get(url){
    return new Promise((resolve,reject)=>{
        axios.get(url).then(response=>{
            resolve(response.data);
        }).catch(err=>{
            reject(err);
        })
    })
}

export default get;