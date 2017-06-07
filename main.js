function initRem() {
 	var innerWidth = window.innerWidth;
	if(innerWidth>400){
		innerWidth=400;
	}
 	rem = innerWidth / 7.5 + 'px';
 	document.documentElement.style.fontSize = rem;
}
initRem();
window.onresize = function() {
 		initRem();
}
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}
/**
 *Dom
 */
 document.body.addEventListener("click",function(event){
	var e=event.target,
		or1=document.getElementById('or1'),
		or2=document.getElementById('or2');
	!function qipao(box){
		if(box.tagName=='A'){
			var href=box.href;
			if(href.indexOf('#pk1')!==-1){
				or1.style.display='none';
				or2.style.display='block';
			}else{
				if(href.indexOf('#pk2')!==-1){
					xxy.popup('暂未开放');
				}
				if(href.indexOf('#index')!==-1){
					or1.style.display='block';
					or2.style.display='none';
				}
			}
		} else{
			if(!box||box.tagName=='BODY'){
				return false;
			}else{
				var boxParendNode=box.parentNode;
				qipao(boxParendNode);
			}
		}
	}(e);
});
/**
*核心
*/
function xxyc(){
	/**
	*渲染
	*/
	//global对象
	var main=document.getElementById('main'),
		global={
			w:10,
			h:12,
			n:false,//顺序记录
			lick:[]
		};
	 for(var i=0; i<=30; i++){
		 global.lick[i] = [];
	 }
	!function(){
			w_bak = global.w,
			h_bak = global.h,
			c = [],
			cc = [];
		while(h_bak--){
			var x = w_bak;
			while(x--){
				cc.push('<span data-site="'+(global.h-h_bak)+','+(global.w-x)+'"></span>');
			}
			c.push('<p>'+cc.join('')+'</p>');
			cc = [];
		}
		main.innerHTML=c.join('');
	}();
	//console.log(global)
	/**
	*操作控制
	*/
	main.addEventListener('click',function mainList(e){
		var th = this,
			e = e.target;
		try{
			var	getSite=e.getAttribute('data-site').split(',');
		}catch(e){
			return false;
		}
		var	site = {
				w: +getSite[0],
				h: +getSite[1]
			},
			n = {
				black: '<i class="child black"></i>',
				white: '<i class="child white"></i>'
			},
			trueX = 0,//连续的子数
			trueY = 0;
		global.n =! global.n;
		if(global.n){
			n.n = n.black;
			n.color = '黑';
		}else{
			n.n = n.white;
			n.color = '白';
		}
		e.innerHTML = n.n;
		/**
		 *添加坐标到全局对象
		 *   h==x,w==y
		 *		x(w)
		 *      +y(h)
		 */
		 // try{
			 // global.lick[site.w][site.h]=n.color;
		 // }catch(e){
			 // global.lick[site.w]=[];
		 // }
		 // 给下棋的棋子添加标注
		global.lick[site.w][site.h] = n.color;
		//console.log(site.h,site.w);
		/**
		*输出结果
		*a 数量
		*/
		function result_fun(a){
			//console.log(a);
			if(a.length>=5){
				th.removeEventListener('click',mainList);
				a.forEach(function(e,i){
					window.setTimeout(function(){
						var x=+e.split(',')[0],
							y=+e.split(',')[1];
						var qizi=th.childNodes[x-1].childNodes[y-1];
						qizi.style.backgroundColor='#1488f5';
					},300*i);
				});
				window.setTimeout(function(){
					xxy.popup('<span style="color:red;font-size:1.2em">'+n.color+'棋 </span>胜','重来','观看棋局',function(e){
						if(e==0){
							xxyc();
						}else{
							th.addEventListener('click',function(){
								return false;
							})
							xxy.toast('观看棋局！',10000);
							document.getElementById('init').style.display='inline-block';
						}
					});
				},2000);
			}
		}
		/**
		*求X上数量 左右
		*/
		!function(){
			// result 连续的总数量计算
			var result=[site.w+','+site.h];
			var subData = site.h, // siteY sub start     Y轴点击的起点
				addData = site.h; // 副本
			function l(a){
				// 匹配下一个  (X-- 上)
				if(global.lick[site.w][a] == n.color){
					result.push(site.w + ',' + a);
					l(--subData);
				// X ++ 向下匹配 
				}else{
					if(/*addData>site.h+6 ||*/ global.lick[site.w][addData+1]!=n.color){
						return false;
					}
					l(++addData)
				}
			}
			l(--subData);
			result_fun(result);
		}();
		/**
		* 求Y的数量 上下    
		*/
		!function(){
			var result= [site.w+','+site.h];
			var subData= site.w,
				addData= site.w;
			function l(a){
				a= a<0?0:a;
				if(global.lick[a][site.h] == n.color){
					result.push(a+','+site.h);
					l(--subData);
				}else{
					if(/*addData > site.w+6 ||*/ global.lick[addData+1][site.h] != n.color){
						return false;
					}
					l(++addData)
				}
			}
			l(--subData);
			result_fun(result);
		}();
		/**
		* '\'
		*8 5,7 4,6 3
		*/
		!function(){
			var result=[site.w+','+site.h],
				subData1=site.w,
				subData2=site.h,
				addData1=site.w,
				addData2=site.h;
			function l(a,b){
				a=a<0?0:a;
				b=b<0?0:b;
				if(global.lick[a][b]==n.color){
					result.push(a+','+b);
					l(--subData1,--subData2);
				}else{
					if(addData1>site.w+6||global.lick[addData1+1][addData2+1]!=n.color){
						return false;
					}
					l(++addData1,++addData2)
				}
			}
			l(--subData1,--subData2);
			result_fun(result);
		}();
		/**
		*  '/'
		*5 9,6 8,7 7 
		*/
		!function(){
			var result=[site.w+','+site.h],
				subData1 = site.w,
				subData2 = site.h,
				addData1 = site.w,
				addData2 = site.h;
			function l(a,b){
				a = a<0?0:a;
				b = b<0?0:b;
				if(global.lick[a][b] == n.color){
					result.push(a+','+b);
					l(--subData1,++subData2);
				}else{
					if(addData1>site.w+6||global.lick[addData1+1][addData2-1]!=n.color){
						return false;
					}
					l(++addData1,--addData2)
				}
			}
			l(--subData1,++subData2);
			result_fun(result);
		}();
	});
}
xxyc();






















