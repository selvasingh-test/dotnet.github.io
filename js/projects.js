require(["jquery"], function ($) {
    $(document).ready(function () {
        //display few features from latest version here
        $.support.cors = true;

        var baseUrl = "https://dotnetweb.blob.core.windows.net/foundation/";
        var projectsUrl = baseUrl + "projects.json";
        var contributorNames = [];
        var projectNames = [];

        $.getJSON(projectsUrl, function (data) {
            writeProjects(data["projects"], "");
            writeContributors(data["contributors"]);


            function writeProjectTitle(project, row) {
                $.get(baseUrl + project.name, function (data) {
                    //$("#projects").append("<h4 class='col-md-4'>" + project + "</h4>");
                    require(["marked"], function (marked) {
                        var paraCount = 0;
                        var renderer = new marked.Renderer();
                        renderer.list = function (body, ordered) {
                            return "";
                        };
                        renderer.paragraph = function (text) {
                            if (paraCount == 0) {
                                paraCount++;
                                return "<p>" + text + "</p>";
                            }
                            return "";
                        };
                        renderer.heading = function (text, level) {
                            if (level == 1) {
                                projectNames.push(text);
                                return "<h4 class='highlight'>" + text + "</h4>";
                            }
                            return "";
                        };
                        var contrib = "<div><b>Contributor:</b> " + project.contributor + "</div>";
                        $(row).append("<div class='col-md-4'>" + marked(data, {
                            renderer: renderer
                        }) + contrib + "</div>");

                    });

                });
            }

            function writeProjects(projects, pattern) {
                $("#projects").empty();
                var projectCount = 0;
                var projectRow;

                for (i = 0; i < projects.length; i++) {
                    if (pattern != "" && projects[i].name != pattern && projects[i].contributor != pattern) {
                        continue;
                    }

                    if (projectCount == 0 || projectCount % 3 == 0) {
                        var rowName = "prow" + projectCount;
                        $("#projects").append("<div class='row' id='" + rowName + "''></div>");
                        projectRow = $("#" + rowName);
                    }
                    writeProjectTitle(projects[i], projectRow);
                }
            }

            function writeContributors(contributors) {
                var contributorRow;

                for (i = 0; i < contributors.length; i++) {
                    if (i == 0 || i % 3 == 0) {
                        var rowName = "crow" + i;
                        $("#contributors").append("<div class='row' id='" + rowName + "'' style='margin-top:15px;margin-bottom:15px; margin-left:10px;'></div>");
                        contributorRow = $("#" + rowName);
                    }
                    $(contributorRow).append("<div class='col-md-4'><div><a href='" + contributors[i].web + "'><img src='" + contributors[i].logo + "' style='max-height:200px;width:200px;'/></a></div>");
                    contributorNames.push(contributors[i].name);
                }
            }

            require(["typeahead"], function (typeahead) {

                var substringMatcher = function (strs) {
                    return function findMatches(q, cb) {
                        var matches, substrRegex;

                        // an array that will be populated with substring matches
                        matches = [];

                        // regex used to determine if a string contains the substring `q`
                        substrRegex = new RegExp(q, 'i');

                        // iterate through the pool of strings and for any string that
                        // contains the substring `q`, add it to the `matches` array
                        $.each(strs, function (i, str) {
                            if (substrRegex.test(str)) {
                                // the typeahead jQuery plugin expects suggestions to a
                                // JavaScript object, refer to typeahead docs for more info
                                matches.push({
                                    value: str
                                });
                            }
                        });

                        cb(matches);
                    };
                };

                $('.typeahead').typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                }, {
                    name: 'contributors',
                    displayKey: 'value',
                    source: substringMatcher(contributorNames)
                }, {
                    name: 'projects',
                    displayKey: 'value',
                    source: substringMatcher(projectNames)
                }).bind('typeahead:selected', function (obj, datum, name) {
                    writeProjects(data["projects"], datum.value);
                });
            });

        });
    });
});