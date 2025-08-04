import { get, writable } from 'svelte/store';
import { Client, Room } from 'colyseus.js';
import { getStateCallbacks } from 'colyseus.js';

interface ClientGameState {
	room: Room | null;
	connected: boolean;
	isHost: boolean;
	error: string | null;
	currentRound?: number;
	currentPrompt?: string;
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
				set({ room: null, connected: false, isHost: false, error: error.message });
				throw error;
			}
		},
		disconnect() {
			update((state) => {
				state.room?.leave();
				return { room: null, connected: false, isHost: false, error: null };
			});
		},
		// sendMessage(type: string, data) {
		// 	update((state) => {
		// 		state.room?.send(type, data);
		// 		return state;
		// 	});
		// },
		// Add these methods to your gameStore
		async createRoom(name: string) {
			try {
				const room = await client.create('game_room', { name: name });
				setupRoomListeners(room);
				set({ room, connected: true, isHost: true, error: null });
				return room;
			} catch (error) {
				set({ room: null, connected: false, isHost: true, error: error.message });

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
				set({ room: null, connected: false, isHost: false, error: error.message });
				throw error;
			}
		}
	};
}

export const gameStore = createGameStore();
