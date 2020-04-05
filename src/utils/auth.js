/* globals Store */
import api from './backend-api'
import Store from "@/store";

export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1]
    let data = 'email=' + email + '&password=' + pass
    api.login('account/login.json', data).then((res) => {
      console.log(res);
      if(res.data.user){
        const token =  res.data.user.auth_token
        const user = res.data.user
        Store.dispatch('user/updateUser', {user, token})
        if (cb) cb(true, null)
        this.onChange(true)
      }
      else{
		  if (cb) cb(false, null);
		  this.loading = false;
        Store.dispatch('user/errorUserLogin', "Error while login")
      }
      
    }, (err) => {
      console.log(err)
      if (cb) cb(false, err)
      this.onChange(false)
    })
  },
  getToken () {
    return Store.state.user.token
  },
  logout (cb) {
    // delete localStorage.token
    // Store.commit('setToken', null)
    Store.dispatch('user/logout')
    if (cb) cb(false)
    this.onChange(false)
  },
  loggedIn () {
    return !!Store.state.user.token
  },
  onChange () {}
}
