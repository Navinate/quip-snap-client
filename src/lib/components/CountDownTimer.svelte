<script lang="ts">
  import { onMount } from 'svelte';
  import { Progress } from "$lib/components/ui/progress";
  
  interface Props {
    photoTime: number; // in seconds
    onComplete?: () => void;
  }
  
  let { photoTime, onComplete }: Props = $props();
  
  let progress = $state(100);
  let timeLeft = $state(0);
  let totalTime = 0;
  let interval: NodeJS.Timeout;
  
  onMount(() => {
    totalTime = photoTime * 1000; // Convert to milliseconds
    timeLeft = totalTime;
    
    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 100; // Decrease by 100ms
        progress = (timeLeft / totalTime) * 100;
      } else {
        clearInterval(interval);
        progress = 0;
        onComplete?.();
      }
    }, 100);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  });
</script>

<div class="w-full space-y-2">
  <div class="flex justify-between text-sm text-muted-foreground">
    <span>Time Remaining</span>
    <span>{Math.ceil(timeLeft / 1000)}s</span>
  </div>
  <Progress value={progress} class="h-3" />
</div>