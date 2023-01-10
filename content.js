var url = document.URL;
if (url.indexOf('helpdesk.compassluxe') != -1) {
	if (url.indexOf('/browse/') != -1) {
		if (document.getElementById("project-name-val").innerHTML.indexOf("Client ") != -1 && (document.getElementById("status-val").innerHTML.indexOf("Open") != -1 || document.getElementById("status-val").innerHTML.indexOf("In Progress") != -1)) {
			insertTo = document.getElementById("assignee-val").parentElement;
			addButton(insertTo);
		}
	}
	if (document.getElementById("myButt") != null) {
		document.getElementById("myButt").addEventListener('mouseenter', (event) => {
			document.getElementById("myButt").setAttribute("style", "outline:none;border:0;background:transparent;color:#0645AD;text-decoration:underline;cursor: pointer")
		});
		document.getElementById("myButt").addEventListener('mouseleave', (event) => {
			document.getElementById("myButt").setAttribute("style", "outline:none;border:0;background:transparent;color:#0645AD;")
		});
	}
}

function addButton(addTo) {
	if ((addTo.innerHTML.indexOf('Auto assigning') == -1)) {
		let a = document.createElement("a");
		let butt = document.createElement('button');
		butt.id = "myButt";
		butt.innerHTML  = "Auto assigning";
		butt.style = "outline:none;border:0;background:transparent;color:#0645AD;";
		butt.onclick = function () {
		  sendText();
		};
		a.appendChild(butt);
		addTo.insertBefore(butt, addTo.children[1])
	}
}

async function sendText() {
	//-------------------никнейм ответственного за компоненту--------------
	let urlEnd = document.URL.split("/")[2];
	personName = "kekovich";
	componenta = (document.getElementById("components-field").children[0]).innerHTML
	projectName = document.getElementById("project-name-val").getAttribute("href").split("/")[2]
	let url = "https://"+urlEnd+"/projects/" + projectName + "?selectedItem=com.atlassian.jira.jira-projects-plugin:components-page";
	let response = await fetch(url);

	let htmlText = (await response.text()).split('WRM._unparsedData["com.atlassian.jira.projects.page.components:components"]="')[1];

	const stringArr =  ((htmlText.split("\n")[0]).replaceAll("}", "}\n")).split("\n");
	stringArr.forEach((curStr) => {
		if ((curStr.indexOf("rel") != -1) && (curStr.indexOf(componenta+"\\") != -1)) {
			let tmp = curStr.split("rel")[1];
			tmp = tmp.substring(5);
			tmp = tmp.substring(0, tmp.indexOf('\\'))
			personName = tmp;
		}
	})
	//-----------------------------------------------------------------
	if (personName != "kekovich") {
		//--------------назначаем на человека----------------
		function getCookie(name) {
		  const value = `; ${document.cookie}`;
		  const parts = value.split(`; ${name}=`);
		  if (parts.length === 2) return parts.pop().split(';').shift();
		}
		atl_token = getCookie("atlassian.xsrf.token")
		issIdEl = document.getElementById("key-val")
		issId = issIdEl.getAttribute("rel")

		fetch('https://'+urlEnd+'/secure/AjaxIssueAction.jspa?decorator=none', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "assignee="+personName+"&issueId="+issId+"&atl_token=" + atl_token + "&singleFieldEdit=true&fieldsToForcePresent=assignee"
		})
		.then(response => response.json())
		.then(response => console.log(response))
		//---------------------------------------------------
	}
	function refresh() {    
		setTimeout(function () {
			location.reload()
		}, 100);
	}
	refresh();
}
