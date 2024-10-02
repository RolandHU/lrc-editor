<script lang="ts">
  import { src, duration, currentTime, currentTimestamp } from "../lib/lrcManager"
  import { createTimestamp } from "../lib/utils"
  import Button from "./Button.svelte"
  import Icon from "@iconify/svelte"

  let audio: HTMLAudioElement
  let paused = true
  let prevPaused = paused
  $: width = ($currentTimestamp?.raw / $duration?.raw) * 100 || 0

  const handleLoad = (event: Event) => {
    const audio = event.target as HTMLAudioElement
    $duration = createTimestamp(audio.duration)
  }

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    width = (Number(input.value) / $duration.raw) * 100

    if (paused) return
    prevPaused = paused
    audio.pause()
  }

  const handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    currentTime.set(Number(input.value) / 1000 || 0)
    !prevPaused && audio.play()
  }
</script>

<div class="flex gap-4 p-4 rounded-2xl bg-zinc-900">
  <Button class="text-3xl" on:click={() => { paused = !paused; prevPaused = paused }}>
    <Icon icon={`${ paused ? "material-symbols:play-arrow-rounded" : "material-symbols:pause-rounded" }`}/>
  </Button>
  <div class="flex flex-1 items-center gap-4">
    <p>{$currentTimestamp?.formatted}</p>
    <div class="relative w-full h-2 hover:h-4 rounded-full bg-zinc-800 transition-[height] duration-150">
      <div class={`h-full rounded-full ${prevPaused ? "bg-zinc-400" : "bg-emerald-700"} transition-colors duration-200`} style={`width: ${width}%`}></div>
      <input class="opacity-0 absolute left-0 top-0 w-full h-full" type="range" min={0} max={$duration?.raw || 0} on:input={handleInput} on:change={handleChange} value={$currentTime * 1000}>
    </div>
    <p>{$duration?.formatted}</p>
  </div>
  <audio src={$src} bind:currentTime={$currentTime} bind:paused={paused} bind:this={audio} on:canplay={handleLoad}></audio>
</div>