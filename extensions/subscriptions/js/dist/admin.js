(()=>{var e={n:r=>{var o=r&&r.__esModule?()=>r.default:()=>r;return e.d(o,{a:o}),o},d:(r,o)=>{for(var t in o)e.o(o,t)&&!e.o(r,t)&&Object.defineProperty(r,t,{enumerable:!0,get:o[t]})},o:(e,r)=>Object.prototype.hasOwnProperty.call(e,r),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},r={};(()=>{"use strict";e.r(r),e.d(r,{extend:()=>i});const o=flarum.reg.get("core","common/extenders");var t=e.n(o);class n{pattern(){return"is:(follow|ignor)(?:ing|ed)"}toFilter(e,r){return{subscription:"follow"===e[1]?"following":"ignoring"}}filterKey(){return"subscription"}fromFilter(e,r){return"".concat(r?"-":"","is:").concat(e)}}flarum.reg.add("flarum-subscriptions","common/query/discussions/SubscriptionGambit",n);const i=[(new(t().Search)).gambit("discussions",n)]})(),module.exports=r})();
//# sourceMappingURL=admin.js.map