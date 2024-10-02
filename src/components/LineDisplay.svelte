<script lang="ts">
  import { lines, getLineByTimestamp, removeLine, addLine } from "../lib/lrcManager"
  import { type Line, LineType } from "../lib/types"
  import DisplayLine from "./DisplayLine.svelte"
  import Dialog from "./Dialog.svelte"
  import TimestampInput from "./TimestampInput.svelte"
  import { createTimestamp } from "../lib/utils"

  let editedLine: Line | null = null

  // Checking the modifications and applying them
  const handleContinue = (event: SubmitEvent) => {
    if (!editedLine) return false
    const formData = new FormData(event.target as HTMLFormElement)
    const timestamp = createTimestamp(Number(formData.get("timestamp")) / 1000)

    if (getLineByTimestamp(timestamp, true)) return true

    removeLine(editedLine.id)
    addLine(editedLine.content, timestamp)

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
    <TimestampInput value={editedLine?.timestamp.formatted} required={true} requiredText="The timestamp should have the 00:00.00 format"/>
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