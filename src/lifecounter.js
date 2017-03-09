import React, { Component } from 'react';
import ReactModal from 'react-modal';
import logo from './logo.svg';
import './lifecounter.css';
import update from 'react-addons-update';
import {Icon} from 'react-fa';

class SettingsModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			id: props.player.id,
			name: props.player.name,
			hp: props.player.hp
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleSubmit(event){
		event.preventDefault();
		this.props.updatePlayer(this.state.id,this.state.name,this.state.hp);
		this.props.closeSettingsModal();
	}

	render() {
		return (
			<div className="settings-modal">
				<form onSubmit={this.handleSubmit}>
					<p><label>Name</label>
					<input type="text" name="name" onChange={this.handleChange} value={this.state.name} /></p>
					<p><label>Hitpoints</label>
					<input type="text" name="hp" onChange={this.handleChange} value={this.state.hp} /></p>
					<p><input className="btn btn-primary" type="submit" value="Update" /></p>
				</form>
			</div>
		);
	}
}

class AddPlayerModal extends Component {
	constructor(){
		super();
		this.state = {
			name: '',
			hp: 40
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleSubmit(event){
		event.preventDefault();
		this.props.addPlayer(this.state.name,this.state.hp);
		this.props.closeAddPlayerModal();
	}

	render() {
		return (
			<div className="player-modal">
				<form onSubmit={this.handleSubmit}>
					<p><label>Name</label>
					<input type="text" name="name" onChange={this.handleChange} value={this.state.name} /></p>
					<p><label>Hitpoints</label>
					<input type="text" name="hp" onChange={this.handleChange} value={this.state.hp} /></p>
					<p><input className="btn btn-primary" type="submit" value="Add" /></p>
				</form>
			</div>
		);
	}
}

class PlayerContainer extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hp: ''
		};

		this.updateScore = this.updateScore.bind(this);
		this.sendModalInfo = this.sendModalInfo.bind(this);
		this.isAlive = this.isAlive.bind(this);
	}

	componentWillMount() {
		this.setState({ hp: this.props.player.hp });  
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ hp: nextProps.player.hp });
	}

	sendModalInfo() {
		const newData = update(this.props.player, {hp: {$set: this.state.hp}});
		this.props.settingsOpen(newData);
	}

	updateScore(event) {
		const change = event.target.value;
		const newHp = parseInt(this.state.hp) + parseInt(change);
		this.isAlive(newHp);
		this.setState({hp: newHp});
		this.props.updatePlayer(this.props.player.id, this.props.player.name, newHp);
	}

	isAlive(hp) {
		if(hp<= 0) {
			this.setState({alive: false}); console.log('dead');}
		else
			this.setState({alive: true})
	}

	render() {
		return (
			<div className="player-container col-md-4">
				<div className={"panel panel-default"+(this.state.alive ? '':' player-dead')}>
					<div className="panel-heading">
						<h3>{this.props.player.name}</h3>
						<a onClick={this.sendModalInfo}>
							<Icon name='cog' size='2x' />
						</a>
					</div>
				  <div className="panel-body">
						<h4>{this.state.hp}</h4>
						<button className="btn btn-default" onClick={this.updateScore} value="-5">-5</button>
						<button className="btn btn-default" onClick={this.updateScore} value="-1">-1</button>
						<button className="btn btn-default" onClick={this.updateScore} value="1">+1</button>
						<button className="btn btn-default" onClick={this.updateScore} value="5">+5</button>
					</div>
				</div>
			</div>
		);
	}
}

const modalStyles = {
	content : {
	  top            : '50%',
	  left           : '50%',
	  right          : 'auto',
	  bottom         : 'auto',
	  marginRight    : '-50%',
	  transform      : 'translate(-50%, -50%)'
  }
};

const shortid = require('shortid');

class Lifecounter extends Component {
	constructor(){
		super();
		this.state = {
			showSettingsModal: false,
			showAddPlayerModal: false,
			currentPlayer:'',
			players: [],
			defaultHp: 40
		};

		this.openSettingsModal = this.openSettingsModal.bind(this);
		this.closeSettingsModal = this.closeSettingsModal.bind(this);
		this.openAddPlayerModal = this.openAddPlayerModal.bind(this);
		this.closeAddPlayerModal = this.closeAddPlayerModal.bind(this);
		this.addPlayer = this.addPlayer.bind(this);
		this.updatePlayer = this.updatePlayer.bind(this);
	}

	openSettingsModal(player) {
		this.setState({currentPlayer: player, showSettingsModal: true});
	}

	closeSettingsModal() {
		this.setState({ showSettingsModal: false });
	}

	openAddPlayerModal() {
		this.setState({ showAddPlayerModal: true });
	}

	closeAddPlayerModal() {
		this.setState({ showAddPlayerModal: false });
	}

	addPlayer(name,hp) {
		const id = shortid.generate();
		this.setState({ players: this.state.players.concat({id: id, name: name, hp: hp}) });
	}

	updatePlayer(id,name,hp) {
		const newState = this.state.players.map((player) => {
			if(player.id===id) {
				const newData = update(player, {
					name: {$set: name},
					hp: {$set: hp}
				});
				return newData;
			}
			else
				return player;
		});

		this.setState({players:newState});

	}

  render() {
  	var that = this;
    return (
      <div className="lifecounter">
        <div className="lifecounter-header">
          <h1>MTG Lifecounter</h1>
          <Icon name='heart' className="logo-heart" />
          	<Icon name='heart' className="logo-heart" />
          	<Icon name='heart' className="logo-heart" />
          	<Icon name='heart-o' className="logo-heart" />
        </div>
        <button className="btn btn-default" onClick={this.openAddPlayerModal}>Add Player</button>
        <div className="lifecounter-container container">
        	<div className="row">
		        {this.state.players.map((player) => 
		        	<PlayerContainer player={player}
			        	settingsOpen={that.openSettingsModal}
			        	updatePlayer={this.updatePlayer} />
		        )}
		       </div>       
        </div>

        <ReactModal
	      	isOpen={this.state.showAddPlayerModal}
	      	onRequestClose={this.closeAddPlayerModal}
	      	style={modalStyles}
      	>
	      	<AddPlayerModal addPlayer={this.addPlayer}
	      		closeAddPlayerModal={this.closeAddPlayerModal} />
	      </ReactModal>

	      <ReactModal
	      	isOpen={this.state.showSettingsModal}
	      	onRequestClose={this.closeSettingsModal}
	      	style={modalStyles}
      	>
	      	<SettingsModal player={this.state.currentPlayer}
	      		updatePlayer={this.updatePlayer}
	      		closeSettingsModal={this.closeSettingsModal} />
	      </ReactModal>
      </div>
    );
  }
}

export default Lifecounter;
