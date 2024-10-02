<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let type: "button" | "submit" | "reset" = "button"
  export let name = undefined
  export let value: string | null = null
  export { style as class }

  const dispatch = createEventDispatcher()
  let style = ""

  const handleClick = (event: Event) => dispatch("click", event)
</script>

<button class={style} class:button={true} {type} {name} {value} on:click={handleClick}>
  <slot/>
</button>