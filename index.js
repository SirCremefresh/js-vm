function e(e,t,n=-1){e.tokenStream.push({token:e.state,startIndex:e.startIndex,endIndex:t+n}),e.startIndex=t}let t,n,s,d,a,r=0,o=0,l=0,c=0,i="//hel   lo world program\npush 100000 // asdf\nload %rd // asdfg\nload %ra // asdfg\nload %rc // asdfg\nlog %rd\npush 200\n\nmy-label:\ninc %rc, 1\njl my-label\n\nhalt";var I;function x(e){const n=t.children[2*e+1];return{startIndex:parseInt(n.dataset.startIndex),endIndex:parseInt(n.dataset.endIndex)}}I=()=>{t=document.getElementById("editor"),n=document.querySelector(".cursor");const e=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--editor-font-size"));r=.6*e,o=1.25*e,console.log({fontSize:e,fontLength:r,fontHeight:o}),s=t.offsetTop,d=t.offsetLeft,document.addEventListener("keydown",(e=>{if("F5"!==e.key&&e.preventDefault(),1===e.key.length){const t=" "!==e.key?e.key:" ",n=x(c);i=i.slice(0,l+n.startIndex)+t+i.slice(l+n.startIndex),l++,E()}else if("Backspace"===e.key){const e=x(c);if(l>0)i=i.slice(0,l+e.startIndex-1)+i.slice(l+e.startIndex),l--;else if(c>0){const t=x(c-1);i=i.slice(0,l+e.startIndex-1)+i.slice(l+e.startIndex),l=t.endIndex-t.startIndex,c--}E()}else if("Delete"===e.key){const e=x(c);i=i.slice(0,l+e.startIndex)+i.slice(l+e.startIndex+1),E()}else if("Enter"===e.key){const e=i.split("\n"),t=e[c];e[c]=t.slice(0,l)+"\n"+t.slice(l),i=e.join("\n"),c++,l=0,E()}else if("ArrowRight"===e.key){const e=x(c);if(l<e.endIndex-e.startIndex)l++;else{const n=t.children.length/2;c<n-1?(l=0,c++):l=e.endIndex-e.startIndex+1}}else if("ArrowLeft"===e.key){if(l>0)l--;else if(c>0){const e=x(c-1);l=e.endIndex-e.startIndex,c--}}else"ArrowDown"===e.key?c++:"ArrowUp"===e.key&&c--;console.log(e.key),N()})),setTimeout((()=>{E(),N()}),500),console.log("after")},"complete"===document.readyState||"interactive"===document.readyState?setTimeout(I,1):document.addEventListener("DOMContentLoaded",I);const f={TOKEN_INSTRUCTION:"instruction",TOKEN_CONST:"const",TOKEN_REGISTER:"register",TOKEN_COMMENT:"comment"};function E(){for(console.time("render"),a=function(t){const n=t.split(""),s={startIndex:0,state:"TOKEN_INSTRUCTION",tokenStream:[]};for(let t=0;t<n.length;++t)switch(n[t]){case" ":if("TOKEN_WHITESPACE"===s.state)break;e(s,t),s.state="TOKEN_WHITESPACE";break;case":":s.state="TOKEN_LABEL";break;case"\n":s.startIndex!==t&&e(s,t),s.state="TOKEN_NEWLINE",e(s,t,0),s.state="TOKEN_INSTRUCTION",s.startIndex=t+1;break;case"%":"TOKEN_WHITESPACE"===s.state&&(e(s,t),s.state="TOKEN_REGISTER");break;case",":e(s,t),s.state="TOKEN_COMMA";break;case"/":if(s.startIndex!==t&&e(s,t),"/"!==n[t+1]){s.state="TOKEN_INVALID";break}for(;"\n"!==n[t];)t++;s.state="TOKEN_COMMENT",--t;break;default:"TOKEN_WHITESPACE"===s.state&&(e(s,t),s.state="TOKEN_CONST")}return e(s,n.length-1,0),s.tokenStream}(i);t.firstChild;)t.removeChild(t.firstChild);let n,s=1;for(const e of a){n||(t.appendChild(u("line-number",s+":",e.startIndex,e.startIndex)),n=T("line"),n.dataset.startIndex=e.startIndex.toString(),s++);const d=f[e.token];if(d)n.appendChild(u(d,i.slice(e.startIndex,e.endIndex+1).replace(/\s/g," "),e.startIndex,e.endIndex));else switch(e.token){case"TOKEN_NEWLINE":n.dataset.endIndex=e.endIndex.toString(),t.appendChild(n),n=null;break;case"TOKEN_WHITESPACE":n.appendChild(u(d,new Array(e.endIndex-e.startIndex+2).join(" "),e.startIndex,e.endIndex));break;default:n.appendChild(u("not-found",i.slice(e.startIndex,e.endIndex+1),e.startIndex,e.endIndex))}}n&&(n.dataset.endIndex=a[a.length-1].endIndex.toString(),t.appendChild(n)),console.timeEnd("render")}function u(e,t,n,s){const d=document.createElement("span");return d.classList.add(e),d.textContent=t,d.dataset.startIndex=n.toString(),d.dataset.endIndex=s.toString(),d}function T(e){const t=document.createElement("div");return t.classList.add(e),t}function N(){const e=t.querySelector(".line-number").scrollWidth;n.style.top=s+c*o+"px",n.style.left=d+e-r/2+l*r+"px"}
