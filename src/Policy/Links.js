import React from "react";
import "./style.css";
import { Form, Icon, Table, Button, Label } from "semantic-ui-react";
import { resourceLinks } from "./TempObjects";


export class ResourceLinks extends React.Component {
  render() {
    const displayLinks = resourceLinks.map(link => (
      <Table.Row>
        <Table.Cell>
          <a href={link.url} target="_blank">
            {link.url}
          </a>
        </Table.Cell>
        <Table.Cell>{link.label}</Table.Cell>
        <Table.Cell textAlign="center">
          <Icon name="minus circle" />
        </Table.Cell>
      </Table.Row>
    ));
    return (
      <div className="ResourceLinks">
        <div style={{float: 'left'}}>Add URLs</div>
        <div style={{float: 'right'}}>
        <Button icon labelPosition="left" circular size="small">
                  <Icon name="cubes" color='blue'/>Resources</Button>
        </div>
    

        <Table basic="very" stackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Form.Input
                  fluid
                  label="URL"
                  placeholder="https://www.example.com/resourcelink/"
                  size="small"
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Form.Input
                  fluid
                  label="Label"
                  placeholder="Overview of Relevant Info"
                  size="small"
                />
              </Table.HeaderCell>
              <Table.HeaderCell textAlign='center'> 
                <Form.Button
                  primary
                  icon="plus"
                  style={{ marginTop: 20 }}
                  size="small"
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body style={{ fontWeight: 200 }}>{displayLinks}</Table.Body>
        </Table>
    
       </div>
    );
  }
}
