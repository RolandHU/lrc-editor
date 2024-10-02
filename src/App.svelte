<script lang="ts">
  import "./app.css"
  import { src, parse, duration } from "./lib/lrcManager"
  import Dialog from "./components/Dialog.svelte"
  import FileInput from "./components/FileInput.svelte"
  import LineDisplay from "./components/LineDisplay.svelte"
  import Preview from "./components/Preview.svelte"
  import AudioControls from "./components/AudioControls.svelte"

  let audioFile: FileList
  $: audioFile?.length > 0 ? $src = URL.createObjectURL(audioFile[0]) : null
  let lrcFile: FileList

  const handleStart = () => {
    if (!audioFile) {
      console.log("Warning")
      return true
    }

    if (lrcFile?.length > 0) parse(lrcFile[0])
    return false
  }
</script>

<Dialog open={true} cancellable={false} onContinue={handleStart}>
  <slot slot="title">LRC Editor</slot>
  <div class="flex flex-col gap-4" slot="content">
    <p>Upload the audio file to start creating your lrc file from scratch. Or upload an lrc file as well, to start editing.</p>
    <FileInput accept="audio/*" required={true} requiredText="No audio file was provided" on:filechange={(e) => audioFile = e.detail}>
      <span slot="placeholder">Upload an <b>audio</b> file</span>
    </FileInput>
    <FileInput accept=".lrc" on:filechange={(e) => lrcFile = e.detail}>
      <span slot="placeholder">Upload an <b>lrc</b> file</span>
    </FileInput>
  </div>
</Dialog>

<main class="h-screen max-h-screen flex flex-col gap-4 p-6">
  <!-- Main editor part -->
  <div class="flex flex-auto gap-4">
    <LineDisplay />
    <Preview />
  </div>

  <!-- Audio progress bar -->
  <AudioControls />
</main>