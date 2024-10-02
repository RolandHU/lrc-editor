<script lang="ts">
  export let name: string | undefined = undefined
  export let value: string | undefined = undefined
  export { style as class }

  let style = ""
</script>

<div class={`input-wrapper ${style}`}>
  <slot/>
  <input class="input" type="text" {name} value={value || ""}>
</div>