import React from "react";
import { Dropdown, Icon } from "semantic-ui-react";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";
import "../style.css";

export class PublishControls extends React.Component {
  clickActions = {
    "draft":"draft",
    "published": "published",
    "update": "published",
    "unpublish": "draft",
    "archived": "archived",
    "restore": "draft"
  }
  handleItemClick = (e, { name }) => this.props.onClick(this.clickActions[name]);
  render() {
    const { stage } = this.props;
    const actionOptions = {
      draft: ["draft", "published", "archived"],
      published: ["update", "unpublish", "archived"],
      archived: ["restore"]
    };
 
    const iconKey = {
      draft: "keyboard",
      published: "rocket",
      update: "angle double up",
      unpublish: "remove circle",
      archived: "archive",
      restore: "hand spock"
    };

    const displayText = {
      draft: "Draft",
      published: "Publish",
      update: "Update",
      unpublish: "Un-publish",
      archived: "Archive",
      restore: "Restore"
    };


    return (
      <>
        <div style={{ position: "absolute", transform: "translateX(5px)" }}>{`Now: ${this.props.unsavedWarning? "Unsaved ":""}`}<b>{stage.toUpperCase()}</b></div>
        <Dropdown 
        button style={{backgroundColor: "#2185D0", color: "#FFFFFF", marginTop: "25px"}} text="Save Stage As...">
        <Dropdown.Menu>
        {actionOptions[stage].map(opt =>
          <Dropdown.Item key={"pubctrl" + giveMeKey()} text={displayText[opt]} icon={iconKey[opt]} name={opt} onClick={this.handleItemClick}  />
        )}
        </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
}
