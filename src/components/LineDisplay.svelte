<script lang="ts">
  import { lines, getLineByTimestamp, removeLine, addLine } from "../lib/lrcManager"
  import { type Line, LineType } from "../lib/types"
  import DisplayLine from "./DisplayLine.svelte"
  import Dialog from "./Dialog.svelte"
  import TimestampInput from "./TimestampInput.svelte"
  import TextInput from "./TextInput.svelte"
  import Icon from "@iconify/svelte"
  import { createTimestamp } from "../lib/utils"

  let editedLine: Line | null = null

  // Checking the modifications and applying them
  const handleContinue = (event: SubmitEvent) => {
    if (!editedLine) return false
    const formData = new FormData(event.target as HTMLFormElement)
    const timestamp = createTimestamp(String(formData.get("timestamp")))
    const content = String(formData.get("content"))

    const existingLine = getLineByTimestamp(timestamp, true)
    if (existingLine && existingLine.line.id !== editedLine.id) removeLine(existingLine.line.id)

    removeLine(editedLine.id)
    addLine(content, timestamp)

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
  <div class="flex flex-col gap-2" slot="content">
    <TimestampInput value={editedLine?.timestamp.formatted} required={true} requiredText="The timestamp should have the 00:00.00 format">
      <Icon class="ml-6 text-xl text-emerald-700" icon="material-symbols:timer-rounded"/>
    </TimestampInput>
    <TextInput name="content" value={editedLine?.content}>
      <Icon class="ml-6 text-xl text-emerald-700" icon="material-symbols:text-fields-rounded"/>
    </TextInput>
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