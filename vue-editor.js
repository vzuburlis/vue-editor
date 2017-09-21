
Vue.filter('reverse', function(value) {
  return value.slice().reverse();
});



var mydata={
		buttons_def:{
			bold:{label:"<i class='fa fa-bold'></i>",action:"setNode",args:'B'},
			italian:{label:"<i class='fa fa-italic'></i>",action:"setNode",args:'I'},
			h1:{label:"<i class='fa fa-header'></i>",action:"setNode",args:'H1'},
			del:{label:"<i class='fa fa-strikethrough'></i>",action:"setNode",args:'DEL'},
			ins:{label:"<i class='fa fa-underline'></i>",action:"setNode",args:'INS'},
			sub:{label:"<i class='fa fa-subscript'></i>",action:"setNode",args:'SUB'},
			sup:{label:"<i class='fa fa-superscript'></i>",action:"setNode",args:'SUP'},
			unset:{label:"Tx",action:"unsetNode",args:['B','I','DEL','INS','SUB','SUB','SUP','BLOCKQUOTE']},
			ul:{label:"<i class='fa fa-list-ul'></i>",action:"insertNode",args:['UL','<li> ',true]},
			ol:{label:"<i class='fa fa-list-ol'></i>",action:"insertNode",args:['OL','<li> ',true]},
			pre:{label:"<i class='fa fa-code'></i>",action:"insertNode",args:['PRE','<code> ',true]},
			blockquote:{label:"<i class='fa fa-blockquote'></i>",action:"insertNode",args:['BLOCKQUOTE','Blockquote',true]},
			img:{label:"<i class='fa fa-image'></i>",action:"insertNode",args:['IMG','<img src="http://spacecronos.com/assets/cache/post_513.jpg" ><figcaption>Image Caption</figcaption>',true,{url:'www',caption:'text'}]},
			table:{label:"<i class='fa fa-table'></i>",action:"insertNode",args:['TABLE','<tr><td><td><td><tr><td><td><td><tr><td><td><td>']}
		},
		buttons_i:['bold','italian','ul','img'],
		figure:{url:'',caption:''},
		elpath:[]
		}
Vue.component('vue-editor', {
	template: '<div class="g-editor"><div class="g-editor-bar"><button v-for="btn in buttons_i" @click="btnAction(btn)" :index="btn">{{{buttons_def[btn].label}}}</button></div><div><button v-for="btn in elpath | reverse">{{btn.nodeName}}</button></div><div contenteditable="true" id="div" v-on:click="onclick" v-on:keydown="onkeydown" class="g-editor-area" >{{{text}}}</div><div v-for="(key, value) in figure">{{ key }}: <input v-model="value"></div></div>',
  	data: function(){ return mydata },
	props: ['buttons','text'],
	created: function () {
		if(typeof this.buttons!='undefined') this.buttons_i=this.buttons.split(' ')
	},
	methods: {
		btnAction: function(index) {
			action = this.buttons_def[index].action
			args = this.buttons_def[index].args
			switch(action) {
				case 'setNode':
				this.setNode(args)
				break
				case 'unsetNode':
				this.unsetNode(args)
				break
				case 'insertNode':
				this.insertNode(args[0],args[1],args[2],args[3])
				break
			}

		},
		setNode: function (x,html=' ') {
			x=x.toUpperCase()
			if(!this.onEditor()) return
			console.log(this.sel.anchorNode.parentNode.nodeName)
			if(this.sel.anchorNode.parentNode.nodeName==x) {
				this.unsetNode(x)
				return
			}

			if(this.sel.getRangeAt(0)==null) {
				this.insertNode(x,' ',true)
				return
			}

			var el = document.createElement(x);
			el.innerHTML = getSelection();
			this.range.deleteContents();
			this.insert(el)
		},
		insertNode: function (x,html=' ',editable=true,obj=null) {
			x=x.toUpperCase()
			if(!this.onEditor()) return

			var el = document.createElement(x);
			el.innerHTML = html;
			this.insert(el)

			if(editable) {
				this.range.selectNodeContents(el)
			}else{
				el.contentEditable=false

				if(obj!=null) {
					_this=this
					el.addEventListener('click',function(){
						_this.figureEdit(obj)
					},false)
				}
			}
		},
		insertText: function (html) {
			if(!this.onEditor()) return
			var el = document.createTextNode(html);
			this.insert(el)
		},
		insert: function(el) {
			this.range.insertNode(el);
			this.range.setStartAfter(el)
			this.sel.removeAllRanges()
			this.sel.addRange(this.range)
		},
		unsetNode: function (x){
			if(!this.onEditor()) return
			if(!Array.isArray(x)) x=[x]

			if (!x.includes(this.sel.anchorNode.parentNode.nodeName)) return
			var el = this.sel.anchorNode.parentNode
			var parent = el.parentNode;
			while( el.firstChild ) {
				parent.insertBefore(  el.firstChild, el );
			}
			//this.range.setStartAfter(el)
			parent.removeChild(el);
		},
		figureEdit: function(obj) {
			console.log(obj)
			this.figure=obj
		},
		onEditor: function () {
			el = document.getElementById("div")
			if (window.getSelection) {
				this.sel = window.getSelection();

				if (this.sel.rangeCount > 0 && this.sel.getRangeAt) {
					for (var i = 0; i < this.sel.rangeCount; ++i) {
						if (!this.isOrContains(this.sel.getRangeAt(i).commonAncestorContainer, el)) {
							return false;
						}
					}
					this.findElPath()

					this.range = this.sel.getRangeAt(0);
					return true;

				}
			}

			return false;
		},
		findElPath: function() {
			this.elpath = new Array()
			i=0
			el = this.sel.anchorNode
			while(el) {
				if(el.classList) if(el.classList.contains('g-editor')) break
				console.log(el.nodeName)
				this.elpath[i] = el
				i++
				el = el.parentNode
			}
		},
		isOrContains: function (node, container) {
			while (node) {
				if (node === container) return true;
				node = node.parentNode;
			}
			return false;
		},
		onclick: function() {
			if(!this.onEditor()) return
			if(event.target.nodeName=='IMG') alert("ok")
		},
		onkeydown: function() {
			if(!this.onEditor()) return
		},
		uncopy: function(event) {
			return
    		if (event.keyCode == 13) {
				sel = window.getSelection();
				pNodes = ['P','LI']
				if (sel.anchorNode.nodeName=='#text') console.log('P,LI<-'+sel.anchorNode.nodeName)
        		if (pNodes.includes(sel.anchorNode.nodeName)) return
        		if ((sel.anchorNode.nodeName=='#text') && pNodes.includes(sel.anchorNode.parentNode.nodeName)) return
				document.execCommand('insertHTML', false, '<br>');
				if ((sel.anchorNode.nodeName!='#text')) this.unsetNode(sel.anchorNode.nodeName)

				return false;
    		}
  		}
	}

})


