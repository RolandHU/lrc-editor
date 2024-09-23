<script lang="ts">
  import "./app.css"
  import { parse, currentTime } from "./lib/lrcManager"
  import LineDisplay from "./components/LineDisplay.svelte"
  import Preview from "./components/Preview.svelte"

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const fileList = target.files as FileList
    
    if (fileList) parse(fileList[0]) 
  }
</script>

<main class="h-screen max-h-screen flex flex-col p-6">
  <!-- Temporary lrc upload -->
  <input type="file" accept=".lrc" on:change={handleChange}>

  <!-- Main editor part -->
  <div class="flex flex-auto gap-6">
    <LineDisplay />
    <Preview />
  </div>

  <!-- Audio progress bar -->
  <audio bind:currentTime={$currentTime} controls></audio>
</main>