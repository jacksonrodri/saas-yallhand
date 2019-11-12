import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import { Button, Label } from "semantic-ui-react";
import { Paper, Card, CardHeader, CardContent,CardActionArea, CardMedia, CardActions, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import department_icon from "../Assets/Icons/department_icon.svg";
import location_icon from "../Assets/Icons/location_icon.svg";
import mobile_icon from "../Assets/Icons/mobile_icon.svg";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import {Label as RSLabel} from "reactstrap";
import { Container, Col, Row, Input, InputGroup,FormGroup } from "reactstrap";

import { AccountStore } from "../Stores/AccountStore";

import { TicketingStore } from "../Stores/TicketingStore";
import {getDisplayTags} from "../SharedCalculations/GetDisplayTags";
import {getDisplayTeams} from "../SharedCalculations/GetDisplayTeams";
import { TeamStore } from "../Stores/TeamStore";

import TimeAgo from 'react-timeago'
import {giveMeKey} from "../SharedCalculations/GiveMeKey";



class QnADetailsFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contactExpanded: false, stage: "", addlFieldsSource: [], contentPreview: "", vari: "" };
  }

//   async componentDidMount(){
//     const data = this.props.data.activity[0].data; 
//     const contentPreview = await Object.keys(data).includes("policyID")? PoliciesStore._getPolicy(data.policyID) : AnnouncementsStore._getAnnouncement(data.announcementID);
//     this.setState({contentPreview});

//   }

async componentDidMount() {
    const vari = await this.props.data._contentPreview.variations.filter(vari => vari.variationID === this.props.data.activity[0].data.variationID)[0];
    await this.setState({vari})


}

toggleContactInfo() {
  this.setState({ contactExpanded: !this.state.contactExpanded });
}

// async addlFields() {
//   const {stage} = this.state;
//   const {_parent} = this.props.data;
//    if (!stage) return [];
//     else if (stage.includes("close")) return await _parent.ticketItems.filter(i => i.isClose);
//     else if (stage === "open") return await _parent.ticketItems.filter(i=>i.isOpen);
//     else return await _parent.ticketItems.filter(i=>i.label && i.label === stage)
// }

  async changeStage(stage) {
    await this.setState({stage});
    // const checkFields = await this.addlFields();
    // if (checkFields[0].data.length) this.setState({addlFieldsSource: checkFields[0].data})
  }

  stagesOptions = () => {

    let baseStages = [
      {text: "Re-open", value:"reopen"},
      {text: "Open", value: "open"},
      {text: "Close (Attach question & response to public content)", value: "close"},
      {text: "Close (Send a reponse to requester privately)", value: "close-cant"},
      {text: "Close (No decline to respond)", value: "reject"}
    ]

    return [ ...baseStages]
  }

//     getFormItemField(formItem) {
//       if(formItem.type === "text") return (
//       <InputGroup>
//           <Input placeholder="" type="text" name={formItem.label} id="description" onChange={() => console.log("fix")} />
//       </InputGroup> )

//       else if(formItem.type === "select") return (
//           <Input type="select" name={formItem.label} id="props_for" onChange={() => console.log("fix")}>
//               {formItem.options.map(opt => <option>{opt}</option>)}
//           </Input>
//       )

//       else if(formItem.type === "multi") return (
//           <FormGroup>
//           {formItem.options.map(opt =>  
          
//           <FormControlLabel
//               control={<Checkbox 
//               id={formItem.label}
//               name={opt}
//               onChange={() => console.log("fix")}
//               />}
//           label={opt}
//           />

//           )}
//         </FormGroup>
//       )
      
