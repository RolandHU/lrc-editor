<script lang="ts">
  import lrcManager from "./lib/lrcManager"

  const { lines, parse, convert } = lrcManager()

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    if (!event.target) return

    const formData = new FormData(event.target as HTMLFormElement)
    const file = formData.get("file") as File

    if (file) return parse(file) 
  }
</script>

<main>
  <h1>Hello World!</h1>

  <button on:click={() => console.log(convert())}>Convert</button>

  <form on:submit={handleSubmit}>
    <input type="file" name="file" accept=".lrc">
    <button type="submit">Continue</button>
  </form>

  <ul>
    {#each $lines.filter(line => line.type !== 0) as { timestamp, content }}
      <li>
        <span>{timestamp.raw >= 0 ? timestamp.formatted + " - " : ""}{content}</span>
      </li>
    {/each}
  </ul>
</main>