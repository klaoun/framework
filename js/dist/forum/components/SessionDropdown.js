(self.webpackChunk_flarum_core=self.webpackChunk_flarum_core||[]).push([[557],{2304:(t,n,o)=>{o.r(n),o.d(n,{default:()=>f});var a=o(2122),e=o(1788),r=o(9908),s=o(507),i=o(9657),p=o(2558),u=o(2587),l=o(4594),c=o(5128),f=function(t){function n(){return t.apply(this,arguments)||this}(0,e.Z)(n,t),n.initAttrs=function(n){t.initAttrs.call(this,n),n.className="SessionDropdown",n.buttonClassName="Button Button--user Button--flat",n.menuClassName="Dropdown-menu--right",n.accessibleToggleLabel=app.translator.trans("core.forum.header.session_dropdown_accessible_label")};var o=n.prototype;return o.view=function(n){return t.prototype.view.call(this,(0,a.Z)({},n,{children:this.items().toArray()}))},o.getButtonContent=function(){var t=app.session.user;return[(0,r.Z)(t)," ",m("span",{className:"Button-label"},(0,s.Z)(t))]},o.items=function(){var t=new l.Z,n=app.session.user;return t.add("profile",p.Z.component({icon:"fas fa-user",href:app.route.user(n)},app.translator.trans("core.forum.header.profile_button")),100),t.add("settings",p.Z.component({icon:"fas fa-cog",href:app.route("settings")},app.translator.trans("core.forum.header.settings_button")),50),app.forum.attribute("adminUrl")&&t.add("administration",p.Z.component({icon:"fas fa-wrench",href:app.forum.attribute("adminUrl"),target:"_blank"},app.translator.trans("core.forum.header.admin_button")),0),t.add("separator",c.Z.component(),-90),t.add("logOut",u.Z.component({icon:"fas fa-sign-out-alt",onclick:app.session.logout.bind(app.session)},app.translator.trans("core.forum.header.log_out_button")),-100),t},n}(i.Z);window.flreg.add("components/SessionDropdown",f)}}]);
//# sourceMappingURL=SessionDropdown.js.map