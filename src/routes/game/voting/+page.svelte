<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { gameStore } from '$lib/stores/gameStore';

    const currentRound = $derived($gameStore.rounds[$gameStore.roundIndex]);
    const votingPhotos = $derived(currentRound?.photos);
    let selectedPhotoIndex = $state<number | null>(null);
    let voted = $state<boolean>(false);
   
    function submitVote() {
        if (selectedPhotoIndex !== null) {
            gameStore.submitVote(votingPhotos[selectedPhotoIndex].playerID);
            voted = true;
        }
    }
</script>

<main class="mx-4 flex min-h-screen flex-col justify-center gap-4">
    <div
        class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:gap-4"
    >
        {#each votingPhotos || [] as photo, index}
            <button
                class="aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all
                {selectedPhotoIndex === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'}"
                onclick={() => (selectedPhotoIndex = index)}
                type="button"
            >
                <img
                    src={photo.filePath}
                    alt="Player submission"
                    class="h-full w-full object-cover"
                />
            </button>
        {/each}
    </div>
   
    {#if !voted}
        <Button disabled={selectedPhotoIndex === null} onclick={submitVote}>Submit Vote!</Button>
    {:else}
        <h4>Voted!</h4>
    {/if}
</main>