<script lang="ts">
  import { lines } from "../lib/lrcManager"
  import { type Line, LineType } from "../lib/types"
  import DisplayLine from "./DisplayLine.svelte"
  import Dialog from "./Dialog.svelte"

  let editedLine: Line | null = null

  // Checking the modifications and applying them
  const handleContinue = () => {
    editedLine = null
    return false
  }

  // Asking the user for verification if there are unsaved modifications
  const handleCancel = () => {
    editedLine = null
    return false
  }
</script>

<Dialog open={editedLine !== null} onContinue={handleContinue} onCancel={handleCancel}>
  <slot slot="title">Edit line</slot>
  <div slot="content">
    <p>{editedLine?.content}</p>
  </div>
  <slot slot="continue">Save</slot>
</Dialog>

<div class="relative w-full max-w-xl rounded-2xl bg-zinc-900 overflow-auto">
  <ul class="absolute w-full p-4 overflow-clip">
    {#each $lines.filter(line => line.type !== LineType.TAG) as data (data.id)}
      <DisplayLine {data} on:edit={(event) => editedLine = event.detail} />
    {/each}
  </ul>
</div>