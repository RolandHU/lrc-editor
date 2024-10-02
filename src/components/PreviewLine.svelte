<script lang="ts">
  import { activeLine, currentTimestamp, currentTime } from "../lib/lrcManager"
  import { LineType, type Line } from "../lib/types"
  export let data: Line

  const { id, content, timestamp, words, type } = data

  $: active = $activeLine?.line?.id === id
  $: hTimestamp = $activeLine?.highlight?.raw || $currentTimestamp.raw
</script>

<div class="text-4xl text-center font-semibold select-none">
  {#if words}  
    <p>
      {#each words as { timestamp, content }}
        <span>
          <button
            class={`${timestamp.raw > hTimestamp ? "text-zinc-500" : (timestamp.raw < hTimestamp ? "text-white" : "text-emerald-400")} hover:text-emerald-400`}
            on:click={() => $currentTime = timestamp.raw / 1000}
          >{content}</button>
        </span>
      {/each}
    </p>
  {:else if type === LineType.LYRIC}
    <button
      class={`${active ? "text-emerald-400" : ($currentTimestamp.raw > timestamp.raw ? "text-white" : "text-zinc-500")} hover:text-emerald-400`}
      on:click={() => $currentTime = timestamp.raw / 1000}
    >{content}</button>
  {/if}
</div>