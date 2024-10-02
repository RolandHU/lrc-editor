<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { activeLine, removeLine } from "../lib/lrcManager"
  import type { Line } from "../lib/types"
  import Button from "./Button.svelte"
  import Icon from "@iconify/svelte"
  export let data: Line

  const dispatch = createEventDispatcher<{ edit: Line }>()
  const { id, timestamp, content } = data
  $: active = $activeLine?.line?.id === id
</script>

<li class={`relative flex justify-between items-center gap-4 px-6 py-4 rounded-2xl ${active && "bg-emerald-900/25 hover:bg-emerald-900/50" || "bg-transparent hover:bg-zinc-800"} group transition-colors duration-200`}>
  <div class="flex gap-4 text-lg">
    <span class="text-emerald-400">{timestamp.formatted}</span>
    <p class="text-lg">{content}</p>
  </div>
  <div class="opacity-0 group-hover:opacity-[200%] translate-x-full group-hover:translate-x-0 flex transition-[opacity_0.25s_ease-in-out,transform_1s_ease-in-out]">
    <Button class="bg-transparent" on:click={() => dispatch("edit", data)}>
      <Icon class="text-lg" icon="material-symbols:edit-rounded"/>
    </Button>
    <Button class="bg-transparent" on:click={() => removeLine(id)}>
      <Icon class="text-lg" icon="material-symbols:close-rounded"/>
    </Button>
  </div>
</li>