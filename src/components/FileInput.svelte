<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let accept: string
  export let required = false
  export let requiredText = ""

  const dispatch = createEventDispatcher()
  let files: FileList
  let invalid = false

  const handleFileChange = (event: Event) => {
    invalid = false
    const input = event.target as HTMLInputElement
    dispatch("filechange", input.files as FileList)
  }
</script>

<div class={`relative flex flex-col gap-2 p-4 border-2 border-dashed rounded-2xl ${invalid ? "border-red-700" : "border-violet-700"}`}>
  {#if invalid}
    <p class="text-center text-red-700">{requiredText}</p>
  {/if}
  {#if files?.length > 0}
    <div class="flex justify-center gap-4">
      {#each files as file}
        <p class="text-lg">{file.name}</p>
      {/each}
    </div>
  {:else}
    <p class="text-lg text-center">
      <slot name="placeholder">Upload a file</slot>
    </p>
  {/if}
  <input class="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer" type="file" {accept} {required} on:change={handleFileChange} on:invalid|preventDefault={() => invalid = true} bind:files={files}>
</div>