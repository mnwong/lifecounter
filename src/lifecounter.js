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
			hp: props.player.hp,
			playerFlair: props.player.flair,
			flair: props.flair
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
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
		this.props.updatePlayer(this.state.id,this.state.name,this.state.hp,this.state.playerFlair);
		this.props.closeSettingsModal();
	}

	handleRemove() {
		this.props.removePlayer(this.state.id);
		this.props.closeSettingsModal();
	}

	render() {
		return (
			<div className="settings-modal">
				<form onSubmit={this.handleSubmit} className="form-horizontal">

					<div className="form-group">
			      <label htmlFor="name" className="col-lg-3 control-label">Name</label>
			      <div className="col-lg-9">
			      	<input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.name} autoFocus />
			      </div>
			    </div>

			    <div className="form-group">
			      <label htmlFor="hitpoints" className="col-lg-3 control-label">Hitpoints</label>
			      <div className="col-lg-9">
							<input type="text" name="hp" className="form-control" onChange={this.handleChange} value={this.state.hp} />
			      </div>
			    </div>

			    <div className="form-group">
			      <label htmlFor="playerFlair" className="col-lg-3 control-label">Art</label>
			      <div className="col-lg-9">
							<select name="playerFlair" className="form-control" onChange={this.handleChange} value={this.state.playerFlair}> 
								<option value="flair-plains">Plains</option>
					      <option value="flair-mountain">Mountain</option>
					      <option value="flair-forest">Forest</option>
					      <option value="flair-swamp">Swamp</option>
					      <option value="flair-island">Island</option>
				      </select>
			      </div>
			    </div>

			    <div className="form-group">
			      <div className="col-lg-9 col-lg-offset-3">
			      	<input className="btn btn-default col-lg-5 col-xs-5" type="submit" defaultValue="Update" />
			      	<input className="btn btn-danger col-lg-5 col-xs-5 col-lg-offset-1 col-xs-offset-1" onClick={this.handleRemove} defaultValue="Delete" />
			      </div>
			    </div>

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
			hp: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		this.setState({ hp: this.props.defaultHp });  
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ hp: nextProps.defaultHp });
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
				<form onSubmit={this.handleSubmit} className="form-horizontal">

					<div className="form-group">
			      <label htmlFor="name" className="col-lg-3 control-label">Name</label>
			      <div className="col-lg-9">
			      	<input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.name} autoFocus />
			      </div>
			    </div>

			    <div className="form-group">
			      <label htmlFor="hitpoints" className="col-lg-3 control-label">Hitpoints</label>
			      <div className="col-lg-9">
							<input type="text" name="hp" className="form-control" onChange={this.handleChange} value={this.state.hp} />
			      </div>
			    </div>

			    <div className="form-group">
			      <div className="col-lg-9 col-lg-offset-3">
			      	<input className="btn btn-default" type="submit" defaultValue="Add" />
			      </div>
			    </div>

				</form>
			</div>
		);
	}
}

