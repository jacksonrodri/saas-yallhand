import React, { Component } from "react";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import { Button, Icon, Popup, 
  // Transition 
} from "semantic-ui-react";
import {
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator
} from "draft-js";
import "draft-js-emoji-plugin/lib/plugin.css";
import "draft-js/dist/Draft.css";
import "draft-js-linkify-plugin/lib/plugin.css";
import "draft-js-emoji-plugin/lib/plugin.css";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import "draft-js-counter-plugin/lib/plugin.css";
import createCounterPlugin from "draft-js-counter-plugin";
import { inject, observer } from "mobx-react";
import { UploadURL } from "./UploadURL.js";
import { DataEntryStore } from "../Stores/DataEntryStore";
import { UIStore } from "../Stores/UIStore";
import "../../node_modules/draft-js-linkify-plugin/lib/plugin.css";
import "../../node_modules/draft-js-emoji-plugin/lib/plugin.css";
import "./style.css";


import {stateToHTML} from 'draft-js-export-html';

const counterPlugin = createCounterPlugin();
const { WordCounter } = counterPlugin;


const emojiPlugin = createEmojiPlugin({
  selectButtonContent: "☺",
  useNativeArt: true
});
const linkifyPlugin = createLinkifyPlugin({
  target: "_blank"
});
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [emojiPlugin, linkifyPlugin, counterPlugin];

@inject("DataEntryStore", "UIStore")
@observer
export class DraftFormField extends Component {
  constructor(props) {
    super(props);
    const { DataEntryStore } = this.props;
    const decorator = new CompositeDecorator([
      {
        strategy: this.findLinkEntities,
        component: this.Link
      }
    ]);
    if (this.props.loadContent === null) {
      DataEntryStore.setDraft(
        "editorState",
        EditorState.createEmpty(decorator)
      );
 
    } else {
      const contentState = convertFromRaw(this.props.loadContent);
      DataEntryStore.setDraft(
        "editorState",
        EditorState.createWithContent(contentState)
      );
     
    }
    this.onChange = editorState => DataEntryStore.setDraft("editorState", editorState);
  }

  confirmLink = this._confirmLink.bind(this);
  onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
  removeLink = this._removeLink.bind(this);

