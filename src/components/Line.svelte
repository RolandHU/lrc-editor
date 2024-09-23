<script lang="ts">
  import { activeLine, removeLine } from "../lib/lrcManager"
  import type { Line } from "../lib/types"
  import Icon from "@iconify/svelte"
  export let data: Line

  const { id, timestamp, content } = data
  $: active = $activeLine?.line?.id === id
</script>

<li class={`relative flex justify-between items-start px-8 py-4 ${active && "bg-violet-800/25 hover:bg-violet-800/50"} bg-transparent hover:bg-zinc-800 group transition-colors duration-200`}>
  <div class="flex flex-col">
    <span class="text-violet-400">{timestamp.formatted}</span>
    <p class="text-lg">{content}</p>
  </div>
  <button class="select-auto group-hover:select-none opacity-0 group-hover:opacity-[200%] translate-x-full group-hover:translate-x-0 transition-[opacity_0.25s_ease-in-out,transform_1s_ease-in-out]" on:click={() => removeLine(id)}>
    <Icon class="text-lg" icon="material-symbols:close-rounded"/>
  </button>
</li>