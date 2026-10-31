const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { toggle?.setAttribute('aria-expanded','false'); nav?.classList.remove('open'); }
toggle?.addEventListener('click',()=>{
 const open=toggle.getAttribute('aria-expanded')!=='true';
 toggle.setAttribute('aria-expanded',String(open)); nav.classList.toggle('open',open);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.target.closest('.header')) closeMenu();});
document.querySelectorAll('[role="tablist"]').forEach(list=>{
 const tabs=[...list.querySelectorAll('[role="tab"]')];
 const activate=tab=>tabs.forEach(t=>{
  const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;
  document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;
 });
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>activate(tab));
  tab.addEventListener('keydown',e=>{
   let next;
   if(e.key==='ArrowRight'||e.key==='ArrowDown') next=(i+1)%tabs.length;
   if(e.key==='ArrowLeft'||e.key==='ArrowUp') next=(i+tabs.length-1)%tabs.length;
   if(e.key==='Home') next=0;if(e.key==='End') next=tabs.length-1;
   if(next!==undefined){e.preventDefault();activate(tabs[next]);tabs[next].focus();}
  });
 });
});
