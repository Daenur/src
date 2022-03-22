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
                <Tab key="1">{props.nsi}</Tab>
                <Tab key="2">{props.projects}</Tab>
            </TabList>
            <TabPanel key="1">{props.tree()}</TabPanel>
            <TabPanel key="2">{props.project()}</TabPanel>
        </TabsComponent>);
}

export default Tabs;
