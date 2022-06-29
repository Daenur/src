import React, { useState,useEffect,Component,memo,useCallback,useContext,createContext }  from 'react';
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
import { createStore} from "redux";
import { connect,Provider} from "react-redux";
import { Map } from 'immutable';
import { Tab, Tabs as TabsComponent, TabList, TabPanel } from "react-tabs";
import FunctionalDataGrid, { Column, Group, Sort, filterRenderers, utils, ColumnGroup} from 'functional-data-grid'
import MultipleSelect from 'multiple-select-js'
let atdlvlcount='';
let localhost='45.89.26.151';
//let localhost='localhost';


document.addEventListener("click",function(e)
{		
if (e.target.getAttribute('id')=='react-tabs-8') {	
	   fetch('http://'+localhost+':3001/FKselect/:crop.:crop_classification.:id_crop_cl')
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
if (e.target.getAttribute('id')=='react-tabs-10') {	
	   fetch('http://'+localhost+':3001/FKseason/')
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
if (e.target.getAttribute('id')=='react-tabs-12') {	
      fetch('http://'+localhost+':3001/FKarea/')
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
	var selectorClick=e.target;
if (e.target.getAttribute('class')==null) (selectorClick=e.target.parentElement)
	if (selectorClick.getAttribute('class')=='functional-data-grid__cell-content css-17z9byi')
	{	
console.log(targetRowobject)
targetHover=selectorClick.parentElement.parentElement.parentElement.getAttribute('data-index');
if (targetRowobject!=0) targetRowobject.parentElement.parentElement.style.color = '#C5C5C5'; 
		selectorClick.parentElement.parentElement.style.color = 'red'; 
		
targetRowobject=e.target;		
	}
		
});

const SubTabs =props => {
    return (
        <TabsComponent>
            <TabList>
			
				<Tab key="11">{"Crop"}</Tab>
				<Tab key="12">{"Season"}</Tab>
			    <Tab key="13">{"ATD"}</Tab>
				<Tab key="10">{"Contract"}</Tab>
            </TabList>
			
			<TabPanel key="11">{props.crop}</TabPanel>
            <TabPanel key="12">{props.season}</TabPanel>
			<TabPanel key="13">{props.atd}</TabPanel>
			<TabPanel key="10">{props.contract}</TabPanel>
        </TabsComponent>);
}

var targetHover;
var targetRowobject=0;
var targetDevis_id;
var targetPath=''
var exampleData;
const SelectFilter = filterRenderers.SelectFilter
const UserContext=createContext();
let setstatebase=''
let probehooks='';
let croptablecolumns = new Object([]);
let croptableconstcolumns = [
 new Column({
    id : 'id_area',
    title: 'id_area',
    width: 120,
		      renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_area,
  }),
  new Column({
    id : 'country',
    title: 'country',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.country,
  }),
      new Column({
    id : 'devis',
    title: 'devis',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.devis,
  }),
    new Column({
    id : 'name_full',
    title: 'name_full',
    width: 120,
    valueGetter: e => e.name_full,
	      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
      sortable : true,
      resizable : true,
  }),
    new Column({
    id : 'name_shot',
    title: 'name_shot',
    width: 120,
	renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.name_shot,
  }),
  
    new Column({
    id : 'code_devision',
    title: 'code_devision',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.code_devision,
  }),
      new Column({
    id : 'date_start',
    title: 'date_start',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_start,
  }),
      new Column({
    id : 'date_end',
    title: 'date_end',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_end,
  }),
        new Column({
    id : 'date_end2',
    title: 'date_end3',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_end2,
  }),
        new Column({
    id : 'date_end3',
    title: 'date_end3',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_end3,
  }),
      new Column({
    id : 'shape',
    title: 'shape',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.shape,
  })]
let cropcolumns = [

  new Column({
    id : 'id_crop',
    title: 'Id_crop',
    width: 120,
		      renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_crop,
  }),
  new Column({
    id : 'name',
    title: 'Name',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.name,
  })
  ]
  
  let atdcolumns = [

  new Column({
    id : 'id_area',
    title: 'Id_area',
    width: 120,
		      renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_area,
  }),
  new Column({
    id : 'name',
    title: 'Name',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.name,
  })
  ]
  
  let seasoncolumns = [

  new Column({
    id : 'id_season',
    title: 'Id_season',
    width: 120,
		      renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_season,
  }),
  new Column({
    id : 'name',
    title: 'Name',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.name,
  })
  ]
let columns = [

  new Column({
    id : 'id_area',
    title: 'id_area',
    width: 120,
		      renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_area,
  }),
  new Column({
    id : 'country',
    title: 'country',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.country,
  }),
      new Column({
    id : 'devis',
    title: 'devis',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.devis,
  }),
    new Column({
    id : 'name_full',
    title: 'name_full',
    width: 120,
    valueGetter: e => e.name_full,
	      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
      sortable : true,
      resizable : true,
  }),
    new Column({
    id : 'name_shot',
    title: 'name_shot',
    width: 120,
	renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.name_shot,
  }),
  
    new Column({
    id : 'code_devision',
    title: 'code_devision',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.code_devision,
  }),
      new Column({
    id : 'date_start1',
    title: 'date_start1',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_start,
  }),
      new Column({
    id : 'date_end',
    title: 'date_end',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_start,
  }),
      new Column({
    id : 'shape',
    title: 'shape',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.shape,
  })
]
let columnsSub = [
  new Column({
    id : 'id_subproject',
    title: 'id_subproject',
    width: 120,
		      renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_subproject,
  }),
  new Column({
    id : 'id_project',
    title: 'id_project',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_project,
  }),
      new Column({
    id : 'name_subproject',
    title: 'name_subproject',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.name_subproject,
  }),
    new Column({
    id : 'date_start',
    title: 'date_start',
    width: 120,
    valueGetter: e => e.date_start,
	      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
      sortable : true,
      resizable : true,
  }),
    new Column({
    id : 'date_plan_finish',
    title: 'date_plan_finish',
    width: 120,
	renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_plan_finish,
  }),
  
    new Column({
    id : 'date_finish',
    title: 'date_finish',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_finish,
  }),
      new Column({
    id : 'status',
    title: 'status',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.status,
  }),
      new Column({
    id : 'id_area',
    title: 'id_area',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_area,
  }),
      new Column({
    id : 'crop',
    title: 'crop',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.crop,
  }),
      new Column({
    id : 'season',
    title: 'season',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.season,
  })
]

let columnspro = [
  new Column({
    id : 'id_project',
    title: 'id_project',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_project,
  }),
      new Column({
    id : 'id_contract',
    title: 'id_contract',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.id_contract,
  }),
    new Column({
    id : 'id_country',
    title: 'id_country',
    width: 120,
    valueGetter: e => e.id_country,
	      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
      sortable : true,
      resizable : true,
  }),
    new Column({
    id : 'name_project',
    title: 'name_project',
    width: 120,
	renderer : (v, e) => <a href={ e.url }  target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.name_project,
  }),
  
    new Column({
    id : 'date_start',
    title: 'date_start',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_start,
  }),
      new Column({
    id : 'date_plan_finish',
    title: 'date_plan_finish',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_plan_finish,
  }),
      new Column({
    id : 'date_finish',
    title: 'date_finish',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.date_finish,
  }),
      new Column({
    id : 'status',
    title: 'status',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.status,
  }),
      new Column({
    id : 'seasons',
    title: 'seasons',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.seasons,
  }),
  new Column({
    id : 'devisions',
    title: 'devisions',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.devisions,
  }),
  new Column({
    id : 'crops',
    title: 'crops',
    width: 120,
		      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
      filterable : true,
	  sortable : true,
    valueGetter: e => e.crops,
  })
]
let gridData=[]
let subatdData=[]
let subcropData=[]
let subseasonData=[]
var targetDevis;
var arrayDevis=[]
var arraycart = [];
var arraycarh = [];
var arraybool=0;
var currentDistrict='Select area...'
var currentDistrict_id;
var projectWindow=[];
const _ = require("lodash");
const Immutable = require('immutable');
const ADD = "add";
const CLEAR = "clear";
const TOGGLE = "toggle";
const DEL = "del";
const UPDATE = "update";
function act_toggle(path) {
return { type: TOGGLE, payload: path };
}
function act_clear(path) {
return { type: CLEAR, payload: path };
}
function act_del(path,id) {
return { type: DEL, payload:{path:Immutable.fromJS(path),id:id} };
}
function act_update(path,id,name) {
return { type: UPDATE, payload:{path:Immutable.fromJS(path),id:id,name:name} };
}
function act_add(text, path,id,devis) {
return { type: ADD, payload: { path: Immutable.fromJS(path), text: text,id:id,devis:devis }};
}
	var select=document.getElementById('setDataGrid')
var initialState = Immutable.fromJS({
text: "India",
childNodes: [],
expanded: false,
path: [],
id:"0",
devis:0,
});

var initialStatepro = Immutable.fromJS({
text: "Projects",
childNodes: [],
expanded: false,
path: [],
id:"0",
devis:0,
});

var initialStatecrop = Immutable.fromJS({
text: "MD",
childNodes: [],
expanded: false,
path: [],
id:"0",
devis:0,
});

function pathForUpdate(ipath) {
var path = ipath.toJS();
var keys = _.range(path.length).map(() => 'childNodes' );
return _.flatten(_.zip(keys, path));
}

function generateNode(data, idx) {
if ( ! _.isNumber(idx) ) { throw "Invalid Index: " + idx }

return Immutable.fromJS({
text: data.text,
id:data.id,
devis:data.devis,
childNodes: [],
expanded: false,
path: data.path.push(idx),
});
}


function reducer(state = Immutable.fromJS(initialState), action) {
var path;
switch(action.type) {
case ADD:
path = pathForUpdate(action.payload.path);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => list.push(generateNode(action.payload, list.size))) );
case TOGGLE:
path = pathForUpdate(action.payload);
return state.updateIn(path, (node) => node.update('expanded', (val) => ! val ));
case CLEAR:
path = pathForUpdate(action.payload);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => list.slice(0,0)) );
case UPDATE:
path = pathForUpdate(action.payload.path);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => reducerUpdate(list,action.payload.id,action.payload.name)) );
case DEL:
path = pathForUpdate(action.payload.path);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => reducerDelete(list,action.payload.id)) );
default:
return state;
}
}


