<script lang="ts">
  import { lines } from "../lib/lrcManager"
  import { LineType } from "../lib/types"
  import PreviewLine from "./PreviewLine.svelte"
</script>

<div class="relative flex-1 rounded-2xl bg-zinc-900 overflow-auto">
  <div class="absolute w-full flex flex-col gap-12 p-6 py-12">
    {#each $lines.filter(line => line.type !== LineType.TAG) as data (data.id)}
      <PreviewLine {data} />
    {/each}
  </div>
</div>