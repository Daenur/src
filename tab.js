import React from "react";
import { Tab, Tabs as TabsComponent, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
const treeStyles = {
    color: 'white',
    fill: 'white',
}
const Tabs =props => {
    return (
        <TabsComponent>
            <TabList>
			<Tab key="1">{"ATD"}</Tab>
			 
            <Tab key="2">{"Project"}</Tab>
			    <Tab key="3">{"MD"}</Tab>
				
            </TabList>
			<TabPanel key="1">{props.atdtree}</TabPanel>
			     
            <TabPanel key="2">{props.project}</TabPanel>
			<TabPanel key="3">{props.tree}</TabPanel>
			
        </TabsComponent>);
}



export default Tabs;