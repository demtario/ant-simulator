var L=Object.defineProperty;var C=(h,t,e)=>t in h?L(h,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):h[t]=e;var s=(h,t,e)=>(C(h,typeof t!="symbol"?t+"":t,e),e);const A=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function e(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=e(o);fetch(o.href,r)}};A();const d=1200,c=800,R=180,F=60,O=20,T="#deb881",S=(h,t)=>Math.hypot(t.x-h.x,t.y-h.y),n=(h,t=0)=>{const e=Math.pow(10,t||0);return Math.round(h*e)/e};var u=(h=>(h[h.Food=0]="Food",h[h.Home=1]="Home",h))(u||{});const D="#5588a3",I="#d56073",f=class{constructor(t,e,i){s(this,"x");s(this,"y");s(this,"lifeTime",0);s(this,"color");s(this,"type");s(this,"lastRenderedStep",0);s(this,"size",3);this.x=n(t),this.y=n(e),this.type=i,this.color=this.type===0?D:I}update(t,e){this.lifeTime+=e}get strength(){return 100-Math.floor(this.lifeTime/f.maxLifeTime*100)}get renderStep(){return 10-n(this.strength/10)+1}draw(t){if(this.lastRenderedStep===this.renderStep)return;const e=Math.floor(Math.max(f.maxLifeTime-this.lifeTime,0)/f.maxLifeTime*255).toString(16).padStart(2,"0");t.fillStyle=T,t.fillRect(n(this.x-this.size/2),n(this.y-this.size/2),this.size,this.size),t.fillStyle=this.color+e,t.fillRect(n(this.x-this.size/2),n(this.y-this.size/2),this.size,this.size),this.lastRenderedStep=this.renderStep}};let m=f;s(m,"maxLifeTime",O*1e3);class p{constructor(t,e){s(this,"x");s(this,"y");s(this,"sensationRadius",4);this.x=t,this.y=e}setPosition(t,e){this.x=t,this.y=e}updatePosition(t,e,i,o){this.setPosition(t+Math.cos(i)*o,e+Math.sin(i)*o)}getPheromonStrength(t){return t.getAllInCircle(this.x,this.y,this.sensationRadius).reduce((i,o)=>i+o.strength,0)}draw(t){}}class v{constructor(t=Math.random()*d,e=Math.random()*c){s(this,"x");s(this,"y");s(this,"angle");s(this,"state",0);s(this,"desiredDirection",1);s(this,"leftSensor");s(this,"forwardSensor");s(this,"rightSensor");s(this,"timeFromLastPheromon",0);s(this,"maxSpeed",8);s(this,"sensorDistance",14);s(this,"wardeningStrength",10);s(this,"pheromonTimeDelay",F);s(this,"size",8);s(this,"color","#7d5e2a");this.x=t,this.y=e,this.angle=Math.random()*Math.PI*2,this.leftSensor=new p(this.x,this.y),this.forwardSensor=new p(this.x,this.y),this.rightSensor=new p(this.x,this.y)}async update(t,e){this.updateSensorPositions(),this.handleRotate(t),this.x+=Math.cos(this.angle)*e*(this.maxSpeed/100),this.y+=Math.sin(this.angle)*e*(this.maxSpeed/100),this.handleMapBoundaries(),this.state===0?this.handleGatherFood(t):this.handleReturnToColony(t),this.createPheromon(t,e)}updateSensorPositions(){const t=this.angle-Math.PI/6,e=this.angle+Math.PI/6;this.leftSensor.updatePosition(this.x,this.y,t,this.sensorDistance),this.rightSensor.updatePosition(this.x,this.y,e,this.sensorDistance),this.forwardSensor.updatePosition(this.x,this.y,this.angle,this.sensorDistance)}handleRotate(t){const e=this.state===0?t.homePheromons:t.foodPheromons;{const i=this.leftSensor.getPheromonStrength(e),o=this.forwardSensor.getPheromonStrength(e),r=this.rightSensor.getPheromonStrength(e);o>Math.max(i,r)?this.desiredDirection=1:i>r?this.desiredDirection=0:r>i&&(this.desiredDirection=2)}if(this.angle=this.desiredAngle+(Math.random()-.5)*Math.PI*(1/this.wardeningStrength),this.state===0){const i=this.getClosesFoodSource(t.foodSources);i&&i.distance<this.size+i.foodSource.size+this.sensorDistance&&(this.angle=Math.atan2(i.foodSource.y-this.y,i.foodSource.x-this.x))}if(this.state===1){const{colony:i}=t;S(this,i)<this.size+i.size+this.sensorDistance&&(this.angle=Math.atan2(i.y-this.y,i.x-this.x))}}get desiredAngle(){return this.desiredDirection===0?this.angle-Math.PI/6:this.desiredDirection===2?this.angle+Math.PI/6:this.angle}getClosesFoodSource(t){return t.reduce((e,i)=>{const o=S(this,i);return!e||o<e.distance?{distance:o,foodSource:i}:e},null)}handleGatherFood({foodSources:t}){const e=this.getClosesFoodSource(t);!e||e.distance<this.size+e.foodSource.size&&(e.foodSource.removeFood(),this.state=1,this.angle+=Math.PI)}handleReturnToColony({colony:t}){Math.hypot(this.x-t.x,this.y-t.y)<this.size+t.size&&(this.state=0,this.angle+=Math.PI,t.increaseScore())}handleMapBoundaries(){this.x<0&&(this.x=0,this.angle=Math.PI-this.angle),this.y<0&&(this.y=0,this.angle=-this.angle),this.x>d&&(this.x=d,this.angle=Math.PI-this.angle),this.y>c&&(this.y=c,this.angle=-this.angle)}createPheromon(t,e){if(this.timeFromLastPheromon+=e,this.timeFromLastPheromon>this.pheromonTimeDelay){this.timeFromLastPheromon=0;const i=this.state===0?u.Food:u.Home,o=new m(this.x,this.y,i);i===u.Food?t.foodPheromons.push(o):t.homePheromons.push(o)}}draw(t){if(t.fillStyle=this.color,t.fillRect(n(this.x-this.size/2),n(this.y-this.size/2),this.size,this.size),this.state===1){const e=this.size*.5;t.fillStyle="#52de97",t.fillRect(this.x-e/2,this.y-e/2,e,e)}this.leftSensor.draw(t),this.forwardSensor.draw(t),this.rightSensor.draw(t)}}class _{constructor(t,e){s(this,"x");s(this,"y");s(this,"size",30);s(this,"score",0);s(this,"color","#a1583e");this.x=t,this.y=e}update(t,e){}draw(t){t.fillStyle=this.color,t.beginPath(),t.arc(n(this.x),n(this.y),this.size,0,Math.PI*2),t.fill(),t.fillStyle="#ffffff",t.fillText(`${this.score}`,this.x,this.y)}increaseScore(t=1){this.score+=t}}class P{constructor(t,e){s(this,"x");s(this,"y");s(this,"foodLeft");s(this,"color","#65d269");this.x=t,this.y=e,this.foodLeft=n(Math.random()*400+200,0)}update(t,e){}draw(t){t.fillStyle=this.color,t.beginPath(),t.arc(n(this.x),n(this.y),this.size,0,Math.PI*2),t.fill(),t.fillStyle="#ffffff",t.fillText(`${this.foodLeft}`,n(this.x-10),n(this.y))}removeFood(){this.foodLeft--}get size(){return Math.max(20,n(this.foodLeft/20))}}class y{constructor(t=[]){s(this,"map",{});t.forEach(e=>this.push(e))}push(t){this.map[t.x]||(this.map[t.x]={}),this.map[t.x][t.y]||(this.map[t.x][t.y]=[]),this.map[t.x][t.y].push(t)}remove(t){if(!this.map[t.x]||!this.map[t.x][t.y])return;const e=this.map[t.x][t.y].indexOf(t);e!==-1&&this.map[t.x][t.y].splice(e,1)}get(t,e){return this.map[t]&&this.map[t][e]?this.map[t][e]:[]}getAllInCircle(t,e,i){const o=[];for(let r=Math.floor(t-i);r<t+i;r++)for(let l=Math.floor(e-i);l<e+i;l++)this.get(r,l).forEach(M=>S({x:t,y:e},M)<=i?o.push(M):null);return o}forEach(t){Object.keys(this.map).forEach(e=>{Object.keys(this.map[e]).forEach(i=>{this.map[e][i].forEach(o=>t(o))})})}filter(t){const e=[];return this.forEach(i=>{t(i)&&e.push(i)}),new y(e)}get length(){let t=0;return this.forEach(()=>t++),t}}const g=document.querySelector("#primaryScene"),E=document.querySelector("#pheromonsScene"),a=g.getContext("2d",{alpha:!1}),x=E.getContext("2d");class G{constructor(){s(this,"isActive",!0);s(this,"lastRender",0);s(this,"colony");s(this,"ants");s(this,"foodPheromons",new y);s(this,"homePheromons",new y);s(this,"foodSources",[]);s(this,"times",[]);s(this,"fps",0);s(this,"updateTime",0);s(this,"drawTime",0);this.colony=new _(d/2,c/2),this.ants=Array.from({length:R},()=>new v(this.colony.x,this.colony.y)),this.foodSources=Array.from({length:4},()=>new P(Math.random()*d,Math.random()*c)),this.loop(0)}draw(){a.fillStyle=T,a.fillRect(0,0,g.width,g.height),this.foodPheromons.forEach(t=>t.draw(x)),this.homePheromons.forEach(t=>t.draw(x)),a.drawImage(E,0,0),this.ants.map(t=>t.draw(a)),this.foodSources.map(t=>t.draw(a)),this.colony.draw(a),this.drawPerfomance()}drawPerfomance(){a.fillStyle="#000";const t=window.performance.memory.usedJSHeapSize;a.fillText(`FPS: ${this.fps}`,10,20),a.fillText(`Memory: ${n(t/1024/1024)} MB`,10,30),a.fillText(`Update time: ${n(this.updateTime,2)}ms`,10,40),a.fillText(`Render time: ${n(this.drawTime,2)}ms`,10,50)}update(t){this.foodPheromons.forEach(e=>e.update(this,t)),this.homePheromons.forEach(e=>e.update(this,t)),this.foodPheromons=this.foodPheromons.filter(e=>e.lifeTime<m.maxLifeTime),this.homePheromons=this.homePheromons.filter(e=>e.lifeTime<m.maxLifeTime),this.ants.map(e=>e.update(this,t)),this.foodSources.map(e=>e.update(this,t)),this.foodSources=this.foodSources.filter(e=>e.foodLeft>0),this.colony.update(this,t)}loop(t){if(!this.isActive)return;const e=t-this.lastRender;this.lastRender=t;const i=performance.now();for(;this.times.length>0&&this.times[0]<=i-1e3;)this.times.shift();this.times.push(i),this.fps=this.times.length,this.update(e);const o=performance.now();this.draw();const r=performance.now();this.updateTime=o-i,this.drawTime=r-o,window.requestAnimationFrame(l=>this.loop(l))}stop(){this.isActive=!1}onMouseClick(t,e){this.foodSources.push(new P(t,e))}}const w=document.querySelector("#primaryScene");w.width=d;w.height=c;const z=document.querySelector("#pheromonsScene");z.width=d;z.height=c;document.addEventListener("DOMContentLoaded",()=>{const h=new G;w.addEventListener("click",t=>{h.onMouseClick(t.offsetX,t.offsetY)}),window.game=h});