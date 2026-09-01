
window.VRAuth={
  user:'admin', pass:'vroderovno2026',
  isAdmin(){return sessionStorage.getItem('vr_admin_session')==='1'},
  login(user,pass){if(user===this.user&&pass===this.pass){sessionStorage.setItem('vr_admin_session','1');return true}return false},
  logout(){sessionStorage.removeItem('vr_admin_session')}
};
