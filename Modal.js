let localhostm='45.89.26.151';
function FKcombo(curs,curt,curcol,status,textnum) {
    fetch('http://'+localhostm+':3001/FK/:'+curs+'.:'+curt)
        .then(response =>  response.text())
        .then(data => {
            {
                let regarcol = [];
                if (data!='[]') {

                    let regexp = (data.split(/\[(.+?)\]/));
                    let regexpf = (regexp[1].split(/\{(.+?)\}/));
                    let regarrows = [];

                    let cou = 0;

                    for (let i = 0; i < regexpf.length; i++) {
                        if (regexpf[i].length > 1) {
                            regarrows[cou] = regexpf[i];
                            cou = cou + 1;
                        }
                    }

                    for (let i = 0; i < regarrows.length; i++) {
                        regarcol[i] = [];

                        let buffer = regarrows[i].split(",");
                        for (let j = 0; j < buffer.length; j++) {
                            regarcol[i].push(buffer[j].split(":").at(1));
                        }

                    }
                }
                var div = document.getElementById('modal_content'+status);
                div.innerHTML="";
                let fori=0;
                for (let i=fori; i< curcol.length;i++)
                {
                    let selectbool=0;
                    for (let j=0; j< regarcol.length;j++)
                    {
                        if ('"'+curcol[i]+'"'==regarcol[j][0]) {
                            selectbool = 1;
                           newcombobox(regarcol[j],curs,status);
                        }

                    }
                    if (selectbool==0) {
                     if ((i==0) && (status=="update"))   div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + textnum() + "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"
                        else div.innerHTML += "<td>" + curcol[i] + "<input  name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"
                    }
                }
            }
        });
}
function combotext(istart,curcol,status,id_dtype)
{
    let combot="";
	alert(curcol);
    for (let i=istart; i< curcol.length;i++) {
		if (curcol[i]=='country') {combot+="'108',";} else 
		{
			if (curcol[i]=='devis') {combot+="'"+id_dtype+"',";} else {
        var div = document.getElementById(curcol[i]+status);
        if (div.localName=="select") combot+=div.value;
		else { if (div.value=='') {combot+="null,";} else 
			combot+="'"+div.value+"',";}}}
		
    
		}

           return combot.slice(0,-1)




}
function handleListSubmit (props) {
var curcol=Object.keys(props.curcol)
	if (props.curt.includes('##')) curcol=Object.values(props.curcol);
    let fields;
    if (props.truestatus=="update") { fields = combotext(1,curcol,props.truestatus,props.id_dtype);
        update(fields,props);}
    if (props.truestatus=="input") { fields = combotext(0,curcol,props.truestatus,props.id_dtype);
        insert(fields,props);}


};

function newcombobox(props,curs,status,keyar)

{ if (props!="NO") {
    fetch('http://'+localhostm+':3001/FKselect/:' + curs + '.:' + props[1] + '.:' + props[2])
        .then(response => response.text())
        .then(data => {
            let regexpFK = (data.split(/\[(.+?)\]/));
            let regexpfFK = (regexpFK[1].split(/\{(.+?)\}/));

            let regarrowsFK = [];
            let regarcolFK = [];
            let couFK = 0;
            for (let i = 0; i < regexpfFK.length; i++) {
                if (regexpfFK[i].length > 1) {
                    regarrowsFK[couFK] = regexpfFK[i];
                    couFK = couFK + 1;
                }
            }

            for (let i = 0; i < regarrowsFK.length; i++) {
                regarcolFK[i] = [];

                let bufferFK = regarrowsFK[i].split(",");
                for (let j = 0; j < bufferFK.length; j++) {
                    regarcolFK[i].push(bufferFK[j].split(":").at(1));
                }
            }

            var div = document.getElementById('modal_content' + status);

            div.innerHTML += "<td>" + props[1].substring(1, props[1].length - 1) + "<select name=\"Names\" id=\"" + props[0].split('"').at(1) + status + "\"></td>"
            var select = document.getElementById(props[0].split('"').at(1) + status);
            select.innerHTML = "";
			console.log(props[0].split('"').at(1) + status);
            for (var i = 0; i < regarcolFK.length; i++) {
                var opt = regarcolFK[i];
                select.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
            }

        });
} else {
    var div = document.getElementById('modal_content' + status);
    div.innerHTML += "<td>"+curs+"<select name=\"Names\" id=\"" + curs + status + "\"></td>"
    var select = document.getElementById(curs + status);
    select.innerHTML = "";
    for (var i = 0; i < keyar.length; i++) {
        var opt = keyar[i].split("&&");
        var finalopt=opt[1]+',"'+opt[0]+'"';
        select.innerHTML += "<option value=\"" + finalopt + "\">" + finalopt + "</option>";
    }
}
}

