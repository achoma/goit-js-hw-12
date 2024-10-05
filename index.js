/* empty css                      */import{S as m,i as p}from"./assets/vendor-5ObWk2rO.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();const g="42580380-f7e9d56cf0d50abf8107b2707",y="https://pixabay.com/api/",h=document.getElementById("search-form"),u=document.getElementById("gallery"),w=document.getElementById("loader");let a;h.addEventListener("submit",async t=>{t.preventDefault();const o=document.getElementById("query").value.trim();if(o!==""){$(),l(!0);try{const s=(await L(o)).hits;if(s.length===0){c("Sorry, there are no images matching your search query. Please try again!");return}E(s),a?a.refresh():a=new m("#gallery a")}catch(n){b(n)}finally{l(!1)}}});async function L(t){const o=`${y}?key=${g}&q=${encodeURIComponent(t)}&image_type=photo&orientation=horizontal&safesearch=true`,n=await fetch(o);if(!n.ok)throw new Error("Network response was not ok");return n.json()}function b(t){t.message==="Network response was not ok"?c("There was a problem with the network connection. Please try again later."):c("An unexpected error occurred. Please try again.")}function c(t){p.error({title:"Error",message:t})}function E(t){const o=t.map(({webformatURL:n,largeImageURL:s,tags:e,likes:r,views:i,comments:f,downloads:d})=>`
        <div class="gallery-item">
          <a href="${s}">
            <img src="${n}" alt="${e}" />
          </a>
          <div class="info">
            <p>Likes: ${r}</p>
            <p>Views: ${i}</p>
            <p>Comments: ${f}</p>
            <p>Downloads: ${d}</p>
          </div>
        </div>`).join("");u.insertAdjacentHTML("beforeend",o)}function $(){u.innerHTML=""}function l(t){w.classList.toggle("hidden",!t)}
//# sourceMappingURL=index.js.map
