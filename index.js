function e(e,t,n=-1){e.tokenStream.push({token:e.state,startIndex:e.startIndex,endIndex:t+n}),e.startIndex=t}let t,n,s,o,a,r=0,l=0,d=0,c=0,i="//hel   lo world program\npush 100000 // asdf\nload %rd // asdfg\nload %ra // asdfg\nload %rc // asdfg\nlog %rd\npush 200\n\nmy-label:\ninc %rc, 1\njl my-label\n\nhalt";var E;E=()=>{t=document.getElementById("editor"),n=document.querySelector(".cursor");const e=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--editor-font-size"));r=.6*e,l=1.25*e,console.log({fontSize:e,fontLength:r,fontHeight:l}),s=t.offsetTop,o=t.offsetLeft,document.addEventListener("keydown",(e=>{if("F5"!==e.key&&e.preventDefault(),1===e.key.length){const t=" "!==e.key?e.key:" ",n=i.split("\n"),s=n[c];n[c]=s.slice(0,d)+t+s.slice(d),i=n.join("\n"),d++,T()}else if("Backspace"===e.key){const e=i.split("\n"),t=e[c];e[c]=t.slice(0,d-1)+t.slice(d),i=e.join("\n"),d--,T()}else if("Delete"===e.key){const e=i.split("\n"),t=e[c];e[c]=t.slice(0,d)+t.slice(d+1),i=e.join("\n"),T()}else if("Enter"===e.key){const e=i.split("\n"),t=e[c];e[c]=t.slice(0,d)+"\n"+t.slice(d),i=e.join("\n"),c++,d=0,T()}else"ArrowRight"===e.key?d++:"ArrowLeft"===e.key?d--:"ArrowDown"===e.key?c++:"ArrowUp"===e.key&&c--;console.log(e.key),N()})),setTimeout((()=>{T(),N()}),500),console.log("after")},"complete"===document.readyState||"interactive"===document.readyState?setTimeout(E,1):document.addEventListener("DOMContentLoaded",E);const f={TOKEN_INSTRUCTION:"instruction",TOKEN_CONST:"const",TOKEN_REGISTER:"register",TOKEN_COMMENT:"comment"};function T(){for(console.time("render"),a=function(t){const n=t.split(""),s={startIndex:0,state:"TOKEN_INSTRUCTION",tokenStream:[]};for(let t=0;t<n.length;++t)switch(n[t]){case" ":if("TOKEN_WHITESPACE"===s.state)break;e(s,t),s.state="TOKEN_WHITESPACE";break;case":":s.state="TOKEN_LABEL";break;case"\n":s.startIndex!==t&&e(s,t),s.state="TOKEN_NEWLINE",e(s,t,0),s.state="TOKEN_INSTRUCTION",s.startIndex=t+1;break;case"%":"TOKEN_WHITESPACE"===s.state&&(e(s,t),s.state="TOKEN_REGISTER");break;case",":e(s,t),s.state="TOKEN_COMMA";break;case"/":if(s.startIndex!==t&&e(s,t),"/"!==n[t+1]){s.state="TOKEN_INVALID";break}for(;"\n"!==n[t];)t++;s.state="TOKEN_COMMENT",--t;break;default:"TOKEN_WHITESPACE"===s.state&&(e(s,t),s.state="TOKEN_CONST")}return e(s,n.length-1,0),s.tokenStream}(i);t.firstChild;)t.removeChild(t.firstChild);let n,s=1;for(const e of a){n||(t.appendChild(u("line-number",s+":")),n=p("line"),s++);const o=f[e.token];if(o)n.appendChild(u(o,i.slice(e.startIndex,e.endIndex+1).replace(/\s/g," ")));else switch(e.token){case"TOKEN_NEWLINE":t.appendChild(n),n=null;break;case"TOKEN_WHITESPACE":n.appendChild(u(o,new Array(e.endIndex-e.startIndex+2).join(" ")));break;default:n.appendChild(u("not-found",i.slice(e.startIndex,e.endIndex+1)))}}n&&t.appendChild(n),console.timeEnd("render")}function u(e,t){const n=document.createElement("span");return n.classList.add(e),n.textContent=t,n}function p(e){const t=document.createElement("div");return t.classList.add(e),t}function N(){const e=t.querySelector(".line-number").scrollWidth;n.style.top=s+c*l+"px",n.style.left=o+e-r/2+d*r+"px"}