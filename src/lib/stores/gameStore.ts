import { writable } from 'svelte/store';
import { Client } from 'colyseus.js';
import type { Room } from 'colyseus.js';
import { goto } from '$app/navigation';
import { GameRoomState } from '$lib/schema/GameRoomState';
import { GameSettings } from '$lib/schema/GameSettings';

const navDelay = () => new Promise((resolve) => setTimeout(resolve, 1000));

function createGameStore() {
	const { subscribe, set } = writable<GameRoomState>(new GameRoomState());
	const client = new Client('https://192.168.50.133:2567');
	let currentRoom: Room | null = null;

	function setupRoomListeners(room: Room) {
		room.onStateChange((state: GameRoomState) => {
			set(state);
		});
		room.onMessage('round_start', async () => {
			await navDelay();
			goto('/game/take-picture');
		});

		room.onMessage('not_enough_players', () => {
			console.error('not enough players');
		});

		room.onMessage('voting_start', async () => {
			await navDelay();
			goto('/game/voting');
		});

		room.onMessage('round_results', async () => {
			await navDelay();
			goto('/game/round-results');
		});

		room.onMessage('game_complete', () => {
			console.log('Game completed!');
		});
	}

	return {
		subscribe,
		async getRoom() {
			if (currentRoom) return currentRoom;

			return new Promise<Room>((resolve) => {
				const checkRoom = () => {
					if (currentRoom) {
						resolve(currentRoom);
					} else {
						setTimeout(checkRoom, 10);
					}
				};
				checkRoom();
			});
		},
		async reconnect() {
			const reconnectionToken = sessionStorage.getItem('reconnectionToken');
			if (reconnectionToken) {
				try {
					currentRoom = await client.reconnect(reconnectionToken);
					console.log('set new room', currentRoom);
					setupRoomListeners(currentRoom);
					console.log('successfully reconnected to prior game');
				} catch {
					sessionStorage.clear();
					goto('/');
					console.log('Failed to reconnect to prior game');
				}
			}
		},
		async createRoom(name: string) {
			currentRoom = await client.create('game_room', { name: name });
			sessionStorage.setItem('reconnectionToken', currentRoom.reconnectionToken);
			setupRoomListeners(currentRoom);
		},
		async joinByCode(roomID: string, name: string) {
			currentRoom = await client.joinById(roomID, { name: name });
			sessionStorage.setItem('reconnectionToken', currentRoom.reconnectionToken);
			setupRoomListeners(currentRoom);
		},
		leaveGame() {
			if (currentRoom) {
				currentRoom.leave();
				currentRoom = null;
			}
			sessionStorage.clear();
			goto('/');
		},
		startGame(gameSettings: GameSettings) {
			if (!currentRoom) throw new Error('Room not available');
			currentRoom.send('game_start', gameSettings);
		},
		nextRound() {
			if (!currentRoom) throw new Error('Room not available');
			currentRoom.send('next_round');
		},
		sendPhoto(processedImage: string) {
			if (!currentRoom) throw new Error('Room not available');
			currentRoom.send('photo', processedImage);
		},
		submitVote(selectedPhotoName: string) {
			if (!currentRoom) throw new Error('Room not available');
			console.log('I voted for: ', selectedPhotoName);
			currentRoom.send('vote_submit', {
				name: selectedPhotoName,
				voter: currentRoom.sessionId
			});
		}
	};
}

export const gameStore = createGameStore();