//   }

  

  render() {
    const {_requester, _userImg, _userInitials, _parent, activity, _contentPreview} = this.props.data;
    const {vari} = this.state;
    return (
      <React.Fragment>
        {/* {JSON.stringify(this.state)} */}
        <Paper>
                <div className="section_title">
                  <div>
                    <h4 style={{ color: "#404040" }}>{_contentPreview.label}</h4>
                    <p style={{ color: "#abacab", fontSize: ".8em" }}>{"Content Q & A"}</p>
                  </div>
                </div>
                <div style={{ padding: 15 }}>
                  <Container>
                    <Row>

                    <Col>
                        <h5>Source</h5>
                        <Row>
                            <Col sm={3}>
                             <div
                                className="ContentPreviewImg"
                                style={{ backgroundImage: `url(${_contentPreview.img})` }}
                            />
          
          </Col>
  <Col><p style={{fontSize: "0.8em", padding: 0, margin: "0 0 0 10px"}}>{_contentPreview.policyID? "FAQ":"Announcement"}</p><p style={{lineHeight: "1.25em", margin: "3px 0 0 10px"}}>{_contentPreview.label}</p></Col>
                        </Row>
                        <Row>
                             <Col sm={3}> <Button primary style={{marginTop: 5,padding:4, fontSize: ".8em"}} size='mini'>Preview</Button></Col>
                            <Col style={{marginTop: 5, color: "rgba(0, 0, 0, 0.54)"}}><p style={{fontSize: "0.8em", padding: 0, margin: "0 0 0 10px"}}>
                            {vari && getDisplayTeams(vari.teamID, TeamStore.structure)}{" "}
                            {vari && (!vari.tags.length ? "" : getDisplayTags(vari.tags, TeamStore.tags))}
                            </p></Col>
                           
                        </Row>
            
                      </Col>


                      <Col>
                        <h5>Requester</h5>

                        <Card style={{ boxShadow: "none" }}>
                          <CardHeader
                            action={
                              <IconButton
                                onClick={this.toggleContactInfo.bind(this)}
                                aria-label="show more"
                              >
                                {" "}
                                <ExpandMoreIcon />{" "}
                              </IconButton>
                            }
                            avatar= { _userImg ? <Avatar src={_userImg}></Avatar> : <Avatar>{_userInitials}</Avatar>}
                            title={_requester.displayName}
                            // subheader={
                            //   <>
                            //     {_requester.profile.title}
                            //     {_parent.config.updateOpener && <> 
                            //       <br />
                            //     <span style={{ fontSize: "0.7em" }}>
                            //       Requester is subscribed to updates
                            //     </span>
                            //     </>
                                
                            //   }
                            //   </>
                            // }
                          />

                          <Collapse
                            in={this.state.contactExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <CardContent>
                              <List component="div">
                              {_requester.email &&
                                <ListItem>
                                  <ListItemIcon>
                                    <MailOutlineRoundedIcon
                                      style={{ color: "#4780F7" }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.email} />
                                </ListItem>}

                                {_requester.Department &&
                                <ListItem>
                                  <ListItemIcon>
                                    <img src={department_icon} alt="" />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.profile.Department} />
                                </ListItem>
                                }

                                {_requester.Location &&
                                <ListItem>
                                  <ListItemIcon>
                                    <img src={location_icon} alt="" />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.profile.Location} />
                                </ListItem>}

                                {_requester.Mobile &&
                                <ListItem>
                                  <ListItemIcon>
                                    <img src={mobile_icon} alt="" />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.profile.Mobile} />
                                </ListItem>}

                              </List>
                            </CardContent>
                          </Collapse>
                        </Card>
                      </Col>
                      <Col>
                        <h5>Activity</h5>
                        <Card style={{ boxShadow: "none" }}>
                          <CardContent style={{ padding: 0 }}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              {activity.reverse().map(act => 
                              <Row style={{ padding: "3px 0 3px" }}>
                              <Col xs={8}>Set as{" "}
                                <strong>{act.stage}</strong> by{" "}
                                <strong>{AccountStore._getUser(act.userID).displayName}</strong>{" "}
                              </Col>
                              <Col> <strong><TimeAgo date={act.updated} /></strong></Col>
                            </Row>
                              )}
                            
                            
                            </Typography>
                          </CardContent>
                        </Card>
                      </Col>
                      <Col>
                        <h5>Data</h5>

                        <Card style={{ boxShadow: "none" }}>
                          <CardContent style={{ padding: 0 }}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                               {activity.filter((act, i) => i && Object.keys(act.data).length).map(act => 

                               {
                                const res = Object.keys(act.data).map(datapnt => 
                                <Row style={{ padding: "3px 0 3px" }}>
                                <Col xs={9}>
                                  <strong>{datapnt} </strong> 
                                  {act.data[datapnt]}{" "}
                                  <Label size="mini" >{AccountStore._getUser(act.userID).displayName}</Label>
                                </Col>
                                <Col>3d ago</Col>
                              </Row>
                                  );
                                return res;
                               }
                          
                               
                             
                                )}
                              
                            </Typography>
                          </CardContent>
                        </Card>
                      </Col>
                      
                    </Row>
             
              
                    <Row style={{ padding: "20px 0 5px" }}>
                      <Col>
                            <h5>{`Q: ${activity[0].data.q}`}</h5>
                      </Col>
                    </Row>
               
                    <Row style={{ padding: "5px 0 5px" }}>
                      <Col>
                        <h5>Respond/Update</h5>
                      </Col>
                    </Row>
                    <Row style={{ padding: "5px 0 5px" }}>
                      <Col md={5}>
                        <InputGroup>
                          <Input
                            placeholder="Change stage..."
                            type="select"
                            name="select"
                            id="exampleSelect"
                            onChange={(e) => this.changeStage(e.target.value)}
                          >
                            <option value="" disabled selected>
                              Change stage...
                            </option>
                            {this.stagesOptions().map(opt => 
                              <option value={opt.value}>{opt.text}</option>
                            )}
                          </Input>
                        </InputGroup>
                      </Col>
                      { !this.state.stage.includes('close') &&
                        <Col xs={3}>
                        <InputGroup>
                        <Input
                            type="select"
                            name="select"
                            id="exampleSelect"
                        >
                            <option value="" disabled selected>
                            Assign to...
                            </option>
                            {
                            AccountStore. _getAdminSelectOptions().map(user => <option key={giveMeKey() + user.text} value={user.value}>{user.text}</option>)
                            }
                        </Input>
                        </InputGroup>
                        </Col>
                      }
                     
                    </Row>

                   <Row>
                   {/* {this.state.addlFieldsSource.map(formItem => 
                        <Col md={6}>
                             <FormGroup>
                                        <RSLabel for="description">{formItem.label}</RSLabel>
                                        {this.getFormItemField(formItem)}
                                    </FormGroup>
                        </Col>

                    )
                    
                    } */}
                   </Row>

                    <Row style={{ padding: "8px 0 8px" }}>
                      <Col>
                        <InputGroup>
                          {
                              this.state.stage.includes('close')?
                              <Input 
                              type="textarea"
                              placeholder="Response"
                              name="response"
                              />
                          :
                          <>
                          <Input
                            placeholder="Memo (optional)"
                            type="text"
                            name={"description"}
                            id="description"
                          />
                          <FormGroup style={{marginTop: 7, marginLeft: 5}} check>
                          <RSLabel check>
                            <Input type="checkbox" id="checkbox2" />{' '}
                            Admin Only
                          </RSLabel>
                        </FormGroup>
                        </>
                          }
                        </InputGroup>
                      </Col>
                    </Row>
                    <Row style={{ padding: "8px 0 8px" }}>
                      <Col>
                        <Button primary>Update</Button>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Paper>
      </React.Fragment>
    );
  }
}

export default withRouter(QnADetailsFrame);