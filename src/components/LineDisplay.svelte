<script lang="ts">
  import { lines } from "../lib/lrcManager"
  import { LineType } from "../lib/types"
  import Line from "./Line.svelte"
</script>

<div class="relative w-full max-w-xl rounded-2xl bg-zinc-900 overflow-auto">
  <ul class="absolute w-full overflow-clip">
    {#each $lines.filter(line => line.type !== LineType.TAG) as data (data.id)}
      <Line {data} />
    {/each}
  </ul>
</div>