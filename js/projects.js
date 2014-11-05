require.config({
    paths: {
        "jquery": "http://code.jquery.com/jquery-2.1.1.min",
        "marked": "http://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min",
        "typeahead" : "http://twitter.github.io/typeahead.js/releases/latest/typeahead.bundle"
    },
    shim: {
		"typeahead": ["jquery"]
	}
});

require(["jquery"], function($) {
	$(document).ready(function () {
		//display few features from latest version here
		$.support.cors = true;

		var baseUrl = "https://dotnetweb.blob.core.windows.net/foundation/";
		var projects = baseUrl + "projects.json";
		var contributors = [];

		$.getJSON(projects,function (data){
			var projectRow;
			var contributorRow;
			var projects = data["projects"];
			for (i = 0; i <projects.length; i++)
			{
				if (i == 0 || i % 3 == 0)
				{
					var rowName = "prow"+ i; 
					$("#projects").append("<div class='row' id='"+ rowName+"''></div>");
					projectRow = $("#" + rowName);
				}
				writeProjectTitle(projects[i], projectRow);
				if (contributors.indexOf(projects[i].contributor) == -1)
				{
					if (contributors.length == 0 || contributors.length % 3 == 0)
					{
						var rowName = "crow"+ i; 
						$("#contributors").append("<div class='row' id='"+ rowName+"'' style='margin-top:15px;margin-bottom:15px; margin-left:10px;'></div>");
						contributorRow = $("#" + rowName);
					}
					var index = data["contributors"].map(function(x) {return x.name; }).indexOf(projects[i].contributor);
					var contributor = data["contributors"][index];
					$(contributorRow).append("<div class='col-md-4'><div><a href='" +contributor.web+"'><img src='" + contributor.logo+ "' style='max-height:200;width:200;'/></a></div>");
					contributors.push(projects[i].contributor);
				}
				
			}

			function writeProjectTitle(project, row)
			{
				$.get(baseUrl + project.name, function(data)
					{
						//$("#projects").append("<h4 class='col-md-4'>" + project + "</h4>");
						require(["marked"], function(marked) {
						var paraCount = 0;
						var renderer = new marked.Renderer(); 
						renderer.list = function(body, ordered){return "";};
						renderer.paragraph = function(text){ 
							if (paraCount == 0)
							{
								paraCount++;
								return "<p>" + text + "</p>";
							}
							return "";
						};
						renderer.heading = function (text, level) { 
						 return level == 1 ?"<h4 class='highlight'>" + text + "</h4>" : ""; 
						}; 
						var contrib = "<div><b>Contributor:</b> " + project.contributor + "</div>"; 
						$(row).append("<div class='col-md-4'>" + marked(data,{renderer:renderer})+ contrib + "</div>"); 

						});
		
					});

			}
		});


	});
});