function reducerpro(state = Immutable.fromJS(initialStatepro), action) {
var path;
switch(action.type) {
case ADD:
path = pathForUpdate(action.payload.path);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => list.push(generateNode(action.payload, list.size))) );
case TOGGLE:
path = pathForUpdate(action.payload);
return state.updateIn(path, (node) => node.update('expanded', (val) => ! val ));
case CLEAR:
path = pathForUpdate(action.payload);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => list.slice(0,0)) );
case UPDATE:
path = pathForUpdate(action.payload.path);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => reducerUpdate(list,action.payload.id,action.payload.name)) );
case DEL:
path = pathForUpdate(action.payload.path);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => reducerDelete(list,action.payload.id)) );
default:
return state;
}
}

function reducercrop(state = Immutable.fromJS(initialStatecrop), action) {
var path;
switch(action.type) {
case ADD:
path = pathForUpdate(action.payload.path);
return state.updateIn(path,
(node) => node.update('childNodes',
(list) => list.push(generateNode(action.payload, list.size))) );
case TOGGLE:
path = pathForUpdate(action.payload);
return state.updateIn(path, (node) => node.update('expanded', (val) => ! val ));

default:
return state;
}
}



function reducerDelete(list,id_d)
{
	
	return list.filter(list => list.get('id') != id_d);
}

function reducerUpdate(list,id_d,name)
{
	
	//var listAr=(JSON.parse((JSON.stringify(list))))
	console.log(list._tail.array[0]._root.entries[0][1]);
	//for (var i=0;i<listAr.length;i++)
	//{
	//	alert(listAr[i]['id']+'='+id_d)
	//	if ((listAr[i]['id'])==id_d) 
	//	{ list[i].text=name;}
	//}
	list._tail.array[0]._root.entries[0][1]='dsdsd';
	return list;
}

function ReduxAtdtable(id,childText,devis,path)
{
	
	targetDevis_id=id
	if (document.getElementById('tablevie')) document.getElementById('tablevie').innerHTML='';
	document.getElementById('func_grid').hidden=false;
targetHover=null;
		if (targetRowobject!=0) {targetRowobject.parentElement.parentElement.style.color = '#C5C5C5'; targetRowobject=0;}
currentDistrict_id=id
if (arrayDevis.length>devis) {targetDevis=(arrayDevis[devis].name_devis)
	targetDevis_id=devis;
targetPath=path;
currentDistrict=childText;
if (id!=0) {fetch("http://"+localhost+":3001/dist/:"+id.replace(/^"|"$/g, ''))
                            .then(response =>  response.text())
                            .then(data => {	
						gridData=JSON.parse(data);
						console.log(gridData);
				fetch("http://"+localhost+":3001/api/lvlcount/?id="+id+'&lvl='+(devis-1))
                            .then(response =>  response.text())
                            .then(data => {	
						let lvlcount=(JSON.parse(data));
									 atdlvlcount=arrayDevis[devis-1].name_devis+' contains : ';
								for (let i=1;i<Object.keys(lvlcount).length;i++)	atdlvlcount=atdlvlcount+Object.keys(lvlcount)[i]+' = '+Object.values(lvlcount)[i]+' ';
									select=document.getElementById('setDataGrid'); 
							select.click();	
                            });	
				 				
});							
}
else {
		                fetch('http://'+localhost+':3001/state/')
                    .then(response =>  response.text())
                    .then(data => {
						gridData=JSON.parse(data);
						console.log(gridData);
							
					
							fetch("http://"+localhost+":3001/api/indiacount/")
                            .then(response =>  response.text())
                            .then(data => {	
						let lvlcount=(JSON.parse(data));
									 atdlvlcount='India contains : ';
								for (let i=0;i<Object.keys(lvlcount).length;i++)	atdlvlcount=atdlvlcount+Object.keys(lvlcount)[i]+' = '+Object.values(lvlcount)[i]+' ';
									select=document.getElementById('setDataGrid'); 
							select.click();
                            });	
							});
}
} else alert('No lvl from type_devis')
return 0;
}

 function mainprojectviewRes()
    {
        fetch('http://'+localhost+':3001/projects/')
            .then(response =>  response.text())
            .then(data => {

                  let regexp= JSON.parse(data)
				  
				//let ExR=(Object.keys(regexp[0]))
				let exampleRow='id,devis,road,terr';
				let ExR=exampleRow.split(',');
				for (var i=0;i<ExR.length;i++)
				{
					var exampleCol=  new Column({
					id : ExR[i],
					title: ExR[i],
					width: 120,
							  renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
					  filterable : true,
					  sortable : true,
					valueGetter: e => e.ExR[i],
				  })
				 columns.push(exampleCol)
				 console.log(columns)
				 console.log(exampleCol)
				}
				 select=document.getElementById('setDataGrid'); 
							select.click(); 
            });


    }
 function mainprojectview(id){
	  if (id==0) {
		 targetDevis_id=id
document.getElementById('func_grid').hidden=true
 select=document.getElementById('setpr'); 
	 select.click()	
}
else
{
	targetDevis_id=id
document.getElementById('func_grid').hidden=true
 select=document.getElementById('setSubpr'); 
	 select.click()	;
}
                                     
 }
 function cropview(id){
		 targetDevis_id=id
document.getElementById('func_grid').hidden=true
 select=document.getElementById('setcrop'); 
	 select.click()	
                                     
 }