  _confirmLink(e) {
    // e.preventDefault();
    const { editorState } = DataEntryStore.draft;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      {
        url:
          DataEntryStore.urlForUpload.prefix + DataEntryStore.urlForUpload.url,
        _resourceID: DataEntryStore.urlForUpload.resourceID,
        _url: DataEntryStore.urlForUpload.url,
        _prefix: DataEntryStore.urlForUpload.prefix,
        _label: DataEntryStore.urlForUpload.label
      }
    );
   
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity, decorator: currentDecorator});
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    DataEntryStore.setDraft(
      "editorState",
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    this.passContent();
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }
  _removeLink(e) {
    e.preventDefault();
    const { editorState } = DataEntryStore.draft;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      DataEntryStore.setDraft(
        "editorState",
        RichUtils.toggleLink(editorState, selection, null)
      );
    }
  }
  getSelectedText = () => {
    // Get block for current selection
    let selection = DataEntryStore.draft.editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const contentState = DataEntryStore.draft.editorState.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(anchorKey);

    //Then based on the docs for SelectionState -
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    const selectedText = currentBlock.getText().slice(start, end);
    return selectedText;
  };

  isLinkSelected = () => {
    // This block is the verbose DraftJS bullshit required to find out if a link has been selected
    let selection = DataEntryStore.draft.editorState.getSelection();
    const contentState = DataEntryStore.draft.editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(selection.getStartOffset());
    return linkKey !== null
    // const linkInstance = contentState.getEntity(linkKey);
    // const {url} = linkInstance.getData();
    
   
  }

  editorStateChanged = (newEditorState: EditorState) => {
    DataEntryStore.setDraft("editorState", newEditorState);
    this.passContent();
  };

  handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(
      DataEntryStore.draft.editorState,
      command
    );
    if (newState) {
      this.editorStateChanged(newState);
      return "handled";
    }
    return "not-handled";
  };

  passContent = () => {
    //pass RAW to store
    const contentState = DataEntryStore.draft.editorState.getCurrentContent();
    DataEntryStore.toggleDraftContentRAW(convertToRaw(contentState));
    //pass HTML to store
    // const logHTML = PoliciesStore._currentObjVariation.content
    // const storedState =  convertFromRaw(logHTML);
    const htmlOutput = stateToHTML(contentState)
    DataEntryStore.toggleDraftContentHTML(htmlOutput);
  };

  _onBoldClick() {
    this.onChange(
      RichUtils.toggleInlineStyle(DataEntryStore.draft.editorState, "BOLD")
    );
  }
  _onUlineClick() {
    this.onChange(
      RichUtils.toggleInlineStyle(DataEntryStore.draft.editorState, "UNDERLINE")
    );
  }
  _onItalicClick() {
    this.onChange(
      RichUtils.toggleInlineStyle(DataEntryStore.draft.editorState, "ITALIC")
    );
  }
  _onUlClick() {
    this.onChange(
      RichUtils.toggleBlockType(
        DataEntryStore.draft.editorState,
        "unordered-list-item"
      )
    );
  }
  _onOlClick() {
    this.onChange(
      RichUtils.toggleBlockType(
        DataEntryStore.draft.editorState,
        "ordered-list-item"
      )
    );
  }

  Link = props => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    return (
      <Popup
        style={{
          borderRadius: 15,
          padding: ".5em",
          fontWeight: 800,

        }}
        trigger={
          <a href={url}>
            {props.children}
          </a>
        }
        hoverable
      >
        <a href={url}
        target="_blank"
        >Go There!</a>
      </Popup>
    );
  };

  findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      );
    }, callback);
  }



  render() {
    // console.log(Popover.defaultProps.isOpen);
    // const togglePopover = () => Popover.openUp;
    const urlButtonDisabled = this.getSelectedText() === "";
    const linkSelected = this.isLinkSelected()

    const openURLModal = e => {
      e.preventDefault();
      UIStore.set("modal", "uploadURL", !UIStore.modal.uploadURL);
      DataEntryStore.set("urlForUpload", "label", this.getSelectedText());
    };
    const addURL = this.props.includeURL ? (
      <React.Fragment>
        {" "}
        <Button
          disabled={urlButtonDisabled || linkSelected}
          className="linkbuttons"
          onClick={e => {
            DataEntryStore.reset("urlForUpload", {prefix: "https://", associations: {"policies": [], "announcements": []}})
            openURLModal(e)
          }}
          icon
        >
          <Icon name="chain" />
        </Button>{" "}
        <Button
          disabled={urlButtonDisabled}
          className="linkbuttons"
          onClick={e => this.removeLink(e)}
          icon
        >
          <Icon name="unlink" />
        </Button>{" "}
      </React.Fragment>
    ) : null;

    return (
      <div className="Answer">
        <div>
          <div className="DraftTools">
            <div
              className="DraftButtons"
              style={{ float: "left", paddingTop: 5 }}
            >
              {/* <Transition.Group animation={"fade up"} duration={150}>
                {DataEntryStore.draft.visible && ( */}
                  <div>
                    <div className="Draft-Float-Left">
                      {" "}
                      <EmojiSelect />
                    </div>
                    <div className="Draft-Float-Right">
                      <Button.Group>
                        <Button
                          className="FixButtonGroup"
                          icon
                          onClick={this._onBoldClick.bind(this)}
                        >
                          <Icon name="bold" />
                        </Button>
                        <Button icon onClick={this._onUlineClick.bind(this)}>
                          <Icon name="underline" />
                        </Button>
                        <Button icon onClick={this._onItalicClick.bind(this)}>
                          <Icon name="italic" />
                        </Button>
                        <Button icon onClick={this._onUlClick.bind(this)}>
                          <Icon name="unordered list" />
                        </Button>
                        <Button icon onClick={this._onOlClick.bind(this)}>
                          <Icon name="ordered list" />
                        </Button>

                        {addURL}
                      </Button.Group>
                    </div>
                  </div>
                
              {/* </Transition.Group> */}
            </div>
          
          </div>
          <div
            className="AnswerField"
            onMouseOver={event => {
              //   console.log(event.closestElement());
            }}
          >
            <Editor
              //   onBlur={e => this.passContent()}
            //   readOnly={!DataEntryStore.draft.visible}
              editorState={DataEntryStore.draft.editorState}
              onChange={this.editorStateChanged}
              handleKeyCommand={this.handleKeyCommand}
              decorators={[
                {
                  strategy: this.findLinkEntities,
                  component: this.Link
                }
              ]}
              plugins={plugins}
              ref={element => {
                this.editor = element;
              }}
            />
          </div>

          <EmojiSuggestions />
        </div>
        <div style={{ float: "left", paddingTop: 5 }}>
          <WordCounter limit={200} /> words
        </div>
        <div style={{ float: "right", paddingTop: 5 }} />
        {/* <div className="EmojiLicense">
          Emoji by{" "}
          <a
            style={{ color: "rgb(179, 179, 179)" }}
            href="https://www.emojione.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            EmojiOne
          </a>{" "}
        </div> */}

        <UploadURL
          open={UIStore.modal.uploadURL}
          selection={this.getSelectedText()}
          onSubmit={this.confirmLink}
        />

        


      </div>
    );
  }
}