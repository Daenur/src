import React, { useState,useEffect,Component,memo,useCallback }  from 'react';

import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Tree from 'react-animated-tree-v2'
import {CSVLink, CSVDownload} from 'react-csv';
import './styles.css'
import Modal from "./Modal";
import { LOCALES } from './translations/locales'
import { messages } from './translations/messages'
import { IntlProvider } from 'react-intl'
import { FormattedMessage} from 'react-intl'
import styled from 'styled-components'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Tabs from "./tab"
import { useTable, useBlockLayout, useResizeColumns } from 'react-table'

var arraycart = [];
var arraycarh = [];
var arraybool=0;


const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border: 1px solid black;
    overflow: auto;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
    font-family: Open Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 22px;
    border: 1px solid #2E343D;
    background: #272D34;
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;

    color: #C5C5C5;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        background: black;
        width: 4px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`

function settable(props) {
    arraycart=props;
    return arraycart;
}

const languages = [
    { name: 'EN', code: LOCALES.ENGLISH },
    { name: 'RU', code: LOCALES.RUSSIAN },
    { name: 'IN', code: LOCALES.INDIAN }
]





function Table({ columns, data }) {
    const defaultColumn = React.useMemo(
        () => ({
            minWidth: 30,
            width: 150,
            maxWidth: 400,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        resetResizing,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useBlockLayout,
        useResizeColumns
    )

    return (

        <div style={{overflow: 'auto',height:'100%'}}>
            <div {...getTableProps()} className="table">
                <div >
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()} className="tr">
                            {headerGroup.headers.map(column => (
                                <div {...column.getHeaderProps()} className="th">
                                    {column.render('Header')}
                                    {/* Use column.getResizerProps to hook up the events correctly */}
                                    <div
                                        {...column.getResizerProps()}
                                        className={`resizer ${
                                            column.isResizing ? 'isResizing' : ''
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <div {...row.getRowProps()} className="tr">
                                {row.cells.map(cell => {
                                    return (
                                        <div {...cell.getCellProps()} className="td">
                                            {cell.render('Cell')}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}

function Example(props) {
    const [modal, setModal] = useState(
        {
            modal1:false
        }
    );

    return (
        <div style={{display:'inline-block',width: '10%'}}>
            <button style={{width: '100%',height: '50px'}}  onClick={() => setModal(
                {
                    ...modal,modal1:true
                }
            )}>

                {props.text}
            </button>
            <Modal
                subcrop={props.subcrop}
                subseason={props.subseason}
                subarea={props.subarea}
                render={props.render}
                textnum={props.textnum}
                truestatus={props.truestatus}
                status={props.status}
                curs={props.curs}
                curcol={props.curcol}
                curt={props.curt}
                text={props.text}
                isOpened={modal.modal1}
                onModalClose={()=> setModal({...modal,modal1:false})}
            >{props.render}
            </Modal>

        </div>
    );
}




const treeStyles = {
    color: 'white',
    fill: 'white',
}


class Board extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showPopup: false,
            xIsNext: true,
            arrayt: '',
            arrayf: '',
            tablevie: '',
            tableview: '',
            statebase: '',
            districtbase: '',
            curt: "",
            curs: "",
            curcol: "Nan",
            textnum: "NaN",
            textrow: "",
            order: "-",
            datasource: "",
            status: "",
            locale: LOCALES.ENGLISH,
            projinfo: "",
            subprojinfo: "",
            arrayheader: "",
            arraytable: "",
            footer:"",
            checkseason:"",
            checkcrop:"",
            auth:"close",
        }
        ;



        let arraytable=[''];
        fetch('http://localhost:3001/')
            .then(response =>  response.text())
            .then(data => {
                arraytable=data.split(",");
                for (let i = 0; i < arraytable.length; i++) {
                    let prefinish = arraytable[i].split(":").at(1);
                    arraytable[i] = (prefinish.split('"').at(1));
                    if ((arraytable[i] != "atd") && (arraytable[i] != "log") && (arraytable[i] != "other") && (arraytable[i] != "mobile_app") && (arraytable[i] != "crop") && (arraytable[i] != "soil")) arraytable[i]=null;

                }
                let arraytablef2 = arraytable.filter(function (el) {
                    return el != null;
                });
                arraytable=arraytablef2;
                let arraytablef=arraytable.slice();
                let arraytablepref;
                for (let i = 0; i < arraytable.length; i++) {



                    fetch('http://localhost:3001/schema/:' + arraytable[i])
                        .then(response => response.text())
                        .then(data => {
                            arraytablef[i] = '';
                            arraytablef[i] = data.split(",");
                            this.setkek(arraytablef, arraytable);
                        });

                }
                fetch('http://localhost:3001/table/:state.:atd')
                    .then(response =>  response.text())
                    .then(data => {
                        let regexp=(data.split(/\[(.+?)\]/));
                        let regexpf=(regexp[1].split(/\{(.+?)\}/));

                        let regarrows=[];
                        let cou=0;
                        for (let i = 0; i < regexpf.length; i++) {
                            if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                        }

                        this.setstatebase(regarrows);
                    }).then(
                    fetch('http://localhost:3001/table/:dist.:atd')
                        .then(response =>  response.text())
                        .then(data => {
                            let regexp=(data.split(/\[(.+?)\]/));
                            let regexpf=(regexp[1].split(/\{(.+?)\}/));

                            let regarrows=[];
                            let cou=0;
                            for (let i = 0; i < regexpf.length; i++) {
                                if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                            }
                            this.setstatedistbase(regarrows);
                        }).then(
                        fetch('http://localhost:3001/table/:project.:projects')
                            .then(response =>  response.text())
                            .then(data => {
                                let regexp=(data.split(/\[(.+?)\]/));
                                let regexpf=(regexp[1].split(/\{(.+?)\}/));

                                let regarrows=[];
                                let cou=0;
                                for (let i = 0; i < regexpf.length; i++) {
                                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                                }
                                this.setprojinfo(regarrows);
                            })
                    ).then(
                        fetch('http://localhost:3001/table/:subproject.:projects')
                            .then(response =>  response.text())
                            .then(data => {
                                let regexp=(data.split(/\[(.+?)\]/));
                                let regexpf=(regexp[1].split(/\{(.+?)\}/));

                                let regarrows=[];
                                let cou=0;
                                for (let i = 0; i < regexpf.length; i++) {
                                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                                }
                                this.setsubprojinfo(regarrows);
                            })))


            });


    }
    setstatebase(props) {
        this.setState({
            statebase:props,
        });
    }
    setsubprojinfo(props) {
        this.setState({
            subprojinfo:props,
        });
    }
    setprojinfo(props) {
        this.setState({
            projinfo:props,
        });
    }
    setstatedistbase(props) {
        this.setState({
            districtbase:props,
        });
    }
    setkek(props,propsa) {
        this.setState({
            arrayt:propsa,
            arrayf: props
        });
    }

    renderproject() {
        return  this.projop(0)
    }

    projop(lvl,state,statename) {
        if ((lvl==0) && (this.state.projinfo.length>0)) {
            let arraybranch=[];
            for (let i = 0; i < this.state.projinfo.length; i++)
            {
                let truedist=(this.state.projinfo[i].split(","));
                let truestate=truedist[0].split(":");
                let truestatename=truedist[3].split(":");
                arraybranch[i] = this.projop(1,truestate[1],truestatename[1]);
            }
            return <Tree content={<FormattedMessage id='projects'/>} onItemClick={()=>this.projectview("Projects",1)} open style={treeStyles}>
                {arraybranch}
            </Tree>}
        if ((lvl==1) && (this.state.projinfo.length>1)) {
            let arraybranch=[];
            let id=0;
            for (let i = 0; i < this.state.subprojinfo.length; i++)
            {
                let truedist=(this.state.subprojinfo[i].split(","));
                let truestate=truedist[1].split(":");
                truedist=truedist[2].split(":");

                if (truestate[1]==state) {
                    arraybranch[id] = this.projop(2,truedist[1],statename);
                    id=id+1;
                }
            }
            return <Tree  content={statename.replace(/^"|"$/g, '')} onItemClick={()=>this.projectview(statename,2,state)}>
                {arraybranch}
            </Tree>
        }
        if (lvl==2) {
            return <Tree content={state.replace(/^"|"$/g, '')}  icons={{ closeIcon: "Eye" }}/>
        }
    }

    rendertree() {
        let arraytree=[''];
        for (let i = 0; i < this.state.arrayt.length; i++) {
            {
                arraytree[i] = this.renderbranch(i);
            }
        }

        return  <Tree content={<FormattedMessage id='nsi' />}  style={treeStyles}>{arraytree}</Tree>

    }

    op(props,propsa) {
        let arraybranch = props.slice();
        if (arraybranch[0].toString().length>1) {
            for (let i = 0; i < arraybranch.length; i++)
            {

                arraybranch[i] = this.rendernode(arraybranch[i],propsa);

            }

            return <Tree content={propsa} >
                {arraybranch}
            </Tree>
        }

        else
            return <Tree content="daclbranch"  canHide/>

    }

    atdop(lvl,state) {
        if (lvl==0)     {       return <Tree content={<FormattedMessage id='atd' />} >
            {this.atdop(1)}
        </Tree>} else {
            if ((lvl == 1)) {
                let arraybranch = [];
                for (let i = 0; i < this.state.statebase.length; i++) {
                    let truedist = (this.state.statebase[i].split(","));
                    let truestate = truedist[2].split(":");
                    arraybranch[i] = this.atdop(2, truestate[1]);
                }
                return <Tree content={<FormattedMessage id='india' />} onItemClick={() => this.countryview()}>
                    {arraybranch}
                </Tree>
            } else
            {
                if ((lvl == 2)) {
                    let arraybranch = [];
                    let id = 0;
                    for (let i = 0; i < this.state.districtbase.length; i++) {
                        let truedist = (this.state.districtbase[i].split(","));
                        let truestate = truedist[2].split(":");

                        if (truestate[1] == state) {
                            truedist = truedist[4].split(":");
                            arraybranch[id] = this.atdop(3, truedist[1]);
                            id = id + 1;
                        }
                    }
                    return <Tree content={state.replace(/^"|"$/g, '')} onItemClick={() => this.stateview(state)}>
                        {arraybranch}
                    </Tree>
                } else {
                    return <Tree content={state.replace(/^"|"$/g, '')} icons={{closeIcon: "Eye"}}/>


                }
            }
        }

    }

    renderbranch (props) {
        if (this.state.arrayf[props]!='[]') {
            if (props==5) { if ((this.state.statebase.length > 1) && (this.state.districtbase.length > 1)) return this.atdop(0)}
            else
                return this.op(this.state.arrayf[props],this.state.arrayt[props])
        }
        else    return <Tree content={this.state.arrayt[props]}  />

    }

    rendernode(props,propsa)
    {
        let x=props.split(":").at(1).split('"').at(1);
        return <Tree   content={x} icons={{ closeIcon: "Eye" }}  onItemClick={() => this.alertnode(x,propsa)}
        />
    }

    alertnode(props,propsa)
    {
        let elements = document.querySelectorAll('div.treeview');

        for (let elem of elements) {
            if (elem.textContent==props)  elem.style.color = '#4DB6BC';
            else elem.style.color = 'white';
        }
        this.tableview(props,propsa)
    }

    projectview(idproj,lvl,idsubproj)
    {
        if (lvl==1)  this.mainprojectview(idproj);
        if (lvl==2)  this.subprojectview(idproj,idsubproj);

    }

    countryview()

    {
        fetch('http://localhost:3001/country/')
            .then(response =>  response.text())
            .then(data => {

                let regexp=(data.split(/\[(.+?)\]/));
                let regexpf=(regexp[1].split(/\{(.+?)\}/));
                let cou=0;
                let regarrows=[];
                let regarcol=[];
                for (let i = 0; i < regexpf.length; i++) {
                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                }

                let arrayheader=[];
                for (let i = 0; i < regarrows.length; i++) {
                    regarcol[i] = [];

                    let buffer=regarrows[i].split(',"');
                    for (let j = 0; j < buffer.length; j++) {
                        regarcol[i].push(buffer[j].split('":').at(1));
                        arrayheader[j]=buffer[j].split('":').at(0);
                    }
                }
                let arraytable=[];
                let headers=arrayheader.slice();

                //  arraytable[arraytable.length]=this.renderprojspin(regarcol[i][j],arrayheader[j].length,0,85/arrayheader.length+"%",regarcol[i][0]);

                arrayheader[0]= arrayheader[0].substr(1);
                var jsonArr = [];
                var jsonArrt = [];

                for (var i = 0; i < arrayheader.length; i++) {
                    jsonArr.push({
                        Header: arrayheader[i],
                        accessor: arrayheader[i],

                    });
                }

                for (let i = 0; i < regarcol.length; i++) {
                    var myCar = new Object();
                    for (var j = 0; j < regarcol[0].length; j++) {

                        myCar[arrayheader[j]]=regarcol[i][j];

                    }
                    jsonArrt.push(myCar);

                }

                this.setState((state) => {
                    return {
                        tableview:regarcol,
                        curcol: headers,
                        curs:"India",
                        curt:"",
                        tablevie: <Styles>
                            <Table columns={jsonArr}
                                   data={jsonArrt} />
                        </Styles>,
                        footer:<div className='lower'>
                        <Example
                            render={()=>this.renderorder(this.state.curcol[0])}
                            curcol={this.state.curcol}
                            curs={this.state.curs}
                            curt={this.state.curt}
                            textnum={this.state.textnum}
                            truestatus="input"
                            text=<FormattedMessage id='input' />
                        status=<FormattedMessage id='inputtxt' />
                        />
                        <Example
                            render={()=>this.renderorder(this.state.curcol[0])}
                            curcol={this.state.curcol}
                            curs={this.state.curs}
                            curt={this.state.curt}
                            textnum={this.state.textnum}
                            truestatus='update'
                            text=<FormattedMessage id='update' />
                        status=<FormattedMessage id='updatetxt' />
                        />
                        <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                            <FormattedMessage id='deletestr' />
                        </button>
                        <button style={{display: 'inline-block',width: '10%'}} onClick={()=>this.xslsreport()}><FormattedMessage id='uploadxsls' />
                        </button>
                    </div>
                    }

                });

                this.render();
            });


    }

    stateview(statename)
    {
        fetch('http://localhost:3001/dist/:26')
            .then(response =>  response.text())
            .then(data => {

                let regexp=(data.split(/\[(.+?)\]/));
                let regexpf=(regexp[1].split(/\{(.+?)\}/));
                let cou=0;
                let regarrows=[];
                let regarcol=[];
                for (let i = 0; i < regexpf.length; i++) {
                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                }

                let arrayheader=[];
                for (let i = 0; i < regarrows.length; i++) {
                    regarcol[i] = [];

                    let buffer=regarrows[i].split(',"');
                    for (let j = 0; j < buffer.length; j++) {
                        regarcol[i].push(buffer[j].split('":').at(1));
                        arrayheader[j]=buffer[j].split('":').at(0);
                    }
                }
                let arraytable=[];
                let headers=arrayheader.slice();
                for (let i = 0; i < regarcol.length; i++) {
                    arraytable[arraytable.length]=this.renderspin("");
                    for (let j = 0; j < regarcol[0].length; j++)
                    {
                        arraytable[arraytable.length]=this.renderprojspin(regarcol[i][j],arrayheader[j].length,0,85/arrayheader.length+"%",regarcol[i][0]);
                    }
                }
                arrayheader[0]= arrayheader[0].substr(1);
                for (let j = 0; j < arrayheader.length; j++)
                {

                    arrayheader[j]=this.renderprojspin(arrayheader[j],arrayheader[j].length,1,85/arrayheader.length+"%");
                }
                for (let j = 0; j < headers.length; j++)
                {
                    headers[j]=headers[j].split('"').at(1);
                }


                this.setState((state) => {
                    return {
                        tableview:regarcol,
                        curcol: headers,
                        curs:"India",
                        curt:statename.replace(/"/g,''),
                        tablevie: <div><div class="trueheader">{arrayheader}</div><div class="truetable" id="truetable" >{arraytable}</div></div>,
                        footer:  <div className='lower'>
                            <Example
                                render={()=>this.renderorder(this.state.curcol[0])}
                                curcol={this.state.curcol}
                                curs={this.state.curs}
                                curt={this.state.curt}
                                textnum={this.state.textnum}
                                truestatus="input"
                                text=<FormattedMessage id='input' />
                            status=<FormattedMessage id='inputtxt' />
                            />
                            <Example
                                render={()=>this.renderorder(this.state.curcol[0])}
                                curcol={this.state.curcol}
                                curs={this.state.curs}
                                curt={this.state.curt}
                                textnum={this.state.textnum}
                                truestatus='update'
                                text=<FormattedMessage id='update' />
                            status=<FormattedMessage id='updatetxt' />
                            />
                            <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                <FormattedMessage id='deletestr' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} >
                                <CSVLink data={this.csvreport()}    filename={this.state.curt+".csv"}><FormattedMessage id='uploadcsv' /></CSVLink>
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>this.xslsreport()}><FormattedMessage id='uploadxsls' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>document.getElementById('fileload').click()}><FormattedMessage id='load' />
                            </button>
                        </div>
                    }

                });

                this.render();
            });


    }

    mainprojectview(idproj)
    {
        fetch('http://localhost:3001/projects/')
            .then(response =>  response.text())
            .then(data => {

                let regexp=(data.split(/\[(.+?)\]/));
                let regexpf=(regexp[1].split(/\{(.+?)\}/));
                let cou=0;
                let regarrows=[];
                let regarcol=[];
                for (let i = 0; i < regexpf.length; i++) {
                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                }

                let arrayheader=[];
                for (let i = 0; i < regarrows.length; i++) {
                    regarcol[i] = [];

                    let buffer=regarrows[i].split(',"');
                    for (let j = 0; j < buffer.length; j++) {
                        regarcol[i].push(buffer[j].split('":').at(1));
                        arrayheader[j]=buffer[j].split('":').at(0);
                    }
                }
                let arraytable=[];
                arrayheader[0]= arrayheader[0].substr(1);
                let headers=arrayheader.slice(0,8);
                for (let i = 0; i < regarcol.length; i++) {
                    arraytable[arraytable.length]=this.renderspin("");
                    for (let j = 0; j < regarcol[0].length; j++)
                    {
                        arraytable[arraytable.length]=this.renderprojspin(regarcol[i][j],arrayheader[j].length,0,85/arrayheader.length+"%",regarcol[i][0]);
                    }
                }

                for (let j = 0; j < arrayheader.length; j++)
                {

                    arrayheader[j]=this.renderprojspin(arrayheader[j],arrayheader[j].length,1,85/arrayheader.length+"%");
                }


                this.setState((state) => {
                    return {
                        tableview:regarcol,
                        curcol: headers,
                        curs:idproj.replace(/"/g,''),
                        curt:"",
                        tablevie: <div><div class="trueheader">{arrayheader}</div><div class="truetable" id="truetable" >{arraytable}</div></div>,
                        footer: <div className='lower'>
                            <Example
                                render={()=>this.renderorder(headers[0])}
                                curcol={headers}
                                curs={idproj}
                                curt=""
                                truestatus="input"
                                text=<FormattedMessage id='inputp' />
                            status=<FormattedMessage id='inputtxt' />
                            />
                            <Example
                                render={()=>this.renderorder(headers[0])}
                                curcol={headers}
                                curs={idproj}
                                curt=""
                                truestatus='update'
                                text=<FormattedMessage id='updatep' />
                            status=<FormattedMessage id='updatetxt' />
                            />
                        </div>
                    }

                });

                this.render();
            });



    }

    renderprojspin(pros,prosa,hea,width,number)
    {

        if (pros=="") {
            return <tr></tr>
        }
        else {

            if (hea==0) {    return       <input
                style={{width:width}}
                name={number}
                value={pros.replace(/"/g,'')}
                type="text"
            />}

            else { if (hea==1) {

                return       <input style={{fontWeight:'bold',width:width,fontSize:'17px',textAlign:'left', outline: 'none'}}
                                    value={pros}
                                    type="text" />}
            }}
    }

    subprojectview(idproj,idid)
    {var arrayheader=[];
        var arraytable=[];
        fetch('http://localhost:3001/project/:'+idproj.replace(/"/g,''))
            .then(response =>  response.text())
            .then(data => {
                let regexp=(data.split(/\[(.+?)\]/));
                let regexpf=(regexp[1].split(/\{(.+?)\}/));
                let cou=0;
                let regarrows=[];
                let regarcol=[];
                for (let i = 0; i < regexpf.length; i++) {
                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                }

                for (let i = 0; i < regarrows.length; i++) {
                    regarcol[i] = [];

                    let buffer=regarrows[i].split(',"');
                    for (let j = 0; j < buffer.length; j++) {
                        regarcol[i].push(buffer[j].split('":').at(1));
                        arrayheader[j]=buffer[j].split('":').at(0);
                    }
                }
                let headers=arrayheader.slice();

                for (let i = 0; i < regarcol.length; i++) {
                    for (let j = 0; j < regarcol[0].length; j++)
                    {
                        arraytable[arraytable.length]=regarcol[i][j];
                    }
                }
                arrayheader[0]= arrayheader[0].substr(1);

                for (let j = 0; j < headers.length; j++)
                {
                    headers[j]=headers[j].split('"').at(1);
                }
                arraycart=arraytable.slice();
                arraycarh=arrayheader;
                this.state.arraytable=arraytable.slice();
                this.state.arrayheader=arrayheader.slice();
            }).then(
            fetch('http://localhost:3001/subproject/:'+idid)
                .then(response => response.text())
                .then(data => {

                    let regexp = (data.split(/\[(.+?)\]/));
                    let regexpf = (regexp[1].split(/\{(.+?)\}/));
                    let cou = 0;
                    let regarrows = [];
                    let regarcol = [];
                    for (let i = 0; i < regexpf.length; i++) {
                        if (regexpf[i].length > 1) {
                            regarrows[cou] = regexpf[i];
                            cou = cou + 1;
                        }
                    }

                    let arrayheadersub = [];
                    for (let i = 0; i < regarrows.length; i++) {
                        regarcol[i] = [];

                        let buffer = regarrows[i].split(',"');
                        for (let j = 0; j < buffer.length; j++) {
                            regarcol[i].push(buffer[j].split('":').at(1));
                            arrayheadersub[j] = buffer[j].split('":').at(0);
                        }
                    }
                    let arraytablesub = [];
                    let headers = arrayheadersub.slice();
                    headers[0]=headers[0].substr(1);

                    for (let i = 0; i < regarcol.length; i++) {
                        arraytablesub[arraytablesub.length] = this.renderspin("");
                        for (let j = 0; j < regarcol[0].length; j++) {
                            arraytablesub[arraytablesub.length] = this.renderprojspin(regarcol[i][j], arrayheadersub[j].length, 0, 85 / arrayheadersub.length + "%", regarcol[i][0]);
                        }
                    }
                    arrayheadersub[0] = arrayheadersub[0].substr(1);
                    for (let j = 0; j < arrayheadersub.length; j++) {
                        arrayheadersub[j] = this.renderprojspin(arrayheadersub[j], arrayheadersub[j].length, 1, 85 / arrayheadersub.length + "%");
                    }



                    if (arraybool>0) {


                        this.setState((state) => {
                            let croparray=(this.state.arraytable[8].replace(/"/g, '')).split(",");
                            let divarray=(this.state.arraytable[9].replace(/"/g, '')).split(",");
                            let seasarray=(this.state.arraytable[10].replace(/"/g, '')).split(",");
                            for (let j = 0; j < croparray.length; j++) {
                                croparray[j] = <td ><input style={{width: '30%'}}  value={croparray[j].split("&&")[1]} /><input style={{width: '64%'}}  value={croparray[j].split("&&")[0]} /> </td>
                            }
                            for (let j = 0; j < divarray.length; j++) {
                                divarray[j] = <td ><input style={{width: '30%'}}  value={divarray[j].split("&&")[1]}  /><input style={{width: '64%'}}  value={divarray[j].split("&&")[0]} /> </td>
                            }
                            for (let j = 0; j < seasarray.length; j++) {
                                let buff=seasarray[j];
                                seasarray[j] = <td ><input style={{width: '30%'}} onClick={()=>this.setcheckseason(buff.split("&&")[1])}  value={seasarray[j].split("&&")[1]}  /><input style={{width: '64%'}}  onClick={()=>this.setcheckseason(buff.split("&&")[1])} value={seasarray[j].split("&&")[0]} /> </td>
                            }
                            arraycart = [];
                            arraybool=0;
                            return {
                                curs: idproj.replace(/"/g, ''),
                                curt: "",
                                tablevie: <div  style={{height:"50%"}}>
                                    <table  style={{width:"30%",height:"100%",display: 'inline-block'}}>
                                        <table className="Projectbody" style={{width:"100%",height:"100%"}}>
                                            <td ><FormattedMessage id='directorh' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}}  value="Иванов" /> </td>
                                            <td ><FormattedMessage id='contract' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}}  value={this.state.arraytable[1]} /> </td>
                                            <td><FormattedMessage id='dates' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}}  value={(this.state.arraytable[4].replace(/"/g, '')).split("T21")[0]} /> </td>
                                            <td><FormattedMessage id='datefp' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}}  value={(this.state.arraytable[5].replace(/"/g, '')).split("T21")[0]} /> </td>
                                            <td><FormattedMessage id='dateff' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input  style={{width: '38%'}} value={(this.state.arraytable[6].replace(/"/g, '')).split("T21")[0]} /> </td>
                                            <td><button style={{display: 'inline-block',width: '100%',height: '40px'}} ><FormattedMessage id='projedit' /></button></td>
                                        </table>
                                    </table>
                                    <table className="Projectbody" style={{width:"20%",height:"50%"}}>
                                        <td ><FormattedMessage id='seasonh' >{placeholder => <input style={{width: '97%'}} type='text' value={placeholder} />}</FormattedMessage> </td>
                                        <td ><input style={{width: '30%'}}  value="Id" /><input style={{width: '64%'}}  value="Name" /> </td>
                                        <table className="Projecttable" style={{width:"100%",height:"100%"}}>
                                            {seasarray}
                                        </table>
                                        <td className="subbutton"><select id="seasonselect" style={{width: '40%'}} >{this.cropcombobox()}</select><button style={{background: '#5B9138'}} onClick={()=>this.insertseason(idproj.replace(/"/g, ''),idid)}>+</button><button style={{background: '#ff0000'}} onClick={()=>this.delseason(idproj.replace(/"/g, ''),"delseason")}>-</button></td>
                                    </table>
                                    <table className="Projectbody" style={{width:"20%",height:"50%"}}>
                                        <td ><FormattedMessage id='croph' >{placeholder => <input style={{width: '97%'}} type='text' value={placeholder} />}</FormattedMessage> </td>
                                        <td ><input style={{width: '30%'}}  value="Id" /><input style={{width: '64%'}}  value="Name" /> </td>
                                        <table className="Projecttable" style={{width:"100%",height:"100%"}}>
                                            {croparray}
                                        </table>
                                        <td className="subbutton"><select id="cropselect" style={{width: '40%'}} >{this.seasoncombobox()}</select><button style={{background: '#5B9138'}} onClick={()=>this.insertcrop(idproj.replace(/"/g, ''),idid)}>+</button><button style={{background: '#ff0000'}} onClick={()=>this.delcrop(idproj.replace(/"/g, ''),"delcrop")}>-</button></td>
                                    </table>
                                    <table className="Projectbody" style={{width:"20%",height:"50%"}}>
                                        <td ><FormattedMessage id='atdh' >{placeholder => <input style={{width: '97%'}} type='text' value={placeholder} />}</FormattedMessage></td>
                                        <td ><input style={{width: '30%'}}  value="Id" /><input style={{width: '64%'}}  value="Name" /> </td>
                                        <table className="Projecttable" style={{width:"100%",height:"100%"}}>
                                            {divarray}
                                        </table>
                                        <td className="subbutton"><select id="areaselect" style={{width: '40%'}} >{this.areacombobox()}</select><button style={{background: '#5B9138'}} onClick={()=>this.insertarea(idproj.replace(/"/g, ''),idid)}>+</button><button style={{background: '#ff0000'}} onClick={()=>this.delarea(idproj.replace(/"/g, ''),"delarea")}>-</button></td>
                                    </table>
                                    <hr style={{top: '58%',width: '100%', position: 'absolute'}}/>
                                    <div class="supportheader"
                                         style={{top: '62%', position: 'absolute'}}>{arrayheadersub}</div>
                                    <div class="supporttable"
                                         style={{top: '70%', position: 'absolute'}}>{arraytablesub}</div>
                                </div>,
                                footer: <div className='lower'>
                                    <Example
                                        render={()=>this.subprojectview(idproj,idid)}
                                        subcrop={(this.state.arraytable[8].replace(/"/g, '')).split(",")}
                                        subarea={(this.state.arraytable[9].replace(/"/g, '')).split(",")}
                                        subseason={(this.state.arraytable[10].replace(/"/g, '')).split(",")}
                                        curcol={headers}
                                        curs="projects"
                                        curt="subproject"
                                        textnum={()=>this.textnumget()}
                                        truestatus="input"
                                        text=<FormattedMessage id='inputsubp' />
                                    status=<FormattedMessage id='inputtxt' />
                                    />
                                    <Example
                                        render={()=>this.subprojectview(idproj,idid)}
                                        subcrop={(this.state.arraytable[8].replace(/"/g, '')).split(",")}
                                        subarea={(this.state.arraytable[8].replace(/"/g, '')).split(",")}
                                        subdiv={(this.state.arraytable[8].replace(/"/g, '')).split(",")}
                                        curcol={headers}
                                        curs="projects"
                                        curt="subproject"
                                        textnum={()=>this.textnumget()}
                                        truestatus="update"
                                        text=<FormattedMessage id='updatesubp' />
                                    status=<FormattedMessage id='updatetxt' />
                                    />
                                    <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                        <FormattedMessage id='deletesubp' />
                                    </button>
                                    <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                        <FormattedMessage id='uploadxsls' />
                                    </button>
                                </div>
                            }


                        });

                    }else { arraybool+=1; this.subprojectview(idproj,idid); this.render();}
                })


        );
    }

    setcheckcrop(id)
    {
        this.setState({
            checkcrop:id,
        });
    }
    setcheckseason(id)
    {
        this.setState({
            checkseason:id,
        });
    }

    tableview(props,propsa)
    {
        fetch('http://localhost:3001/table/:'+props+'.:'+propsa)
            .then(response =>  response.text())
            .then(data => {
                let regexp=(data.split(/\[(.+?)\]/));
                let regexpf=(regexp[1].split(/\{(.+?)\}/));
                let cou=0;
                let regarrows=[];
                let regarcol=[];
                for (let i = 0; i < regexpf.length; i++) {
                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                }

                let arrayheader=[];
                for (let i = 0; i < regarrows.length; i++) {
                    regarcol[i] = [];

                    let buffer=regarrows[i].split(",");
                    for (let j = 0; j < buffer.length; j++) {
                        regarcol[i].push(buffer[j].split(":").at(1));
                        arrayheader[j]=buffer[j].split(":").at(0);
                    }
                }

                let arraytable=[];
                let headers=arrayheader.slice();
                for (let i = 0; i < regarcol.length; i++) {
                    arraytable[arraytable.length]=this.renderspin("");
                    for (let j = 0; j < regarcol[0].length; j++)
                    {regarcol[i][j]=regarcol[i][j].replace(/^"|"$/g, '');
                        //if ((j==3) && (arrayheader[i]="id_crop_category")) { regarcol[i][j]=this.quartaproof(regarcol[i][j]);}
                        arraytable[arraytable.length]=this.renderspin(regarcol[i][j],arrayheader[j].length,0,85/arrayheader.length+"%",regarcol[i][0]);
                    }
                }
                for (let j = 0; j < arrayheader.length; j++)
                {
                    arrayheader[j]=this.renderspin(arrayheader[j],arrayheader[j].length,1,85/arrayheader.length+"%");
                }
                for (let j = 0; j < headers.length; j++)
                {
                    headers[j]=headers[j].split('"').at(1);
                }


                this.setState((state) => {
                    return {
                        tableview:regarcol,
                        curcol: headers,
                        curs: propsa,
                        curt:props,
                        textnum: "",
                        tablevie: <div><div class="trueheader">{arrayheader}</div><div class="truetable" id="truetable" >{arraytable}</div></div>,
                        footer:              <div className='lower'>
                            <Example
                                render={()=>this.renderorder(this.state.curcol[0])}
                                curcol={headers}
                                curs={propsa}
                                curt={props}
                                textnum={()=>this.textnumget()}
                                truestatus="input"
                                text=<FormattedMessage id='input' />
                            status=<FormattedMessage id='inputtxt' />
                            />
                            <Example
                                render={()=>this.renderorder(this.state.curcol[0])}
                                curcol={headers}
                                curs={propsa}
                                curt={props}
                                textnum={()=>this.textnumget()}
                                truestatus='update'
                                text=<FormattedMessage id='update' />
                            status=<FormattedMessage id='updatetxt' />
                            />
                            <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                <FormattedMessage id='deletestr' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} >
                                <CSVLink data={this.csvreport()}    filename={this.state.curt+".csv"}><FormattedMessage id='uploadcsv' /></CSVLink>
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>this.xslsreport()}><FormattedMessage id='uploadxsls' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>document.getElementById('fileload').click()}><FormattedMessage id='load' />
                            </button>
                        </div>
                    }

                });

                this.render();
            });
    }

    updateradio (props)
    {
        let elements = document.querySelectorAll('div.truetable>input');
        let element = document.getElementsByName(props);
        for (let elem of elements) {
            elem.style.background = '#272D34';
            elem.style.color= '#C5C5C5';
        }
        for (let elem of element) {
            elem.style.background = '#3E4751';
        }
        this.setState((state) => {
            return {
                textnum: props
            }

        });
    }

    renderspin(pros,prosa,hea,width,number)
    {

        if (pros=="") {
            return <tr></tr>
        }
        else {

            if (hea==0) {    return       <input
                style={{width:width}}
                name={number}
                value={pros}
                type="text"
                onClick={() => this.updateradio(number)}
            />}

            else { if (hea==1) {

                return       <input style={{fontWeight:'bold',width:width,fontSize:'17px',textAlign:'left', outline: 'none'}} onClick={() => this.renderorder(pros.split('"').at(1))}
                                    value={pros.split('"').at(1)}
                                    type="text" />}
            }}
    }

    postrendertree()
    {
    }

    renderorder(props)
    { if (this.state.curt=="") this.postrendertree()
    else {
        fetch('http://localhost:3001/tableorder/:'+this.state.curt+'.:'+this.state.curs+'.:'+props)
            .then(response =>  response.text())
            .then(data => {
                let regexp=(data.split(/\[(.+?)\]/));
                let regexpf=(regexp[1].split(/\{(.+?)\}/));
                let cou=0;
                let regarrows=[];
                let regarcol=[];
                for (let i = 0; i < regexpf.length; i++) {
                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                }
                let arrayheader=[];
                for (let i = 0; i < regarrows.length; i++) {
                    regarcol[i] = [];

                    let buffer=regarrows[i].split(",");
                    for (let j = 0; j < buffer.length; j++) {
                        regarcol[i].push(buffer[j].split(":").at(1));
                        arrayheader[j]=buffer[j].split(":").at(0);
                    }
                }
                let arraytable=[];
                let headers=arrayheader.slice();
                let dostup=1109-4*arrayheader[0].length;
                let x=((dostup-dostup%arrayheader.length)/arrayheader.length);
                for (let i = 0; i < regarcol.length; i++) {
                    arraytable[arraytable.length]=this.renderspin("");
                    arraytable[arraytable.length]=this.renderspin(regarcol[i][0],headers[0],2);
                    for (let j = 0; j < regarcol[0].length; j++)
                    {regarcol[i][j]=regarcol[i][j].replace(/^"|"$/g, '');
                        arraytable[arraytable.length]=this.renderspin(regarcol[i][j],arrayheader[j].length,0,85/arrayheader.length+"%",regarcol[i][0]);
                    }
                }
                for (let j = 0; j < arrayheader.length; j++)
                {
                    arrayheader[j]=this.renderspin(arrayheader[j],arrayheader[j].length,1,85/arrayheader.length+"%");
                }
                for (let j = 0; j < headers.length; j++)
                {
                    headers[j]=headers[j].split('"').at(1);
                }


                this.setState((state) => {

                    return {
                        textnum:'',
                        tableview:regarcol,
                        tablevie: <div><div class="trueheader">{arrayheader}</div><div class="truetable" id="truetable" >{arraytable}</div></div>,
                        footer: <div className='lower'>
                            <Example
                                render={()=>this.renderorder(this.state.curcol[0])}
                                curcol={this.state.curcol}
                                curs={this.state.curs}
                                curt={this.state.curt}
                                textnum={this.state.textnum}
                                truestatus="input"
                                text=<FormattedMessage id='input' />
                            status=<FormattedMessage id='inputtxt' />
                            />
                            <Example
                                render={()=>this.renderorder(this.state.curcol[0])}
                                curcol={this.state.curcol}
                                curs={this.state.curs}
                                curt={this.state.curt}
                                textnum=''
                                truestatus='update'
                                text=<FormattedMessage id='update' />
                            status=<FormattedMessage id='updatetxt' />
                            />
                            <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                <FormattedMessage id='deletestr' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} >
                                <CSVLink data={this.csvreport()}    filename={this.state.curt+".csv"}><FormattedMessage id='uploadcsv' /></CSVLink>
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>this.xslsreport()}><FormattedMessage id='uploadxsls' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>document.getElementById('fileload').click()}><FormattedMessage id='load' />
                            </button>
                        </div>
                    }

                });

                this.render();
            });
    }
    }

    textnumget()
    {
        return this.state.textnum
    }



    renderSquare()
    {

        return this.state.tablevie;
    }
    delete() {
        fetch('http://localhost:3001/delete/:'+this.state.curcol[0]+'.:'+this.state.textnum+'.:'+this.state.curt+'.:'+this.state.curs, {
            method: 'DELETE',
        })
            .then(
                this.renderorder(this.state.curcol[0])
            );
    }

    insert(textrow,curt,curs)
    {
        for (let i=0; i<textrow.length;i++) {
            textrow[i]="'"+textrow[i]+"'";
        }
        fetch('http://localhost:3001/insert/:'+textrow+'.:'+curt+'.:'+curs, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        this.renderorder(this.state.curcol[0]);
    }

    handleChange(event,curt,curs){
        var reader = new FileReader();
        reader.onload = (e) => {
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: 'binary'});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
            const dataParse = XLSX.utils.sheet_to_json(ws,{header:1});

            for (let i=1; i<dataParse.length;i++) {
                this.insert(dataParse[i],curt,curs)
            }
        };

        reader.readAsBinaryString(event.target.files[0]);


    }

    localeChange(evt) {
        const val = evt.target.value;
        this.setState((state) => {
            return {
                locale:  val
            }
        });
    }

    csvreport(){
        return this.state.tableview;
    }

    xslsreport(){
        var xsls="";
        if (this.state.tableview.length>0) {

            var jsonArr = [];
            var jsonArrt = [];

            for (var i = 0; i < this.state.curcol.length; i++) {
                jsonArr.push(this.state.curcol[i].replace(/"/g,''));
            }
            for (let i = 0; i < this.state.tableview.length; i++) {
                var myCar = new Object();
                for (var j = 0; j < this.state.tableview[0].length; j++) {

                    myCar[this.state.curcol[j].replace(/"/g,'')]=this.state.tableview[i][j].replace(/"/g,'');

                }
                jsonArrt.push(myCar);

            }
            let header = ["Name", "City"];
            const ws = XLSX.utils.book_new();
            XLSX.utils.sheet_add_aoa(ws, [jsonArr]);
            XLSX.utils.sheet_add_json(ws, jsonArrt, { origin: 'A2', skipHeader: true });
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: 'array', cellStyles:true });
            xsls = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});
            FileSaver.saveAs(xsls, this.state.curt+".xlsx");
        }
    }


    cropcombobox()
    {
        fetch('http://localhost:3001/FKselect/:crop.:crop_classification.:id_crop_cl')
            .then(response =>  response.text())
            .then(data => {
                let regexpFK=(data.split(/\[(.+?)\]/));
                let regexpfFK=(regexpFK[1].split(/\{(.+?)\}/));

                let regarrowsFK=[];
                let regarcolFK=[];
                let couFK=0;
                for (let i = 0; i < regexpfFK.length; i++) {
                    if (regexpfFK[i].length>1) {regarrowsFK[couFK]=regexpfFK[i];  couFK=couFK+1;}
                }

                for (let i = 0; i < regarrowsFK.length; i++) {
                    regarcolFK[i] = [];

                    let bufferFK=regarrowsFK[i].split(",");
                    for (let j = 0; j < bufferFK.length; j++) {
                        regarcolFK[i].push(bufferFK[j].split(":").at(1));
                    }
                }

                var select = document.getElementById("cropselect");
                select.innerHTML = "";
                for(var i = 0; i < regarcolFK.length; i++) {
                    var opt = regarcolFK[i];
                    select.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
                }
            });
    }

    seasoncombobox()
    {
        fetch('http://localhost:3001/FKseason/')
            .then(response =>  response.text())
            .then(data => {
                let regexpFK=(data.split(/\[(.+?)\]/));
                let regexpfFK=(regexpFK[1].split(/\{(.+?)\}/));

                let regarrowsFK=[];
                let regarcolFK=[];
                let couFK=0;
                for (let i = 0; i < regexpfFK.length; i++) {
                    if (regexpfFK[i].length>1) {regarrowsFK[couFK]=regexpfFK[i];  couFK=couFK+1;}
                }

                for (let i = 0; i < regarrowsFK.length; i++) {
                    regarcolFK[i] = [];

                    let bufferFK=regarrowsFK[i].split(",");
                    for (let j = 0; j < bufferFK.length; j++) {
                        regarcolFK[i].push(bufferFK[j].split(":").at(1));
                    }
                }

                var select = document.getElementById("seasonselect");
                select.innerHTML = "";
                for(var i = 0; i < regarcolFK.length; i++) {
                    var opt = regarcolFK[i];
                    select.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
                }
            });
    }

    areacombobox()
    {
        fetch('http://localhost:3001/FKarea/')
            .then(response =>  response.text())
            .then(data => {
                let regexpFK=(data.split(/\[(.+?)\]/));
                let regexpfFK=(regexpFK[1].split(/\{(.+?)\}/));

                let regarrowsFK=[];
                let regarcolFK=[];
                let couFK=0;
                for (let i = 0; i < regexpfFK.length; i++) {
                    if (regexpfFK[i].length>1) {regarrowsFK[couFK]=regexpfFK[i];  couFK=couFK+1;}
                }

                for (let i = 0; i < regarrowsFK.length; i++) {
                    regarcolFK[i] = [];

                    let bufferFK=regarrowsFK[i].split(",");
                    for (let j = 0; j < bufferFK.length; j++) {
                        regarcolFK[i].push(bufferFK[j].split(":").at(1));
                    }
                }

                var select = document.getElementById("areaselect");
                select.innerHTML = "";
                for(var i = 0; i < regarcolFK.length; i++) {
                    var opt = regarcolFK[i];
                    select.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
                }
            });
    }

    insertcrop(proj,idid)
    {
        var div = document.getElementById("cropselect");
        fetch('http://localhost:3001/insertcrop/:'+"'"+proj+"'"+'.:'+div.value.slice(0, -1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            this.subprojectview('"'+proj+'"',idid));
    }
    insertseason(proj,idid)
    {
        var div = document.getElementById("seasonselect");
        fetch('http://localhost:3001/insertseason/:'+"'"+proj+"'"+'.:'+div.value.slice(0, -1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            this.subprojectview('"'+proj+'"',idid));
    }

    insertarea(proj,idid)
    {
        var div = document.getElementById("areaselect");
        fetch('http://localhost:3001/insertarea/:'+"'"+proj+"'"+'.:'+div.value.slice(0, -1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            this.subprojectview('"'+proj+'"',idid));
    }
    delcrop(proj,idid)
    {
        alert(proj+this.state.checkcrop) ;
    }
    delseason(proj,idid)
    {
        alert(proj+this.state.checkseason) ;
    }
    delarea(proj,idid)
    {
        alert(proj) ;
    }




    render() {

        return (
            <div style={{verticalAlign: 'top'}}>

                <IntlProvider
                    messages={messages[this.state.locale]}
                    locale={this.state.locale}>

                    <div className='middle' style={{display:'inline-block'}}>
                        <div className="treemiddle" id="treemiddle "style={{display:'inline-block'}}><Tabs projects={<FormattedMessage id='projects'/>} nsi=<FormattedMessage id='nsi' /> project={()=>this.renderproject()} tree={()=>this.rendertree()}  /></div>
                        <div className="tablemiddle" style={{display:'inline-block'}}>

                            <h1>{this.state.curs}.{this.state.curt}</h1>
                            <div className='tablecels'>{this.renderSquare()}</div>
                            {this.state.footer}
                        </div>
                        <input type="file" accept=".xls,.xlsx" id="fileload" style={{display:'none'}}  onInput={(e)=>this.handleChange(e,this.state.curt,this.state.curs)} />
                    </div>
                </IntlProvider>
            </div>
        );
    }
}




class Game extends React.Component {

    render() {

        return (
            <div className="game">
                <Board />
            </div>

        );
    }
}

// ========================================

export default Game;