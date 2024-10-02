<script lang="ts">
  import { maska } from "maska/svelte"
  export let value = "00:00.00"
  export let required = false
  export let requiredText = ""

  let invalid = false
  let style = ""

  $: value ? invalid = false : null

  const options = {
    mask: "##:##.##",
    eager: true
  }
</script>

<div class="flex flex-col gap-2">
  <div class={`input-wrapper ${style}`} class:input-invalid={invalid}>
    <slot/>
    <input class="input" type="text" name="timestamp" use:maska={options} bind:value={value} {required} pattern="\d\d:\d\d\.\d\d" on:change={() => invalid = false} on:invalid|preventDefault={() => invalid = true}>
  </div>
  {#if invalid}
    <p class="text-center text-red-700">{requiredText}</p>
  {/if}
</div>