function RenderSubProTop()
{	return
	(
	<div  style={{height:"50%"}}>
                                    <table  style={{width:"30%",height:"100%",display: 'inline-block'}}>
                                        <table className="Projectbody" style={{width:"100%",height:"100%"}}>
                                           
                                        </table>
                                    </table>
	</div>
	)
}

function atdChild(path,id,devis)
{
	store.dispatch(act_clear(path));
	 fetch("http://"+localhost+":3001/atdchild/:"+id.replace(/^"|"$/g, ''))
                            .then(response =>  response.text())
                            .then(data => {
								var childArray=data.substr(1,data.length-2).split(",");
								 for (let i = 0; i < childArray.length; i=i+2) {
								 childArray[i]=childArray[i].split(":").at(1);
								  childArray[i+1]=childArray[i+1].split(":").at(1);
								  childArray[i+1]=childArray[i+1].slice(1,-2);
								 store.dispatch(act_add(childArray[i+1],path,childArray[i],devis));
								 }
                            })
	

return 0;	
}


class Node extends React.Component{
toggle(path,id,devis,text) {
if (id!=0)	{
	if (text=='+') { 
	console.log(store.getState())
 atdChild(path,id,devis+1);
 }}
this.props.toggle(path);
}
shouldComponentUpdate(nextProps, nextState) {
return ! Immutable.is(nextProps.item, this.props.item);
}
divStyle(item) {
var indent = item.get('path').size;
return {
marginLeft: (indent * 10) + "px"
};
}
renderChild(item) {
return <Node item={item} toggle={this.props.toggle} />
}
render() {
var item = this.props.item
//var disabled = item.get('childNodes').size == 0;
var collapsed = ! item.get('expanded');
var text = disabled ? "" : collapsed ? "+" : "-";
var disabled = false;
return <div style={this.divStyle(item)}>
<button disabled={disabled}
onClick={this.toggle.bind(this, item.get('path'),item.get('id'),item.get('devis'),text)}>{text}</button>
<span onClick={()=>ReduxAtdtable(item.get('id'),item.get('text'),item.get('devis'),item.get('path'))}>{item.get('text')}</span>
{item.get('expanded') ? item.get('childNodes').map(this.renderChild, this) : false }
</div>
}
}
class App extends React.Component{
constructor(props) {

super(props);
this.state = {item: props.store.getState()};
}

componentDidMount() {
this.props.store.subscribe(this.storeUpdated.bind(this));
}
storeUpdated() {
this.setState({item: this.props.store.getState()});
}
toggle(path) {
this.props.store.dispatch(act_toggle(path));
}
render() {

return <div className='treeatd'>
<Node item={this.state.item} toggle={this.toggle.bind(this)} />
</div>
}
}

class NodePro extends React.Component{
toggle(path,id,devis,text) {
this.props.toggle(path);
}
shouldComponentUpdate(nextProps, nextState) {
return ! Immutable.is(nextProps.item, this.props.item);
}
divStyle(item) {
var indent = item.get('path').size;
return {
marginLeft: (indent * 10) + "px"
};
}
renderChild(item) {
return <NodePro item={item} toggle={this.props.toggle} />
}
render() {
var item = this.props.item
var disabled = item.get('childNodes').size == 0;
var collapsed = ! item.get('expanded');
var text = disabled ? "" : collapsed ? "+" : "-";
var disabled = false;
return <div style={this.divStyle(item)}>
<button disabled={disabled}
onClick={this.toggle.bind(this, item.get('path'),item.get('id'),item.get('devis'),text)}>{text}</button>
<span onClick={()=>mainprojectview(item.get('id'))}>{item.get('text')}</span>
{item.get('expanded') ? item.get('childNodes').map(this.renderChild, this) : false }
</div>
}
}
class AppPro extends React.Component{
constructor(props) {

super(props);
this.state = {item: props.store.getState()};
}

componentDidMount() {
this.props.store.subscribe(this.storeUpdated.bind(this));
}
storeUpdated() {
this.setState({item: this.props.store.getState()});
}
toggle(path) {
this.props.store.dispatch(act_toggle(path));
}
render() {

return <div className='treepro'>
<NodePro item={this.state.item} toggle={this.toggle.bind(this)} />
</div>
}
}

class NodeCrop extends React.Component{
toggle(path,id,devis,text) {
this.props.toggle(path);
}
shouldComponentUpdate(nextProps, nextState) {
return ! Immutable.is(nextProps.item, this.props.item);
}
divStyle(item) {
var indent = item.get('path').size;
return {
marginLeft: (indent * 10) + "px"
};
}
renderChild(item) {
return <NodeCrop item={item} toggle={this.props.toggle} />
}
render() {
var item = this.props.item
var disabled = item.get('childNodes').size == 0;
var collapsed = ! item.get('expanded');
var text = disabled ? "" : collapsed ? "+" : "-";
var disabled = false;
return <div style={this.divStyle(item)}>
<button disabled={disabled}
onClick={this.toggle.bind(this, item.get('path'),item.get('id'),item.get('devis'),text)}>{text}</button>
<span onClick={()=>cropview(item.get('text'))}>{item.get('text').split('##').at(0)}</span>
{item.get('expanded') ? item.get('childNodes').map(this.renderChild, this) : false }
</div>
}
}
class AppCrop extends React.Component{
constructor(props) {

super(props);
this.state = {item: props.store.getState()};
}

componentDidMount() {
this.props.store.subscribe(this.storeUpdated.bind(this));
}
storeUpdated() {
this.setState({item: this.props.store.getState()});
}
toggle(path) {
this.props.store.dispatch(act_toggle(path));
}
render() {

return <div className='treepro'>
<NodeCrop item={this.state.item} toggle={this.toggle.bind(this)} />
</div>
}
}


