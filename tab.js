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
				<Tab key="3">{"ATD"}</Tab>
            </TabList>
			<TabPanel key="3">{props.atdtree}</TabPanel>
        </TabsComponent>);
}

export default Tabs;
