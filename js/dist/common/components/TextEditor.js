(self.webpackChunk_flarum_core=self.webpackChunk_flarum_core||[]).push([[247],{7664:(t,e,i)=>{i.r(e),i.d(e,{default:()=>h});var o=i(1788),n=i(8931),r=i(4594),s=i(7473),a=i(2587),l=i(6156),d=i(6496),u=i.n(d),c=function(){function t(t,e){(0,l.Z)(this,"el",void 0),this.el=document.createElement("textarea"),this.build(t,e)}var e=t.prototype;return e.build=function(t,e){var i=this;this.el.className=e.classNames.join(" "),this.el.disabled=e.disabled,this.el.placeholder=e.placeholder,this.el.value=e.value;var o=function(t){e.inputListeners.forEach((function(t){t()})),t.redraw=!1};this.el.oninput=function(t){e.oninput(i.el.value),o(t)},this.el.onclick=o,this.el.onkeyup=o,this.el.addEventListener("keydown",(function(t){(t.metaKey||t.ctrlKey)&&"Enter"===t.key&&e.onsubmit()})),t.append(this.el)},e.setValue=function(t){$(this.el).val(t).trigger("input"),this.el.dispatchEvent(new CustomEvent("input",{bubbles:!0,cancelable:!0}))},e.moveCursorTo=function(t){this.setSelectionRange(t,t)},e.getSelectionRange=function(){return[this.el.selectionStart,this.el.selectionEnd]},e.getLastNChars=function(t){return this.el.value.slice(Math.max(0,this.el.selectionStart-t),this.el.selectionStart)},e.insertAtCursor=function(t){this.insertAt(this.el.selectionStart,t)},e.insertAt=function(t,e){this.insertBetween(t,t,e)},e.insertBetween=function(t,e,i){var o=this.el.value,n=o.slice(0,t),r=o.slice(e);this.setValue(""+n+i+r),this.moveCursorTo(t+i.length)},e.replaceBeforeCursor=function(t,e){this.insertBetween(t,this.el.selectionStart,e)},e.setSelectionRange=function(t,e){this.el.setSelectionRange(t,e),this.focus()},e.getCaretCoordinates=function(t){var e=u()(this.el,t);return{top:e.top-this.el.scrollTop,left:e.left}},e.disabled=function(t){this.el.disabled=t},e.focus=function(){this.el.focus()},e.destroy=function(){this.el.remove()},t}();window.flreg.add("utils/BasicEditorDriver",c);var h=function(t){function e(){return t.apply(this,arguments)||this}(0,o.Z)(e,t);var i=e.prototype;return i.oninit=function(e){t.prototype.oninit.call(this,e),this.value=this.attrs.value||"",this.disabled=!!this.attrs.disabled},i.view=function(){return m("div",{className:"TextEditor"},m("div",{className:"TextEditor-editorContainer"}),m("ul",{className:"TextEditor-controls Composer-footer"},(0,s.Z)(this.controlItems().toArray()),m("li",{className:"TextEditor-toolbar"},this.toolbarItems().toArray())))},i.oncreate=function(e){t.prototype.oncreate.call(this,e),this.attrs.composer.editor=this.buildEditor(this.$(".TextEditor-editorContainer")[0])},i.onupdate=function(){var t=!!this.attrs.disabled;this.disabled!==t&&(this.disabled=t,this.attrs.composer.editor.disabled(t))},i.buildEditorParams=function(){var t=this;return{classNames:["FormControl","Composer-flexible","TextEditor-editor"],disabled:this.disabled,placeholder:this.attrs.placeholder||"",value:this.value,oninput:this.oninput.bind(this),inputListeners:[],onsubmit:function(){t.onsubmit(),m.redraw()}}},i.buildEditor=function(t){return new c(t,this.buildEditorParams())},i.controlItems=function(){var t=new r.Z;return t.add("submit",a.Z.component({icon:"fas fa-paper-plane",className:"Button Button--primary",itemClassName:"App-primaryControl",onclick:this.onsubmit.bind(this)},this.attrs.submitLabel)),this.attrs.preview&&t.add("preview",a.Z.component({icon:"far fa-eye",className:"Button Button--icon",onclick:this.attrs.preview,title:app.translator.trans("core.forum.composer.preview_tooltip"),oncreate:function(t){return $(t.dom).tooltip()}})),t},i.toolbarItems=function(){return new r.Z},i.oninput=function(t){this.value=t,this.attrs.onchange(this.value)},i.onsubmit=function(){this.attrs.onsubmit(this.value)},e}(n.Z);window.flreg.add("components/TextEditor",h)},6496:t=>{!function(){var e=["direction","boxSizing","width","height","overflowX","overflowY","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderStyle","paddingTop","paddingRight","paddingBottom","paddingLeft","fontStyle","fontVariant","fontWeight","fontStretch","fontSize","fontSizeAdjust","lineHeight","fontFamily","textAlign","textTransform","textIndent","textDecoration","letterSpacing","wordSpacing","tabSize","MozTabSize"],i="undefined"!=typeof window,o=i&&null!=window.mozInnerScreenX;function n(t,n,r){if(!i)throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");var s=r&&r.debug||!1;if(s){var a=document.querySelector("#input-textarea-caret-position-mirror-div");a&&a.parentNode.removeChild(a)}var l=document.createElement("div");l.id="input-textarea-caret-position-mirror-div",document.body.appendChild(l);var d=l.style,u=window.getComputedStyle?window.getComputedStyle(t):t.currentStyle,c="INPUT"===t.nodeName;d.whiteSpace="pre-wrap",c||(d.wordWrap="break-word"),d.position="absolute",s||(d.visibility="hidden"),e.forEach((function(t){c&&"lineHeight"===t?d.lineHeight=u.height:d[t]=u[t]})),o?t.scrollHeight>parseInt(u.height)&&(d.overflowY="scroll"):d.overflow="hidden",l.textContent=t.value.substring(0,n),c&&(l.textContent=l.textContent.replace(/\s/g," "));var h=document.createElement("span");h.textContent=t.value.substring(n)||".",l.appendChild(h);var p={top:h.offsetTop+parseInt(u.borderTopWidth),left:h.offsetLeft+parseInt(u.borderLeftWidth),height:parseInt(u.lineHeight)};return s?h.style.backgroundColor="#aaa":document.body.removeChild(l),p}void 0!==t.exports?t.exports=n:i&&(window.getCaretCoordinates=n)}()}}]);
//# sourceMappingURL=TextEditor.js.map