

function FKcombo(curs,curt,curcol,status,textnum,subcrop,subarea,subseason) {
    fetch('http://localhost:3001/FK/:'+curs+'.:'+curt)
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
                    if (curcol[i]=='id_area') {
                        selectbool = 1;
                        newcombobox('NO',"id_area",status,subarea);
                    }
                    if (curcol[i]=='crop') {
                        selectbool = 1;
                        newcombobox('NO',"crop",status,subcrop);
                    }
                    if (curcol[i]=='season') {
                        selectbool = 1;
                        newcombobox('NO',"season",status,subseason);
                    }
                    if (selectbool==0) {
                     if ((i==0) && (status=="update"))   div.innerHTML += "<td>" + curcol[i] + "<input value=\"" + textnum() + "\" disabled name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"
                        else div.innerHTML += "<td>" + curcol[i] + "<input  name=\"Names\" id=\"" + curcol[i] + status + "\"></td>"
                    }
                }
            }
        });
}
function combotext(props,curcol,status)
{
    let combot="";
    for (let i=props; i< curcol.length;i++)
    {
        var div = document.getElementById(curcol[i]+status);
        if (div.localName=="select") combot+=div.value;
        else combot+="'"+div.value+"',";
    }

           return combot.slice(0,-1)



}
function handleListSubmit (props) {

    let fields;
    if (props.truestatus=="update") { fields = combotext(1,props.curcol,props.truestatus);
        update(fields,props);}
    if (props.truestatus=="input") { fields = combotext(0,props.curcol,props.truestatus);
        insert(fields,props);}


};

function newcombobox(props,curs,status,keyar)

{ if (props!="NO") {
    fetch('http://localhost:3001/FKselect/:' + curs + '.:' + props[1] + '.:' + props[2])
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
const Modal = props => {

    return (

        <div className={`modal_wrapper ${props.isOpened ? 'open' : 'close'}`} style={{...props.style}}>
            <div className='modal_body'>
                <div className='modal_close' onClick={props.onModalClose}>X</div>
                <h1>{props.status}</h1>
                <hr/>
                <h2>{props.curs+"."+props.curt}</h2>
                <hr/>
                <table id={'modal_content'+props.truestatus}>{FKcombo(props.curs,props.curt,props.curcol,props.truestatus,props.textnum,props.subcrop,props.subarea,props.subseason)}</table>
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
    alert(props.curt);
    fetch('http://localhost:3001/insert/:'+textrow+'.:'+curt+'.:'+curs, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
    function(response) {
        if (response.status == 200){
            return (props.render());  }});
}
function update(textrow,props)
{
    let updatear=props.curcol.slice(1);
    for (let i=0;i<updatear.length;i++) updatear[i]='"'+updatear[i]+'"';
    fetch('http://localhost:3001/update/:'+props.curcol[0]+'.:'+props.textnum()+'.:'+updatear+'.:'+textrow+'.:'+props.curt+'.:'+props.curs)
.then(
    function(response) {
        if (response.status == 200) {
            return (props.render());  }});
}
export default Modal