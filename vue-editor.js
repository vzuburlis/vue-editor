
Vue.filter('reverse', function(value) {
  return value.slice().reverse();
});


var ve_node_style={
	IMG:{'width':[],'height':[]},
	SPAN:{'color':[],'font-family':[],'font-size':[]},
	P:{'align':[]}
}
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
		blockquote:{label:"<i class='fa fa-quote-left'></i>",action:"insertNode",args:['BLOCKQUOTE','Blockquote',true]},
		img:{label:"<i class='fa fa-image'></i>",action:"insertNode",args:['FIGURE','<img src="img.jpg" ><figcaption>Image Caption</figcaption>',false]},
		table:{label:"<i class='fa fa-table'></i>",action:"insertNode",args:['TABLE','<tr><td><td><td><tr><td><td><td><tr><td><td><td>']},
		save:{label:"<i class='fa fa-save'></i>",action:"saveHtml"}
	},
	buttons_i:['bold','italian','ul','ol','blockquote','img','save'],
	figure:[],
	elpath:[],
	node2edit: false,
	nodeobj: [],
	areaID:''
}

Vue.component('vue-editor', {
	template: '<div class="ve-editor">\
	<div class="ve-editor-bar"><button v-for="btn in buttons_i" @click="btnAction(btn)" :index="btn">{{{buttons_def[btn].label}}}</button></div>\
	<div style="position:relative">\
		<div contenteditable="true" :id="areaID" v-on:click="onclick" v-on:keydown="onkeydown" class="ve-editor-area" >{{{text}}}</div>\
		<div v-if="node2edit!=false" class="ve-edit-node">\
			<table><tr v-for="(key, value) in nodeobj">\
                <td>{{ key | capitalize | bold}}<td><input v-model="value" v-on:input="updateEditNode"></tr>\
            </table>\
			<button v-on:click="deleteEditNode">Del</button><button v-on:click="unsetEditNode">Unset</button><button v-on:click="exitEditNode">Exit</button>\
		</div>\
	</div>\
	<div class="ve-footbar"><button v-for="(index,btn) in elpath | reverse" v-on:click="editNodeIndx(index)">&lt;{{btn.nodeName | lowercase}}&gt;</button></div>\
	</div>',
  	data: function(){ return mydata },
	props: ['buttons','text'],
	created: function () {
		if(typeof this.buttons!='undefined') this.buttons_i=this.buttons.split(' ')
		
		do{
			this.areaID = 'g-editor-area-'+Math.floor(Math.random()*100000)
		}while(document.getElementById(this.areaID))
			
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
				case 'saveHtml':
				this.saveHtml()
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
				//el.contentEditable=false

				/*if(obj!=null) {
					_this=this
					el.addEventListener('click',function(){
						_this.figureEdit(obj)
					},false)
				}*/
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
		editNodeIndx: function (indx) {
			this.editNode(this.elpath[this.elpath.length-indx-1])
		},
		editNode: function (node) {
			this.node2edit = node
			this.nodeobj = {'class':node.class,id:node.id}
			let ve = ve_node_style[this.node2edit.nodeName]
			if(ve) for(style in ve) {
				this.nodeobj[style] = node.style[style]
			}
		},
		updateEditNode: function () {
			this.node2edit.class = this.nodeobj.class
			this.node2edit.id = this.nodeobj.id
			let ve = ve_node_style[this.node2edit.nodeName]
			if(ve) for(style in ve) {
				this.node2edit.style[style] = this.nodeobj[style]
			}
		},
		deleteEditNode: function () {
			res = confirm('Remove node and its components?')
			if(res == true) {
				this.node2edit.parentNode.removeChild(this.node2edit)
			}
		},
		unsetEditNode: function () {
			var el = this.node2edit
			var parent = el.parentNode;
			while( el.firstChild ) {
				parent.insertBefore(  el.firstChild, el );
			}
			parent.removeChild(el);
		},
		exitEditNode: function () {
			this.node2edit = false
		},
		figureEdit: function(obj) {
			console.log(obj)
			this.figure=obj
		},
		saveHtml: function() {
			console.log(document.getElementById(this.areaID).innerHTML)
		},
		onEditor: function () {
			el = document.getElementById(this.areaID)
			if (window.getSelection) {
				this.sel = window.getSelection();
				this.findElPath()

				if (this.sel.rangeCount > 0 && this.sel.getRangeAt) {
					for (var i = 0; i < this.sel.rangeCount; ++i) {
						if (!this.isOrContains(this.sel.getRangeAt(i).commonAncestorContainer, el)) {
							return false;
						}
					}
					
					this.range = this.sel.getRangeAt(0);
					this.node2edit = false
					return true;

				}
			}/* else if ( (sel = document.selection) && sel.type != "Control") {
				return this.isOrContains(sel.createRange().parentElement(), el);
			}*/

			return false;
		},
		findElPath: function() {
			this.elpath = new Array()
			i=0
			if(this.sel.id == this.areaID) return
			el = this.sel.anchorNode
			if(el.id==this.areaID) return
			if(el) el=el.parentNode; else el=this.sel.parentNode
			while(el) {
				if(el.id == this.areaID) break
				//if(el.classList) if(el.classList.contains('ve-editor-area')) break
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
			if(event.target.nodeName=='IMG') this.editNode(event.target)
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
				//this.unsetNode(sel.anchorNode.nodeName)
				//event.preventDefault()
				return false;
    		}
  		}
	}

})


