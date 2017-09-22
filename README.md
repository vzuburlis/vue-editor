# vue-editor
A simple WYIWYG editor made with VueJS

A basic use of the component
```
<!DOCTYPE html>
<header>
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="vue-editor.css">

	<!-- VueJS -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.16/vue.js"></script>
	<script src="vue-editor.js"></script>
</header>

<body>
	<vue-editor text='<p>A free WYSIWYG editor</p>'></vue-editor>
</body>

<script>


var editor = new Vue({
	el: 'body',
})

</script>
```

Demo
=
<p>
  <img src="https://github.com/vzuburlis/vue-editor/blob/master/screenshot.jpg"  />
</p>

