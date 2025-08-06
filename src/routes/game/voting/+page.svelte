<script lang="ts">
    import CountDownTimer from '$lib/components/CountDownTimer.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import { gameStore } from '$lib/stores/gameStore';
	import type { Room } from 'colyseus.js';
	import { onMount } from 'svelte';
    const currentRound = $derived($gameStore.rounds[$gameStore.roundIndex]);
    const votingPhotos = $derived(currentRound?.photos);
    let selectedPhotoIndex = $state<number | null>(null);
    let voted = $state<boolean>(false);
    let room = $state<Room | null>(null);
    onMount(async () => {
        room = await gameStore.getRoom();
    });
    const currentPlayerID = $derived(room?.sessionId ?? '');
    function submitVote() {
        if (selectedPhotoIndex !== null) {
            gameStore.submitVote(votingPhotos[selectedPhotoIndex].playerID);
            voted = true;
        }
    }

    function getPlayerName(playerID: string): string {
        const p = $gameStore.players.get(playerID)
        return p ? p.name : '';
    }
</script>

<main class="flex min-h-screen flex-col p-3 gap-4">
    <div class="text-center pt-safe mt-8">
        <h1 class="text-xl sm:text-2xl font-bold mb-1">📸 Vote for Your Favorite</h1>
        <p class="text-sm text-muted-foreground">Choose the photo that best captures the prompt</p>
    </div>

    <div class="flex justify-center">
        <CountDownTimer initTime={$gameStore.settings.voteTime} onComplete={submitVote} />
    </div>
    
    <div class="min-h-80 overflow-y-auto px-4">
        <div class="grid grid-cols-2 gap-2 sm:gap-4 max-w-2xl mx-auto">
            {#each votingPhotos || [] as photo, index}
                <div 
                    class="cursor-pointer overflow-hidden transition-all duration-200 active:scale-95 
                        {photo.playerID === currentPlayerID ? 'hidden' : ''}"

                >
                    <button
                        class="w-full h-full relative"
                        onclick={() => (selectedPhotoIndex = index)}
                        type="button"
                    >
                        <div class="aspect-square overflow-hidden relative">
                            <img
                                src={photo.filePath}
                                alt="Player submission"
                                class="h-full w-full object-cover rounded-lg"
                            />
                            {#if selectedPhotoIndex === index}
                                <div class="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg">
                                    <div class="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                                        ✓
                                    </div>
                                </div>
                            {/if}
                            <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-lg">
                                <p class="text-xs sm:text-sm font-medium text-center truncate">{getPlayerName(photo.playerID)}</p>
                            </div>
                        </div>
                    </button>
                </div>
            {/each}
        </div>
    </div>
   
    <div>
        {#if !voted}
            <Button 
                class="w-full py-4 text-base font-semibold" 
                disabled={selectedPhotoIndex === null} 
                onclick={submitVote}
            >
                🗳️ Submit Vote
            </Button>
        {:else}
            <Button class="w-full py-4 text-base font-semibold" disabled>
                ✅ Vote Submitted!
            </Button>
        {/if}
    </div>
</main>