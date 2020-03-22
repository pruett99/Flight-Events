﻿import * as React from 'react';
import { UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import { AircraftStatus } from '../Models';
import Panel from './Controls/Panel';

interface Props {
    aircrafts: { [connectionId: string]: AircraftStatus };
    onAircraftClick: (connectionId: string, aircraft: AircraftStatus) => void;

    myConnectionId: string | null;
    onMeChanged: (connectionId: string | null) => void;
    followingConnectionId: string | null;
    onFollowingChanged: (connectionId: string | null) => void;

    moreInfoConnectionIds: string[];
    onMoreInfoChanged: (connectionId: string) => void;
}

export default class AircraftList extends React.Component<Props> {
    static displayName = AircraftList.name;

    handleFollowChanged(connectionId: string) {
        if (this.props.followingConnectionId === connectionId) {
            this.props.onFollowingChanged(null);
        } else {
            this.props.onFollowingChanged(connectionId);
        }
    }

    handleMeChanged(connectionId: string) {
        if (this.props.myConnectionId === connectionId) {
            this.props.onMeChanged(null);
        } else {
            this.props.onMeChanged(connectionId);
        }
    }

    handleMoreInfoChanged(connectionId: string) {
        this.props.onMoreInfoChanged(connectionId);
    }

    public render() {
        let connectionIds = Object
            .entries(this.props.aircrafts)
            .sort((a, b) => (a[1].callsign || a[0].substring(5)).localeCompare((b[1].callsign || b[0].substring(5))))
            .map(o => o[0]);

        if (this.props.myConnectionId) {
            connectionIds = connectionIds.filter(o => o !== this.props.myConnectionId);
            connectionIds = [this.props.myConnectionId].concat(connectionIds);
        }
        const list = connectionIds.length === 0 ?
            <tr><td colSpan={4}><NoneText>None</NoneText></td></tr> :
            connectionIds.map(connectionId => (
                <ListItem key={connectionId}>
                    <td>
                        <button className="btn btn-link" onClick={() => this.props.onAircraftClick(connectionId, this.props.aircrafts[connectionId])}>
                            {this.props.aircrafts[connectionId].callsign || connectionId.substring(5)}
                        </button>
                    </td>
                    <td><Checkbox type="checkbox" checked={this.props.myConnectionId === connectionId} onChange={() => this.handleMeChanged(connectionId)} /></td>
                    <td><Checkbox type="checkbox" checked={this.props.followingConnectionId === connectionId} onChange={() => this.handleFollowChanged(connectionId)} /></td>
                    <td><Checkbox type="checkbox" checked={this.props.moreInfoConnectionIds.includes(connectionId)} onChange={() => this.handleMoreInfoChanged(connectionId)} /></td>
                </ListItem>
            ));

        return <Wrapper>
            <Join />
            <List>
                <thead>
                    <tr>
                        <th><Title>Aircraft</Title></th>
                        <th>
                            <div id="txtMe">Own</div>
                            <UncontrolledTooltip placement="right" target="txtMe">Own aircraft. Will display the visible range circle for multiplayer</UncontrolledTooltip>
                        </th>
                        <th>
                            <div id="txtFollow">Flw</div>
                            <UncontrolledTooltip placement="right" target="txtFollow">Keep the map centered on this aircraft</UncontrolledTooltip>
                        </th>
                        <th>
                            <div id="txtMore">Nfo</div>
                            <UncontrolledTooltip placement="right" target="txtMore">Show more info</UncontrolledTooltip>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </List>
        </Wrapper>
    }
}

interface JoinState {
    modal: boolean;
}

class Join extends React.Component<any, JoinState> {
    constructor(props: any) {
        super(props);

        this.state = {
            modal: false
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    public render() {
        return <>
            <Button color="primary" onClick={this.toggle} style={{ width: '100%' }}>Join</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Flight Events Client</ModalHeader>
                <ModalBody>
                    <p>In order to connect your flight simulator to this map, you have to run a small client software on your computer.</p>

                    <a className="btn btn-primary" href="https://events-storage.flighttracker.tech/downloads/FlightEvents.Client.zip" target="_blank">Download Client</a>

                    <hr />
                    <p>When you start the client, it might also ask you to install the following prerequisites:</p>
                    <ul>
                        <li><a href="https://dotnet.microsoft.com/download/dotnet-core/thank-you/runtime-desktop-3.1.2-windows-x86-installer" target="_blank">.NET Core Windows Runtime (x86)</a></li>
                        <li><a href="https://events-storage.flighttracker.tech/downloads/SimConnect.zip" target="_blank">SimConnect</a></li>
                    </ul>
                </ModalBody>
            </Modal>
        </>
    }
}

const Title = styled.div`
margin-left: 8px;
margin-right: 8px;
font-weight: bold;
font-style: italic;
text-align: center;
`

const NoneText = styled.div`
margin: 0 8px 10px 8px;
`

const Wrapper = styled(Panel)`
position: absolute;
top: 10px;
right: 10px;
z-index: 1000;
max-height: calc(100% - 200px);
overflow-y: auto;
`

const List = styled.table`
margin-top: 10px;
margin-right: 5px;
list-style: none;
padding: 0;

th div {
min-width: 20px;
text-align: center;
}
`

const ListItem = styled.tr`
button {
display: block;
font-weight: bold;
width: 100%;
}
td {
text-align: center;
}
`

const Checkbox = styled.input`
text-align: center;
`