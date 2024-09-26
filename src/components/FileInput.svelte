<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let accept: string

  const dispatch = createEventDispatcher()
  let files: FileList

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    dispatch("filechange", input.files as FileList)
  }
</script>

<div class="relative p-4 border-2 border-dashed rounded-2xl border-violet-700">
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
  <input class="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer" type="file" {accept} bind:files={files} on:change={handleFileChange}>
</div>