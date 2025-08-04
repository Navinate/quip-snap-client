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

// interface ServerGameState {
// 	roundNumber: number;
// 	currentPrompt: string;
// 	hostID: string;
// }

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
			// Handle round timing logic
		});
		// TODO: add voting time, round over onMessage listeners

		room.onMessage('game_complete', () => {
			console.log('Game completed!');
		});
	}

	return {
		subscribe,
		async connect(roomName: string) {
			try {
				const room = await client.joinOrCreate(roomName);
				setupRoomListeners(room);
				set({ room, connected: true, isHost: false, error: null });
				return room;
			} catch (error) {
				set({ room: null, connected: false, isHost: false, error: (error as Error).message });
				throw error;
			}
		},
		disconnect() {
			update((state) => {
				state.room?.leave();
				return { room: null, connected: false, isHost: false, error: null };
			});
		},
		leaveGame() {
			gameStore.disconnect();
			goto('/');
		},
		startGame(gameSettings: GameSettings) {
			//put code to check if user is host
			this.sendMessage("game_start", gameSettings)
		},
		sendMessage(type: string, data?: unknown) {
			update((state) => {
				state.room?.send(type, data);
				return state;
			});
		},
		// Add these methods to your gameStore
		async createRoom(name: string) {
			try {
				const room = await client.create('game_room', { name: name });
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
				setupRoomListeners(room);
				set({ room, connected: true, isHost: false, error: null });
				return room;
			} catch (error) {
				set({ room: null, connected: false, isHost: false, error: (error as Error).message });
				throw error;
			}
		}
	};
}

export const gameStore = createGameStore();