function atdRows(curOb,status,textnum,row,curt)
{
	var	curcol=Object.keys(curOb);
	if (curt.includes('##')) {curcol=Object.values(curOb); 
	
	if ((status=="update")) {
if (row!=null) {console.log(row)

var div = document.getElementById('modal_content'+status);
if (div!=null) {
div.innerHTML="";
for (let i=0; i< curcol.length;i++)
{

if (i==0) {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + row[curcol[i]] + "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"}


else
{
if (row[curcol[i]]==null) row[curcol[i]]=''
if (curcol[i]=='country') {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + curOb.country+ "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>" }
else {
if (curcol[i]=='devis') {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + curOb.devis + "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"} else


div.innerHTML += "<td>" + curcol[i] + "<input value=\""+row[curcol[i]]+"\"+ name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"}
}

}
}}
}
else {

var div = document.getElementById('modal_content'+status);
if (div!=null) {
div.innerHTML="";
FKcombo(curt.split('##')[1],curt.split('##')[0],curcol,status);

}
}
	
	}else 
	{
	if ((status=="update")) {
if (row!=null)	{console.log(row)

	                var div = document.getElementById('modal_content'+status);	
				if (div!=null) {
               div.innerHTML="";
                let fori=0;
	                for (let i=fori; i< curcol.length;i++)
                {
					
                     if (i==0)   {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + row[curcol[i]] + "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"}
					
					 
                        else 
							{
								if (row[curcol[i]]==null) row[curcol[i]]=''
								if (curcol[i]=='country') {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + curOb.country+ "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>" }
								else {
								if (curcol[i]=='devis') {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + curOb.devis + "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"} else 
								
												
								div.innerHTML += "<td>" + curcol[i] + "<input value=\""+row[curcol[i]]+"\"+ name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"}
				}
                    
				}
	}} 
	}
	else {
		
			                var div = document.getElementById('modal_content'+status);	
				if (div!=null) {
               div.innerHTML="";
                let fori=0;
	                for (let i=fori; i< curcol.length;i++)
                {
                
                    
								if (curcol[i]=='country') {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + curOb.country+ "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>" }
								else {
								if (curcol[i]=='devis') {div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + curOb.devis + "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"} else 
								
										
								div.innerHTML += "<td>" + curcol[i] + "<input name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"}
				
                    
				}
	}
}
}}
const Modal = props => {

    return (

        <div className={`modal_wrapper ${props.isOpened ? 'open' : 'close'}`} style={{...props.style}}>
            <div className='modal_body'>
                <div className='modal_close' onClick={props.onModalClose}>X</div>
                <h1>{props.status}</h1>
                <hr/>
                <h2>{props.curs+props.curt}</h2>
                <hr/>
<table id={'modal_content'+props.truestatus}>{atdRows(props.curcol,props.truestatus,props.textnum,props.row,props.curt)}</table>
                <hr/>
                <button style={{width: '20%',height: '50px'}} onClick={()=>handleListSubmit (props)}>{props.text}</button>
                {props.children}
            </div>
            </div>
    )
}



function insert(textrow,props)
{
let curt=props.curt;
 let curs=props.curs;
    if ((props.curt=="") && (props.curs=="Projects"))
    {
        curt="project";
        curs="projects";
    }
  //  fetch('http://'+localhostm+':3001/insert/:'+textrow+'.:'+curt+'.:'+curs, {
  //      method: 'POST',
  //      headers: {
  //          'Content-Type': 'application/json',
  //      }
  //  }).then(
  //  function(response) {
   //     if (response.status == 200){
    //        return (props.render());  }});
	
	info_area_insert(textrow,props)
	
}

function info_area_insert(textrow,props)
{ 
if (props.curt.includes('##')) { 
	    fetch('http://'+localhostm+':3001/insert/:'+textrow+'.:'+props.curt.split('##')[0]+'.:'+props.curt.split('##')[1], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
    function(response) {
		return (props.render());  
			});
	} else {
 var idArray=textrow.split(',')
	    fetch('http://'+localhostm+':3001/insert/:'+textrow+'.:info_area_devision.:atd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
    function(response) {
        if (response.status == 200) {
			if (props.id_dtype>1) {var type_link=props.id_dtype-1;
			fetch('http://'+localhostm+':3001/insertcus/:'+idArray[0]+','+props.id_p+','+type_link+'.:id_area,id_parent_area,id_type_link.:link_up_down.:atd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
		})
			
			
			}
            return (props.render(idArray[3].slice(1,-1),idArray[0]));  }
			else {console.log(response)}
			});
}}

function update(textrow,props)
{
	if (props.curt.includes('##')) {
			var	curcol=Object.values(props.curcol);
			var targetUpdate=props.row[curcol[0]] ;
	var idArray=textrow.split(',')
		fetch('http://'+localhostm+':3001/update/:'+curcol[0]+'.:'+targetUpdate+'.:'+curcol.slice(1)+'.:'+textrow+'.:'+props.curt.split('##')[0]+'.:'+props.curt.split('##')[1])
.then(
    function(response) {
        if (response.status == 200) {
            return (props.render(idArray[2].slice(1,-1),targetUpdate));  }});} 
			else {
		var	curcol=Object.keys(props.curcol)
	var targetUpdate=props.row[curcol[0]] ;
	var idArray=textrow.split(',')
	for (var i=0;i<curcol.length;i++) 
	{
	if (curcol[i]=='country') curcol[i]='id_country'
	if (curcol[i]=='devis') curcol[i]='id_type_devis'
	if (curcol[i]=='shape') curcol[i]='id_status_shape'
	}
	   fetch('http://'+localhostm+':3001/update/:'+curcol[0]+'.:'+targetUpdate+'.:'+curcol.slice(1)+'.:'+textrow+'.:info_area_devision.:atd')
.then(
    function(response) {
        if (response.status == 200) {
            return (props.render(idArray[2].slice(1,-1),targetUpdate));  }});
}}
export default Modal