var cropstore=createStore(reducercrop);
var projectstore=createStore(reducerpro);
var store = createStore(reducer);
//--------------------------------------------------------------------------------------------------
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
            <Modal style={{top:'20px',left:'200px',position:'fixed'}}
			id_p={props.id_p}
				row={gridData[targetHover]}
			id_dtype={props.id_dtype}
                subcrop={props.subcrop}
                subseason={props.subseason}
                subarea={props.subarea}
                render={props.render}
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
            curt: 'Select area...',
            curs: '',
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
			columnsBoard:columns
        }
        ;


	
        let arraytable=[''];
        fetch('http://'+localhost+':3001/')
            .then(response =>  response.text())
            .then(data => {
                arraytable=data.split(",");
                for (let i = 0; i < arraytable.length; i++) {
                    let prefinish = arraytable[i].split(":").at(1);
                    arraytable[i] = (prefinish.split('"').at(1));
                   if ((arraytable[i] == "about_nsi") || (arraytable[i] == "area_map") || (arraytable[i] == "atd") || (arraytable[i] == "log") || (arraytable[i] == "projects") || (arraytable[i] == "public") || (arraytable[i] == "tiger") || (arraytable[i] == "tiger_data") || (arraytable[i] == "topology")) arraytable[i]=null;

                }
                let arraytablef2 = arraytable.filter(function (el) {
                    return el != null;
                });
                arraytable=arraytablef2;
                let arraytablef=arraytable.slice();
                let arraytablepref;
				
                for (let i = 0; i < arraytable.length; i++) {

                    fetch('http://'+localhost+':3001/schema/:' + arraytable[i])
                        .then(response => response.text())
                        .then(data => {
                            arraytablef[i] = '';
                            arraytablef[i] = data.split(",");
                        });
				
                }
                fetch('http://'+localhost+':3001/country/')
                    .then(response =>  response.text())
                    .then(data => {
                        let regexp=(data.split(/\[(.+?)\]/));
                        let regexpf=(regexp[1].split(/\{(.+?)\}/));

                        let regarrows=[];
                        let cou=0;
                        for (let i = 0; i < regexpf.length; i++) {
                            if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1; }
                        }
						
                        setstatebase=regarrows;
                    }).then(
                    fetch('http://'+localhost+':3001/table/:dist.:atd')
                        .then(response =>  response.text())
                        .then(data => {
                            let regexp=(data.split(/\[(.+?)\]/));
                            let regexpf=(regexp[1].split(/\{(.+?)\}/));

                            let regarrows=[];
                            let cou=0;
                            for (let i = 0; i < regexpf.length; i++) {
                                if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1; }
                            }
                           // this.setstatedistbase(regarrows);
                        }).then(
                        fetch('http://'+localhost+':3001/table/:project.:projects')
                            .then(response =>  response.text())
                            .then(data => {
                                let regexp=(data.split(/\[(.+?)\]/));
                                let regexpf=(regexp[1].split(/\{(.+?)\}/));

                                let regarrows=[];
                                let cou=0;
                               
                             //   this.setprojinfo(regarrows);
                            })
                    ).then(
                        fetch('http://'+localhost+':3001/table/:subproject.:projects')
                            .then(response =>  response.text())
                            .then(data => {
                                let regexp=(data.split(/\[(.+?)\]/));
                                let regexpf=(regexp[1].split(/\{(.+?)\}/));

                                let regarrows=[];
                                let cou=0;
                                for (let i = 0; i < regexpf.length; i++) {
                                    if (regexpf[i].length>1) {regarrows[cou]=regexpf[i];  cou=cou+1;}
                                }
                               // this.setsubprojinfo(regarrows);
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


    renderproject() {
        fetch('http://'+localhost+':3001/table/:project.:projects')
                            .then(response =>  response.text())
                            .then(data => {
                                let regexp= JSON.parse(data)
                                for (let i = 0; i < regexp.length; i++) {
                                  projectstore.dispatch(act_add(regexp[i]['name_project'], [],regexp[i]['id_project'],1));
								 //fetch('http://'+localhost+':3001/subproject/:'+regexp[i]['id_project'])
                            //.then(response =>  response.text())
                            //.then(data => {
                              //   let regexp2= JSON.parse(data)
                                //console.log(regexp2)
                               //for (let j = 0; j < regexp2.length; j++) {
                                 //{ projectstore.dispatch(act_add(regexp2[j]['name_subproject'], [i],regexp[j]['id_subproject'],1));}
                               // }
                            //})
								 
                                }
                            
                            })
    }



    rendertree() {
		        fetch('http://'+localhost+':3001/')
                            .then(response =>  response.text())
                            .then(data => {
                                let regexp= JSON.parse(data)
								let cou=0;
                                for (let i = 0; i < regexp.length; i++) {
                           {
if ((regexp[i]['nspname'] != "about_nsi") && (regexp[i]['nspname'] != "area_map") && (regexp[i]['nspname'] != "atd") && (regexp[i]['nspname'] != "log") && (regexp[i]['nspname'] != "projects") && (regexp[i]['nspname'] != "public") && (regexp[i]['nspname'] != "tiger") && (regexp[i]['nspname'] != "tiger_data") && (regexp[i]['nspname'] != "topology") && (regexp[i]['nspname'] != "pg_toast") && (regexp[i]['nspname'] != "pg_temp_1") && (regexp[i]['nspname'] != "pg_toast_temp_1") && (regexp[i]['nspname'] != "pg_catalog") && (regexp[i]['nspname']!="information_schema") )
{cropstore.dispatch(act_add(regexp[i]['nspname'], [],i,1));
fetch('http://'+localhost+':3001/schema/:' + regexp[i]['nspname'])
.then(response => response.text())
.then(data => {
let regexp2= JSON.parse(data)

if (regexp[i]['nspname']=='crop') cou=0;
if (regexp[i]['nspname']=='mobile_app') cou=1;
if (regexp[i]['nspname']=='other') cou=2;
if (regexp[i]['nspname']=='soil') cou=3;
if (regexp[i]['nspname']=='rse') cou=4;


for (let j = 0; j < regexp2.length; j++) {
{


cropstore.dispatch(act_add((regexp2[j])['table_name']+'##'+regexp[i]['nspname'], [cou],i,1));}
}
cou=5;
});

}
						   }
                                }
                            
                            });
	        

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

   
	
renderAtd()
{
	
	fetch('http://'+localhost+':3001/table/:type_devision.:atd')
            .then(response =>  response.text())
            .then(data => {
				arrayDevis=JSON.parse(data)
			}
			);
						
	                fetch('http://'+localhost+':3001/country/')
                    .then(response =>  response.text())
                    .then(data => {
                        let regexp=(data.split(/\[(.+?)\]/));
                        let regexpf=(regexp[1].split(/\{(.+?)\}/));

                        let regarrows=[];
                        let cou=0;
                        for (let i = 0; i < regexpf.length; i++) {
                            if (regexpf[i].length>1) {//regarrows[cou]=regexpf[i];  cou=cou+1; 
							   let truedist = (regexpf[i].split(","));
							   var id_atd=truedist[0].split(":");
							   var name_atd=truedist[1].split(':');
					
                 store.dispatch(act_add(name_atd[1].replace(/^"|"$/g, ''), [],id_atd[1],1));
							}
						}
					});
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
        fetch('http://'+localhost+':3001/country/')
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
        fetch('http://'+localhost+':3001/dist/:26')
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
		
        fetch('http://'+localhost+':3001/projects/')
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
gridData=JSON.parse(data);
                for (let j = 0; j < arrayheader.length; j++)
                {

                    arrayheader[j]=this.renderprojspin(arrayheader[j],arrayheader[j].length,1,85/arrayheader.length+"%");
                }

	exampleData={
								 id_project: targetDevis_id,
								 id_contract: null,
						id_country: null,
						name_project: null,
						date_start:null,
						date_plan_finish:null,
						date_finish:null,
						status:null,
						seasons:null,
						devisions:null,
						crops:null,}
                this.setState((state) => {
                    return {
                        tableview:regarcol,
                        curcol: headers,
                        curs:'Projects',
                        curt:"",
                        tablevie: <div style={{top: '0%', position: 'absolute',height:'500px',width:'100%'}} >
									<FunctionalDataGrid onClick={()=>alert(';l;l')} columns={columnspro} data={JSON.parse(data)} enableColumnsShowAndHide={true}/>
                                    </div>,
                        footer:              <div className='lower'>
								     <Example
                                        render={()=>this.projectview()}
                                        curcol={exampleData}
									   curs=''
                                        curt="Project"
                                        textnum={()=>this.textnumget()}
                                        truestatus="input"
                                        text=<FormattedMessage id='inputp' />
                                    status=<FormattedMessage id='inputtxt' />
                                    />
                                    <Example
                                        render={()=>this.projectview()}
                                        curcol={exampleData}
									   curs=''
                                        curt="Project"
                                        textnum={()=>this.textnumget()}
                                        truestatus="input"
                                        text=<FormattedMessage id='updatep' />
                                    status=<FormattedMessage id='updatetxt' />
                                    />
                            <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                <FormattedMessage id='deletestr' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} >
                                <CSVLink style={{color:'#2B3138'}}  data={this.csvreport()}    filename={"Projects.csv"}><FormattedMessage id='uploadcsv' /></CSVLink>
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
	
//getcolumns=()=>croptablecolumns
rendercroptable()
{
	 alert(croptablecolumns)
	return 		<FunctionalDataGrid  onClick={()=>alert(';l;l')} columns={this.getcolumns()} data={gridData} enableColumnsShowAndHide={true}/>
                                    
}
    cropview(idproj)
	{ 
		if (idproj.includes('##')) {
		if (this.tablevie!=null) document.getElementById('funcgrid').innerHTML=null;
		let propsa=idproj.split('##')[1];
		let props=idproj.split('##')[0];
		currentDistrict=props;
		 
		 
        fetch('http://'+localhost+':3001/table/:'+props+'.:'+propsa)
            .then(response =>  response.text())
            .then(data => {
				
			
				
                let regexp=(JSON.parse(data));
				let header=Object.keys(regexp[0]);
				if (croptablecolumns.length>0) {
					croptablecolumns=croptableconstcolumns.slice(0,10);
					for (let i=0;i<header.length;i++) {
				Object.defineProperty(croptablecolumns[i],'title',{value:header[i]});
				Object.defineProperty(croptablecolumns[i],'valueGetter',{value:eval('e=>e.'+header[i])});
				//croptablecolumns[i]['hidden']=true;
					}
					
				}
				
				 else 
				 {
				for (let i=0;i<11;i++) {
			if (header[i]==undefined) 
			{
		let myObj=new Column({
						id : 'test',
						title: 'test',
						width: 120,
								  renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
						  filterable : true,
						  sortable : true,
						  valueGetter: e => e['test'],
						  hidden:false
			});
					 croptableconstcolumns[i]=Object.assign({},myObj);
			   croptablecolumns[i]=Object.assign({},myObj);
			Object.defineProperty(croptablecolumns[i],'valueGetter',{value:eval('e=>e.'+'test')})
		
		} else {
				let myObj=new Column({
						id : header[i],
						title: header[i],
						width: 120,
								  renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
						  filterable : true,
						  sortable : true,
						  valueGetter: e => e[header[i]],
						  hidden:false
			});
					 croptableconstcolumns[i]=Object.assign({},myObj);
			   croptablecolumns[i]=Object.assign({},myObj);
			Object.defineProperty(croptablecolumns[i],'valueGetter',{value:eval('e=>e.'+header[i])})
			}
				
				}
				}
				gridData=regexp.slice();
				currentDistrict=idproj;
				currentDistrict_id=idproj;
				console.log(croptablecolumns);
				croptablecolumns=croptablecolumns.slice(0,header.length);
				console.log(croptablecolumns);
                this.setState((state) => {
                    return {
						tablevie:<div id='funcgrid' style={{top: '0%', position: 'absolute',height:'100%',width:'100%'}} >
<FunctionalDataGrid onClick={()=>alert(';l;l')} columns={croptablecolumns} data={regexp} enableColumnsShowAndHide={true}/>
</div>,
						curs:propsa+'.',
						curt:props,
									footer:              <div className='lower'>
						 <Example
                                render={()=>this.cropview(idproj)}
                                curcol={header}
                                curs={this.state.curs}
                                curt={currentDistrict}
                                
								id_dtype={targetDevis_id+1}
								id_p={currentDistrict_id}
                                truestatus="input"
                                text=<FormattedMessage id='input' />
                            status=<FormattedMessage id='inputtxt' />
                            />
                            <Example
                                render={()=>this.cropview(idproj)}
                                curcol={header}
                                curs={this.state.curs}
                                curt={currentDistrict}
                                
								id_p={currentDistrict_id}
                                truestatus='update'
								id_dtype={targetDevis_id+1}
                                text=<FormattedMessage id='update' />
                            status=<FormattedMessage id='updatetxt' />
                            />
                            <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                <FormattedMessage id='deletestr' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} >
                                <CSVLink style={{color:'#2B3138'}}  data={this.csvreport()}    filename={currentDistrict+".csv"}><FormattedMessage id='uploadcsv' /></CSVLink>
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>this.xslsreport(1)}><FormattedMessage id='uploadxsls' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>document.getElementById('fileload').click()}><FormattedMessage id='load' />
                            </button>
							</div>
					
                    };

                });
            });

		this.render();
		}
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
	
    {
		this.curt='id';
		var arrayheader=[];
        var arraytable=[];
        fetch('http://'+localhost+':3001/project/:'+idproj)
            .then(response =>  response.text())
            .then(data => {
                let regexp=(data.split(/\[(.+?)\]/));
				console.log(regexp)
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
 headers[0]=headers[0].slice(1);
          
				
                arraycart=arraytable.slice();
                arraycarh=arrayheader;
                this.state.arraytable=arraytable.slice();
                this.state.arrayheader=arrayheader.slice();
				
            }).then(
            fetch('http://'+localhost+':3001/subproject/:'+idid)
                .then(response => response.text())
                .then(data => {
					let reggrid=(JSON.parse(data));
					//let header=Object.keys(regexp[0]);
					
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
					
            



                    if (arraybool>0) {


                        this.setState((state) => {
							
							gridData=reggrid;
                            let croparray=(this.state.arraytable[8].replace(/"/g, '')).split(",");
                            let divarray=(this.state.arraytable[9].replace(/"/g, '')).split(",");
                            let seasarray=(this.state.arraytable[10].replace(/"/g, '')).split(",");
							subcropData=[];
							subatdData=[];
							subseasonData=[];
                            for (let j = 0; j < croparray.length; j++) {
								subcropData.push({id_crop:croparray[j].split("&&")[1],name:croparray[j].split("&&")[0]})
                                croparray[j] = <td ><input style={{width: '30%'}}  value={croparray[j].split("&&")[1]} /><input style={{width: '64%'}}  value={croparray[j].split("&&")[0]} /> </td>
								
                            }
                            for (let j = 0; j < divarray.length; j++) {
								subatdData.push({id_area:divarray[j].split("&&")[1],name:divarray[j].split("&&")[0]})
                                divarray[j] = <td ><input style={{width: '30%'}}  value={divarray[j].split("&&")[1]}  /><input style={{width: '64%'}}  value={divarray[j].split("&&")[0]} /> </td>
                            }
                            for (let j = 0; j < seasarray.length; j++) {
                                let buff=seasarray[j];
								subseasonData.push({id_season:seasarray[j].split("&&")[1],name:seasarray[j].split("&&")[0]})
                                seasarray[j] = <td ><input style={{width: '30%'}} onClick={()=>this.setcheckseason(buff.split("&&")[1])}  value={seasarray[j].split("&&")[1]}  /><input style={{width: '64%'}}  onClick={()=>this.setcheckseason(buff.split("&&")[1])} value={seasarray[j].split("&&")[0]} /> </td>
                            }
                            arraycart = [];
                            arraybool=0;
							exampleData={id_subproject: null,
								 id_project: targetDevis_id,
								 name_subproject: null,
						date_start: null,
						date_plan_finish: null,
						status:null,
						id_area:null,
						crop:null,
						season:null}
						console.log(JSON.parse(data));
                                       return {
                                curt: this.state.arraytable[3],
                                curs: 'Project ',
                                tablevie: 
								<div style={{height:"100%",display: "flex"}}>
								<div style={{width:"80%",height:"100%",resize:"horizontal",overflow: "auto"}}>
								<FunctionalDataGrid onClick={()=>alert(';l;l')} columns={columnsSub} data={gridData} enableColumnsShowAndHide={true}/>
								</div>
								<div style={{overflow: "auto",border:"1px solid #505A66",height:"120%",width:'30%',left:'75%'}}>
								<SubTabs 
								crop={<div style={{height:"550px",width:"100%"}}><FunctionalDataGrid onClick={()=>alert(';l;l')} columns={cropcolumns} data={subcropData}/><td className="subbutton"><select   id="cropselect" style={{width: '40%'}} ></select><button style={{background: '#5B9138'}} onClick={()=>this.insertcrop(idproj,idid)}>+</button><button style={{background: '#ff0000'}} onClick={()=>this.delcrop(idproj)}>-</button></td></div>}
								contract={<div style={{height:"100%"}}>
								<div id='tablevie' style={{height:"100%"}}>
<table style={{width:"100%",height:"100%"}}>
<table className="Projectbody" style={{width:"100%",height:"100%"}}>
<td ><FormattedMessage id='directorh' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}} type='text' value='Ivanov' /> </td>
<td ><FormattedMessage id='contract' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}} type='text' value={this.state.arraytable[1]} /> </td>
<td><FormattedMessage id='dates' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}} value={(this.state.arraytable[4].replace(/"/g, '')).split("T21")[0]} /> </td>
<td><FormattedMessage id='datefp' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}} value={(this.state.arraytable[5].replace(/"/g, '')).split("T21")[0]} /> </td>
<td><FormattedMessage id='dateff' >{placeholder => <input type='text' value={placeholder} />}</FormattedMessage><input style={{width: '38%'}} value={(this.state.arraytable[6].replace(/"/g, '')).split("T21")[0]} /> </td>
<td><button style={{display: 'inline-block',width: '100%',height: '40px'}} ><FormattedMessage id='projedit' /></button></td>
</table>
</table></div></div>}
								atd={<div style={{height:"550px"}}><FunctionalDataGrid onClick={()=>alert(';l;l')} columns={atdcolumns} data={subatdData}/><td className="subbutton"><select id="areaselect" style={{width: '40%'}} ></select><button style={{background: '#5B9138'}} onClick={()=>this.insertarea(idproj,idid)}>+</button><button style={{background: '#ff0000'}} onClick={()=>this.delarea(idproj)}>-</button></td></div>}
								season={<div style={{height:"550px"}}><FunctionalDataGrid onClick={()=>alert(';l;l')} columns={seasoncolumns} data={subseasonData}/><td className="subbutton"><select  id="seasonselect" style={{width: '40%'}} ></select><button style={{background: '#5B9138'}} onClick={()=>this.insertseason(idproj,idid)}>+</button><button style={{background: '#ff0000'}} onClick={()=>this.delseason(idproj)}>-</button></td></div>}
								/>
						
								</div>
								</div>,
								footer:              <div className='lower'>
								     <Example
                                        render={()=>this.subprojectview(idproj,idid)}
                                        subcrop={(this.state.arraytable[8].replace(/"/g, '')).split(",")}
                                        subarea={(this.state.arraytable[9].replace(/"/g, '')).split(",")}
                                        subseason={(this.state.arraytable[10].replace(/"/g, '')).split(",")}
                                        curcol={exampleData}
									   curs={this.state.arraytable[3]}
                                        curt="subproject"
                                        textnum={()=>this.textnumget()}
                                        truestatus="input"
                                        text=<FormattedMessage id='inputsubp' />
                                    status=<FormattedMessage id='inputtxt' />
                                    />
                                    <Example
                                        render={()=>this.subprojectview(idproj,idid)}
                                        subcrop={(this.state.arraytable[8].replace(/"/g, '')).split(",")}
                                        subarea={(this.state.arraytable[9].replace(/"/g, '')).split(",")}
										subseason={(this.state.arraytable[10].replace(/"/g, '')).split(",")}
                                        subdiv={(this.state.arraytable[8].replace(/"/g, '')).split(",")}
                                        curcol={exampleData}
									   curs={this.state.arraytable[3]}
                                        curt="subproject"
                                        textnum={()=>this.textnumget()}
                                        truestatus="update"
                                        text=<FormattedMessage id='updatesubp' />
                                    status=<FormattedMessage id='updatetxt' />
                                    />
                            <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                <FormattedMessage id='deletestr' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} >
                                <CSVLink style={{color:'#2B3138'}}  data={this.csvreport()}    filename={'subs'+this.state.arraytable[3]+".csv"}><FormattedMessage id='uploadcsv' /></CSVLink>
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>this.xslsreport()}><FormattedMessage id='uploadxsls' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>document.getElementById('fileload').click()}><FormattedMessage id='load' />
                            </button>
							</div>

                               
                            }


                        });

                    }else { arraybool+=1; this.subprojectview(idproj,idid);
				this.render();}
                })


        );
    }

generateSubproject(id,crop,atd,sea,dates,datee,datef,idproj,idid)
{let crops='';
let atds='';
let seas='';
	for (let i=0;i<crop.length;i++) crops=crops+crop[i].id_crop+'&';
	for (let i=0;i<atd.length;i++) atds=atds+atd[i].id_area+'&';
	for (let i=0;i<sea.length;i++) seas=seas+sea[i].id_season+'&';
			fetch('http://'+localhost+':3001/generatesub/:'+id+".:'"+dates.substr(1, 10)+"'.:'"+datee.substr(1, 10)+ "'.:'"+datef.substr(1, 10)+"'.:"+crops+'.:'+atds+'.:'+seas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(this.subprojectview(idproj,idid))
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
        fetch('http://'+localhost+':3001/table/:'+props+'.:'+propsa)
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
        fetch('http://'+localhost+':3001/tableorder/:'+this.state.curt+'.:'+this.state.curs+'.:'+props)
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
    { console.log(this.state.tablevie);
        return this.state.tablevie;
    }
    delete() {
		
		
	
	
	if (targetHover!=null) {
		if (currentDistrict.includes('##')) {
			let curt=currentDistrict.split('##').at(0); 
			let curs=currentDistrict.split('##').at(1); 
		
	 var targetDelete=(gridData[targetHover]);
	// targetDelete=targetDelete[0];
	 var delcol=(Object.keys(targetDelete)[0]);
	 targetDelete=(gridData[targetHover][delcol]);
	       fetch('http://'+localhost+':3001/delete/:'+delcol+'.:'+targetDelete+'.:'+curt+'.:'+curs, {
            method: 'DELETE',
        })
            .then(function(response) {
		targetHover=null;
		 targetRowobject=0;
		 console.log(curt);
            	cropview(targetDevis_id)
				
			});
		}
		else {
		var delcol='id_area'
		console.log(gridData[targetHover])
		console.log(currentDistrict)
	 var targetDelete=(gridData[targetHover]);
	 targetDelete=targetDelete[columns[0].title];
	       fetch('http://'+localhost+':3001/delete/:'+delcol+'.:'+targetDelete+'.:link_up_down.:atd', {
            method: 'DELETE',
        })
            .then(
			function(response) {
				if (response.status == 200) {
					fetch('http://'+localhost+':3001/delete/:'+delcol+'.:'+targetDelete+'.:info_area_devision.:atd', {
            method: 'DELETE',
        })
		targetHover=null;
		 targetRowobject=0;
			store.dispatch(act_del(targetPath,targetDelete))
            	ReduxAtdtable(currentDistrict_id,currentDistrict,targetDevis_id,targetPath)
				}
			});
	}
	}
	
		else (alert('No target row'))
	
	
    }
	
	

    insert(textrow,curt,curs)
    {
        for (let i=0; i<textrow.length;i++) {
            textrow[i]="'"+textrow[i]+"'";
        }
        fetch('http://'+localhost+':3001/insert/:'+textrow+'.:'+curt+'.:'+curs, {
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
                this.info_area_insert(dataParse[i],targetDevis_id+1,currentDistrict_id);
				
            }
			
        };
        reader.readAsBinaryString(event.target.files[0]);
	
return select.click();
    }


 info_area_insert(textrow,id_dtype,id_p)
{ 
 var idArray=textrow
 
       for (let i=0; i<idArray.length;i++) {
		   
                if (idArray[i]==undefined) idArray[i]='null'
				else idArray[i]="'"+idArray[i]+"'"
            }
			if (currentDistrict_id.includes('##')) {
				  fetch('http://'+localhost+':3001/insert/:'+idArray+'.:'+currentDistrict_id.split('##')[0]+'.:'+currentDistrict_id.split('##')[1], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
    function(response) {
        if (response.status == 200) {
			gridData.push((idArray));
			cropview(currentDistrict_id);
			}
			else {console.log(response)}
			
			});
			}
			else {
			
	    fetch('http://'+localhost+':3001/insert/:'+idArray+'.:info_area_devision.:atd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
    function(response) {
        if (response.status == 200) {
			
			if (id_dtype>1) {var type_link=id_dtype-1;
			fetch('http://'+localhost+':3001/insertcus/:'+idArray[0]+','+id_p+','+type_link+'.:id_area,id_parent_area,id_type_link.:link_up_down.:atd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
		})
			
			
			}
			
			
			let newrow=new Object();
			
			
			newrow['id_area']=textrow[0].replace(/'/g,'');
			newrow['country']='India';
			newrow['devis']=arrayDevis[currentDistrict_id-1]['name_devis'];
			newrow['name_full']=textrow[3].replace(/'/g,'');
			newrow['name_shot']=textrow[4].replace(/'/g,'');
			newrow['code_devision']=textrow[5].replace(/'/g,'');
			newrow['date_start']=textrow[6].replace(/'/g,'');
			newrow['date_end']=textrow[7].replace(/'/g,'');
			newrow['shape']='Not Input';
				gridData=gridData.concat(newrow);
			store.dispatch(act_add(idArray[3].slice(1,-1), targetPath,idArray[0].slice(1,-1),targetDevis_id+1));
				select=document.getElementById('setDataGrid'); 
			select.click();	
			
			}
			else {console.log(response)}
			
			});
}}

    localeChange(evt) {
        const val = evt.target.value;
        this.setState((state) => {
            return {
                locale:  val
            }
        });
    }

    csvreport(){
					  var exportData=[];
					  exportData=gridData.slice();
			  for (var i=0;i<exportData.length;i++)
			  {
				  //exportData[i].country=108;
				  //exportData[i].devis=targetDevis_id+1;
				  //exportData[i].shape=1;
			  }
        return exportData;
    }

    xslsreport(mode){
        var xsls="";
		   var jsonArr = Object.keys(gridData[0]);
		

            const ws = XLSX.utils.book_new();
          //  XLSX.utils.sheet_add_aoa(ws, [jsonArr]);
          //  XLSX.utils.sheet_add_json(ws, jsonArrt, { origin: 'A2', skipHeader: true });
		      XLSX.utils.sheet_add_aoa(ws, [jsonArr]);
			  var exportData=gridData.slice();
			 if (mode!=1) {for (var i=0;i<exportData.length;i++)
			  {
				  exportData[i].country=108;
				  exportData[i].devis=targetDevis_id+1;
				  exportData[i].shape=1;
				 //  exportData[i][idCountrycol]=108
				  //  exportData[i][idDeviscol]=targetDevis_id
			 }}
            XLSX.utils.sheet_add_json(ws, exportData, { origin: 'A2', skipHeader: true });
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: 'array', cellStyles:true });
            xsls = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});
            FileSaver.saveAs(xsls, this.state.curt+".xlsx");
       // }
    }


    cropcombobox()
    {
        fetch('http://'+localhost+':3001/FKselect/:crop.:crop_classification.:id_crop_cl')
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

                var selectcrop='';
                for(var i = 0; i < regarcolFK.length; i++) {
                    var opt = regarcolFK[i];
                    selectcrop += "<option value=\"" + opt + "\">" + opt + "</option>";
                }
			//	cropselect
			var div = document.getElementById('cropselect');
			div.innerHTML=selectcrop;
				//return selectcrop;
            });
    }

    seasoncombobox()
    {
        fetch('http://'+localhost+':3001/FKseason/')
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

                var seasonbox='';
                for(var i = 0; i < regarcolFK.length; i++) {
                    var opt = regarcolFK[i];
                    seasonbox += "<option value=\"" + opt + "\">" + opt + "</option>";
                }
				var div3 = document.getElementById("seasonselect");
                div3.innerHTML = seasonbox;
            });
    }

    areacombobox()
    {
        fetch('http://'+localhost+':3001/FKarea/')
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

                var div2 = document.getElementById("areaselect");
                div2.innerHTML = "";
                for(var i = 0; i < regarcolFK.length; i++) {
                    var opt = regarcolFK[i];
                    div2.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
                }
            });
    }

    insertcrop(proj,idid)
    {
        var div = document.getElementById("cropselect");
        fetch('http://'+localhost+':3001/insertcrop/:'+"'"+proj+"'"+'.:'+div.value.slice(0, -1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
           this.subprojectview(proj,proj)).then( this.subprojectview(proj,proj));
    }
    insertseason(proj,idid)
    {
        var div = document.getElementById("seasonselect");
        fetch('http://'+localhost+':3001/insertseason/:'+"'"+proj+"'"+'.:'+div.value.slice(0, -1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            this.subprojectview(proj,proj)).then( this.subprojectview(proj,proj));
    }

    insertarea(proj,idid)
    {
        var div = document.getElementById("areaselect");
        fetch('http://'+localhost+':3001/insertarea/:'+"'"+proj+"'"+'.:'+div.value.slice(0, -1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
             this.subprojectview(proj,proj)).then( this.subprojectview(proj,proj));
    }
    delcrop(proj)
    {
		
		 fetch('http://'+localhost+':3001/deletecrop/:'+"'"+proj+"'"+'.:'+(document.getElementById('cropselect').value).slice(0, -1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            this.subprojectview(proj,proj)).then( this.subprojectview(proj,proj));
    }
    delseason(proj)
    {
        alert(proj+this.state.checkseason) ;
    }
    delarea(proj)
    {
        alert(proj+this.state.checkarea) ;
    }

updateTree(name,id,obj)
{
	gridData=gridData.concat(obj);
	select=document.getElementById('setDataGrid'); 
	select.click();	
	store.dispatch(act_add(name, targetPath,id.slice(1,-1),targetDevis_id+1));
	

}
updateTreerename(name,id)
{
	
	ReduxAtdtable(currentDistrict_id,currentDistrict,targetDevis_id,targetPath)
	store.dispatch(act_update(targetPath,id,name));
}

rendersubpr(targetDevis_id)
{
	this.subprojectview(targetDevis_id,targetDevis_id);
	this.cropcombobox();
}

	setDataGrid()
	{
		 exampleData={id_area: null,
		 country: "India",
		 devis: targetDevis,
		 name_full: null,
name_shot: null,
code_devision: null,
date_start:null,
date_end:null,



		 shape: 1}
this.setState((state) => {
                    return {
						curs:'',
						tablevie:'',
						curt:currentDistrict,
					footer:              <div className='lower'>
						 <Example
                                render={(name,id,obj)=>this.updateTree(name,id,obj)}
                                curcol={exampleData}
                                curs={this.state.curs}
                                curt={currentDistrict}
                                
								id_dtype={targetDevis_id+1}
								id_p={currentDistrict_id}
                                truestatus="input"
                                text=<FormattedMessage id='input' />
                            status=<FormattedMessage id='inputtxt' />
                            />
                            <Example
                                render={(name,id)=>this.updateTreerename(name,id)}
                                curcol={exampleData}
                                curs={this.state.curs}
                                curt={currentDistrict}
                                
								id_p={currentDistrict_id}
                                truestatus='update'
								id_dtype={targetDevis_id+1}
                                text=<FormattedMessage id='update' />
                            status=<FormattedMessage id='updatetxt' />
                            />
                            <button style={{display: 'inline-block',width: '10%',height: '50px'}} onClick={() => this.delete()}>
                                <FormattedMessage id='deletestr' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} >
                                <CSVLink style={{color:'#2B3138'}}  data={this.csvreport()}    filename={currentDistrict+".csv"}><FormattedMessage id='uploadcsv' /></CSVLink>
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>this.xslsreport()}><FormattedMessage id='uploadxsls' />
                            </button>
                            <button style={{display: 'inline-block',width: '10%'}} onClick={()=>document.getElementById('fileload').click()}><FormattedMessage id='load' />
                            </button>
							</div>
}})
	}

    render() {
	
        return (
            <div style={{verticalAlign: 'top'}}>
				
                <IntlProvider
                    messages={messages[this.state.locale]}
                    locale={this.state.locale}>
                    <div className='middle' style={{display:'inline-block'}}>
					 
                        <div className="treemiddle" id="treemiddle "style={{display:'inline-block'}}><Tabs projects={<FormattedMessage id='projects'/>} nsi=<FormattedMessage id='nsi' />  atdtree={ <App store={store} />}  project={<AppPro store={projectstore}/>} tree={<AppCrop store={cropstore}/>}/>
						</div>
                        <div className="tablemiddle" id="base" style={{display:'inline-block'}}>
						<span id='setDataGrid' onClick={()=>this.setDataGrid()}></span>
						<span id='setSubpr' onClick={()=>this.rendersubpr(targetDevis_id,targetDevis_id)}></span>
						<span id='setpr' onClick={()=>this.projectview(targetDevis_id,1)}></span>
						<span id='setcrop' onClick={()=>this.cropview(targetDevis_id)}></span>
						<h1>{this.state.curs}{this.state.curt}</h1>
							<div id='func_grid' style={{height: '100%'}}>
								 <FunctionalDataGrid onClick={()=>alert(';l;l')} columns={columns} data={gridData} enableColumnsShowAndHide={true}/> 
								 <div className='lvlcount'>{atdlvlcount}</div>
							</div>	 
                            <div id='tablecels' className='tablecels' >{this.renderSquare()}</div>
                            {this.state.footer}
                        </div>
                        <input type="file" accept=".xls,.xlsx" id="fileload" style={{display:'none'}}  onInput={(e)=>this.handleChange(e,this.state.curt,this.state.curs)} />
                    </div>
                </IntlProvider>
            </div>
        );
    }
}

let myBoard=new Board()
myBoard.renderAtd();
myBoard.rendertree();
myBoard.renderproject();

const  MyGrid =() => {
    const [email, setEmail] = useContext(UserContext)
    const [password, setPassword] = useState('')
    const [emailDirty,setEmailDirty]=useState(false)
    const [passwordDirty,setPasswordDirty]=useState(false)
    const [emailError,setEmailError]=useState('Empty field')
    const [passwordError,setPasswordError]=useState('Empty field')
    const [formValid,setFormValid]=useState(false)

    useEffect (() => {
        if (emailError || passwordError)
        {
            setFormValid(false)
        } else setFormValid(true)
    },[emailError,passwordError])
	    const emailHandler=(e)=> {
        setEmail(e.target.value)
    }
	
	return (
        <div className='login'  >
                <FunctionalDataGrid columns={columns} />
          {email}
        </div>
    );
}

class Game extends React.Component {

    render() {

        return (
	<UserContext.Provider id={"Provider"} value={'dfdfdgttrryh'}>	
            <div className="game">
			<Board/>
            </div>
</UserContext.Provider>	
        );
    }
}

// ========================================

export default Game;