import { get, writable } from 'svelte/store';
import { Client, Room } from 'colyseus.js';
import { getStateCallbacks } from 'colyseus.js';
import { goto } from '$app/navigation';

interface ClientGameState {
	room: Room | null;
	connected: boolean;
	isHost: boolean;
	error: string | null;
	currentRound?: number;
	currentPrompt?: string;
	votingPhotos: VotingPhoto[];
}

interface GameSettings {
	photoTime: number;
	votingTime: number;
	numRounds: number;
}
export interface VotingPhoto {
	name:string;
	image: Uint8Array;
}

function createGameStore() {
	const { subscribe, /*set,*/ update } = writable<ClientGameState>({
		room: null,
		connected: false,
		isHost: false,
		error: null,
		currentRound: 0,
		currentPrompt: '',
		votingPhotos: []
	});

	const client = new Client('https://192.168.50.133:2567');

	// Helper functions for updating specific fields
	const updateField = <K extends keyof ClientGameState>(key: K, value: ClientGameState[K]) => {
		update((state) => ({ ...state, [key]: value }));
	};
	const updateFields = (fields: Partial<ClientGameState>) => {
		update((state) => ({ ...state, ...fields }));
	};

	function setupRoomListeners(room: Room) {
		const $ = getStateCallbacks(room);

		$(room.state).onChange(() => {
			updateFields({
				currentRound: room.state.roundIndex,
				currentPrompt: room.state.currentPrompt,
				isHost: room.sessionId === room.state.hostID
			});
		});

		room.onMessage('round_start', () => {
			goto('/game/take-picture');
		});

		room.onMessage('not_enough_players', () => {
			console.error("not enough players :(");
		})

		room.onMessage('voting_start', (data) => {
			const filteredPhotos = data.photos.filter((photo: VotingPhoto) => photo.name !== room.sessionId);
			updateField('votingPhotos', filteredPhotos);
			goto('/game/voting');
			console.log(get(gameStore).votingPhotos);
		});

		room.onMessage('game_complete', () => {
			console.log('Game completed!');
		});
	}

	return {
		subscribe,
		async reconnect() {
			const reconnectionToken = sessionStorage.getItem('reconnectionToken');
			if (reconnectionToken) {
				console.log('attempting to reconnect because token exists', reconnectionToken);
				try {
					const room: Room = await client.reconnect(reconnectionToken);
					setupRoomListeners(room);
					updateFields({
						room,
						connected: true,
						isHost: room.sessionId === room.state.hostID,
						error: null
					});
					console.log('successfully reconnected!', get(gameStore).isHost);
				} catch (error) {
					updateFields({
						room: null,
						connected: false,
						isHost: false,
						error: (error as Error).message
					});
					console.log('Room does not exist anymore');
					this.leaveGame();
				}
			}
		},
		async createRoom(name: string) {
			try {
				const room = await client.create('game_room', { name: name });
				sessionStorage.setItem('reconnectionToken', room.reconnectionToken);
				setupRoomListeners(room);
				updateFields({ room, connected: true, isHost: true, error: null });
				return room;
			} catch (error) {
				updateFields({
					room: null,
					connected: false,
					isHost: true,
					error: (error as Error).message
				});
				throw error;
			}
		},
		async joinByCode(roomID: string, name: string) {
			try {
				const room = await client.joinById(roomID, { name: name });
				sessionStorage.setItem('reconnectionToken', room.reconnectionToken);
				setupRoomListeners(room);
				updateFields({ room, connected: true, isHost: false, error: null });
				return room;
			} catch (error) {
				updateFields({
					room: null,
					connected: false,
					isHost: false,
					error: (error as Error).message
				});
				throw error;
			}
		},
		_disconnect() {
			update((state) => {
				state.room?.leave();
				return { room: null, connected: false, isHost: false, error: null, votingPhotos: [] };
			});
		},
		leaveGame() {
			gameStore._disconnect();
			sessionStorage.clear();
			goto('/');
		},
		startGame(gameSettings: GameSettings) {
			this.sendMessage('game_start', gameSettings);
		},
		sendMessage(type: string, data?: unknown) {
			update((state) => {
				state.room?.send(type, data);
				return state;
			});
		},
		//TODO Add a function to check game status and sync up if desynced.
		// Could also do this by checking state object idk read colyseus docs idiot
	};
}

export const gameStore = createGameStore();
