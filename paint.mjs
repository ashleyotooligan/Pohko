export const C={paper:'#f5f1e8',white:'#fffcf7',ink:'#29232d',muted:'#777078',rule:'#d9d1d7',purple:'#715294',lilac:'#e6dded',coral:'#ca583e',rose:'#f2d8ce',green:'#3b7063',mint:'#e2ece5',dark:'#29232d'};
export function box(c,x,y,w,h,fill=C.white,stroke){c.fillStyle=fill;c.fillRect(x,y,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.strokeRect(x+.5,y+.5,w-1,h-1);}}
export function line(c,x,y,x2,y2,color=C.rule,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
export function text(c,value,x,y,size=20,color=C.ink,font='sans',weight='normal'){
 c.fillStyle=color;c.font=(weight==='bold'?'bold ':'')+size+'px '+(font==='serif'?'"DejaVu Serif"':font==='mono'?'"DejaVu Sans Mono"':'"DejaVu Sans"');c.textBaseline='top';c.fillText(String(value),x,y);
}
export function wrap(c,value,x,y,width,size=20,color=C.ink,font='sans',leading=1.42,maxLines=20){
 text(c,'',x,y,size,color,font);const rows=[];let row='';for(const word of String(value).split(/\s+/)){const next=row?row+' '+word:word;if(c.measureText(next).width>width&&row){rows.push(row);row=word;}else row=next;}if(row)rows.push(row);
 rows.slice(0,maxLines).forEach((r,i)=>text(c,r,x,y+i*size*leading,size,color,font));return y+Math.min(rows.length,maxLines)*size*leading;
}
export function label(c,value,x,y,color=C.muted){text(c,String(value).toUpperCase(),x,y,13,color,'mono');}
export function pill(c,value,x,y,color=C.purple,bg=C.lilac){text(c,'',x,y,14,color,'mono');const w=c.measureText(String(value).toUpperCase()).width+24;box(c,x,y,w,29,bg);text(c,String(value).toUpperCase(),x+12,y+6,14,color,'mono');return w;}
export function imageFit(c,image,x,y,w,h){if(!image)return;const s=Math.min(w/image.width,h/image.height);c.imageSmoothingEnabled=false;c.drawImage(image,x+(w-image.width*s)/2,y+(h-image.height*s)/2,image.width*s,image.height*s);}
export function stateColor(state){return ['broken','contested'].includes(state)?C.coral:state==='supported'||state==='intact'?C.green:C.purple;}
export function fraction(value){return (value*100).toFixed(0)+'%';}
export function stamp(c,value,x,y,w=210){c.save();c.translate(x,y);c.rotate(-.04);c.strokeStyle=C.coral;c.lineWidth=2;c.strokeRect(0,0,w,41);text(c,value,12,10,17,C.coral,'mono','bold');c.restore();}
export function plot(c,values,x,y,w,h,{color=C.purple,min=0,max=1,area=false}={}){
 if(!values.length)return;const scale=v=>y+h-(v-min)/(max-min||1)*h;
 for(let i=0;i<4;i++)line(c,x,y+i*h/3,x+w,y+i*h/3,C.rule);
 if(area){c.beginPath();c.moveTo(x,y+h);values.forEach((v,i)=>c.lineTo(x+i*w/Math.max(1,values.length-1),scale(v)));c.lineTo(x+w,y+h);c.closePath();c.fillStyle=C.lilac;c.fill();}
 c.strokeStyle=color;c.lineWidth=3;c.beginPath();values.forEach((v,i)=>i?c.lineTo(x+i*w/Math.max(1,values.length-1),scale(v)):c.moveTo(x,scale(v)));c.stroke();
 values.forEach((v,i)=>{c.fillStyle=color;c.beginPath();c.arc(x+i*w/Math.max(1,values.length-1),scale(v),4,0,Math.PI*2);c.fill();});
}