class PlayerContainer extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hp: '',
			alive: ''
		};

		this.updateScore = this.updateScore.bind(this);
		this.sendModalInfo = this.sendModalInfo.bind(this);
		this.isAlive = this.isAlive.bind(this);
	}

	componentWillMount() {
		this.setState({ hp: this.props.player.hp,
			alive: this.props.player.alive });  
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ hp: nextProps.player.hp });
		this.isAlive(nextProps.player.hp);
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
		this.props.updatePlayer(this.props.player.id, this.props.player.name, newHp, this.props.player.flair);
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
				<div className={"panel panel-default"+(this.state.alive ? '':' player-dead')+' '+this.props.player.flair}>
					<div className="panel-heading">
						<h3>{this.props.player.name}</h3>
						<a onClick={this.sendModalInfo}>
							<Icon name='cog' size='2x' />
						</a>
					</div>
				  <div className="panel-body">
						<h4>{this.state.hp}</h4>
						<div className="btn-group btn-group-lg" role="group">
							<button className="btn btn-default" onClick={this.updateScore} value="-5">-5</button>
							<button className="btn btn-default" onClick={this.updateScore} value="-1">-1</button>
							<button className="btn btn-default" onClick={this.updateScore} value="1">+1</button>
							<button className="btn btn-default" onClick={this.updateScore} value="5">+5</button>
						</div>
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
			defaultHp: 40,
			flair: ['flair-mountain','flair-plains','flair-forest','flair-swamp','flair-island']
		};

		this.openSettingsModal = this.openSettingsModal.bind(this);
		this.closeSettingsModal = this.closeSettingsModal.bind(this);
		this.openAddPlayerModal = this.openAddPlayerModal.bind(this);
		this.closeAddPlayerModal = this.closeAddPlayerModal.bind(this);
		this.addPlayer = this.addPlayer.bind(this);
		this.removePlayer = this.removePlayer.bind(this);
		this.updatePlayer = this.updatePlayer.bind(this);
		this.resetLifeTotal = this.resetLifeTotal.bind(this);
		this.handleChange = this.handleChange.bind(this);
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

	handleChange(event) {
		const target = event.target;
		const value = target.value;

		this.setState({ defaultHp: value });
	}

	randomNumber() {
		return Math.floor((Math.random() * this.state.flair.length) + 0);
	}

	resetLifeTotal() {
		const newState = this.state.players.map((player) => {
			const newData = update(player, {
				hp: {$set: this.state.defaultHp},
				alive: {$set: true}
			});
			return newData;
		});

		this.setState({players:newState});
	}

	addPlayer(name,hp) {
		const id = shortid.generate();
		this.setState({ players: 
			this.state.players.concat({id: id, 
				name: name, 
				hp: hp, 
				alive: true,
				flair: this.state.flair[this.randomNumber()]})
		});

	}

	removePlayer(id) {
		var index = this.state.players.map(function(player){return player.id}).indexOf(id);
		const newState = this.state.players;
		newState.splice(index,1);
		this.setState({players:newState});
	}

	updatePlayer(id,name,hp,flair) {
		const newState = this.state.players.map((player) => {
			if(player.id===id) {
				const newData = update(player, {
					name: {$set: name},
					hp: {$set: hp},
					flair: {$set: flair}
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
        
				<div className="form-inline">
				  <button className="btn btn-default" onClick={this.openAddPlayerModal}>Add Player</button>
				  <button className="btn btn-danger" onClick={this.resetLifeTotal}>Reset Life</button>
				  <div className="input-group">
				    <div className="input-group-addon">Life Start</div>
				    <input type="text" className="form-control" onChange={this.handleChange} value={this.state.defaultHp} />
				  </div>
				</div>

        <div className="lifecounter-container container">
        	<div className="row">
		        {this.state.players.map((player) => 
		        	<PlayerContainer player={player}
			        	settingsOpen={that.openSettingsModal}
			        	updatePlayer={this.updatePlayer}
			        	key={player.id} />
		        )}
		       </div>       
        </div>

        <ReactModal
	      	isOpen={this.state.showAddPlayerModal}
	      	onRequestClose={this.closeAddPlayerModal}
	      	style={modalStyles}
      	>
	      	<AddPlayerModal addPlayer={this.addPlayer}
	      		closeAddPlayerModal={this.closeAddPlayerModal}
	      		defaultHp={this.state.defaultHp} />
	      </ReactModal>

	      <ReactModal
	      	isOpen={this.state.showSettingsModal}
	      	onRequestClose={this.closeSettingsModal}
	      	style={modalStyles}
      	>
	      	<SettingsModal player={this.state.currentPlayer}
	      		updatePlayer={this.updatePlayer}
	      		removePlayer={this.removePlayer}
	      		closeSettingsModal={this.closeSettingsModal}
	      		flair={this.state.flair} />
	      </ReactModal>
      </div>
    );
  }
}

export default Lifecounter;
