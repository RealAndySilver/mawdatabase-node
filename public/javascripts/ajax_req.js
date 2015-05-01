$(document).on('ready', function(){	
	$('#main_form form').on('submit', function(e){
		e.preventDefault();
		$.ajax({
			beforeSend: function (){
				$("#results_table").html('');
				$("#results_label").html('Loading');
				$("#loading").html('<img src="../../../../images/loading.gif" width="30" height:"30" alt="imagen">');
			},
			url: $('#main_form form').attr('action'),
			type: $('#main_form form').attr('method'), 
			data: $("#main_form form").serialize(),//Serializa la data del form y la convierte en un json
			success: function (res){
				$("#results_label").html('<span class="badge pull-left" style="margin:7px 5px 0px 0px;">'+res.response+'</span>'+" Results found");
				$("#loading").html('');
				fillTable(res);
				console.log(res);
			},
			error: function (jqXHR,status,error){
				$("#loading").html('');
				console.log(status);
			},
			complete: function (jqXHR,status){
				$("#loading").html('');
				console.log(status);
			},
			timeout:100000
		});
	});	
});

function fillTable(res){
	var result='';
	var head = '<table class="table table-striped table-bordered table-condensed", style="background:white; max-width:700px;">'
					+'<thead>'
							+'<tr>';
	var cell_class='';
	var table_res='';
	var a_link_open = '';
	var a_link_close = '';
	
	if(res.type=="recording"){
		head+='<th> CD Number </th>'
				+'<th> Composer </th>'	
				+'<th> Title </th>'
				+'<th> Artist </th>'
			+'</tr>'
		+'</head>'
		+'<tbody>';
		for(var i = 0; i< res.response;i++){
			if(res.session){
				a_link_open = '<a href="/Dashboard/Recordings/'+res.list[i]._id+'">';
				a_link_close = '</a>'
			}
			cell_class= res.list[i].artist.length>0 && res.list[i].composer.length>0 && res.list[i].title.length>0 ? 'none':'danger';
			table_res+='<tr class='+cell_class+' style="vertical-align:middle;">'
					+'<td style="vertical-align:middle;">'+'<b>' + a_link_open +res.list[i].cd_number  + a_link_close +'</b>'+'</td>'
					+'<td style="vertical-align:middle;">'+ res.list[i].composer +'</td>'
					+'<td style="vertical-align:middle;">'+ res.list[i].title +'</td>'
					+'<td style="vertical-align:middle;">'+ res.list[i].artist +'</td>'
				+'</tr>'
		}
	}
	else if(res.type=="score"){
		head += '<th> ID </th>'
				+'<th> Category </th>'	
				+'<th> Composer </th>'
				+'<th> Title </th>'
				+'<th> Edition </th>'
			+'</tr>'
		+'</head>'
		+'<tbody>';
		for(var i = 0; i< res.response;i++){
			if(res.session){
				a_link_open = '<a href="/Dashboard/Scores/'+res.list[i]._id+'">';
				a_link_close = '</a>'
			}
			cell_class= res.list[i].category.length>0 && res.list[i].composer.length>0 && res.list[i].title.length>0 && res.list[i].edition.length>0 ? 'none':'danger';
			table_res+=
			'<tr class='+cell_class+' style="vertical-align:middle;">'
					+'<td style="vertical-align:middle;">'+'<b>' + a_link_open + res.list[i].lib_id + a_link_close +'</b>'+'</td>'
					+'<td style="vertical-align:middle;">'+'<span class="label label-danger">' + res.list[i].category +'</span>'+'</td>'
					+'<td style="vertical-align:middle;">'+ res.list[i].composer +'</td>'
					+'<td style="vertical-align:middle;">'+ res.list[i].title +'</td>'
					+'<td style="vertical-align:middle;">'+ res.list[i].edition +'</td>'
				+'</tr>';
		}
	}
	result = head + table_res + '</tbody>'
	$("#results_table").html(result);
};