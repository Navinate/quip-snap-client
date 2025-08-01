import { writable } from 'svelte/store';
import { Client, Room } from 'colyseus.js';

interface ClientGameState {
	room: Room | null;
	connected: boolean;
	isHost: boolean;
	error: string | null;
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
		error: null
	});

	const client = new Client('ws://localhost:2567');

	return {
		subscribe,
		async connect(roomName: string) {
			try {
				const room = await client.joinOrCreate(roomName);
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
		sendMessage(type: string, data) {
			update((state) => {
				state.room?.send(type, data);
				return state;
			});
		},
		// Add these methods to your gameStore
		async createRoom() {
			try {
				const room = await client.create('game_room');
				set({ room, connected: true, isHost: true, error: null });
				return room;
			} catch (error) {
				set({ room: null, connected: false, isHost: true, error: error.message });
				throw error;
			}
		},

		async joinByCode(roomID: string) {
			try {
				// This only joins existing rooms, doesn't create new ones
				const room = await client.joinById(roomID);
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
