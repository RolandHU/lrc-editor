<script lang="ts">
  import { maska } from "maska/svelte"
  export let value = "00:00.00"
  export let required = false
  export let requiredText = ""

  let invalid = false

  const options = {
    mask: "##:##.##",
    eager: true
  }
</script>

<div>
  <input class={`px-4 py-2 border rounded-full ${invalid ? "border-red-700" : "border-zinc-700"} bg-transparent`} type="text" name="timestamp" use:maska={options} bind:value={value} {required} pattern="\d\d:\d\d\.\d\d" on:change={() => invalid = false} on:invalid|preventDefault={() => invalid = true}>
  {#if invalid}
    <p class="text-center text-red-700">{requiredText}</p>
  {/if}
</div>