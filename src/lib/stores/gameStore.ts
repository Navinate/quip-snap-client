import { writable } from 'svelte/store';
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
}

export interface GameSettings {
	photoTime: number;
	votingTime: number;
	numRounds: number;
}

function createGameStore() {
	const { subscribe, set, update } = writable<ClientGameState>({
		room: null,
		connected: false,
		isHost: false,
		error: null,
		currentRound: 0,
		currentPrompt: ''
	});

	const client = new Client('https://192.168.50.133:2567');

	function setupRoomListeners(room: Room) {
		const $ = getStateCallbacks(room);

		// Listen to any state changes
		$(room.state).onChange(() => {
			console.log('State Changed');
			update((state) => ({
				...state,
				currentRound: room.state.roundIndex,
				currentPrompt: room.state.currentPrompt,
				isHost: room.sessionId === room.state.hostID
			}));
		});

		// Listen to messages
		room.onMessage('round_start', (data) => {
			console.log('Round started at:', data.timestamp);
			goto('/game/take-picture');
		});
		// TODO: add voting time, round over onMessage listeners

		room.onMessage('game_complete', () => {
			console.log('Game completed!');
		});

		// room.onMessage('new_host', () => {

		// })
	}

	return {
		subscribe,
		// async connect(roomName: string) {
		// 	try {
		// 		const room = await client.joinOrCreate(roomName);
		//      sessionStorage.setItem('reconnectionToken', room.reconnectionToken);
		// 		setupRoomListeners(room);
		// 		set({ room, connected: true, isHost: false, error: null });
		// 		return room;
		// 	} catch (error) {
		// 		set({ room: null, connected: false, isHost: false, error: (error as Error).message });
		// 		throw error;
		// 	}
		// },
		async reconnect() {
			const reconnectionToken = sessionStorage.getItem('reconnectionToken');
			if (reconnectionToken) {
				console.log('attempting to reconnect because token exists', reconnectionToken);
				try {
					const room = await client.reconnect(reconnectionToken);

					setupRoomListeners(room);
					if (room.state.hostID === room.roomId) {
						set({ room, connected: true, isHost: true, error: null });
					} else {
						set({ room, connected: true, isHost: false, error: null });
					}

					console.log('successfully reconnected!');
				} catch (error) {
					set({ room: null, connected: false, isHost: false, error: (error as Error).message });
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
				set({ room, connected: true, isHost: true, error: null });
				return room;
			} catch (error) {
				set({ room: null, connected: false, isHost: true, error: (error as Error).message });

				throw error;
			}
		},
		async joinByCode(roomID: string, name: string) {
			try {
				// This only joins existing rooms, doesn't create new ones
				const room = await client.joinById(roomID, { name: name });
				sessionStorage.setItem('reconnectionToken', room.reconnectionToken);
				setupRoomListeners(room);
				set({ room, connected: true, isHost: false, error: null });
				return room;
			} catch (error) {
				set({ room: null, connected: false, isHost: false, error: (error as Error).message });
				throw error;
			}
		},
		_disconnect() {
			update((state) => {
				state.room?.leave();
				return { room: null, connected: false, isHost: false, error: null };
			});
		},
		leaveGame() {
			gameStore._disconnect();
			sessionStorage.removeItem('reconnectionToken');
			goto('/');
		},
		startGame(gameSettings: GameSettings) {
			//put code to check if user is host
			this.sendMessage('game_start', gameSettings);
		},
		sendMessage(type: string, data?: unknown) {
			update((state) => {
				state.room?.send(type, data);
				return state;
			});
		}
	};
}

export const gameStore = createGameStore();
