import React from "react";
import { PlusButton } from "../Assets/Graphics/PlusButton";
import { Modal, Button, Input, Message } from "semantic-ui-react";
import {inject, observer} from 'mobx-react'
import "./style.css";
import {FormCharMax} from '../SharedValidations/FormCharMax'


@inject('SideBarStore')
@observer
export class ChannelHeader extends React.Component {
  render() {
    const {SideBarStore} = this.props
    const newChannelStatus = FormCharMax(SideBarStore.newTitle, 24)
    return (
      <div className="ChannelHeader">
        <div style={{ float: "left" }}>
          <h4>Channels</h4>
        </div>
        <div
          className="ChannelAdd"
          style={{ float: "right", marginRight: 50 }}
          onClick={(e) => SideBarStore.openMod(e)}
        >
          <PlusButton />
        </div>

        <Modal open={SideBarStore.addChannelMod} onClose={(e) => SideBarStore.closeMod(e)} closeIcon size="mini">
          <Modal.Header>Add Channel</Modal.Header>
          <Modal.Content>
            <h4>Channel Name</h4>
            <Input list="suggested" fluid onChange={(e, val) => SideBarStore.addTitle(val.value)}>
            <input maxLength="24"/>
            </Input>
            <datalist id="suggested">
              <option value="HR" />
              <option value="Payroll" />
              <option value="Benefits" />
            </datalist>
          <Message error attached hidden={newChannelStatus.messageHide}>{newChannelStatus.message}</Message>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              icon="checkmark"
              labelPosition="right"
              content="Submit"
              onClick={(e) => SideBarStore.addChannel(e)} />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
