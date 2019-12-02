import React from 'react';
import {inject, observer} from "mobx-react"
import Layout from '../../layouts/DefaultLayout';

import { Row, Col, } from 'reactstrap';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from "../components/TabPanel";
import Hierarchy from "../components/Hierarchy";
import StaffDetail from '../components/StaffDetail';
import DirectoryData from '../../data/directory.json';

@inject("AccountStore")
@observer
class Directory extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0, height: 0,
         StaffDetailsData: [],
         tabValue: 0
      }
   }

   handleChangeTab(e, newVal) {
      this.setState({ tabValue: newVal });
   }
   componentDidMount() {
      this.setState({
         StaffDetailsData: DirectoryData,
      });

      document.body.classList.add('page_content_bg');
      document.body.classList.remove('page_content_white');
   }

   socials = (user) => {
      let socials = {}
      if(user.profile.Twitter !== "" && user.profile.Twitter !== undefined) { socials = { ...socials, "github": `https://twitter.com/${user.profile.Twitter}` } }
      if(user.profile.Medium !== "" && user.profile.Medium !== undefined) { socials = { ...socials, "medium": `https://medium.com/@${user.profile.Medium}` } }
      if(user.profile.Github !== "" && user.profile.Github !== undefined) { socials = { ...socials, "twitter": `https://github.com/${user.profile.Twitter}` } }
      if(user.profile.LinkedIn !== "" && user.profile.LinkedIn !== undefined) { socials = { ...socials, "linkedin": `https://linkedin.com/${user.profile.LinkedIn}` } }
      return socials
   }

   render() {
      const { StaffDetailsData } = this.state;
      const { AccountStore } = this.props;

      const allUsers = AccountStore._allActiveUsers || [];
      console.log("=========================================", allUsers);
      let users = allUsers.map((user, i) => {
         return (
            <Col className="all-staff-box" lg={4} md={6} sm={6} key={i}>
               <StaffDetail
                  profile={user.img}
                  name={user.displayName}
                  designation={user.profile.Title}
                  department={user.profile.Department}
                  location={user.profile.Location}
                  contact={user.phone}
                  email={user.email}
                  socials={this.socials(user)} />
            </Col>
         )
      })
      return (
         <Layout pageTitle="Directory">
            <div className="container">
               <div className="page_container">
                  <div className="staffDetailTab custom-tabs">
                     <AppBar position="static">
                        <Tabs indicatorColor="primary"
                           textColor="primary" value={this.state.tabValue} onChange={this.handleChangeTab.bind(this)} aria-label="simple tabs example">
                           <Tab label="All Staff" id='simple-tab-0' aria-controls='simple-tabpanel-0' />
                           <Tab label="Explore Hierarchy" id='simple-tab-1' aria-controls='simple-tabpanel-1' />
                        </Tabs>
                     </AppBar>
                     <TabPanel value={this.state.tabValue} index={0}>
                        <Row>
                           {users}
                        </Row>
                     </TabPanel>
                     <TabPanel value={this.state.tabValue} index={1}>
                        <Hierarchy />
                     </TabPanel>
                  </div>
               </div>
            </div>
         </Layout>
      );
   }
}

export default Directory;
